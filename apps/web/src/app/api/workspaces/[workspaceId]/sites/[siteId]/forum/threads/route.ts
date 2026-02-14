import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET threads for a site (with optional category filter)
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = 20;
  const categoryId = url.searchParams.get('categoryId') || undefined;

  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;

  // Find threads for categories belonging to the site
  const siteCategories = await prisma.forumCategory.findMany({
    where: { siteId: params.siteId },
    select: { id: true },
  });
  const categoryIds = siteCategories.map(c => c.id);
  where.categoryId = categoryId ? categoryId : { in: categoryIds };

  const [threads, total] = await Promise.all([
    prisma.forumThread.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
        _count: { select: { posts: true } },
      },
    }),
    prisma.forumThread.count({ where }),
  ]);

  return NextResponse.json({ threads, total, page, pages: Math.ceil(total / limit) });
}
