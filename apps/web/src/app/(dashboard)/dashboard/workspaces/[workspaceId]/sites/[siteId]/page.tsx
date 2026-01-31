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
  Settings,
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
              {site.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
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
          <Link href={`/dashboard/workspaces/${params.workspaceId}/sites/${params.siteId}/settings`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
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
                <p className="text-xs text-muted-foreground">Pages</p>
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
                <p className="text-xs text-muted-foreground">Published</p>
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
                <p className="text-xs text-muted-foreground">Last Updated</p>
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
            Pages
          </TabsTrigger>
          <TabsTrigger value="collections" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Collections
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Pages</h2>
              <p className="text-sm text-muted-foreground">
                Manage all pages on your site
              </p>
            </div>
            <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Page
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
                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first page to start building your site. Each page can have its own design and content.
                </p>
                <CreatePageDialog workspaceId={params.workspaceId} siteId={params.siteId}>
                  <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Create First Page
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
                            Edit in Builder
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
              <h3 className="text-lg font-medium">Collections</h3>
              <p className="text-sm text-muted-foreground">
                Manage your content collections (CMS)
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Collection
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
                    <h4 className="font-medium">Blog Posts</h4>
                    <p className="text-xs text-muted-foreground">12 items</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Articles, news, and updates
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
                    <h4 className="font-medium">Products</h4>
                    <p className="text-xs text-muted-foreground">48 items</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Product catalog and inventory
                </p>
              </CardContent>
            </Card>

            <Card className="border-dashed hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Create Collection</p>
                <p className="text-xs text-muted-foreground">
                  Add a new content type
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Design Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your site&apos;s visual appearance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </CardTitle>
                <CardDescription>
                  Define your brand colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primary Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary border" />
                    <span className="text-sm text-muted-foreground">#3B82F6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Secondary Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-secondary border" />
                    <span className="text-sm text-muted-foreground">#6B7280</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Accent Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-green-500 border" />
                    <span className="text-sm text-muted-foreground">#22C55E</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Customize Colors
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
                  Font settings for your site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Heading Font</span>
                  <span className="text-sm font-medium">Inter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Body Font</span>
                  <span className="text-sm">Inter</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Base Size</span>
                  <span className="text-sm text-muted-foreground">16px</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Customize Typography
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
                  Page layout and spacing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Container Width</span>
                  <span className="text-sm text-muted-foreground">1200px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Section Spacing</span>
                  <span className="text-sm text-muted-foreground">80px</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Border Radius</span>
                  <span className="text-sm text-muted-foreground">8px</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Customize Layout
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Global Styles
                </CardTitle>
                <CardDescription>
                  Site-wide style settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <Badge>Light</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark Mode</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Animations</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Customize Global Styles
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Site Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure your site&apos;s settings and metadata
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General</CardTitle>
                <CardDescription>
                  Basic site information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site Name</label>
                    <input
                      type="text"
                      defaultValue={site.name}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL Slug</label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                        /s/
                      </span>
                      <input
                        type="text"
                        defaultValue={site.slug}
                        className="w-full px-3 py-2 border rounded-r-md text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    placeholder="A brief description of your site..."
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Domain
                </CardTitle>
                <CardDescription>
                  Configure your custom domain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Domain</label>
                  <input
                    type="text"
                    defaultValue={site.customDomain || ''}
                    placeholder="www.example.com"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Point your domain&apos;s CNAME record to builderly.app
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" />
                    DNS Pending
                  </Badge>
                  <Button variant="outline" size="sm">
                    Verify Domain
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO & Social</CardTitle>
                <CardDescription>
                  Optimize your site for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  <input
                    type="text"
                    placeholder="My Awesome Site"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="A brief description for search engines..."
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Social Image</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Drop an image here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200x630px
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium">Delete Site</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this site and all its pages
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Site
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
