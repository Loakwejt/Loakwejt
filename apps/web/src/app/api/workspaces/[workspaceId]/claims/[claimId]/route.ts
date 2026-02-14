import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; claimId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, claimId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const claim = await prisma.claim.findUnique({ where: { id: claimId }, include: { order: true } });
  if (!claim || claim.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(claim);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, claimId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const existing = await prisma.claim.findUnique({ where: { id: claimId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status) {
    data.status = body.status;
    if (body.status === 'APPROVED') data.approvedAt = new Date();
    if (body.status === 'REFUNDED') data.refundedAt = new Date();
    if (body.status === 'REJECTED') data.rejectedAt = new Date();
    if (body.status === 'CLOSED') data.closedAt = new Date();
  }
  if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes;
  if (body.refundAmount !== undefined) data.refundAmount = body.refundAmount;
  if (body.resolution !== undefined) data.resolution = body.resolution;

  const claim = await prisma.claim.update({ where: { id: claimId }, data });
  return NextResponse.json(claim);
}
