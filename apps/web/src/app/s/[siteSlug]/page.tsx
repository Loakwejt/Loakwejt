import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@builderly/db';
import { authOptions } from '@/lib/auth';
import { SafeRenderer } from '@/components/runtime/safe-renderer';
import type { BuilderTree } from '@builderly/core';
import { Layers } from 'lucide-react';

interface Props {
  params: { siteSlug: string };
}

export async function generateMetadata({ params }: Props) {
  const site = await prisma.site.findFirst({
    where: {
      slug: params.siteSlug,
      isPublished: true,
    },
    include: {
      pages: {
        where: { isHomepage: true },
        take: 1,
      },
    },
  });

  if (!site) return { title: 'Not Found' };

  const page = site.pages[0];
  return {
    title: page?.metaTitle || page?.name || site.name,
    description: page?.metaDescription || site.description,
    openGraph: {
      title: page?.metaTitle || page?.name || site.name,
      description: page?.metaDescription || site.description,
      images: page?.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function SiteHomePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  const site = await prisma.site.findFirst({
    where: {
      slug: params.siteSlug,
      isPublished: true,
    },
    include: {
      workspace: {
        select: { plan: true },
      },
      pages: {
        where: {
          isHomepage: true,
          publishedRevisionId: { not: null },
        },
        include: {
          publishedRevision: true,
        },
        take: 1,
      },
    },
  });

  if (!site || !site.pages[0]) {
    notFound();
  }

  const page = site.pages[0];
  const revision = page.publishedRevision;

  if (!revision) {
    notFound();
  }

  const builderTree = revision.builderTree as BuilderTree;
  const showWatermark = site.workspace.plan === 'FREE';

  return (
    <div className="min-h-screen">
      <SafeRenderer 
        tree={builderTree} 
        context={{
          siteId: site.id,
          pageId: page.id,
          user: session?.user ?? null,
        }}
      />
      
      {showWatermark && (
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href="https://builderly.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-background border rounded-full shadow-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Layers className="h-4 w-4" />
            Made with Builderly
          </a>
        </div>
      )}
    </div>
  );
}
