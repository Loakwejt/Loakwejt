import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@builderly/ui';
import { Image, Database, Users, Plus, ExternalLink, FileText, Pencil, Globe, Settings } from 'lucide-react';
import { CreatePageDialog } from '@/components/dashboard/create-page-dialog';
import { PublishPageButton, PublishAllButton } from '@/components/dashboard/publish-buttons';

interface WorkspacePageProps {
  params: { workspaceId: string };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: params.workspaceId,
      members: {
        some: { userId: session.user.id },
      },
    },
    include: {
      _count: {
        select: {
          pages: true,
          assets: true,
          collections: true,
          members: true,
        },
      },
      pages: {
        orderBy: [{ isHomepage: 'desc' }, { updatedAt: 'desc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          isHomepage: true,
          updatedAt: true,
          isDraft: true,
          publishedRevisionId: true,
        },
      },
    },
  });

  if (!workspace) {
    redirect('/dashboard');
  }

  const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const publicUrl = `${appUrl}/s/${workspace.slug}`;
  const hasPublishedPages = workspace.pages.some((p) => p.publishedRevisionId !== null);
  const draftPages = workspace.pages.filter((p) => p.isDraft);
  const allPagesForPublish = workspace.pages.map((p) => ({ id: p.id, name: p.name }));

  const stats = [
    { label: 'Seiten', value: workspace._count.pages, icon: FileText, href: `/dashboard/workspaces/${params.workspaceId}` },
    { label: 'Dateien', value: workspace._count.assets, icon: Image, href: `/dashboard/workspaces/${params.workspaceId}/assets` },
    { label: 'Sammlungen', value: workspace._count.collections, icon: Database, href: `/dashboard/workspaces/${params.workspaceId}/collections` },
    { label: 'Mitglieder', value: workspace._count.members, icon: Users, href: `/dashboard/workspaces/${params.workspaceId}/settings` },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold">{workspace.name}</h1>
            {workspace.isPublished ? (
              <Badge variant="default" className="bg-green-600">
                <Globe className="mr-1 h-3 w-3" />
                Online
              </Badge>
            ) : (
              <Badge variant="secondary">Offline</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            {workspace.slug} · {workspace._count.pages} {workspace._count.pages === 1 ? 'Seite' : 'Seiten'}
            {draftPages.length > 0 && ` · ${draftPages.length} Entwürfe`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {workspace.pages.length > 0 && (
            <PublishAllButton workspaceId={params.workspaceId} pages={allPagesForPublish} />
          )}
          <CreatePageDialog workspaceId={params.workspaceId}>
            <Button variant="outline" size="sm" className="h-9">
              <Plus className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Neue Seite</span>
              <span className="sm:hidden">Neu</span>
            </Button>
          </CreatePageDialog>
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href={`/dashboard/workspaces/${params.workspaceId}/settings`}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Öffentlicher Link (nur wenn veröffentlicht) */}
      {workspace.isPublished && hasPublishedPages && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 md:p-2 rounded-lg bg-green-100 dark:bg-green-900 shrink-0">
                  <Globe className="h-4 w-4 md:h-5 md:w-5 text-green-700 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm md:text-base text-green-900 dark:text-green-100">Deine Website ist online!</p>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-green-700 dark:text-green-400 hover:underline truncate block"
                  >
                    {publicUrl}
                  </a>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="border-green-300 dark:border-green-800 w-full sm:w-auto">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Website öffnen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Seiten */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Seiten</CardTitle>
            <CardDescription>Alle Seiten deiner Website — bearbeiten, veröffentlichen und verwalten</CardDescription>
          </div>
          <CreatePageDialog workspaceId={params.workspaceId}>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Neue Seite
            </Button>
          </CreatePageDialog>
        </CardHeader>
        <CardContent>
          {workspace.pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Noch keine Seiten</h3>
              <p className="text-muted-foreground mb-4">
                Erstelle deine erste Seite, gestalte sie im Editor und veröffentliche deine Website.
              </p>
              <CreatePageDialog workspaceId={params.workspaceId}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Erste Seite erstellen
                </Button>
              </CreatePageDialog>
            </div>
          ) : (
            <div className="space-y-2">
              {workspace.pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-md bg-primary/10 shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{page.name}</h4>
                        {page.isHomepage && (
                          <Badge variant="secondary" className="text-[10px] shrink-0">
                            Startseite
                          </Badge>
                        )}
                        {page.isDraft ? (
                          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 shrink-0">
                            Entwurf
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-green-600 border-green-300 shrink-0">
                            Veröffentlicht
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        /{page.slug} · Aktualisiert {new Date(page.updatedAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <PublishPageButton
                      workspaceId={params.workspaceId}
                      pageId={page.id}
                      pageName={page.name}
                      isDraft={page.isDraft}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/workspaces/${params.workspaceId}/preview/${page.id}`} target="_blank">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Vorschau
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`${editorUrl}/?workspaceId=${params.workspaceId}&pageId=${page.id}`} target="_blank">
                        <Pencil className="mr-1 h-3 w-3" />
                        Editor
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
