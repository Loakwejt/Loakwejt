import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';

// GET /api/workspaces/[workspaceId]/assets
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    const assets = await prisma.asset.findMany({
      where: {
        workspaceId: params.workspaceId,
        ...(siteId && { siteId }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: assets });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}
