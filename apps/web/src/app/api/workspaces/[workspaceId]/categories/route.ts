import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/:wid/categories
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const categories = await prisma.productCategory.findMany({
    where: { workspaceId },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

// POST /api/workspaces/:wid/categories
export async function POST(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, image, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
  }

  const existing = await prisma.productCategory.findUnique({
    where: { workspaceId_slug: { workspaceId, slug } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const category = await prisma.productCategory.create({
    data: {
      workspaceId,
      name,
      slug,
      description: description || null,
      image: image || null,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
