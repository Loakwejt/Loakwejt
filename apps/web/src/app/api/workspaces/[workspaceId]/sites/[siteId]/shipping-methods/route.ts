import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET /api/workspaces/:wid/sites/:sid/shipping-methods
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const methods = await prisma.shippingMethod.findMany({
    where: { siteId: params.siteId },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ methods });
}

// POST /api/workspaces/:wid/sites/:sid/shipping-methods
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, description, price, freeAbove, estimatedDaysMin, estimatedDaysMax, countries, maxWeight, sortOrder, isActive } = body;

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const method = await prisma.shippingMethod.create({
    data: {
      siteId: params.siteId,
      name,
      description: description || null,
      price: price ?? 0,
      freeAbove: freeAbove || null,
      estimatedDaysMin: estimatedDaysMin ?? 3,
      estimatedDaysMax: estimatedDaysMax ?? 5,
      countries: countries || [],
      maxWeight: maxWeight || null,
      sortOrder: sortOrder ?? 0,
      isActive: isActive !== false,
    },
  });

  return NextResponse.json({ method }, { status: 201 });
}
