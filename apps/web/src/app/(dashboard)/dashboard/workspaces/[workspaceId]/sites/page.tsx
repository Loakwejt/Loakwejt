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
  Badge,
} from '@builderly/ui';
import {
  Plus,
  Globe,
  ExternalLink,
  FileText,
  Eye,
  Clock,
  Search,
  ShoppingBag,
  BookOpen,
  MessageSquare,
  BookMarked,
  Briefcase,
  Layout,
} from 'lucide-react';
import { CreateSiteDialog } from '@/components/dashboard/create-site-dialog';

interface Props {
  params: { workspaceId: string };
}

const siteTypeConfig: Record<string, { label: string; icon: typeof Globe; color: string }> = {
  WEBSITE: { label: 'Website', icon: Globe, color: 'blue' },
  SHOP: { label: 'Online-Shop', icon: ShoppingBag, color: 'green' },
  BLOG: { label: 'Blog', icon: BookOpen, color: 'purple' },
  FORUM: { label: 'Forum', icon: MessageSquare, color: 'orange' },
  WIKI: { label: 'Wiki', icon: BookMarked, color: 'teal' },
  PORTFOLIO: { label: 'Portfolio', icon: Briefcase, color: 'pink' },
  LANDING: { label: 'Landing Page', icon: Layout, color: 'indigo' },
};

export default async function SitesListPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  const hasAccess = await checkWorkspacePermission(
    params.workspaceId,
    session.user.id,
    'view'
  );
  if (!hasAccess) notFound();

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: params.workspaceId,
      members: { some: { userId: session.user.id } },
    },
    include: {
      sites: {
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { pages: true },
          },
        },
      },
    },
  });

  if (!workspace) redirect('/dashboard');

  const workspaceType = (workspace as any).type || 'WEBSITE';
  const typeInfo = siteTypeConfig[workspaceType] || siteTypeConfig.WEBSITE;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sites</h1>
          <p className="text-muted-foreground">
            Alle Websites in &quot;{workspace.name}&quot;
          </p>
        </div>
        <CreateSiteDialog workspaceId={params.workspaceId}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neue Site
          </Button>
        </CreateSiteDialog>
      </div>

      {/* Sites Grid */}
      {workspace.sites.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary to-primary/60 p-4 rounded-2xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Noch keine Sites</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Erstelle deine erste Website, um loszulegen. Du kannst verschiedene Typen wählen: Shop, Blog, Forum und mehr.
            </p>
            <CreateSiteDialog workspaceId={params.workspaceId}>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Erste Site erstellen
              </Button>
            </CreateSiteDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspace.sites.map((site: typeof workspace.sites[number]) => {
            const TypeIcon = typeInfo.icon;

            return (
              <Link
                key={site.id}
                href={`/dashboard/workspaces/${params.workspaceId}/sites/${site.id}`}
              >
                <Card className="group hover:border-primary/50 hover:shadow-md transition-all h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-${typeInfo.color}-500/10`}>
                          <TypeIcon className={`h-5 w-5 text-${typeInfo.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {site.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {typeInfo.label}
                          </span>
                        </div>
                      </div>
                      <Badge variant={site.isPublished ? 'success' : 'secondary'}>
                        {site.isPublished ? 'Live' : 'Entwurf'}
                      </Badge>
                    </div>

                    {site.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {site.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-4 border-t">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {site._count.pages} {site._count.pages === 1 ? 'Seite' : 'Seiten'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        /s/{site.slug}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(site.updatedAt).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* New Site Card */}
          <CreateSiteDialog workspaceId={params.workspaceId}>
            <Card className="border-dashed hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="p-3 rounded-full bg-muted mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Neue Site erstellen</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Website, Shop, Blog, Forum…
                </p>
              </CardContent>
            </Card>
          </CreateSiteDialog>
        </div>
      )}
    </div>
  );
}
