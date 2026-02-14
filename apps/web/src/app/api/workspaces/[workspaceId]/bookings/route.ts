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

  const where: Record<string, unknown> = { workspaceId };
  if (status) where.status = status;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({ where, orderBy: { startTime: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.booking.count({ where }),
  ]);
  return NextResponse.json({ bookings, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { workspaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { serviceName, customerName, customerEmail, startTime, endTime, price, notes } = body;
  if (!serviceName || !customerName || !customerEmail || !startTime || !endTime) {
    return NextResponse.json({ error: 'serviceName, customerName, customerEmail, startTime, and endTime are required' }, { status: 400 });
  }

  const count = await prisma.booking.count({ where: { workspaceId } });
  const bookingNumber = `BK-${String(count + 1).padStart(5, '0')}`;

  // Check for overlapping bookings
  const overlap = await prisma.booking.findFirst({
    where: {
      workspaceId, title: serviceName,
      status: { not: 'CANCELLED' },
      startTime: { lt: new Date(endTime) },
      endTime: { gt: new Date(startTime) },
    },
  });
  if (overlap) return NextResponse.json({ error: 'Time slot overlaps with an existing booking' }, { status: 409 });

  const booking = await prisma.booking.create({
    data: {
      workspaceId, title: serviceName,
      customerName, customerEmail, startTime: new Date(startTime),
      endTime: new Date(endTime), price: price ? parseFloat(price) : 0,
      currency: 'EUR', status: 'PENDING', notes: notes || null,
    },
  });
  return NextResponse.json(booking, { status: 201 });
}
