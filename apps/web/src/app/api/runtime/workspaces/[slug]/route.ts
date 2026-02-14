import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/runtime/workspaces/[slug] - Public endpoint for workspace/site info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const workspace = await prisma.workspace.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        faviconUrl: true,
        settings: true,
        plan: true,
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...workspace,
      showWatermark: workspace.plan === 'FREE',
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }
}
