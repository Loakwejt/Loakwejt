import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { PublishPageSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

// POST /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]/publish
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json().catch(() => ({}));
    const validated = PublishPageSchema.parse(body);

    // Support scheduled publishing
    const scheduledAt = body.scheduledPublishAt ? new Date(body.scheduledPublishAt) : null;

    // Get the current page
    const page = await prisma.page.findFirst({
      where: {
        id: params.pageId,
        siteId: params.siteId,
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // If scheduled for later, set the schedule and exit without publishing now
    if (scheduledAt && scheduledAt > new Date()) {
      await prisma.page.update({
        where: { id: params.pageId },
        data: { scheduledPublishAt: scheduledAt },
      });

      await createAuditLog({
        userId,
        action: 'PAGE_SCHEDULED',
        entity: 'Page',
        entityId: params.pageId,
        details: { siteId: params.siteId, scheduledAt: scheduledAt.toISOString() },
      });

      return NextResponse.json({ scheduled: true, scheduledAt: scheduledAt.toISOString() }, { status: 200 });
    }

    // Get the latest version number
    const latestRevision = await prisma.pageRevision.findFirst({
      where: { pageId: params.pageId },
      orderBy: { version: 'desc' },
    });

    const newVersion = (latestRevision?.version || 0) + 1;

    // Create new revision
    const revision = await prisma.pageRevision.create({
      data: {
        pageId: params.pageId,
        builderTree: page.builderTree as object,
        version: newVersion,
        comment: validated.comment,
        createdById: userId,
      },
    });

    // Update page to point to new revision and mark as published
    await prisma.page.update({
      where: { id: params.pageId },
      data: {
        publishedRevisionId: revision.id,
        isDraft: false,
        scheduledPublishAt: null, // Clear any schedule
      },
    });

    // Update site publish status
    await prisma.site.update({
      where: { id: params.siteId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    await createAuditLog({
      userId,
      action: 'PAGE_PUBLISHED',
      entity: 'Page',
      entityId: params.pageId,
      details: { siteId: params.siteId, version: newVersion, revisionId: revision.id },
    });

    return NextResponse.json(revision, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error publishing page:', error);
    return NextResponse.json({ error: 'Failed to publish page' }, { status: 500 });
  }
}
