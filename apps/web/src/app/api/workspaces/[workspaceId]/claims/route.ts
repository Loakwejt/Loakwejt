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
  const type = url.searchParams.get('type') || '';
  const status = url.searchParams.get('status') || '';

  const where: Record<string, unknown> = { workspaceId };
  if (type) where.type = type;
  if (status) where.status = status;

  const [claims, total] = await Promise.all([
    prisma.claim.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
      include: { order: { select: { id: true, email: true } } },
    }),
    prisma.claim.count({ where }),
  ]);
  return NextResponse.json({ claims, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { orderId, type, reason, items, customerEmail, customerName } = body;
  if (!orderId || !type || !reason) return NextResponse.json({ error: 'orderId, type and reason are required' }, { status: 400 });

  // Generate claim number
  const count = await prisma.claim.count({ where: { workspaceId } });
  const claimNumber = `CLM-${String(count + 1).padStart(5, '0')}`;

  const refundAmount = (items || []).reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0);

  const claim = await prisma.claim.create({
    data: {
      workspaceId, orderId, claimNumber, type, reason,
      items: items || [], customerEmail: customerEmail || null, customerName: customerName || null,
      refundAmount, status: 'OPEN',
    },
  });
  return NextResponse.json(claim, { status: 201 });
}
