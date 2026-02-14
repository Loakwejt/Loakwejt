import type { MetadataRoute } from 'next';
import { prisma } from '@builderly/db';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://builderly.de';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Add all published workspaces and pages
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        pages: {
          where: { publishedRevisionId: { not: null } },
          select: {
            slug: true,
            isHomepage: true,
            updatedAt: true,
          },
        },
      },
    });

    for (const ws of workspaces) {
      // Workspace homepage
      entries.push({
        url: `${BASE_URL}/s/${ws.slug}`,
        lastModified: ws.updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
      });

      // Workspace subpages
      for (const page of ws.pages) {
        if (page.isHomepage) continue;
        entries.push({
          url: `${BASE_URL}/s/${ws.slug}/${page.slug}`,
          lastModified: page.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return entries;
}
