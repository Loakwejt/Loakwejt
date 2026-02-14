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

  const where = { workspaceId };
  const [plans, total] = await Promise.all([
    prisma.subscriptionPlan.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.subscriptionPlan.count({ where }),
  ]);
  return NextResponse.json({ plans, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, description, price, currency, interval, intervalCount, trialDays, features } = body;
  if (!name || price === undefined || !interval) {
    return NextResponse.json({ error: 'name, price, and interval are required' }, { status: 400 });
  }

  const plan = await prisma.subscriptionPlan.create({
    data: {
      workspaceId, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || null,
      price: parseFloat(price), currency: currency || 'EUR',
      interval,
      trialDays: trialDays || 0, features: features || [],
      isActive: true,
    },
  });
  return NextResponse.json(plan, { status: 201 });
}
