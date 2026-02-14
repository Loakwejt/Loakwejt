import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string; methodId: string }>;
}

// PATCH update shipping method
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, methodId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, description, price, freeAbove, estimatedDaysMin, estimatedDaysMax, countries, maxWeight, sortOrder, isActive } = body;

  const method = await prisma.shippingMethod.update({
    where: { id: methodId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(freeAbove !== undefined && { freeAbove }),
      ...(estimatedDaysMin !== undefined && { estimatedDaysMin }),
      ...(estimatedDaysMax !== undefined && { estimatedDaysMax }),
      ...(countries !== undefined && { countries }),
      ...(maxWeight !== undefined && { maxWeight }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json({ method });
}

// DELETE shipping method
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId, methodId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.shippingMethod.delete({ where: { id: methodId } });
  return NextResponse.json({ success: true });
}
