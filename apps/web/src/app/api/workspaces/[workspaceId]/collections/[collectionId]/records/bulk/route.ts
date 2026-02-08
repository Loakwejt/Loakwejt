import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { z } from 'zod';

const BulkOperationSchema = z.object({
  action: z.enum(['delete', 'publish', 'unpublish', 'archive']),
  recordIds: z.array(z.string()).min(1).max(100),
});

// POST /api/workspaces/[workspaceId]/collections/[collectionId]/records/bulk
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const { action, recordIds } = BulkOperationSchema.parse(body);

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

    // Verify all records belong to this collection
    const records = await prisma.record.findMany({
      where: {
        id: { in: recordIds },
        collectionId: params.collectionId,
      },
      select: { id: true },
    });

    const foundIds = new Set(records.map((r: { id: string }) => r.id));
    const missingIds = recordIds.filter(id => !foundIds.has(id));

    if (missingIds.length > 0) {
      return NextResponse.json(
        { error: `Some records not found: ${missingIds.join(', ')}` },
        { status: 404 }
      );
    }

    // Execute bulk operation
    let result;
    switch (action) {
      case 'delete':
        result = await prisma.record.deleteMany({
          where: {
            id: { in: recordIds },
            collectionId: params.collectionId,
          },
        });
        await createAuditLog({ userId, action: 'RECORDS_BULK_DELETED', entity: 'Record', details: { collectionId: params.collectionId, count: result.count } });
        return NextResponse.json({
          success: true,
          action,
          affected: result.count,
        });

      case 'publish':
        result = await prisma.record.updateMany({
          where: {
            id: { in: recordIds },
            collectionId: params.collectionId,
          },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
        });
        await createAuditLog({ userId, action: 'RECORDS_BULK_PUBLISHED', entity: 'Record', details: { collectionId: params.collectionId, count: result.count } });
        return NextResponse.json({
          success: true,
          action,
          affected: result.count,
        });

      case 'unpublish':
        result = await prisma.record.updateMany({
          where: {
            id: { in: recordIds },
            collectionId: params.collectionId,
          },
          data: {
            status: 'DRAFT',
          },
        });
        await createAuditLog({ userId, action: 'RECORDS_BULK_UNPUBLISHED', entity: 'Record', details: { collectionId: params.collectionId, count: result.count } });
        return NextResponse.json({
          success: true,
          action,
          affected: result.count,
        });

      case 'archive':
        result = await prisma.record.updateMany({
          where: {
            id: { in: recordIds },
            collectionId: params.collectionId,
          },
          data: {
            status: 'ARCHIVED',
          },
        });
        await createAuditLog({ userId, action: 'RECORDS_BULK_ARCHIVED', entity: 'Record', details: { collectionId: params.collectionId, count: result.count } });
        return NextResponse.json({
          success: true,
          action,
          affected: result.count,
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error in bulk operation:', error);
    return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 });
  }
}
