import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';

// GET /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]/revisions
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const revisions = await prisma.pageRevision.findMany({
      where: { pageId: params.pageId },
      select: {
        id: true,
        version: true,
        comment: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { version: 'desc' },
    });

    return NextResponse.json({ data: revisions });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching revisions:', error);
    return NextResponse.json({ error: 'Failed to fetch revisions' }, { status: 500 });
  }
}
