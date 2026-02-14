import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string; zoneId: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, zoneId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const zone = await prisma.taxZone.findUnique({ where: { id: zoneId } });
  if (!zone || zone.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(zone);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, zoneId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.taxZone.findUnique({ where: { id: zoneId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  if (body.isDefault) {
    await prisma.taxZone.updateMany({
      where: { workspaceId, isDefault: true, NOT: { id: zoneId } },
      data: { isDefault: false },
    });
  }

  const zone = await prisma.taxZone.update({ where: { id: zoneId }, data: body });
  return NextResponse.json(zone);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, zoneId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.taxZone.findUnique({ where: { id: zoneId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.taxZone.delete({ where: { id: zoneId } });
  return NextResponse.json({ success: true });
}
