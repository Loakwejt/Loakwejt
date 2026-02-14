import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { z } from 'zod';
import crypto from 'crypto';
import { emailService } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Rate limit: max 3 requests per email per hour
    const rateLimitResult = await rateLimit(`forgot-password:${email}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 3600),
          },
        }
      );
    }

    // Find user (always return success to prevent email enumeration)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Return success even if user not found (security: prevent email enumeration)
    if (!user || user.deletedAt || !user.isActive) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expires: tokenExpires,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        entity: 'User',
        entityId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Send password reset email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await emailService.sendTemplate('password-reset', email, {
      name: user.name || email.split('@')[0],
      resetUrl,
      expiresIn: '1 hour',
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
