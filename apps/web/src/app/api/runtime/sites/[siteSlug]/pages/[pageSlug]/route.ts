import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@builderly/db';

// GET /api/runtime/sites/[siteSlug]/pages/[pageSlug]
export async function GET(
  request: NextRequest,
  { params }: { params: { siteSlug: string; pageSlug: string } }
) {
  try {
    const site = await prisma.site.findFirst({
      where: {
        slug: params.siteSlug,
        isPublished: true,
      },
    });

    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const page = await prisma.page.findFirst({
      where: {
        siteId: site.id,
        slug: params.pageSlug,
        publishedRevisionId: { not: null },
      },
      include: {
        publishedRevision: true,
      },
    });

    if (!page || !page.publishedRevision) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({
      page: {
        id: page.id,
        name: page.name,
        slug: page.slug,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        ogImage: page.ogImage,
      },
      revision: {
        id: page.publishedRevision.id,
        builderTree: page.publishedRevision.builderTree,
        version: page.publishedRevision.version,
      },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
