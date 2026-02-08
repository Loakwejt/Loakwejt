import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';

// Helper: Prüfe ob der eingeloggte Builderly-User Zugriff hat
async function verifySiteAccess(siteId: string, userId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId, role: { in: ['OWNER', 'ADMIN', 'EDITOR'] } },
          },
        },
      },
    },
  });

  if (!site || site.workspace.members.length === 0) return null;
  return site;
}

// GET /api/workspaces/[workspaceId]/sites/[siteId]/users/[userId]
// Einzelnen Site-User abrufen mit Details
export async function GET(
  _request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const site = await verifySiteAccess(params.siteId, session.user.id);
    if (!site) {
      return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
    }

    const user = await prisma.siteUser.findFirst({
      where: { id: params.userId, siteId: params.siteId },
      include: {
        sessions: {
          orderBy: { lastActiveAt: 'desc' },
          take: 10,
          select: {
            id: true,
            ipAddress: true,
            userAgent: true,
            deviceType: true,
            createdAt: true,
            lastActiveAt: true,
            expiresAt: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            total: true,
            currency: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden.' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching site user:', error);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/sites/[siteId]/users/[userId]
// Benutzer bearbeiten (Rolle, Status, Ban etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const site = await verifySiteAccess(params.siteId, session.user.id);
    if (!site) {
      return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
    }

    const body = await request.json();
    const { role, isActive, isBanned, banReason, name } = body;

    const updateData: Record<string, unknown> = {};

    if (role && ['ADMIN', 'MODERATOR', 'MEMBER', 'VIP'].includes(role)) {
      updateData.role = role;
    }
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (typeof isBanned === 'boolean') {
      updateData.isBanned = isBanned;
      updateData.banReason = isBanned ? (banReason || null) : null;

      // If banning, also invalidate all sessions
      if (isBanned) {
        await prisma.siteUserSession.deleteMany({
          where: {
            siteUser: { id: params.userId, siteId: params.siteId },
          },
        });
      }
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    const updatedUser = await prisma.siteUser.update({
      where: { id: params.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isBanned: true,
        banReason: true,
      },
    });

    await createAuditLog({ userId: session.user.id, action: 'SITE_USER_UPDATED', entity: 'SiteUser', entityId: params.userId, details: { siteId: params.siteId, changes: Object.keys(updateData) } });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating site user:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/sites/[siteId]/users/[userId]
// Benutzer permanent löschen
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const site = await verifySiteAccess(params.siteId, session.user.id);
    if (!site) {
      return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
    }

    await prisma.siteUser.delete({
      where: { id: params.userId },
    });

    await createAuditLog({ userId: session.user.id, action: 'SITE_USER_DELETED', entity: 'SiteUser', entityId: params.userId, details: { siteId: params.siteId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site user:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
