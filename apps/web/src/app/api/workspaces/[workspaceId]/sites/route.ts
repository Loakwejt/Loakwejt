import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { canCreateSite } from '@/lib/entitlements';
import { CreateSiteSchema } from '@builderly/sdk';

// GET /api/workspaces/[workspaceId]/sites
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const sites = await prisma.site.findMany({
      where: { workspaceId: params.workspaceId },
      include: {
        _count: {
          select: { pages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: sites });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

// POST /api/workspaces/[workspaceId]/sites
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    // Check entitlements
    const canCreate = await canCreateSite(params.workspaceId);
    if (!canCreate.allowed) {
      return NextResponse.json({ error: canCreate.reason }, { status: 403 });
    }

    const body = await request.json();
    const validated = CreateSiteSchema.parse(body);

    // Check if slug is unique within workspace
    const existing = await prisma.site.findUnique({
      where: {
        workspaceId_slug: {
          workspaceId: params.workspaceId,
          slug: validated.slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A site with this slug already exists in this workspace' },
        { status: 400 }
      );
    }

    const site = await prisma.site.create({
      data: {
        workspaceId: params.workspaceId,
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
      },
    });

    // Create default home page
    await prisma.page.create({
      data: {
        siteId: site.id,
        name: 'Home',
        slug: 'home',
        isHomepage: true,
        createdById: userId,
        builderTree: {
          builderVersion: 1,
          root: {
            id: 'root',
            type: 'Section',
            props: {},
            style: { base: { padding: 'lg' } },
            actions: [],
            children: [
              {
                id: 'heading-1',
                type: 'Heading',
                props: { level: 1, text: `Welcome to ${validated.name}` },
                style: { base: { textAlign: 'center' } },
                actions: [],
                children: [],
              },
              {
                id: 'text-1',
                type: 'Text',
                props: { text: 'Start editing this page in the visual editor.' },
                style: { base: { textAlign: 'center', color: 'muted-foreground' } },
                actions: [],
                children: [],
              },
            ],
          },
        },
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error creating site:', error);
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 });
  }
}
