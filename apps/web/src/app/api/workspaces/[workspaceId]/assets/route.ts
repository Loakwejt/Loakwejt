import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';
import { requireWorkspacePermission } from '@/lib/permissions';

// GET /api/workspaces/[workspaceId]/assets
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  try {
    await requireWorkspacePermission(workspaceId, 'view');

    const { searchParams } = new URL(request.url);
    
    // Filtering
    const folder = searchParams.get('folder');
    const mimeType = searchParams.get('mimeType');
    const search = searchParams.get('search');
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Build where clause
    const where: Record<string, unknown> = {
      workspaceId,
    };

    if (folder) {
      where.folder = folder === 'root' ? null : folder;
    }

    if (mimeType) {
      if (mimeType === 'image') {
        where.mimeType = { startsWith: 'image/' };
      } else if (mimeType === 'video') {
        where.mimeType = { startsWith: 'video/' };
      } else if (mimeType === 'audio') {
        where.mimeType = { startsWith: 'audio/' };
      } else if (mimeType === 'document') {
        where.mimeType = { startsWith: 'application/' };
      } else {
        where.mimeType = mimeType;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.asset.count({ where });

    // Get assets
    const assets = await prisma.asset.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
    });

    // Get unique folders for this workspace
    const folders = await prisma.asset.findMany({
      where: {
        workspaceId,
        folder: { not: null },
      },
      select: { folder: true },
      distinct: ['folder'],
    });

    return NextResponse.json({
      data: assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      folders: folders.map((f: { folder: string | null }) => f.folder).filter(Boolean),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}
