import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';

// Helper: Prüfe ob der eingeloggte Builderly-User Zugriff auf die Site hat
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

  if (!site || site.workspace.members.length === 0) {
    return null;
  }
  return site;
}

// GET /api/workspaces/[workspaceId]/sites/[siteId]/users
// Listet alle registrierten Besucher einer Website
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
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

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Math.min(Number(url.searchParams.get('limit') || '50'), 100);
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || '';
    const status = url.searchParams.get('status') || ''; // active, banned, inactive
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    // Build filter
    const where: Record<string, unknown> = { siteId: params.siteId };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }
    if (status === 'active') {
      where.isActive = true;
      where.isBanned = false;
    } else if (status === 'banned') {
      where.isBanned = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [users, total] = await Promise.all([
      prisma.siteUser.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          isActive: true,
          isBanned: true,
          banReason: true,
          emailVerified: true,
          provider: true,
          lastLoginAt: true,
          loginCount: true,
          createdAt: true,
          _count: {
            select: {
              sessions: true,
              orders: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.siteUser.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching site users:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Benutzer.' }, { status: 500 });
  }
}
