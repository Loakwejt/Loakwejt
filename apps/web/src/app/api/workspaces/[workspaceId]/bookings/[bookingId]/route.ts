import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext { params: Promise<{ workspaceId: string; bookingId: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, bookingId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const booking = await prisma.booking.findFirst({ where: { id: bookingId, workspaceId } });
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { workspaceId, bookingId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'edit');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.booking.findFirst({ where: { id: bookingId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.status) {
    data.status = body.status;
    if (body.status === 'CONFIRMED') data.confirmedAt = new Date();
    if (body.status === 'CANCELED') data.canceledAt = new Date();
    if (body.status === 'COMPLETED') data.completedAt = new Date();
    if (body.status === 'NO_SHOW') data.noShowAt = new Date();
  }
  if (body.serviceName) data.serviceName = body.serviceName;
  if (body.customerName) data.customerName = body.customerName;
  if (body.customerEmail) data.customerEmail = body.customerEmail;
  if (body.startTime) data.startTime = new Date(body.startTime);
  if (body.endTime) data.endTime = new Date(body.endTime);
  if (body.price !== undefined) data.price = parseFloat(body.price);
  if (body.notes !== undefined) data.notes = body.notes;

  const booking = await prisma.booking.update({ where: { id: bookingId }, data });
  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { workspaceId, bookingId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const existing = await prisma.booking.findFirst({ where: { id: bookingId, workspaceId } });
  if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  await prisma.booking.delete({ where: { id: bookingId } });
  return NextResponse.json({ success: true });
}
