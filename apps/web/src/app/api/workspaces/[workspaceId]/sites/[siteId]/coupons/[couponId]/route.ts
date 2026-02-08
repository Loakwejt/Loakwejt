import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string; couponId: string };
}

// GET single coupon
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const coupon = await prisma.coupon.findFirst({
    where: { id: params.couponId, siteId: params.siteId },
    include: { _count: { select: { orders: true } } },
  });
  if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ coupon });
}

// PATCH update coupon
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { code, description, type, value, minOrderAmount, maxUses, maxUsesPerUser, startsAt, expiresAt, isActive } = body;

  // Check code uniqueness if changing
  if (code) {
    const existing = await prisma.coupon.findFirst({
      where: { siteId: params.siteId, code: code.toUpperCase(), NOT: { id: params.couponId } },
    });
    if (existing) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
  }

  const coupon = await prisma.coupon.update({
    where: { id: params.couponId },
    data: {
      ...(code !== undefined && { code: code.toUpperCase() }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(value !== undefined && { value }),
      ...(minOrderAmount !== undefined && { minOrderAmount }),
      ...(maxUses !== undefined && { maxUses }),
      ...(maxUsesPerUser !== undefined && { maxUsesPerUser }),
      ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ coupon });
}

// DELETE coupon
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.coupon.delete({ where: { id: params.couponId } });
  return NextResponse.json({ success: true });
}
