import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/:wid/products
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { workspaceId } = await params;

  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status'); // 'active' | 'inactive' | null

  const where: Record<string, unknown> = { workspaceId };
  if (search) where.name = { contains: search, mode: 'insensitive' };
  if (status === 'active') where.isActive = true;
  if (status === 'inactive') where.isActive = false;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit, pages: Math.ceil(total / limit) });
}

// POST /api/workspaces/:wid/products
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { workspaceId } = await params;

  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    name, slug, shortDescription, description, price, compareAtPrice, currency, sku, barcode, inventory,
    weight, length, width, height, vendor, tags, images, isActive, isFeatured,
    specifications, manufacturer, manufacturerSku, manufacturerUrl,
  } = body;

  if (!name || !slug || typeof price !== 'number') {
    return NextResponse.json({ error: 'name, slug and price are required' }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({
    where: { workspaceId_slug: { workspaceId, slug } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      workspaceId,
      name,
      slug,
      shortDescription: shortDescription || null,
      description: description || null,
      price,
      compareAtPrice: compareAtPrice || null,
      currency: currency || 'EUR',
      sku: sku || null,
      barcode: barcode || null,
      inventory: inventory || 0,
      weight: weight || null,
      length: length || null,
      width: width || null,
      height: height || null,
      vendor: vendor || null,
      tags: tags || [],
      images: images || [],
      isActive: isActive !== false,
      isFeatured: isFeatured || false,
      specifications: specifications || null,
      manufacturer: manufacturer || null,
      manufacturerSku: manufacturerSku || null,
      manufacturerUrl: manufacturerUrl || null,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
