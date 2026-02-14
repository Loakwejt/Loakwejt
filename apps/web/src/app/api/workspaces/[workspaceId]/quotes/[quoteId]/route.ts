import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; quoteId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, quoteId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const quote = await prisma.quote.findFirst({ where: { id: quoteId, workspaceId } });
  if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  return NextResponse.json(quote);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, quoteId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.quote.findFirst({ where: { id: quoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.status) {
    data.status = body.status;
    if (body.status === 'SENT') data.sentAt = new Date();
    if (body.status === 'ACCEPTED') data.acceptedAt = new Date();
    if (body.status === 'REJECTED') data.rejectedAt = new Date();
  }
  if (body.customerName) data.customerName = body.customerName;
  if (body.customerEmail) data.customerEmail = body.customerEmail;
  if (body.customerAddress !== undefined) data.customerAddress = body.customerAddress;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.validUntil) data.validUntil = new Date(body.validUntil);
  if (body.lineItems) {
    data.items = body.lineItems;
    const subtotal = body.lineItems.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);
    const taxRate = body.taxRate ?? 0;
    data.subtotal = subtotal;
    data.taxAmount = subtotal * (taxRate / 100);
    data.total = subtotal + subtotal * (taxRate / 100);
  }

  const quote = await prisma.quote.update({ where: { id: quoteId }, data });
  return NextResponse.json(quote);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, quoteId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.quote.findFirst({ where: { id: quoteId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  if (existing.status !== 'DRAFT') return NextResponse.json({ error: 'Only draft quotes can be deleted' }, { status: 400 });

  await prisma.quote.delete({ where: { id: quoteId } });
  return NextResponse.json({ success: true });
}
