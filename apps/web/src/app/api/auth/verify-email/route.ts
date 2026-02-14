import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
    }

    // Find the token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      return NextResponse.redirect(new URL('/login?error=token_expired', request.url));
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=user_not_found', request.url));
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        entity: 'User',
        entityId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Delete the token (it's been used)
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
  }
}
