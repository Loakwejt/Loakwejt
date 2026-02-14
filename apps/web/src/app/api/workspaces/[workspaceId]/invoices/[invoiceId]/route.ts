import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; invoiceId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, invoiceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { order: true } });
  if (!invoice || invoice.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, invoiceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const existing = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status) {
    data.status = body.status;
    if (body.status === 'SENT') data.sentAt = new Date();
    if (body.status === 'PAID') data.paidAt = new Date();
    if (body.status === 'CANCELLED') data.cancelledAt = new Date();
  }
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.lineItems) data.lineItems = body.lineItems;
  if (body.dueDate) data.dueDate = new Date(body.dueDate);
  if (body.pdfUrl) data.pdfUrl = body.pdfUrl;

  const invoice = await prisma.invoice.update({ where: { id: invoiceId }, data });
  return NextResponse.json(invoice);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, invoiceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const existing = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!existing || existing.workspaceId !== workspaceId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (existing.status !== 'DRAFT') return NextResponse.json({ error: 'Can only delete draft invoices' }, { status: 400 });
  await prisma.invoice.delete({ where: { id: invoiceId } });
  return NextResponse.json({ success: true });
}
