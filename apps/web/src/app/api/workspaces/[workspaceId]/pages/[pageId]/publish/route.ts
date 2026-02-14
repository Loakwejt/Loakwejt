import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { PublishPageSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';
import { validatePageLinks } from '@/lib/reference-validator';

interface RouteContext {
  params: Promise<{ workspaceId: string; pageId: string }>;
}

// POST /api/workspaces/[workspaceId]/pages/[pageId]/publish
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId, pageId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json().catch(() => ({}));
    const validated = PublishPageSchema.parse(body);

    // Support scheduled publishing
    const scheduledAt = body.scheduledPublishAt ? new Date(body.scheduledPublishAt) : null;

    // Get the current page
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        workspaceId,
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Validate internal links before publishing
    const { searchParams } = new URL(request.url);
    const skipLinkValidation = searchParams.get('skipLinkValidation') === 'true';
    
    if (!skipLinkValidation) {
      const linkValidation = await validatePageLinks(pageId);
      
      if (!linkValidation.valid) {
        return NextResponse.json({
          error: 'Broken Links gefunden',
          details: linkValidation.errors,
          warnings: linkValidation.warnings,
          brokenLinks: linkValidation.usages.map(u => u.propertyPath),
          hint: 'Füge ?skipLinkValidation=true hinzu um trotzdem zu veröffentlichen'
        }, { status: 422 });
      }
    }

    // If scheduled for later, set the schedule and exit without publishing now
    if (scheduledAt && scheduledAt > new Date()) {
      await prisma.page.update({
        where: { id: pageId },
        data: { scheduledPublishAt: scheduledAt },
      });

      await createAuditLog({
        userId,
        action: 'PAGE_SCHEDULED',
        entity: 'Page',
        entityId: pageId,
        details: { workspaceId, scheduledAt: scheduledAt.toISOString() },
      });

      return NextResponse.json({ scheduled: true, scheduledAt: scheduledAt.toISOString() }, { status: 200 });
    }

    // Get the latest version number
    const latestRevision = await prisma.pageRevision.findFirst({
      where: { pageId },
      orderBy: { version: 'desc' },
    });

    const newVersion = (latestRevision?.version || 0) + 1;

    // Create new revision
    const revision = await prisma.pageRevision.create({
      data: {
        pageId,
        builderTree: page.builderTree as object,
        version: newVersion,
        comment: validated.comment,
        createdById: userId,
      },
    });

    // Update page to point to new revision and mark as published
    await prisma.page.update({
      where: { id: pageId },
      data: {
        publishedRevisionId: revision.id,
        isDraft: false,
        scheduledPublishAt: null, // Clear any schedule
      },
    });

    // Update workspace publish status
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    await createAuditLog({
      userId,
      action: 'PAGE_PUBLISHED',
      entity: 'Page',
      entityId: pageId,
      details: { workspaceId, version: newVersion, revisionId: revision.id },
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
