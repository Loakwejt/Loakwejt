import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import { sendTemplateEmail } from '@/lib/email';
import crypto from 'crypto';

// POST /api/runtime/sites/[siteSlug]/auth/forgot-password
// Erzeugt einen Passwort-Reset-Token und sendet eine E-Mail
export async function POST(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich.' },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({
      success: true,
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail gesendet.',
    });

    // Find published site
    const site = await prisma.site.findFirst({
      where: { slug: params.siteSlug, isPublished: true },
      select: { id: true, name: true },
    });

    if (!site) {
      return successResponse;
    }

    // Find site user
    const siteUser = await prisma.siteUser.findUnique({
      where: {
        siteId_email: {
          siteId: site.id,
          email: email.toLowerCase(),
        },
      },
      select: { id: true, email: true, name: true, isActive: true, isBanned: true },
    });

    if (!siteUser || !siteUser.isActive || siteUser.isBanned) {
      return successResponse;
    }

    // Invalidate existing unused tokens for this email
    await prisma.siteUserPasswordReset.updateMany({
      where: { siteId: site.id, email: email.toLowerCase(), used: false },
      data: { used: true },
    });

    // Create reset token (valid for 1 hour)
    const token = crypto.randomBytes(48).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.siteUserPasswordReset.create({
      data: {
        siteId: site.id,
        email: email.toLowerCase(),
        token,
        expires,
      },
    });

    // Build the reset URL (pointing to the published site)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/s/${params.siteSlug}/reset-password?token=${token}`;

    // Send email
    await sendTemplateEmail('password-reset', email.toLowerCase(), {
      name: siteUser.name || '',
      resetUrl,
      expiresIn: '1 Stunde',
    }).catch((err) => console.error('Failed to send password reset email:', err));

    await createAuditLog({
      action: 'SITE_USER_PASSWORD_RESET_REQUESTED',
      entity: 'SiteUser',
      entityId: siteUser.id,
      details: { siteSlug: params.siteSlug, email: email.toLowerCase() },
    });

    return successResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Anfrage fehlgeschlagen. Bitte versuche es später erneut.' },
      { status: 500 }
    );
  }
}
