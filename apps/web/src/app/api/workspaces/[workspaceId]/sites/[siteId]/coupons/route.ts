import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET /api/workspaces/:wid/sites/:sid/coupons
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const search = url.searchParams.get('search') || '';

  const where: Record<string, unknown> = { siteId: params.siteId };
  if (search) where.code = { contains: search, mode: 'insensitive' };

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.coupon.count({ where }),
  ]);

  return NextResponse.json({ coupons, total, page, limit, pages: Math.ceil(total / limit) });
}

// POST /api/workspaces/:wid/sites/:sid/coupons
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { code, description, type, value, minOrderAmount, maxUses, maxUsesPerUser, startsAt, expiresAt, isActive } = body;

  if (!code || !type || typeof value !== 'number') {
    return NextResponse.json({ error: 'code, type and value are required' }, { status: 400 });
  }

  // Check code uniqueness
  const existing = await prisma.coupon.findUnique({
    where: { siteId_code: { siteId: params.siteId, code: code.toUpperCase() } },
  });
  if (existing) {
    return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      siteId: params.siteId,
      code: code.toUpperCase(),
      description: description || null,
      type,
      value,
      minOrderAmount: minOrderAmount || null,
      maxUses: maxUses || null,
      maxUsesPerUser: maxUsesPerUser ?? 1,
      startsAt: startsAt ? new Date(startsAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
