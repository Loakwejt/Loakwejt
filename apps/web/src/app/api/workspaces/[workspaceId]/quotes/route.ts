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

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.quote.count({ where }),
  ]);
  return NextResponse.json({ quotes, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { customerName, customerEmail, customerAddress, lineItems, taxRate, notes, validUntil } = body;
  if (!customerName || !customerEmail) return NextResponse.json({ error: 'customerName and customerEmail are required' }, { status: 400 });

  const count = await prisma.quote.count({ where: { workspaceId } });
  const quoteNumber = `QUO-${String(count + 1).padStart(5, '0')}`;

  const items = lineItems || [];
  const subtotal = items.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);
  const tax = subtotal * ((taxRate || 0) / 100);

  const quote = await prisma.quote.create({
    data: {
      workspaceId, quoteNumber, customerName, customerEmail,
      customerAddress: customerAddress || null, items,
      subtotal, taxAmount: tax, total: subtotal + tax,
      currency: 'EUR', notes: notes || null, status: 'DRAFT',
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 86400000),
    },
  });
  return NextResponse.json(quote, { status: 201 });
}
