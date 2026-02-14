import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';

// POST /api/runtime/workspaces/[slug]/auth/logout
// Meldet einen Website-Besucher ab
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const workspace = await prisma.workspace.findFirst({
      where: { slug, isPublished: true },
      select: { id: true },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    const cookieName = `site_session_${workspace.id}`;
    const sessionToken = request.cookies.get(cookieName)?.value;

    if (sessionToken) {
      // Delete session from DB
      await prisma.siteUserSession.deleteMany({
        where: { token: sessionToken },
      });
    }

    const response = NextResponse.json({ success: true });

    await createAuditLog({ action: 'SITE_USER_LOGOUT', entity: 'Workspace', details: { slug } });

    // Clear cookie
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Site user logout error:', error);
    return NextResponse.json(
      { error: 'Abmeldung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
