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

  const [vouchers, total] = await Promise.all([
    prisma.voucher.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.voucher.count({ where }),
  ]);
  return NextResponse.json({ vouchers, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { code, initialBalance, currency, recipientEmail, recipientName, expiresAt, message } = body;
  if (!code || typeof initialBalance !== 'number') {
    return NextResponse.json({ error: 'code and initialBalance are required' }, { status: 400 });
  }

  const existing = await prisma.voucher.findFirst({ where: { workspaceId, code: code.toUpperCase() } });
  if (existing) return NextResponse.json({ error: 'Voucher code already exists' }, { status: 409 });

  const voucher = await prisma.voucher.create({
    data: {
      workspaceId, code: code.toUpperCase(), initialValue: initialBalance, balance: initialBalance,
      currency: currency || 'EUR', recipientEmail: recipientEmail || null, recipientName: recipientName || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null, personalMessage: message || null,
    },
  });
  return NextResponse.json(voucher, { status: 201 });
}
