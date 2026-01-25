import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { canUploadAsset } from '@/lib/entitlements';
import { uploadFile, generateAssetKey } from '@/lib/storage';

// POST /api/workspaces/[workspaceId]/assets/upload
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { userId } = await requireWorkspacePermission(params.workspaceId, 'edit');

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const siteId = formData.get('siteId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Check entitlements
    const canUpload = await canUploadAsset(params.workspaceId, file.size);
    if (!canUpload.allowed) {
      return NextResponse.json({ error: canUpload.reason }, { status: 403 });
    }

    // Generate storage key
    const key = generateAssetKey(params.workspaceId, file.name, siteId || undefined);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3/MinIO
    const { url } = await uploadFile(key, buffer, file.type);

    // Get image dimensions if applicable
    let width: number | null = null;
    let height: number | null = null;

    // TODO: Use sharp or similar to get dimensions
    // For now, skip dimension extraction

    // Create asset record
    const asset = await prisma.asset.create({
      data: {
        workspaceId: params.workspaceId,
        siteId: siteId || null,
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        width,
        height,
        uploadedById: userId,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
