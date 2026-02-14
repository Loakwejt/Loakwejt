import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { SafeRenderer } from '@/components/runtime/safe-renderer';
import type { BuilderTree } from '@builderly/core';
import { AlertTriangle } from 'lucide-react';

interface Props {
  params: Promise<{ workspaceId: string; pageId: string }>;
}

export default async function PagePreview({ params }: Props) {
  const { workspaceId, pageId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Verify workspace membership
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: { userId: session.user.id },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      workspaceId: workspaceId,
    },
  });

  if (!page) {
    notFound();
  }

  // Use builderTree directly (draft content), not publishedRevision
  const builderTree = page.builderTree as unknown as BuilderTree;

  if (!builderTree || !builderTree.root) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Leere Seite</h1>
          <p className="text-muted-foreground">
            Diese Seite hat noch keinen Inhalt. Öffne sie im Editor um sie zu gestalten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Preview banner */}
      <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 text-center text-sm py-1.5 font-medium">
        Vorschau – {page.name} ({page.isDraft ? 'Entwurf' : 'Veröffentlicht'})
      </div>
      <SafeRenderer
        tree={builderTree}
        context={{
          workspaceId: workspace.id,
          pageId: page.id,
        }}
      />
    </div>
  );
}
