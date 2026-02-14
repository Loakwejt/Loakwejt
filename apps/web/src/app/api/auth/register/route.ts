import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import crypto from 'crypto';
import { emailService } from '@/lib/email';

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  marketingConsent: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, privacyConsent, marketingConsent } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (not verified yet)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: null, // Will be set when email is verified
        privacyConsentAt: privacyConsent ? new Date() : null,
        privacyConsentVersion: privacyConsent ? '1.0' : null,
        marketingConsent: marketingConsent ?? false,
        marketingConsentAt: marketingConsent ? new Date() : null,
      },
    });
    
    // Create email verification token
    await prisma.emailVerificationToken.create({
      data: {
        email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    // Create default workspace for the user
    const workspaceSlug = `${email.split('@')[0]}-workspace`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    await prisma.workspace.create({
      data: {
        name: `${name || email.split('@')[0]}'s Workspace`,
        slug: `${workspaceSlug}-${Date.now()}`,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER',
          },
        },
      },
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id,
        details: {
          privacyConsent,
          marketingConsent,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });
    
    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
    
    await emailService.sendTemplate('email-verification', email, {
      name: name || email.split('@')[0],
      verifyUrl,
      expiresIn: '24 hours',
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
