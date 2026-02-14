import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; ruleId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, ruleId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const rule = await prisma.automationRule.findFirst({ where: { id: ruleId, workspaceId } });
  if (!rule) return NextResponse.json({ error: 'Automation rule not found' }, { status: 404 });
  return NextResponse.json(rule);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, ruleId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.automationRule.findFirst({ where: { id: ruleId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Automation rule not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.trigger) data.trigger = body.trigger;
  if (body.conditions) data.conditions = body.conditions;
  if (body.actions) data.actions = body.actions;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  const rule = await prisma.automationRule.update({ where: { id: ruleId }, data });
  return NextResponse.json(rule);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, ruleId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.automationRule.findFirst({ where: { id: ruleId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Automation rule not found' }, { status: 404 });

  await prisma.automationRule.delete({ where: { id: ruleId } });
  return NextResponse.json({ success: true });
}
