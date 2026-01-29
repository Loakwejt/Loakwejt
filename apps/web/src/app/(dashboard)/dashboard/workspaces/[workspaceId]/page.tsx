import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@builderly/ui';
import { Globe, Image, Database, Users, Plus, ExternalLink } from 'lucide-react';

interface WorkspacePageProps {
  params: { workspaceId: string };
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get workspace with stats
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
          sites: true,
          assets: true,
          collections: true,
          members: true,
        },
      },
      sites: {
        take: 5,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          updatedAt: true,
          _count: { select: { pages: true } },
        },
      },
    },
  });

  if (!workspace) {
    redirect('/dashboard');
  }

  const stats = [
    { label: 'Sites', value: workspace._count.sites, icon: Globe, href: `/dashboard/workspaces/${params.workspaceId}/sites` },
    { label: 'Assets', value: workspace._count.assets, icon: Image, href: `/dashboard/workspaces/${params.workspaceId}/assets` },
    { label: 'Collections', value: workspace._count.collections, icon: Database, href: `/dashboard/workspaces/${params.workspaceId}/collections` },
    { label: 'Members', value: workspace._count.members, icon: Users, href: `/dashboard/workspaces/${params.workspaceId}/settings` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground">Workspace Overview</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/workspaces/${params.workspaceId}/sites/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Site
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Sites */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sites</CardTitle>
          <CardDescription>Your most recently updated sites</CardDescription>
        </CardHeader>
        <CardContent>
          {workspace.sites.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No sites yet</h3>
              <p className="text-muted-foreground">
                Create your first site to get started
              </p>
              <Button asChild className="mt-4">
                <Link href={`/dashboard/workspaces/${params.workspaceId}/sites/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Site
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {workspace.sites.map((site: typeof workspace.sites[number]) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{site.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {site._count.pages} page{site._count.pages !== 1 ? 's' : ''} •
                      Updated {new Date(site.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/s/${site.slug}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/workspaces/${params.workspaceId}/sites/${site.id}`}>
                        Edit
                      </Link>
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
