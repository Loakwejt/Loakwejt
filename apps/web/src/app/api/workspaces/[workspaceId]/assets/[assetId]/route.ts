import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { deleteFile } from '@/lib/storage';
import { createAuditLog } from '@/lib/audit';

// GET /api/workspaces/[workspaceId]/assets/[assetId]
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; assetId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'view');

    const asset = await prisma.asset.findFirst({
      where: {
        id: params.assetId,
        workspaceId: params.workspaceId,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching asset:', error);
    return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
  }
}

// PATCH /api/workspaces/[workspaceId]/assets/[assetId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; assetId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    const body = await request.json();
    const { name, alt, caption, folder, tags } = body;

    // Verify asset exists and belongs to workspace
    const existing = await prisma.asset.findFirst({
      where: {
        id: params.assetId,
        workspaceId: params.workspaceId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const asset = await prisma.asset.update({
      where: { id: params.assetId },
      data: {
        ...(name !== undefined && { name }),
        ...(alt !== undefined && { alt }),
        ...(caption !== undefined && { caption }),
        ...(folder !== undefined && { folder }),
        ...(tags !== undefined && { tags }),
      },
    });

    await createAuditLog({
      action: 'ASSET_UPDATED',
      entity: 'Asset',
      entityId: params.assetId,
      details: { fields: Object.keys({ name, alt, caption, folder, tags }).filter(k => (({ name, alt, caption, folder, tags }) as any)[k] !== undefined) },
    });

    return NextResponse.json(asset);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error updating asset:', error);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[workspaceId]/assets/[assetId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; assetId: string } }
) {
  try {
    await requireWorkspacePermission(params.workspaceId, 'edit');

    // Get asset to find the storage key
    const asset = await prisma.asset.findFirst({
      where: {
        id: params.assetId,
        workspaceId: params.workspaceId,
      },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Extract key from URL
    const url = new URL(asset.url);
    const key = url.pathname.split('/').slice(2).join('/'); // Remove bucket name from path

    // Delete from S3/MinIO
    try {
      await deleteFile(key);
      
      // Delete thumbnail if exists
      if (asset.thumbnailUrl) {
        const thumbUrl = new URL(asset.thumbnailUrl);
        const thumbKey = thumbUrl.pathname.split('/').slice(2).join('/');
        await deleteFile(thumbKey);
      }
    } catch (storageError) {
      console.error('Storage delete error:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    await prisma.asset.delete({
      where: { id: params.assetId },
    });

    await createAuditLog({
      action: 'ASSET_DELETED',
      entity: 'Asset',
      entityId: params.assetId,
      details: { fileName: asset.fileName },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
