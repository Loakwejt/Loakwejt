import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@builderly/db';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@builderly/ui';
import {
  Users,
  Building2,
  Globe,
  FileText,
  HardDrive,
  Crown,
  TrendingUp,
  Activity,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  // Alle Statistiken parallel abrufen
  const [
    totalUsers,
    totalWorkspaces,
    totalSites,
    totalPages,
    totalAssets,
    totalStorageAgg,
    planDistribution,
    recentUsers,
    recentWorkspaces,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.site.count(),
    prisma.page.count(),
    prisma.asset.count(),
    prisma.asset.aggregate({ _sum: { size: true } }),
    prisma.workspace.groupBy({ by: ['plan'], _count: { plan: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.workspace.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        createdAt: true,
        _count: { select: { sites: true, members: true } },
      },
    }),
  ]);

  const totalStorageBytes = Number(totalStorageAgg._sum.size ?? 0);
  const totalStorageGB = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(0);

  // Plan distribution map
  const planCounts: Record<string, number> = {
    FREE: 0,
    PRO: 0,
    BUSINESS: 0,
    ENTERPRISE: 0,
  };
  for (const p of planDistribution) {
    planCounts[p.plan] = p._count.plan;
  }

  const planColors: Record<string, string> = {
    FREE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    PRO: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    BUSINESS: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  };

  const planLabels: Record<string, string> = {
    FREE: 'Starter',
    PRO: 'Pro',
    BUSINESS: 'Business',
    ENTERPRISE: 'Enterprise',
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Admin-Übersicht</h1>
        <p className="text-muted-foreground">
          Systemweite Statistiken und aktuelle Aktivitäten.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Benutzer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalWorkspaces}</p>
                <p className="text-xs text-muted-foreground">Workspaces</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSites}</p>
                <p className="text-xs text-muted-foreground">Websites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPages}</p>
                <p className="text-xs text-muted-foreground">Seiten</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage + Plan Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Speichernutzung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">
                  {Number(totalStorageGB) >= 1 ? `${totalStorageGB} GB` : `${totalStorageMB} MB`}
                </p>
                <p className="text-sm text-muted-foreground pb-1">
                  über {totalAssets} Dateien
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Plan-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'] as const).map((plan) => {
                const count = planCounts[plan] ?? 0;
                const total = totalWorkspaces || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={plan} className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`w-24 justify-center ${planColors[plan]}`}
                    >
                      {planLabels[plan]}
                    </Badge>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Neue Benutzer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Neueste Benutzer
            </CardTitle>
            <CardDescription>Zuletzt registrierte Benutzer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name || 'Unbenannt'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Neue Workspaces */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Neueste Workspaces
            </CardTitle>
            <CardDescription>Zuletzt erstellte Workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentWorkspaces.map((ws) => (
                <div key={ws.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                      {ws.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ws.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ws._count.sites} Sites · {ws._count.members} Mitglieder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${planColors[ws.plan]}`}>
                      {planLabels[ws.plan]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ws.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
