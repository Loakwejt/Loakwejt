import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';
import { CreateRecordSchema } from '@builderly/sdk';

// GET /api/workspaces/[workspaceId]/collections/[collectionId]/records
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const where = {
      collectionId: params.collectionId,
      ...(status && { status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }),
    };

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.record.count({ where }),
    ]);

    return NextResponse.json({
      data: records,
      meta: {
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/collections/[collectionId]/records
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; collectionId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = CreateRecordSchema.parse(body);

    // Check if slug is unique within collection (if provided)
    if (validated.slug) {
      const existing = await prisma.record.findFirst({
        where: {
          collectionId: params.collectionId,
          slug: validated.slug,
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'A record with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const record = await prisma.record.create({
      data: {
        collectionId: params.collectionId,
        data: validated.data as Prisma.InputJsonValue,
        slug: validated.slug,
        status: validated.status || 'DRAFT',
        createdById: userId,
      },
    });

    await createAuditLog({ userId, action: 'RECORD_CREATED', entity: 'Record', entityId: record.id, details: { collectionId: params.collectionId, slug: validated.slug } });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating record:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}
