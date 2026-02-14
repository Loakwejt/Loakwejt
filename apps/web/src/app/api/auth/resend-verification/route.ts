import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { z } from 'zod';
import crypto from 'crypto';
import { emailService } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = resendSchema.parse(body);

    // Rate limit: max 3 resends per email per hour
    const rateLimitResult = await rateLimit(`resend-verification:${email}`, {
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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email and is not verified, a new verification email has been sent.',
      });
    }

    // Delete any existing tokens for this email
    await prisma.emailVerificationToken.deleteMany({
      where: { email },
    });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new token
    await prisma.emailVerificationToken.create({
      data: {
        email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    await emailService.sendTemplate('email-verification', email, {
      name: user.name || email.split('@')[0],
      verifyUrl,
      expiresIn: '24 hours',
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'VERIFICATION_EMAIL_RESENT',
        entity: 'User',
        entityId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email and is not verified, a new verification email has been sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
