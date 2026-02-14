import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string; categoryId: string };
}

// PATCH update category
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, image, sortOrder } = body;

  if (slug) {
    const existing = await prisma.productCategory.findFirst({
      where: { siteId: params.siteId, slug, NOT: { id: params.categoryId } },
    });
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const category = await prisma.productCategory.update({
    where: { id: params.categoryId },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });

  return NextResponse.json({ category });
}

// DELETE category
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.productCategory.delete({ where: { id: params.categoryId } });
  return NextResponse.json({ success: true });
}
