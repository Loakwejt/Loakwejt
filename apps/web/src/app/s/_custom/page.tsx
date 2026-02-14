import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@builderly/db';
import { SafeRenderer } from '@/components/runtime/safe-renderer';
import { SiteAuthProvider } from '@/components/runtime/site-auth-provider';
import type { BuilderTree } from '@builderly/core';
import { Layers } from 'lucide-react';

// This page handles custom domain routing.
// When middleware detects a custom domain, it rewrites to /s/_custom?__domain=example.com
// We resolve the site by its custom domain instead of slug.

interface Props {
  searchParams: { __domain?: string };
}

export default async function CustomDomainHomePage({ searchParams }: Props) {
  const domain = searchParams.__domain || headers().get('host') || '';

  if (!domain) notFound();

  // Find site by custom domain
  const site = await prisma.site.findFirst({
    where: {
      customDomain: domain,
      isPublished: true,
    },
    include: {
      workspace: { select: { plan: true } },
      pages: {
        where: {
          isHomepage: true,
          publishedRevisionId: { not: null },
        },
        include: { publishedRevision: true },
        take: 1,
      },
    },
  });

  if (!site || !site.pages[0]) {
    // Check if domain is registered but not verified
    const domainRecord = await prisma.customDomain.findUnique({
      where: { domain },
    });
    if (domainRecord && domainRecord.status !== 'VERIFIED') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-2xl font-bold">Domain wird eingerichtet</h1>
            <p className="text-muted-foreground">
              Die Domain <strong>{domain}</strong> wird gerade verifiziert. Bitte versuche es später erneut.
            </p>
          </div>
        </div>
      );
    }
    notFound();
  }

  const page = site.pages[0];
  const revision = page.publishedRevision;
  if (!revision) notFound();

  const builderTree = revision.builderTree as unknown as BuilderTree;
  const showWatermark = site.workspace.plan === 'FREE';

  return (
    <div className="min-h-screen">
      <SiteAuthProvider siteSlug={site.slug}>
        <SafeRenderer
          tree={builderTree}
          context={{
            siteId: site.id,
            pageId: page.id,
          }}
        />
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
