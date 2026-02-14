import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/:wid/tax-zones
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const zones = await prisma.taxZone.findMany({
    where: { workspaceId },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ zones });
}

// POST
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { workspaceId } = await params;
  const hasAccess = await checkWorkspacePermission(workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, countries, taxRate, reducedRate, isDefault, taxId, taxType } = body;

  if (!name || typeof taxRate !== 'number') {
    return NextResponse.json({ error: 'name and taxRate are required' }, { status: 400 });
  }

  // If marking as default, un-default others
  if (isDefault) {
    await prisma.taxZone.updateMany({
      where: { workspaceId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const zone = await prisma.taxZone.create({
    data: {
      workspaceId,
      name,
      countries: countries || [],
      defaultRate: taxRate,
      reducedRate: reducedRate ?? null,
      isDefault: isDefault ?? false,
    },
  });
  return NextResponse.json(zone, { status: 201 });
}
