import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
  const productId = url.searchParams.get('productId') || '';
  const type = url.searchParams.get('type') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (productId) where.productId = productId;
  if (type) where.type = type;

  const [movements, total] = await Promise.all([
    prisma.inventoryMovement.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
      include: { product: { select: { id: true, name: true, sku: true } } },
    }),
    prisma.inventoryMovement.count({ where }),
  ]);
  return NextResponse.json({ movements, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { productId, type, quantity, reason, reference } = body;
  if (!productId || !type || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'productId, type and quantity are required' }, { status: 400 });
  }

  // Update product inventory and create movement in transaction
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || product.workspaceId !== workspaceId) throw new Error('Product not found');

    const newInventory = product.inventory + quantity;
    await tx.product.update({ where: { id: productId }, data: { inventory: Math.max(0, newInventory) } });

    return tx.inventoryMovement.create({
      data: {
        workspaceId, productId, type, quantity,
        previousStock: product.inventory, newStock: Math.max(0, newInventory),
        reason: reason || null, reference: reference || null,
      },
    });
  });

  return NextResponse.json(result, { status: 201 });
}
