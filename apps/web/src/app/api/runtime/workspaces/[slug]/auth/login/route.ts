import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// POST /api/runtime/workspaces/[slug]/auth/login
// Meldet einen Website-Besucher an
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    // Find the published workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: { id: true, settings: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    // Find the site user
    const siteUser = await prisma.siteUser.findUnique({
      where: {
        workspaceId_email: {
          workspaceId: workspace.id,
          email: email.toLowerCase(),
        },
      },
    });

    if (!siteUser || !siteUser.passwordHash) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail oder Passwort.' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!siteUser.isActive) {
      return NextResponse.json(
        { error: 'Dieses Konto wurde deaktiviert.' },
        { status: 403 }
      );
    }

    if (siteUser.isBanned) {
      return NextResponse.json(
        { error: `Dieses Konto wurde gesperrt.${siteUser.banReason ? ` Grund: ${siteUser.banReason}` : ''}` },
        { status: 403 }
      );
    }

    // Check email verification
    const settings = workspace.settings as Record<string, unknown>;
    if (settings?.requireEmailVerification && !siteUser.emailVerified) {
      return NextResponse.json(
        { error: 'Bitte bestätige zuerst deine E-Mail-Adresse.' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, siteUser.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail oder Passwort.' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.siteUserSession.create({
      data: {
        siteUserId: siteUser.id,
        token: sessionToken,
        expiresAt,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Update login tracking
    await prisma.siteUser.update({
      where: { id: siteUser.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: siteUser.id,
        email: siteUser.email,
        name: siteUser.name,
        avatar: siteUser.avatar,
        role: siteUser.role,
      },
      token: sessionToken,
    });

    await createAuditLog({ action: 'SITE_USER_LOGIN', entity: 'SiteUser', entityId: siteUser.id, details: { slug, email: siteUser.email } });

    // Set cookie
    response.cookies.set(`site_session_${workspace.id}`, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Site user login error:', error);
    return NextResponse.json(
      { error: 'Anmeldung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
