import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET /api/workspaces/:wid/sites/:sid/products
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status'); // 'active' | 'inactive' | null

  const where: Record<string, unknown> = { siteId: params.siteId };
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

// POST /api/workspaces/:wid/sites/:sid/products
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, slug, description, price, currency, sku, inventory, images, isActive } = body;

  if (!name || !slug || typeof price !== 'number') {
    return NextResponse.json({ error: 'name, slug and price are required' }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({
    where: { siteId_slug: { siteId: params.siteId, slug } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      siteId: params.siteId,
      name,
      slug,
      description: description || null,
      price,
      currency: currency || 'EUR',
      sku: sku || null,
      inventory: inventory || 0,
      images: images || [],
      isActive: isActive !== false,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
