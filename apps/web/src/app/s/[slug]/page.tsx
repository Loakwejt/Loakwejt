import { notFound } from 'next/navigation';
import { prisma } from '@builderly/db';
import { SafeRenderer } from '@/components/runtime/safe-renderer';
import { SiteAuthProvider } from '@/components/runtime/site-auth-provider';
import { CartProvider } from '@/components/runtime/cart-provider';
import type { BuilderTree } from '@builderly/core';
import { Layers } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      pages: {
        where: { isHomepage: true },
        take: 1,
      },
    },
  });

  if (!workspace) return { title: 'Not Found' };

  const page = workspace.pages[0];
  return {
    title: page?.metaTitle || page?.name || workspace.name,
    description: page?.metaDescription || workspace.description,
    openGraph: {
      title: page?.metaTitle || page?.name || workspace.name,
      description: page?.metaDescription || workspace.description,
      images: page?.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function SiteHomePage({ params }: Props) {
  const { slug } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
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

  if (!workspace || !workspace.pages[0]) {
    notFound();
  }

  const page = workspace.pages[0];
  const revision = page.publishedRevision;

  if (!revision) {
    notFound();
  }

  const builderTree = revision.builderTree as unknown as BuilderTree;
  const showWatermark = workspace.plan === 'FREE';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.metaTitle || page.name || workspace.name,
    description: page.metaDescription || workspace.description || '',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://builderly.de'}/s/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: workspace.name,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://builderly.de'}/s/${slug}`,
    },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteAuthProvider slug={slug}>
        <CartProvider slug={slug}>
          <SafeRenderer 
            tree={builderTree} 
            context={{
              workspaceId: workspace.id,
              pageId: page.id,
            }}
          />
        </CartProvider>
      </SiteAuthProvider>
      
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
