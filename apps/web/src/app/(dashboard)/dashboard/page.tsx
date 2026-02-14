import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from '@builderly/ui';
import { 
  Plus, 
  Globe, 
  FileText, 
  ExternalLink, 
  TrendingUp,
  Users,
  Eye,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Crown,
  Folder,
  Settings
} from 'lucide-react';
import { CreateWorkspaceDialog } from '@/components/dashboard/create-workspace-dialog';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Get user's workspaces with pages
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          pages: {
            select: {
              id: true,
              name: true,
              slug: true,
              isDraft: true,
              updatedAt: true,
            },
            orderBy: { updatedAt: 'desc' },
          },
          _count: { select: { members: true, pages: true, assets: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  type MembershipWithWorkspace = (typeof memberships)[number];
  type WorkspaceWithRole = MembershipWithWorkspace['workspace'] & { role: MembershipWithWorkspace['role'] };
  
  const workspaces: WorkspaceWithRole[] = [];
  for (const membership of memberships) {
    workspaces.push({
      ...membership.workspace,
      role: membership.role,
    });
  }

  // Calculate stats
  const totalPages = workspaces.reduce((acc, w) => acc + w._count.pages, 0);
  const publishedPages = workspaces.reduce((acc, w) =>
    acc + w.pages.filter(p => !p.isDraft).length, 0
  );

  // Get recent activity (pages updated in last 7 days)
  const recentPages = workspaces
    .flatMap(w => w.pages.map(p => ({ ...p, workspaceId: w.id, workspaceName: w.name, workspaceSlug: w.slug })))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Plan limits
  const planLimits = {
    FREE: { pages: 5, storage: 500 },
    PRO: { pages: 20, storage: 2000 },
    BUSINESS: { pages: 100, storage: 10000 },
    ENTERPRISE: { pages: 999, storage: 50000 },
  };

  // If user has no workspaces, show onboarding
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-primary to-primary/60 p-4 md:p-6 rounded-2xl">
            <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Willkommen bei Builderly! 🎉</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 max-w-md text-base md:text-lg">
          Erstelle beeindruckende Websites ohne Code. Starte jetzt mit deinem ersten Workspace.
        </p>
        <CreateWorkspaceDialog>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Ersten Workspace erstellen
          </Button>
        </CreateWorkspaceDialog>
        
        <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 text-center w-full max-w-md">
          <div className="space-y-1 md:space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
            <p className="text-xs md:text-sm text-muted-foreground">Komponenten</p>
          </div>
          <div className="space-y-1 md:space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">10+</div>
            <p className="text-xs md:text-sm text-muted-foreground">Vorlagen</p>
          </div>
          <div className="space-y-1 md:space-y-2">
            <div className="text-2xl md:text-3xl font-bold text-primary">∞</div>
            <p className="text-xs md:text-sm text-muted-foreground">Möglichkeiten</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Willkommen zurück, {session.user.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Hier ist eine Übersicht deiner Websites
          </p>
        </div>
        <CreateWorkspaceDialog>
          <Button className="gap-2 w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Neuer Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-blue-500/20">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{totalPages}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Seiten gesamt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{publishedPages}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Veröffentlicht</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-purple-500/20">
                <Globe className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{publishedPages > 0 ? workspaces.filter(w => w.isPublished).length : 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Live Websites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-orange-500/20">
                <Folder className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{workspaces.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Workspaces</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Sites */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                Letzte Aktivität
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Deine zuletzt bearbeiteten Seiten</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            {recentPages.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <FileText className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
                <p className="text-sm md:text-base">Noch keine Seiten. Erstelle deine erste Seite.</p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {recentPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between p-2 md:p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      <div className="p-1.5 md:p-2 rounded-lg bg-muted shrink-0">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm md:text-base group-hover:text-primary transition-colors truncate">
                          {page.name}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                          {page.workspaceName} · {page.isDraft ? 'Entwurf' : 'Live'} · {formatTimeAgo(page.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 shrink-0 ml-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      {!page.isDraft && (
                        <Link href={`/s/${page.workspaceSlug}/${page.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0">
                            <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/dashboard/workspaces/${page.workspaceId}`}>
                        <Button size="sm" className="h-7 px-2 md:h-8 md:px-3 text-xs md:text-sm">Bearbeiten</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              Schnellaktionen
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-2 md:space-y-3">
            <CreateWorkspaceDialog>
              <Button variant="outline" className="w-full justify-start gap-2 md:gap-3 h-10 md:h-11 text-sm">
                <Plus className="h-4 w-4" />
                Workspace erstellen
              </Button>
            </CreateWorkspaceDialog>
            
            <Link href="/dashboard/billing" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 md:gap-3 h-10 md:h-11 text-sm">
                <Crown className="h-4 w-4 text-yellow-500" />
                Plan upgraden
              </Button>
            </Link>
            
            <Link href="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 md:gap-3 h-10 md:h-11 text-sm">
                <Settings className="h-4 w-4" />
                Kontoeinstellungen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Deine Workspaces</h2>
        </div>

        {workspaces.map((workspace) => {
          const limits = planLimits[workspace.plan as keyof typeof planLimits];
          const pagesUsed = workspace._count.pages;
          const pagesPercent = Math.min(100, (pagesUsed / limits.pages) * 100);
          
          return (
            <Card key={workspace.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Folder className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="flex flex-wrap items-center gap-2 text-base md:text-lg">
                        <span className="truncate">{workspace.name}</span>
                        <Badge 
                          variant={workspace.plan === 'FREE' ? 'secondary' : workspace.plan === 'ENTERPRISE' ? 'success' : 'default'}
                          className="text-[10px] md:text-xs shrink-0"
                        >
                          {workspace.plan === 'FREE' ? 'Starter' : workspace.plan === 'ENTERPRISE' ? 'Enterprise' : workspace.plan === 'BUSINESS' ? 'Business' : 'Pro'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] md:text-xs shrink-0">
                          {workspace.role === 'OWNER' ? 'Besitzer' : workspace.role === 'ADMIN' ? 'Admin' : workspace.role === 'EDITOR' ? 'Editor' : 'Betrachter'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3 md:gap-4 mt-1 text-xs md:text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {workspace._count.members} {workspace._count.members === 1 ? 'Mitglied' : 'Mitglieder'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {workspace._count.pages} {workspace._count.pages === 1 ? 'Seite' : 'Seiten'}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Link href={`/dashboard/workspaces/${workspace.id}`}>
                      <Button size="sm" variant="outline" className="h-8 md:h-9 text-xs md:text-sm">
                        <ArrowRight className="mr-1.5 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                        Öffnen
                      </Button>
                    </Link>
                    <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 md:h-9 md:w-9 p-0">
                        <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Usage Bar */}
                {workspace.plan === 'FREE' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                      <span className="text-muted-foreground">Seiten: {pagesUsed}/{limits.pages}</span>
                      {pagesPercent >= 100 && (
                        <Link href="/dashboard/billing">
                          <Button size="sm" variant="link" className="h-auto p-0 text-primary text-xs md:text-sm">
                            Mehr freischalten <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                    <Progress value={pagesPercent} className="h-1.5 md:h-2" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {workspace.pages.length === 0 ? (
                  <div className="text-center py-8 md:py-12 text-muted-foreground">
                    <FileText className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-xs md:text-sm">Noch keine Seiten</p>
                    <Link href={`/dashboard/workspaces/${workspace.id}`}>
                      <Button variant="link" size="sm" className="mt-2 text-xs md:text-sm">
                        Erste Seite erstellen
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {workspace.pages.map((page: typeof workspace.pages[number]) => (
                      <div 
                        key={page.id} 
                        className="flex items-center justify-between p-3 md:p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0 ${!page.isDraft ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <div className="min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">{page.name}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground">
                              /{page.slug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 shrink-0 ml-2">
                          {!page.isDraft ? (
                            <Badge variant="success" className="text-[10px] md:text-xs hidden sm:inline-flex">Live</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] md:text-xs hidden sm:inline-flex">Entwurf</Badge>
                          )}
                          <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {!page.isDraft && (
                              <Link href={`/s/${workspace.slug}/${page.slug}`} target="_blank">
                                <Button variant="ghost" size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0">
                                  <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </Link>
                            )}
                            <Link href={`/dashboard/workspaces/${workspace.id}`}>
                              <Button size="sm" className="h-7 px-2 md:h-8 md:px-3 text-xs">Verwalten</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Min.`;
  if (hours < 24) return `vor ${hours} Std.`;
  if (days < 7) return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  return new Date(date).toLocaleDateString('de-DE');
}
