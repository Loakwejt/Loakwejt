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
  const trigger = url.searchParams.get('trigger') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (trigger) where.trigger = trigger;

  const [rules, total] = await Promise.all([
    prisma.automationRule.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.automationRule.count({ where }),
  ]);
  return NextResponse.json({ rules, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, trigger, triggerConfig, action, actionConfig } = body;
  if (!name || !trigger || !action) {
    return NextResponse.json({ error: 'name, trigger, and action are required' }, { status: 400 });
  }

  const rule = await prisma.automationRule.create({
    data: {
      workspaceId, name, trigger,
      triggerConfig: triggerConfig || {},
      action,
      actionConfig: actionConfig || {},
      isActive: true,
    },
  });
  return NextResponse.json(rule, { status: 201 });
}
