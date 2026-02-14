import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { getCurrentUser } from '@/lib/permissions';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id, role: { in: ['OWNER', 'ADMIN'] } },
  });
  if (!membership) throw new Error('Forbidden');
  return user;
}

// GET /api/admin/users?page=1&limit=20&search=...
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          isActive: true,
          createdAt: true,
          memberships: {
            select: {
              role: true,
              workspace: {
                select: { id: true, name: true, plan: true },
              },
            },
          },
          _count: {
            select: { memberships: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 });
    }
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Benutzer' }, { status: 500 });
  }
}
