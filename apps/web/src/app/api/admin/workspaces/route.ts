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

// GET /api/admin/workspaces?page=1&limit=20&search=...&plan=...
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search') || '';
    const planFilter = searchParams.get('plan') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (planFilter && ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'].includes(planFilter)) {
      where.plan = planFilter;
    }

    const [workspaces, total] = await Promise.all([
      prisma.workspace.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          createdAt: true,
          stripeSubscriptionId: true,
          _count: {
            select: { pages: true, members: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.workspace.count({ where }),
    ]);

    return NextResponse.json({
      workspaces,
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
    console.error('Admin workspaces error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Workspaces' }, { status: 500 });
  }
}
