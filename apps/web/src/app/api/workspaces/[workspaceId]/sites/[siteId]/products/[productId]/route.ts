import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string; productId: string };
}

// GET single product
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const product = await prisma.product.findFirst({
    where: { id: params.productId, siteId: params.siteId },
    include: { orderItems: { include: { order: true }, take: 10, orderBy: { order: { createdAt: 'desc' } } } },
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ product });
}

// PATCH update product
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, price, currency, sku, inventory, images, isActive } = body;

  // Check slug uniqueness if changing
  if (slug) {
    const existing = await prisma.product.findFirst({
      where: { siteId: params.siteId, slug, NOT: { id: params.productId } },
    });
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const product = await prisma.product.update({
    where: { id: params.productId },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(currency !== undefined && { currency }),
      ...(sku !== undefined && { sku }),
      ...(inventory !== undefined && { inventory }),
      ...(images !== undefined && { images }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ product });
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.product.delete({ where: { id: params.productId } });
  return NextResponse.json({ success: true });
}
