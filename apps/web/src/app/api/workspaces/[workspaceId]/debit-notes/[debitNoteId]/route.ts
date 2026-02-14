import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; debitNoteId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, debitNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const dn = await prisma.debitNote.findFirst({
    where: { id: debitNoteId, workspaceId },
    include: { order: { select: { id: true, email: true, name: true } } },
  });
  if (!dn) return NextResponse.json({ error: 'Debit note not found' }, { status: 404 });
  return NextResponse.json(dn);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, debitNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.debitNote.findFirst({ where: { id: debitNoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Debit note not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status) {
    data.status = body.status;
    if (body.status === 'ISSUED') data.issuedAt = new Date();
  }
  if (body.reason) data.reason = body.reason;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.lineItems) {
    data.items = body.lineItems;
    const subtotal = body.lineItems.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);
    const taxRate = body.taxRate ?? 0;
    data.subtotal = subtotal;
    data.taxAmount = subtotal * (taxRate / 100);
    data.total = subtotal + subtotal * (taxRate / 100);
  }

  const dn = await prisma.debitNote.update({ where: { id: debitNoteId }, data });
  return NextResponse.json(dn);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, debitNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.debitNote.findFirst({ where: { id: debitNoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Debit note not found' }, { status: 404 });
  if (existing.status !== 'DRAFT') return NextResponse.json({ error: 'Only draft debit notes can be deleted' }, { status: 400 });

  await prisma.debitNote.delete({ where: { id: debitNoteId } });
  return NextResponse.json({ success: true });
}
