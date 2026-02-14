import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { UpdatePageSchema } from '@builderly/sdk';
import { ZodError } from 'zod';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const page = await prisma.page.findFirst({
      where: {
        id: params.pageId,
        siteId: params.siteId,
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdatePageSchema.parse(body);

    // If updating slug, check uniqueness
    if (validated.slug) {
      const existing = await prisma.page.findFirst({
        where: {
          siteId: params.siteId,
          slug: validated.slug,
          id: { not: params.pageId },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // If setting as homepage, unset existing homepage
    if (validated.isHomepage) {
      await prisma.page.updateMany({
        where: {
          siteId: params.siteId,
          isHomepage: true,
          id: { not: params.pageId },
        },
        data: { isHomepage: false },
      });
    }

    // Destructure builderTree to handle separately
    const { builderTree, ...restValidated } = validated;
    
    const page = await prisma.page.update({
      where: {
        id: params.pageId,
        siteId: params.siteId,
      },
      data: {
        ...restValidated,
        ...(builderTree !== undefined && { builderTree: builderTree as Prisma.InputJsonValue }),
      },
    });

    await createAuditLog({
      action: 'PAGE_UPDATED',
      entity: 'Page',
      entityId: params.pageId,
      details: { fields: Object.keys(validated), siteId: params.siteId },
    });

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Validation error updating page:', error.errors);
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page', details: String(error) }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/sites/[siteId]/pages/[pageId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string; pageId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    // Check if this is the only page
    const pageCount = await prisma.page.count({
      where: { siteId: params.siteId },
    });

    if (pageCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last page of a site' },
        { status: 400 }
      );
    }

    // Check if this is the homepage
    const page = await prisma.page.findUnique({
      where: { id: params.pageId },
    });

    if (page?.isHomepage) {
      return NextResponse.json(
        { error: 'Cannot delete the homepage. Set another page as homepage first.' },
        { status: 400 }
      );
    }

    await prisma.page.delete({
      where: {
        id: params.pageId,
        siteId: params.siteId,
      },
    });

    await createAuditLog({
      action: 'PAGE_DELETED',
      entity: 'Page',
      entityId: params.pageId,
      details: { siteId: params.siteId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
