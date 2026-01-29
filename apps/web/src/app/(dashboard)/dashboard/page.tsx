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
} from '@builderly/ui';
import { Plus, Globe, FileText, ExternalLink } from 'lucide-react';
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
            },
            orderBy: { updatedAt: 'desc' },
          },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const workspaces = memberships.map((membership: typeof memberships[number]) => ({
    ...membership.workspace,
    role: membership.role,
  }));

  // If user has no workspaces, show onboarding
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Builderly!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Create your first workspace to start building websites.
        </p>
        <CreateWorkspaceDialog>
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your workspaces and sites
          </p>
        </div>
        <CreateWorkspaceDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        </CreateWorkspaceDialog>
      </div>

      {workspaces.map((workspace) => (
        <Card key={workspace.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {workspace.name}
                  <Badge variant="outline" className="ml-2">
                    {workspace.plan}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {workspace._count.members} member{workspace._count.members !== 1 ? 's' : ''} ·{' '}
                  {workspace.sites.length} site{workspace.sites.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <CreateSiteDialog workspaceId={workspace.id}>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Site
                </Button>
              </CreateSiteDialog>
            </div>
          </CardHeader>
          <CardContent>
            {workspace.sites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sites yet. Create your first site to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workspace.sites.map((site) => (
                  <Card key={site.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{site.name}</CardTitle>
                        {site.isPublished && (
                          <Badge variant="success" className="text-xs">
                            Published
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        /{site.slug} · {site._count.pages} page{site._count.pages !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/workspaces/${workspace.id}/sites/${site.id}`}
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            Manage
                          </Button>
                        </Link>
                        {site.isPublished && (
                          <Link href={`/s/${site.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
