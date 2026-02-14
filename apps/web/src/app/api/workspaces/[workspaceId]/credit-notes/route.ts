import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, parseInt(url.searchParams.get('limit') || '20'));
  const status = url.searchParams.get('status') || '';
  const orderId = url.searchParams.get('orderId') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (status) where.status = status;
  if (orderId) where.orderId = orderId;

  const [creditNotes, total] = await Promise.all([
    prisma.creditNote.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { order: { select: { id: true, email: true } } } }),
    prisma.creditNote.count({ where }),
  ]);
  return NextResponse.json({ creditNotes, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { orderId, reason, lineItems, taxRate } = body;
  if (!orderId || !reason) return NextResponse.json({ error: 'orderId and reason are required' }, { status: 400 });

  const order = await prisma.order.findFirst({ where: { id: orderId, workspaceId } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const count = await prisma.creditNote.count({ where: { workspaceId } });
  const creditNoteNumber = `CN-${String(count + 1).padStart(5, '0')}`;

  const items = lineItems || [];
  const subtotal = items.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);
  const tax = subtotal * ((taxRate || 0) / 100);

  const cn = await prisma.creditNote.create({
    data: {
      workspaceId, orderId, creditNoteNumber, reason,
      customerName: order!.name || order!.email, customerEmail: order!.email,
      items, subtotal, taxAmount: tax,
      total: subtotal + tax, currency: 'EUR', status: 'DRAFT',
    },
  });
  return NextResponse.json(cn, { status: 201 });
}
