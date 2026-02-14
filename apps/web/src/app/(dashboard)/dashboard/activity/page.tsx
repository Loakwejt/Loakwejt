import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@builderly/ui';
import { 
  Activity,
  Globe,
  FileText,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Get user's recent activity
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: {
        include: {
          pages: {
            orderBy: { updatedAt: 'desc' },
            take: 10,
            select: {
              id: true,
              name: true,
              slug: true,
              updatedAt: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  // Flatten all pages with context
  const allPages = memberships.flatMap(m =>
    m.workspace.pages.map(page => ({
      ...page,
      workspaceName: m.workspace.name,
      workspaceId: m.workspace.id,
    }))
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Group by date
  const groupedByDate = allPages.reduce((acc, page) => {
    const date = new Date(page.updatedAt).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(page);
    return acc;
  }, {} as Record<string, typeof allPages>);

  // Mock analytics data
  const analytics = {
    totalViews: 1247,
    viewsChange: 12.5,
    uniqueVisitors: 892,
    visitorsChange: 8.3,
    avgTimeOnSite: '2m 34s',
    bounceRate: '42%',
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          Activity & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your sites' performance and recent changes
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{analytics.viewsChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{analytics.visitorsChange}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time on Site</p>
                <p className="text-2xl font-bold">{analytics.avgTimeOnSite}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{analytics.bounceRate}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Views Over Time</CardTitle>
          <CardDescription>Page views in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Analytics chart coming soon</p>
              <p className="text-xs">Track page views, visitors, and more</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Changes made across all your workspaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start editing pages to see your activity here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).slice(0, 5).map(([date, pages]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {date}
                  </h3>
                  <div className="space-y-2 border-l-2 border-muted pl-4 ml-2">
                    {pages.map((page) => (
                      <div 
                        key={page.id} 
                        className="flex items-center justify-between py-2 hover:bg-muted/30 rounded px-2 -ml-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <div>
                            <p className="font-medium text-sm">{page.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {page.workspaceName} · /{page.slug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {new Date(page.createdAt).getTime() === new Date(page.updatedAt).getTime() 
                              ? 'Created' 
                              : 'Updated'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(page.updatedAt).toLocaleTimeString('de-DE', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
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
