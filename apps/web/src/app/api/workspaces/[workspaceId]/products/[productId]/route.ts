import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';
import { validateProductDeletion } from '@/lib/reference-validator';

interface RouteContext {
  params: Promise<{ workspaceId: string; productId: string }>;
}

// GET single product
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, productId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const product = await prisma.product.findFirst({
    where: { id: productId, workspaceId },
    include: { orderItems: { include: { order: true }, take: 10, orderBy: { order: { createdAt: 'desc' } } } },
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ product });
}

// PATCH update product
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, productId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    name, slug, shortDescription, description, price, compareAtPrice, currency, sku, barcode, inventory,
    weight, length, width, height, vendor, tags, images, isActive, isFeatured,
    specifications, manufacturer, manufacturerSku, manufacturerUrl,
  } = body;

  // Check slug uniqueness if changing
  if (slug) {
    const existing = await prisma.product.findFirst({
      where: { workspaceId, slug, NOT: { id: productId } },
    });
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(compareAtPrice !== undefined && { compareAtPrice }),
      ...(currency !== undefined && { currency }),
      ...(sku !== undefined && { sku }),
      ...(barcode !== undefined && { barcode }),
      ...(inventory !== undefined && { inventory }),
      ...(weight !== undefined && { weight }),
      ...(length !== undefined && { length }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(vendor !== undefined && { vendor }),
      ...(tags !== undefined && { tags }),
      ...(images !== undefined && { images }),
      ...(isActive !== undefined && { isActive }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(specifications !== undefined && { specifications }),
      ...(manufacturer !== undefined && { manufacturer }),
      ...(manufacturerSku !== undefined && { manufacturerSku }),
      ...(manufacturerUrl !== undefined && { manufacturerUrl }),
    },
  });

  return NextResponse.json({ product });
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, productId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Check for references before deletion
  const { searchParams } = new URL(req.url);
  const force = searchParams.get('force') === 'true';
  
  if (!force) {
    const validation = await validateProductDeletion(productId, workspaceId);
    
    if (!validation.valid) {
      return NextResponse.json({ 
        error: 'Produkt wird noch verwendet',
        details: validation.errors,
        warnings: validation.warnings,
        usages: validation.usages,
        hint: 'Füge ?force=true hinzu um trotzdem zu löschen'
      }, { status: 409 });
    }
    
    // Return warnings even if valid
    if (validation.warnings.length > 0) {
      // Proceed but include warnings in response
      await prisma.product.delete({ where: { id: productId } });
      return NextResponse.json({ 
        success: true,
        warnings: validation.warnings 
      });
    }
  }

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ success: true });
}
