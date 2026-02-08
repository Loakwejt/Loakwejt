import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/runtime/sites/[siteSlug]/auth/me
// Gibt den aktuell eingeloggten Website-Besucher zurück
export async function GET(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const site = await prisma.site.findFirst({
      where: { slug: params.siteSlug, isPublished: true },
      select: { id: true },
    });

    if (!site) {
      return NextResponse.json({ error: 'Website nicht gefunden.' }, { status: 404 });
    }

    const cookieName = `site_session_${site.id}`;
    const sessionToken = request.cookies.get(cookieName)?.value;

    // Also check Authorization header (for API/fetch calls)
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = sessionToken || bearerToken;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Find valid session
    const session = await prisma.siteUserSession.findUnique({
      where: { token },
      include: {
        siteUser: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
            profileData: true,
            isActive: true,
            isBanned: true,
            emailVerified: true,
            createdAt: true,
            lastLoginAt: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      // Expired or not found
      if (session) {
        await prisma.siteUserSession.delete({ where: { id: session.id } });
      }
      return NextResponse.json({ authenticated: false, user: null });
    }

    if (!session.siteUser.isActive || session.siteUser.isBanned) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Update last active
    await prisma.siteUserSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({
      authenticated: true,
      user: session.siteUser,
    });
  } catch (error) {
    console.error('Site auth check error:', error);
    return NextResponse.json(
      { error: 'Auth-Prüfung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
