import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const UpdateCollectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  schema: z.record(z.any()).optional(),
});

// GET /api/workspaces/[workspaceId]/collections/[collectionId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; collectionId: string }> }
) {
  const { workspaceId, collectionId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'view');

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
      },
      include: {
        _count: { select: { records: true } },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/collections/[collectionId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; collectionId: string }> }
) {
  const { workspaceId, collectionId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateCollectionSchema.parse(body);

    // Verify collection exists and belongs to workspace
    const existing = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.schema !== undefined && { schema: validated.schema }),
      },
    });

    await createAuditLog({
      action: 'COLLECTION_UPDATED',
      entity: 'Collection',
      entityId: collectionId,
    });

    return NextResponse.json(collection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/collections/[collectionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string; collectionId: string }> }
) {
  const { workspaceId, collectionId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'edit');

    // Verify collection exists and belongs to workspace
    const existing = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Delete collection (records will be cascade deleted)
    await prisma.collection.delete({
      where: { id: collectionId },
    });

    await createAuditLog({
      action: 'COLLECTION_DELETED',
      entity: 'Collection',
      entityId: collectionId,
      details: { name: existing.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
