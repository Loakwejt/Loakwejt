import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { z } from 'zod';

const RollbackSchema = z.object({
  revisionId: z.string(),
});

// POST /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]/rollback
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const { revisionId } = RollbackSchema.parse(body);

    // Get the revision
    const revision = await prisma.pageRevision.findFirst({
      where: {
        id: revisionId,
        pageId: params.pageId,
      },
    });

    if (!revision) {
      return NextResponse.json({ error: 'Revision not found' }, { status: 404 });
    }

    // Update the page to use this revision's builder tree and point to it
    const page = await prisma.page.update({
      where: { id: params.pageId },
      data: {
        builderTree: revision.builderTree as object,
        publishedRevisionId: revision.id,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error rolling back page:', error);
    return NextResponse.json({ error: 'Failed to rollback page' }, { status: 500 });
  }
}
