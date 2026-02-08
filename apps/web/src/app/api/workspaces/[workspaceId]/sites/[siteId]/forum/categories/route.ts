import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET all forum categories for a site
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const categories = await prisma.forumCategory.findMany({
    where: { siteId: params.siteId },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { threads: true } },
    },
  });

  return NextResponse.json({ categories });
}

// POST create category
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { name, slug, description, order } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 });

  const existing = await prisma.forumCategory.findFirst({
    where: { siteId: params.siteId, slug },
  });
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

  const category = await prisma.forumCategory.create({
    data: {
      siteId: params.siteId,
      name,
      slug,
      description: description || null,
      order: order || 0,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
