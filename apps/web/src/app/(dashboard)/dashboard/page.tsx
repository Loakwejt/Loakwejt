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
import { CreateSiteDialog } from '@/components/dashboard/create-site-dialog';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Get user's workspaces with sites
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          sites: {
            include: {
              _count: { select: { pages: true } },
              pages: {
                take: 1,
                orderBy: { updatedAt: 'desc' },
                select: { updatedAt: true }
              }
            },
            orderBy: { updatedAt: 'desc' },
          },
          _count: { select: { members: true, sites: true, assets: true } },
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
  const totalSites = workspaces.reduce((acc, w) => acc + w._count.sites, 0);
  const totalPages = workspaces.reduce((acc, w) => 
    acc + w.sites.reduce((sAcc, s) => sAcc + s._count.pages, 0), 0
  );
  const publishedSites = workspaces.reduce((acc, w) => 
    acc + w.sites.filter(s => s.isPublished).length, 0
  );

  // Get recent activity (sites updated in last 7 days)
  const recentSites = workspaces
    .flatMap(w => w.sites.map(s => ({ ...s, workspaceId: w.id, workspaceName: w.name })))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Plan limits
  const planLimits = {
    FREE: { sites: 1, storage: 500 },
    PRO: { sites: 3, storage: 2000 },
    BUSINESS: { sites: 10, storage: 10000 },
    ENTERPRISE: { sites: 999, storage: 50000 },
  };

  // If user has no workspaces, show onboarding
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-primary to-primary/60 p-6 rounded-2xl">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Welcome to Builderly! 🎉</h1>
        <p className="text-muted-foreground mb-8 max-w-md text-lg">
          Create stunning websites without writing code. Start by creating your first workspace.
        </p>
        <CreateWorkspaceDialog>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Your First Workspace
          </Button>
        </CreateWorkspaceDialog>
        
        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">50+</div>
            <p className="text-sm text-muted-foreground">Components</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">10+</div>
            <p className="text-sm text-muted-foreground">Templates</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">∞</div>
            <p className="text-sm text-muted-foreground">Possibilities</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your sites
          </p>
        </div>
        <CreateWorkspaceDialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalSites}</p>
                <p className="text-sm text-muted-foreground">Total Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{publishedSites}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalPages}</p>
                <p className="text-sm text-muted-foreground">Total Pages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Folder className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{workspaces.length}</p>
                <p className="text-sm text-muted-foreground">Workspaces</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Sites */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recently updated sites</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recentSites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sites yet. Create your first site to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {site.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {site.workspaceName} · {site._count.pages} pages · Updated {formatTimeAgo(site.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {site.isPublished && (
                        <Link href={`/s/${site.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/dashboard/workspaces/${site.workspaceId}/sites/${site.id}`}>
                        <Button size="sm">Edit</Button>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CreateWorkspaceDialog>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="h-4 w-4" />
                Create Workspace
              </Button>
            </CreateWorkspaceDialog>
            
            <Link href="/dashboard/billing" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Crown className="h-4 w-4 text-yellow-500" />
                Upgrade Plan
              </Button>
            </Link>
            
            <Link href="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Settings className="h-4 w-4" />
                Account Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Workspaces</h2>
        </div>

        {workspaces.map((workspace) => {
          const limits = planLimits[workspace.plan as keyof typeof planLimits];
          const sitesUsed = workspace._count.sites;
          const sitesPercent = Math.min(100, (sitesUsed / limits.sites) * 100);
          
          return (
            <Card key={workspace.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Folder className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workspace.name}
                        <Badge 
                          variant={workspace.plan === 'FREE' ? 'secondary' : workspace.plan === 'ENTERPRISE' ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {workspace.plan === 'FREE' ? 'Starter' : workspace.plan === 'ENTERPRISE' ? 'Enterprise' : workspace.plan === 'BUSINESS' ? 'Business' : 'Pro'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {workspace.role}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {workspace._count.members} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {workspace._count.sites} sites
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreateSiteDialog workspaceId={workspace.id}>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        New Site
                      </Button>
                    </CreateSiteDialog>
                    <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Usage Bar */}
                {workspace.plan === 'FREE' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Sites: {sitesUsed}/{limits.sites}</span>
                      {sitesPercent >= 100 && (
                        <Link href="/dashboard/billing">
                          <Button size="sm" variant="link" className="h-auto p-0 text-primary">
                            Upgrade for more <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                    <Progress value={sitesPercent} className="h-2" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {workspace.sites.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No sites yet</p>
                    <CreateSiteDialog workspaceId={workspace.id}>
                      <Button variant="link" size="sm" className="mt-2">
                        Create your first site
                      </Button>
                    </CreateSiteDialog>
                  </div>
                ) : (
                  <div className="divide-y">
                    {workspace.sites.map((site: typeof workspace.sites[number]) => (
                      <div 
                        key={site.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${site.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <div>
                            <p className="font-medium">{site.name}</p>
                            <p className="text-xs text-muted-foreground">
                              /{site.slug} · {site._count.pages} page{site._count.pages !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {site.isPublished ? (
                            <Badge variant="success" className="text-xs">Live</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {site.isPublished && (
                              <Link href={`/s/${site.slug}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            <Link href={`/dashboard/workspaces/${workspace.id}/sites/${site.id}`}>
                              <Button size="sm">Manage</Button>
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

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}
