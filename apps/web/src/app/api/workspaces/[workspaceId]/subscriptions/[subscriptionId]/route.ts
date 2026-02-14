import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; subscriptionId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, subscriptionId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const sub = await prisma.shopSubscription.findFirst({
    where: { id: subscriptionId, workspaceId },
    include: { plan: true },
  });
  if (!sub) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  return NextResponse.json(sub);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, subscriptionId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.shopSubscription.findFirst({ where: { id: subscriptionId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.status) {
    data.status = body.status;
    if (body.status === 'CANCELED') data.canceledAt = new Date();
  }
  if (typeof body.cancelAtPeriodEnd === 'boolean') data.cancelAtPeriodEnd = body.cancelAtPeriodEnd;
  if (body.planId) data.planId = body.planId;

  const sub = await prisma.shopSubscription.update({
    where: { id: subscriptionId }, data,
    include: { plan: { select: { id: true, name: true } } },
  });
  return NextResponse.json(sub);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, subscriptionId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.shopSubscription.findFirst({ where: { id: subscriptionId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

  await prisma.shopSubscription.delete({ where: { id: subscriptionId } });
  return NextResponse.json({ success: true });
}
