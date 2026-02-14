import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; creditNoteId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, creditNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const cn = await prisma.creditNote.findFirst({
    where: { id: creditNoteId, workspaceId },
    include: { order: { select: { id: true, email: true, name: true } } },
  });
  if (!cn) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });
  return NextResponse.json(cn);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, creditNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.creditNote.findFirst({ where: { id: creditNoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });

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

  const cn = await prisma.creditNote.update({ where: { id: creditNoteId }, data });
  return NextResponse.json(cn);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, creditNoteId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.creditNote.findFirst({ where: { id: creditNoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Credit note not found' }, { status: 404 });
  if (existing.status !== 'DRAFT') return NextResponse.json({ error: 'Only draft credit notes can be deleted' }, { status: 400 });

  await prisma.creditNote.delete({ where: { id: creditNoteId } });
  return NextResponse.json({ success: true });
}
