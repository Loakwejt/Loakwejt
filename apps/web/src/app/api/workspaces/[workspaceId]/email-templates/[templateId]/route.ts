import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; templateId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, templateId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const template = await prisma.emailTemplate.findFirst({ where: { id: templateId, workspaceId } });
  if (!template) return NextResponse.json({ error: 'Email template not found' }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, templateId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.emailTemplate.findFirst({ where: { id: templateId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Email template not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.subject) data.subject = body.subject;
  if (body.htmlBody) data.htmlBody = body.htmlBody;
  if (body.textBody !== undefined) data.textBody = body.textBody;
  if (typeof body.isActive === 'boolean') data.isActive = body.isActive;

  const template = await prisma.emailTemplate.update({ where: { id: templateId }, data });
  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, templateId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.emailTemplate.findFirst({ where: { id: templateId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Email template not found' }, { status: 404 });

  await prisma.emailTemplate.delete({ where: { id: templateId } });
  return NextResponse.json({ success: true });
}
