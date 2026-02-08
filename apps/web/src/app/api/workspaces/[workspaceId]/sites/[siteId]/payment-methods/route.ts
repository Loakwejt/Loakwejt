import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: { workspaceId: string; siteId: string };
}

// GET /api/workspaces/:wid/sites/:sid/payment-methods
export async function GET(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'view');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const methods = await prisma.paymentMethod.findMany({
    where: { siteId: params.siteId },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ methods });
}

// POST /api/workspaces/:wid/sites/:sid/payment-methods
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hasAccess = await checkWorkspacePermission(params.workspaceId, session.user.id, 'admin');
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { name, provider, config, description, icon, sortOrder, isActive } = body;

  if (!name || !provider) {
    return NextResponse.json({ error: 'name and provider are required' }, { status: 400 });
  }

  const method = await prisma.paymentMethod.create({
    data: {
      siteId: params.siteId,
      name,
      provider,
      config: config || {},
      description: description || null,
      icon: icon || null,
      sortOrder: sortOrder ?? 0,
      isActive: isActive !== false,
    },
  });

  return NextResponse.json({ method }, { status: 201 });
}
