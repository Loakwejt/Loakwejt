import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; voucherId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, voucherId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const voucher = await prisma.voucher.findUnique({ where: { id: voucherId } });
  if (!voucher || voucher.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(voucher);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, voucherId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const existing = await prisma.voucher.findUnique({ where: { id: voucherId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const voucher = await prisma.voucher.update({ where: { id: voucherId }, data: body });
  return NextResponse.json(voucher);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, voucherId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const existing = await prisma.voucher.findUnique({ where: { id: voucherId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.voucher.delete({ where: { id: voucherId } });
  return NextResponse.json({ success: true });
}
