import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';
import { canUploadAsset } from '@/lib/entitlements';
import { uploadFile, generateAssetKey } from '@/lib/storage';
import { processImage, isImage } from '@/lib/image-processor';

// Allowed file types
const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
  // Documents
  'application/pdf',
  // Videos
  'video/mp4',
  'video/webm',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

// Max file sizes by type (in bytes)
const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 20 * 1024 * 1024, // 20MB
};

function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
}

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
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    // Check file size based on category
    const category = getFileCategory(file.type);
    const maxSize = MAX_SIZES[category] || MAX_SIZES.document;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size for ${category}: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Check entitlements
    const canUpload = await canUploadAsset(params.workspaceId, file.size);
    if (!canUpload.allowed) {
      return NextResponse.json({ error: canUpload.reason }, { status: 403 });
    }

    // Convert file to buffer
    let buffer = Buffer.from(await file.arrayBuffer());
    let width: number | null = null;
    let height: number | null = null;
    let thumbnailUrl: string | null = null;
    let optimizedMimeType = file.type;

    // Process image if applicable
    if (isImage(file.type) && file.type !== 'image/svg+xml') {
      try {
        const processed = await processImage(buffer, file.type, {
          maxWidth: 2000,
          maxHeight: 2000,
          quality: 85,
          generateThumbnail: true,
        });

        buffer = processed.buffer;
        width = processed.metadata.width;
        height = processed.metadata.height;

        // Upload thumbnail if generated
        if (processed.thumbnailBuffer) {
          const thumbKey = generateAssetKey(
            params.workspaceId,
            `thumb_${file.name.replace(/\.[^/.]+$/, '.jpg')}`,
            siteId || undefined,
            folder || undefined
          );
          const thumbResult = await uploadFile(thumbKey, processed.thumbnailBuffer, 'image/jpeg');
          thumbnailUrl = thumbResult.url;
        }
      } catch (error) {
        console.error('Image processing error:', error);
        // Continue with original buffer if processing fails
      }
    }

    // Generate storage key
    const key = generateAssetKey(params.workspaceId, file.name, siteId || undefined, folder || undefined);

    // Upload to S3/MinIO
    const { url } = await uploadFile(key, buffer, optimizedMimeType);

    // Create asset record
    const asset = await prisma.asset.create({
      data: {
        workspaceId: params.workspaceId,
        siteId: siteId || null,
        name: file.name.split('.').slice(0, -1).join('.') || file.name,
        fileName: file.name,
        mimeType: optimizedMimeType,
        size: buffer.length,
        url,
        thumbnailUrl,
        width,
        height,
        folder: folder || null,
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
