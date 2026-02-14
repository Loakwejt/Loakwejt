import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { createAuditLog } from '@/lib/audit';

interface RouteContext {
  params: Promise<{ workspaceId: string }>;
}

// GET /api/workspaces/[workspaceId]
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    await requireWorkspacePermission(workspaceId, 'view');

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: {
            pages: true,
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
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'admin');

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
      where: { id: workspaceId },
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
      entityId: workspaceId,
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
  { params }: RouteContext
) {
  try {
    const { workspaceId } = await params;
    const { userId } = await requireWorkspacePermission(workspaceId, 'owner');

    await createAuditLog({
      userId,
      action: 'WORKSPACE_DELETED',
      entity: 'Workspace',
      entityId: workspaceId,
    });

    await prisma.workspace.delete({
      where: { id: workspaceId },
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
