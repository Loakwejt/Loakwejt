import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { z } from 'zod';

const UpdateRecordSchema = z.object({
  data: z.record(z.any()).optional(),
  slug: z.string().min(1).max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// GET /api/workspaces/[workspaceId]/collections/[collectionId]/records/[recordId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string; recordId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    // Verify collection belongs to workspace
    const collection = await prisma.collection.findFirst({
      where: {
        id: params.collectionId,
        workspaceId: params.workspaceId,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const record = await prisma.record.findFirst({
      where: {
        id: params.recordId,
        collectionId: params.collectionId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching record:', error);
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/collections/[collectionId]/records/[recordId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string; recordId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateRecordSchema.parse(body);

    // Verify collection belongs to workspace
    const collection = await prisma.collection.findFirst({
      where: {
        id: params.collectionId,
        workspaceId: params.workspaceId,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Verify record exists
    const existing = await prisma.record.findFirst({
      where: {
        id: params.recordId,
        collectionId: params.collectionId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.record.findFirst({
        where: {
          collectionId: params.collectionId,
          slug: validated.slug,
          NOT: { id: params.recordId },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A record with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update record
    const record = await prisma.record.update({
      where: { id: params.recordId },
      data: {
        ...(validated.data !== undefined && { data: validated.data }),
        ...(validated.slug !== undefined && { slug: validated.slug }),
        ...(validated.status !== undefined && { status: validated.status }),
        // Update publishedAt timestamp if publishing
        ...(validated.status === 'PUBLISHED' && !existing.publishedAt && {
          publishedAt: new Date(),
        }),
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/collections/[collectionId]/records/[recordId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string; recordId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    // Verify collection belongs to workspace
    const collection = await prisma.collection.findFirst({
      where: {
        id: params.collectionId,
        workspaceId: params.workspaceId,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Verify record exists
    const existing = await prisma.record.findFirst({
      where: {
        id: params.recordId,
        collectionId: params.collectionId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Delete record
    await prisma.record.delete({
      where: { id: params.recordId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting record:', error);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
