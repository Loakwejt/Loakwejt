import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';
import bcrypt from 'bcryptjs';

// POST /api/runtime/sites/[siteSlug]/auth/reset-password
// Setzt das Passwort mit einem gültigen Reset-Token zurück
export async function POST(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token und neues Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 }
      );
    }

    // Find published site
    const site = await prisma.site.findFirst({
      where: { slug: params.siteSlug, isPublished: true },
      select: { id: true },
    });

    if (!site) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    // Find valid token
    const resetRecord = await prisma.siteUserPasswordReset.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Ungültiger oder abgelaufener Link.' },
        { status: 400 }
      );
    }

    if (resetRecord.used) {
      return NextResponse.json(
        { error: 'Dieser Link wurde bereits verwendet.' },
        { status: 400 }
      );
    }

    if (resetRecord.expires < new Date()) {
      return NextResponse.json(
        { error: 'Dieser Link ist abgelaufen. Bitte fordere einen neuen an.' },
        { status: 400 }
      );
    }

    if (resetRecord.siteId !== site.id) {
      return NextResponse.json(
        { error: 'Ungültiger Link für diese Website.' },
        { status: 400 }
      );
    }

    // Find the site user
    const siteUser = await prisma.siteUser.findUnique({
      where: {
        siteId_email: {
          siteId: site.id,
          email: resetRecord.email,
        },
      },
    });

    if (!siteUser) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden.' },
        { status: 404 }
      );
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.siteUser.update({
        where: { id: siteUser.id },
        data: { passwordHash },
      }),
      prisma.siteUserPasswordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    await createAuditLog({
      action: 'SITE_USER_PASSWORD_RESET_COMPLETED',
      entity: 'SiteUser',
      entityId: siteUser.id,
      details: { siteSlug: params.siteSlug, email: resetRecord.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Passwort-Reset fehlgeschlagen. Bitte versuche es später erneut.' },
      { status: 500 }
    );
  }
}
