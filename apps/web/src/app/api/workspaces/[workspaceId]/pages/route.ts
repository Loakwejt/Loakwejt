import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { canCreatePage } from '@/lib/entitlements';
import { CreatePageSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]/pages
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const pages = await prisma.page.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isHomepage: true,
        isDraft: true,
        publishedRevisionId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { isHomepage: 'desc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ data: pages });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/pages
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'edit');

    // Check entitlements
    const canCreate = await canCreatePage(workspaceId);
    if (!canCreate.allowed) {
      return NextResponse.json({ error: canCreate.reason }, { status: 403 });
    }

    const body = await request.json();
    const validated = CreatePageSchema.parse(body);

    // Check if slug is unique within site
    const existing = await prisma.page.findUnique({
      where: {
        workspaceId_slug: {
          workspaceId,
          slug: validated.slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      );
    }

    // If setting as homepage, unset existing homepage
    if (validated.isHomepage) {
      await prisma.page.updateMany({
        where: { workspaceId, isHomepage: true },
        data: { isHomepage: false },
      });
    }

    const page = await prisma.page.create({
      data: {
        workspaceId,
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        isHomepage: validated.isHomepage || false,
        createdById: userId,
        builderTree: {
          builderVersion: 1,
          root: {
            id: 'root',
            type: 'Section',
            props: {},
            style: { base: { padding: 'lg' } },
            actions: [],
            children: [],
          },
        },
      },
    });

    await createAuditLog({
      userId,
      action: 'PAGE_CREATED',
      entity: 'Page',
      entityId: page.id,
      details: { name: page.name, slug: page.slug, workspaceId },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
