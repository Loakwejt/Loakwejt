import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { UpdateSiteSchema } from '@builderly/sdk';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces/[workspaceId]/sites/[siteId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const site = await prisma.site.findFirst({
      where: {
        id: params.siteId,
        workspaceId: params.workspaceId,
      },
      include: {
        _count: {
          select: { pages: true },
        },
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json(site);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching site:', error);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/sites/[siteId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const validated = UpdateSiteSchema.parse(body);
    
    // Destructure settings to handle separately
    const { settings, ...restValidated } = validated;
    const enableUserAuth = (validated as Record<string, unknown>).enableUserAuth as boolean | undefined;

    // Enforce irreversibility: enableUserAuth can only go false → true
    if (enableUserAuth !== undefined) {
      const existingSite = await prisma.site.findFirst({
        where: { id: params.siteId, workspaceId: params.workspaceId },
      });

      if (!existingSite) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }

      if ((existingSite as Record<string, unknown>).enableUserAuth && !enableUserAuth) {
        return NextResponse.json(
          { error: 'Das Login-System kann nicht deaktiviert werden, sobald es aktiviert wurde.' },
          { status: 400 },
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { enableUserAuth: _ea, ...cleanData } = restValidated as Record<string, unknown>;

    const site = await prisma.site.update({
      where: {
        id: params.siteId,
        workspaceId: params.workspaceId,
      },
      data: {
        ...cleanData,
        ...(enableUserAuth === true && {
          enableUserAuth: true,
          userAuthEnabledAt: new Date(),
        }),
        ...(settings !== undefined && { settings: settings as Prisma.InputJsonValue }),
      },
    });

    await createAuditLog({
      action: 'SITE_UPDATED',
      entity: 'Site',
      entityId: params.siteId,
      details: { fields: Object.keys(validated) },
    });

    return NextResponse.json(site);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating site:', error);
    return NextResponse.json({ error: 'Failed to update site' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/sites/[siteId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; siteId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'admin');

    await createAuditLog({
      action: 'SITE_DELETED',
      entity: 'Site',
      entityId: params.siteId,
    });

    await prisma.site.delete({
      where: {
        id: params.siteId,
        workspaceId: params.workspaceId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting site:', error);
    return NextResponse.json({ error: 'Failed to delete site' }, { status: 500 });
  }
}
