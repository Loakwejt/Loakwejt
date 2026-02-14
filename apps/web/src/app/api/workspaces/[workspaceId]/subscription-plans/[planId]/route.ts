import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; planId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, planId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const plan = await prisma.subscriptionPlan.findFirst({
    where: { id: planId, workspaceId },
    include: { _count: { select: { subscriptions: true } } },
  });
  if (!plan) return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });
  return NextResponse.json(plan);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, planId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.subscriptionPlan.findFirst({ where: { id: planId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = parseFloat(body.price);
  if (body.currency) data.currency = body.currency;
  if (body.interval) data.interval = body.interval;
  if (body.intervalCount) data.intervalCount = body.intervalCount;
  if (body.trialDays !== undefined) data.trialDays = body.trialDays;
  if (body.features) data.features = body.features;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  const plan = await prisma.subscriptionPlan.update({ where: { id: planId }, data });
  return NextResponse.json(plan);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, planId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.subscriptionPlan.findFirst({ where: { id: planId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 });

  // Check for active subscriptions
  const activeSubs = await prisma.shopSubscription.count({ where: { planId, status: 'ACTIVE' } });
  if (activeSubs > 0) return NextResponse.json({ error: 'Cannot delete plan with active subscriptions' }, { status: 400 });

  await prisma.subscriptionPlan.delete({ where: { id: planId } });
  return NextResponse.json({ success: true });
}
