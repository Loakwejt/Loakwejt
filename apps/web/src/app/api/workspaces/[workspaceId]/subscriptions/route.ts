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
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '20'));
  const status = url.searchParams.get('status') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (status) where.status = status;

  const [subscriptions, total] = await Promise.all([
    prisma.shopSubscription.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
      include: { plan: { select: { id: true, name: true, price: true, interval: true } } },
    }),
    prisma.shopSubscription.count({ where }),
  ]);
  return NextResponse.json({ subscriptions, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { planId, customerName, customerEmail } = body;
  if (!planId || !customerName || !customerEmail) {
    return NextResponse.json({ error: 'planId, customerName, and customerEmail are required' }, { status: 400 });
  }

  const plan = await prisma.subscriptionPlan.findFirst({ where: { id: planId, workspaceId } });
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  const now = new Date();
  const startDate = plan.trialDays > 0 ? new Date(now.getTime() + plan.trialDays * 86400000) : now;

  const sub = await prisma.shopSubscription.create({
    data: {
      workspaceId, planId, name: customerName, email: customerEmail,
      status: plan.trialDays > 0 ? 'TRIALING' : 'ACTIVE',
      currentPeriodEnd: getNextPeriod(startDate, plan.interval, 1),
    },
    include: { plan: { select: { id: true, name: true } } },
  });
  return NextResponse.json(sub, { status: 201 });
}

function getNextPeriod(start: Date, interval: string, count: number): Date {
  const d = new Date(start);
  switch (interval) {
    case 'DAY': d.setDate(d.getDate() + count); break;
    case 'WEEK': d.setDate(d.getDate() + count * 7); break;
    case 'MONTH': d.setMonth(d.getMonth() + count); break;
    case 'YEAR': d.setFullYear(d.getFullYear() + count); break;
  }
  return d;
}
