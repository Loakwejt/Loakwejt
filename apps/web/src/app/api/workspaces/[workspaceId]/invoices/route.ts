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
  const status = url.searchParams.get('status') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (status) where.status = status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
      include: { order: { select: { id: true, email: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);
  return NextResponse.json({ invoices, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { orderId, customerName, customerEmail, customerAddress, lineItems, taxRate, notes, dueDate } = body;

  // Generate invoice number
  const settings = await prisma.invoiceSettings.findUnique({ where: { workspaceId } });
  const prefix = settings?.invoicePrefix || 'INV';
  const lastInvoice = await prisma.invoice.findFirst({
    where: { workspaceId }, orderBy: { invoiceNumber: 'desc' },
  });
  const nextNum = lastInvoice ? parseInt(lastInvoice.invoiceNumber.replace(/\D/g, '')) + 1 : (settings?.nextInvoiceNumber || 1);
  const invoiceNumber = `${prefix}-${String(nextNum).padStart(5, '0')}`;

  // Calculate totals
  const items = lineItems || [];
  const subtotal = items.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);
  const tax = subtotal * ((taxRate || 0) / 100);
  const total = subtotal + tax;

  const invoice = await prisma.invoice.create({
    data: {
      workspaceId, orderId: orderId || null, invoiceNumber,
      customerName, customerEmail, customerAddress: customerAddress || null,
      items, subtotal, taxAmount: tax, total,
      currency: 'EUR',
      notes: notes || null, dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 86400000),
      status: 'DRAFT',
    },
  });

  // Update next invoice number
  if (settings) {
    await prisma.invoiceSettings.update({
      where: { workspaceId }, data: { nextInvoiceNumber: nextNum + 1 },
    });
  }

  return NextResponse.json(invoice, { status: 201 });
}
