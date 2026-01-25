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
} from '@builderly/ui';
import {
  Plus,
  FileText,
  ExternalLink,
  Edit,
  Home,
  Globe,
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
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>{site.name}</span>
          </div>
          <h1 className="text-3xl font-bold mt-2">{site.name}</h1>
          <p className="text-muted-foreground">
            {site.description || 'No description'}
          </p>
        </div>
        <div className="flex gap-2">
          {site.isPublished && (
            <Link href={`/s/${site.slug}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">/s/{site.slug}</span>
            </div>
            <Badge variant={site.isPublished ? 'success' : 'secondary'}>
              {site.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {site.pages.length} page{site.pages.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pages</h2>
            <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Button>
            </CreatePageDialog>
          </div>

          {site.pages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No pages yet</p>
                <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Page
                  </Button>
                </CreatePageDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {site.pages.map((page) => (
                <Card key={page.id}>
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {page.isHomepage && (
                          <Home className="h-4 w-4 text-primary" />
                        )}
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {page.name}
                            {page.publishedRevisionId && (
                              <Badge variant="success" className="text-xs">
                                Published
                              </Badge>
                            )}
                            {page.isDraft && !page.publishedRevisionId && (
                              <Badge variant="secondary" className="text-xs">
                                Draft
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>/{page.slug}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`${editorUrl}?workspaceId=${params.workspaceId}&siteId=${params.siteId}&pageId=${page.id}`}
                          target="_blank"
                        >
                          <Button size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
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
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>Collections</CardTitle>
              <CardDescription>
                Manage your content collections (CMS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Collections feature coming soon. You&apos;ll be able to create and manage
                structured content like blog posts, products, and more.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure your site settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <p className="text-sm text-muted-foreground">{site.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">URL Slug</label>
                <p className="text-sm text-muted-foreground">/s/{site.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Custom Domain</label>
                <p className="text-sm text-muted-foreground">
                  {site.customDomain || 'Not configured'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
