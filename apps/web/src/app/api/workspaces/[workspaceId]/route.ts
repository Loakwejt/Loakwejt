import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces/[workspaceId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const workspace = await prisma.workspace.findUnique({
      where: { id: params.workspaceId },
      include: {
        _count: {
          select: {
            sites: true,
            members: true,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching workspace:', error);
    return NextResponse.json({ error: 'Failed to fetch workspace' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'admin');

    const body = await request.json();
    const {
      name,
      description,
      logoUrl,
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyVatId,
      companyWebsite,
      socialLinks,
    } = body;

    const workspace = await prisma.workspace.update({
      where: { id: params.workspaceId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(companyName !== undefined && { companyName }),
        ...(companyEmail !== undefined && { companyEmail }),
        ...(companyPhone !== undefined && { companyPhone }),
        ...(companyAddress !== undefined && { companyAddress }),
        ...(companyVatId !== undefined && { companyVatId }),
        ...(companyWebsite !== undefined && { companyWebsite }),
        ...(socialLinks !== undefined && { socialLinks: socialLinks as Prisma.InputJsonValue }),
      },
    });

    await createAuditLog({
      userId,
      action: 'WORKSPACE_UPDATED',
      entity: 'Workspace',
      entityId: params.workspaceId,
      details: { fields: Object.keys(body) },
    });

    return NextResponse.json(workspace);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating workspace:', error);
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'owner');

    await createAuditLog({
      userId,
      action: 'WORKSPACE_DELETED',
      entity: 'Workspace',
      entityId: params.workspaceId,
    });

    await prisma.workspace.delete({
      where: { id: params.workspaceId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting workspace:', error);
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
  }
}
