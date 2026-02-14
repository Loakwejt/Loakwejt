import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// POST /api/runtime/workspaces/[slug]/auth/register
// Registriert einen neuen Besucher-Account für eine veröffentlichte Site
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 }
      );
    }

    // Find the published workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        settings: true,
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    // Check if workspace has user auth enabled
    const settings = workspace.settings as Record<string, unknown>;
    if (!settings?.enableUserAuth) {
      return NextResponse.json(
        { error: 'Benutzer-Registrierung ist für diese Website nicht aktiviert.' },
        { status: 403 }
      );
    }

    // Check if email is already taken for this workspace
    const existing = await prisma.siteUser.findUnique({
      where: {
        workspaceId_email: {
          workspaceId: workspace.id,
          email: email.toLowerCase(),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const siteUser = await prisma.siteUser.create({
      data: {
        workspaceId: workspace.id,
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        role: 'MEMBER',
        verificationToken,
        provider: 'email',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // TODO: E-Mail-Verifizierung senden (optional, abhängig von Site-Settings)

    // Send verification email if required
    if (settings?.requireEmailVerification) {
      try {
        const { sendTemplateEmail } = await import('@/lib/email');
        const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/runtime/workspaces/${slug}/auth/verify-email?token=${verificationToken}`;
        await sendTemplateEmail('email-verification', email.toLowerCase(), {
          name: name || '',
          verifyUrl,
          expiresIn: '24 Stunden',
        });
      } catch (err) {
        console.error('Failed to send verification email:', err);
      }
    }

    // Create session immediately (or require verification first, depending on settings)
    const requireVerification = settings?.requireEmailVerification === true;

    if (requireVerification) {
      return NextResponse.json({
        success: true,
        requiresVerification: true,
        message: 'Konto erstellt. Bitte bestätige deine E-Mail-Adresse.',
      });
    }

    // Auto-login: create session token
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
        loginCount: 1,
        emailVerified: requireVerification ? undefined : new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      user: siteUser,
      token: sessionToken,
    });

    await createAuditLog({ action: 'SITE_USER_REGISTERED', entity: 'SiteUser', entityId: siteUser.id, details: { slug, email: email.toLowerCase() } });

    // Set cookie for session
    response.cookies.set(`site_session_${workspace.id}`, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Site user registration error:', error);
    return NextResponse.json(
      { error: 'Registrierung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
