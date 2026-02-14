import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';

// Helper: Resolve authenticated site user from request
async function getAuthenticatedSiteUser(request: NextRequest, siteSlug: string) {
  const site = await prisma.site.findFirst({
    where: { slug: siteSlug, isPublished: true },
    select: { id: true },
  });

  if (!site) return null;

  const cookieName = `site_session_${site.id}`;
  const sessionToken = request.cookies.get(cookieName)?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = sessionToken || bearerToken;

  if (!token) return null;

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
          isActive: true,
          isBanned: true,
          createdAt: true,
          emailVerified: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) return null;
  if (!session.siteUser.isActive || session.siteUser.isBanned) return null;

  return { site, siteUser: session.siteUser };
}

// PATCH /api/runtime/sites/[siteSlug]/auth/profile
// Ermöglicht dem eingeloggten Besucher, sein Profil zu aktualisieren
export async function PATCH(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const auth = await getAuthenticatedSiteUser(request, params.siteSlug);

    if (!auth) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, avatar } = body;

    // Build update data — only include fields that are provided
    const updateData: Record<string, unknown> = {};
    if (typeof name === 'string') updateData.name = name.slice(0, 100);
    if (typeof bio === 'string') updateData.bio = bio.slice(0, 500);
    if (typeof avatar === 'string') updateData.avatar = avatar.slice(0, 2048);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Keine Änderungen angegeben.' },
        { status: 400 }
      );
    }

    const updated = await prisma.siteUser.update({
      where: { id: auth.siteUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    await createAuditLog({
      action: 'SITE_USER_PROFILE_UPDATED',
      entity: 'SiteUser',
      entityId: auth.siteUser.id,
      details: {
        siteSlug: params.siteSlug,
        fields: Object.keys(updateData),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Profil-Aktualisierung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
