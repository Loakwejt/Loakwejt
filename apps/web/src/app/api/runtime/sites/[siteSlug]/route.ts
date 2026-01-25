import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/runtime/sites/[siteSlug] - Public endpoint for site info
export async function GET(
  request: NextRequest,
  { params }: { params: { siteSlug: string } }
) {
  try {
    const site = await prisma.site.findFirst({
      where: {
        slug: params.siteSlug,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        faviconUrl: true,
        settings: true,
        workspace: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...site,
      showWatermark: site.workspace.plan === 'FREE',
    });
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json({ error: 'Failed to fetch site' }, { status: 500 });
  }
}
