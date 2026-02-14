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
  const recovered = url.searchParams.get('recovered');

  const where: Record<string, unknown> = { workspaceId };
  if (recovered === 'true') where.recoveredAt = { not: null };
  if (recovered === 'false') where.recoveredAt = null;

  const [carts, total] = await Promise.all([
    prisma.cart.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
    prisma.cart.count({ where }),
  ]);

  const totalValue = await prisma.cart.aggregate({ where: { workspaceId, recoveredAt: null }, _sum: { subtotal: true } });

  return NextResponse.json({ carts, total, page, limit, pages: Math.ceil(total / limit), abandonedValue: totalValue._sum?.subtotal || 0 });
}
