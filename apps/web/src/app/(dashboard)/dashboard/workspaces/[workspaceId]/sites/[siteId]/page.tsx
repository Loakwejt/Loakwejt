import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { checkWorkspacePermission } from '@/lib/permissions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Label,
  Separator,
} from '@builderly/ui';
import {
  Plus,
  FileText,
  ExternalLink,
  Edit,
  Home,
  Globe,
  Trash2,
  MoreVertical,
  Copy,
  Eye,
  Clock,
  ArrowRight,
  Sparkles,
  Palette,
  Layers,
} from 'lucide-react';
import { CreatePageDialog } from '@/components/dashboard/create-page-dialog';

interface Props {
  params: { workspaceId: string; siteId: string };
}

export default async function SiteDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const hasAccess = await checkWorkspacePermission(
    params.workspaceId,
    session.user.id,
    'view'
  );
  if (!hasAccess) notFound();

  const site = await prisma.site.findFirst({
    where: {
      id: params.siteId,
      workspaceId: params.workspaceId,
    },
    include: {
      pages: {
        orderBy: [{ isHomepage: 'desc' }, { name: 'asc' }],
      },
      workspace: true,
    },
  });

  if (!site) notFound();

  const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/dashboard/workspaces/${params.workspaceId}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {site.workspace.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>{site.name}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2 flex items-center gap-3">
            {site.name}
            <Badge variant={site.isPublished ? 'success' : 'secondary'}>
              {site.isPublished ? 'Live' : 'Entwurf'}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            {site.description || 'Keine Beschreibung'}
          </p>
        </div>
        <div className="flex gap-2">
          {site.isPublished && (
            <Link href={`/s/${site.slug}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Site ansehen
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{site.pages.length}</p>
                <p className="text-xs text-muted-foreground">Seiten</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{site.pages.filter(p => p.publishedRevisionId).length}</p>
                <p className="text-xs text-muted-foreground">Veröffentlicht</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium truncate">/s/{site.slug}</p>
                <p className="text-xs text-muted-foreground">URL</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {new Date(site.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">Zuletzt aktualisiert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Seiten
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Sammlungen
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>

        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Seiten</h2>
              <p className="text-sm text-muted-foreground">
                Verwalte alle Seiten deiner Website
              </p>
            </div>
            <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neue Seite
              </Button>
            </CreatePageDialog>
          </div>

          {site.pages.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative bg-gradient-to-br from-primary to-primary/60 p-4 rounded-2xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Noch keine Seiten</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Erstelle deine erste Seite, um mit dem Aufbau deiner Website zu beginnen. Jede Seite kann ihr eigenes Design und eigene Inhalte haben.
                </p>
                <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Erste Seite erstellen
                  </Button>
                </CreatePageDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {site.pages.map((page: typeof site.pages[number]) => (
                <Card key={page.id} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${page.isHomepage ? 'bg-primary/10' : 'bg-muted'}`}>
                          {page.isHomepage ? (
                            <Home className="h-5 w-5 text-primary" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{page.name}</h3>
                            {page.isHomepage && (
                              <Badge variant="outline" className="text-xs">Homepage</Badge>
                            )}
                            {page.publishedRevisionId ? (
                              <Badge variant="success" className="text-xs">Live</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>/{page.slug}</span>
                            <span className="text-muted-foreground/50">·</span>
                            <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`${editorUrl}?workspaceId=${params.workspaceId}&siteId=${params.siteId}&pageId=${page.id}`}
                          target="_blank"
                        >
                          <Button size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Im Builder bearbeiten
                          </Button>
                        </Link>
                        {page.publishedRevisionId && (
                          <Link
                            href={
                              page.isHomepage
                                ? `/s/${site.slug}`
                                : `/s/${site.slug}/${page.slug}`
                            }
                            target="_blank"
                          >
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Sammlungen</h3>
              <p className="text-sm text-muted-foreground">
                Verwalte deine Inhaltssammlungen (CMS)
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neue Sammlung
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Sample Collections */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Blog-Beiträge</h4>
                    <p className="text-xs text-muted-foreground">12 Einträge</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Artikel, Neuigkeiten und Updates
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Layers className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Produkte</h4>
                    <p className="text-xs text-muted-foreground">48 Einträge</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Produktkatalog und Inventar
                </p>
              </CardContent>
            </Card>

            <Card className="border-dashed hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Sammlung erstellen</p>
                <p className="text-xs text-muted-foreground">
                  Neuen Inhaltstyp hinzufügen
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Design-Einstellungen</h3>
            <p className="text-sm text-muted-foreground">
              Konfiguriere das visuelle Erscheinungsbild deiner Website
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Farben
                </CardTitle>
                <CardDescription>
                  Definiere deine Markenfarben
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primärfarbe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary border" />
                    <span className="text-sm text-muted-foreground">#3B82F6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sekundärfarbe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-secondary border" />
                    <span className="text-sm text-muted-foreground">#6B7280</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Akzentfarbe</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-green-500 border" />
                    <span className="text-sm text-muted-foreground">#22C55E</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Farben anpassen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                  </svg>
                  Typography
                </CardTitle>
                <CardDescription>
                  Schrifteinstellungen für deine Website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Überschrift-Schrift</span>
                  <span className="text-sm font-medium">Inter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Text-Schrift</span>
                  <span className="text-sm">Inter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Basisgröße</span>
                  <span className="text-sm text-muted-foreground">16px</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Typografie anpassen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  Layout
                </CardTitle>
                <CardDescription>
                  Seitenlayout und Abstände
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Container-Breite</span>
                  <span className="text-sm text-muted-foreground">1200px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Abschnitts-Abstand</span>
                  <span className="text-sm text-muted-foreground">80px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Eckenradius</span>
                  <span className="text-sm text-muted-foreground">8px</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Layout anpassen
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Globale Stile
                </CardTitle>
                <CardDescription>
                  Seitenweite Stil-Einstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Farbschema</span>
                  <Badge>Hell</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dunkelmodus</span>
                  <Badge variant="outline">Aktiviert</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Animationen</span>
                  <Badge variant="outline">Aktiviert</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Globale Stile anpassen
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
