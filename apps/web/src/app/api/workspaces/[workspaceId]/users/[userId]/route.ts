import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { createAuditLog } from '@/lib/audit';

// Helper: Prüfe ob der eingeloggte Builderly-User Zugriff hat
async function verifyWorkspaceAccess(workspaceId: string, userId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        where: { userId, role: { in: ['OWNER', 'ADMIN', 'EDITOR'] } },
      },
    },
  });

  if (!workspace || workspace.members.length === 0) return null;
  return workspace;
}

interface RouteContext {
  params: Promise<{ workspaceId: string; userId: string }>;
}

// GET /api/workspaces/[workspaceId]/users/[userId]
// Einzelnen Site-User abrufen mit Details
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const { workspaceId, userId } = await params;
    const workspace = await verifyWorkspaceAccess(workspaceId, session.user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
    }

    const user = await prisma.siteUser.findFirst({
      where: { id: userId, workspaceId },
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

// PATCH /api/workspaces/[workspaceId]/users/[userId]
// Benutzer bearbeiten (Rolle, Status, Ban etc.)
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const { workspaceId, userId } = await params;
    const workspace = await verifyWorkspaceAccess(workspaceId, session.user.id);
    if (!workspace) {
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
            siteUser: { id: userId, workspaceId },
          },
        });
      }
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    const updatedUser = await prisma.siteUser.update({
      where: { id: userId },
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

    await createAuditLog({ userId: session.user.id, action: 'SITE_USER_UPDATED', entity: 'SiteUser', entityId: userId, details: { workspaceId, changes: Object.keys(updateData) } });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating site user:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren.' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/users/[userId]
// Benutzer permanent löschen
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const { workspaceId, userId } = await params;
    const workspace = await verifyWorkspaceAccess(workspaceId, session.user.id);
    if (!workspace) {
      return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
    }

    await prisma.siteUser.delete({
      where: { id: userId },
    });

    await createAuditLog({ userId: session.user.id, action: 'SITE_USER_DELETED', entity: 'SiteUser', entityId: userId, details: { workspaceId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting site user:', error);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
