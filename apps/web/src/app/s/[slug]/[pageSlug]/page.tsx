import { notFound } from 'next/navigation';
import { prisma } from '@builderly/db';
import { SafeRenderer } from '@/components/runtime/safe-renderer';
import { SiteAuthProvider } from '@/components/runtime/site-auth-provider';
import { CartProvider } from '@/components/runtime/cart-provider';
import type { BuilderTree } from '@builderly/core';
import { Layers } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, pageSlug } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!workspace) return { title: 'Not Found' };

  const page = await prisma.page.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: pageSlug,
      publishedRevisionId: { not: null },
    },
  });

  if (!page) return { title: 'Not Found' };

  return {
    title: page.metaTitle || page.name,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle || page.name,
      description: page.metaDescription || undefined,
      images: page.ogImage ? [page.ogImage] : [],
    },
  };
}

export default async function SitePage({ params }: Props) {
  const { slug, pageSlug } = await params;
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!workspace) {
    notFound();
  }

  const page = await prisma.page.findFirst({
    where: {
      workspaceId: workspace.id,
      slug: pageSlug,
      publishedRevisionId: { not: null },
    },
    include: {
      publishedRevision: true,
    },
  });

  if (!page || !page.publishedRevision) {
    notFound();
  }

  const builderTree = page.publishedRevision.builderTree as unknown as BuilderTree;
  const showWatermark = workspace.plan === 'FREE';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.metaTitle || page.name,
    description: page.metaDescription || '',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://builderly.de'}/s/${slug}/${pageSlug}`,
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
