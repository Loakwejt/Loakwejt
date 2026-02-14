import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { CreateCollectionSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces/[workspaceId]/collections
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    const collections = await prisma.collection.findMany({
      where: {
        workspaceId: params.workspaceId,
        ...(siteId && { siteId }),
      },
      include: {
        _count: { select: { records: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ data: collections });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/collections
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = CreateCollectionSchema.parse(body);

    // Check if slug is unique
    const existing = await prisma.collection.findFirst({
      where: {
        workspaceId: params.workspaceId,
        siteId: validated.siteId || null,
        slug: validated.slug,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A collection with this slug already exists' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        workspaceId: params.workspaceId,
        siteId: validated.siteId || null,
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        schema: validated.schema as Prisma.InputJsonValue,
      },
    });

    await createAuditLog({
      action: 'COLLECTION_CREATED',
      entity: 'Collection',
      entityId: collection.id,
      details: { name: collection.name, slug: collection.slug },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
