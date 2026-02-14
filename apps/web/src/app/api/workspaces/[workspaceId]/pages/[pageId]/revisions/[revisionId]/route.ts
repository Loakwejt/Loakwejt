import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';

interface RouteContext {
  params: Promise<{ workspaceId: string; pageId: string; revisionId: string }>;
}

// GET /api/workspaces/[workspaceId]/pages/[pageId]/revisions/[revisionId]
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId, pageId, revisionId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const revision = await prisma.pageRevision.findFirst({
      where: { 
        id: revisionId,
        pageId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!revision) {
      return NextResponse.json({ error: 'Revision nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ data: revision });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching revision:', error);
    return NextResponse.json({ error: 'Failed to fetch revision' }, { status: 500 });
  }
}
