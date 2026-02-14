'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@builderly/ui';
import {
  Users,
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldOff,
  Ban,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Activity,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface SiteUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'VIP';
  isActive: boolean;
  isBanned: boolean;
  banReason: string | null;
  emailVerified: boolean;
  provider: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  createdAt: string;
  _count: {
    sessions: number;
    orders: number;
  };
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeSessions: number;
  roleDistribution: { role: string; count: number }[];
  providerDistribution: { provider: string; count: number }[];
  recentSignups: { id: string; email: string; name: string | null; role: string; createdAt: string }[];
}

interface UserDetail extends SiteUser {
  bio: string | null;
  profileData: Record<string, unknown> | null;
  sessions: {
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    deviceType: string | null;
    createdAt: string;
    lastActiveAt: string;
    expiresAt: string;
  }[];
  orders: {
    id: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
  }[];
}

// ============================================================================
// SITE USERS CLIENT
// ============================================================================

interface SiteUsersClientProps {
  workspaceId: string;
  siteName: string;
}

export function SiteUsersClient({ workspaceId, siteName }: SiteUsersClientProps) {
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'ban' | 'unban' | 'delete' | 'activate' | 'deactivate';
    userId: string;
    userName: string;
  }>({ open: false, type: 'ban', userId: '', userName: '' });
  const [banReason, setBanReason] = useState('');

  const baseUrl = `/api/workspaces/${workspaceId}/users`;

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`${baseUrl}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, page, search, roleFilter, statusFilter]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${baseUrl}/stats`);
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    } finally {
      setStatsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch user details
  const openUserDetail = async (userId: string) => {
    try {
      const res = await fetch(`${baseUrl}/${userId}`);
      if (res.ok) {
        setSelectedUser(await res.json());
        setDetailOpen(true);
      }
    } catch (e) {
      console.error('Error fetching user detail:', e);
    }
  };

  // Update user
  const updateUser = async (userId: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`${baseUrl}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchUsers();
        fetchStats();
        return true;
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
    return false;
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${baseUrl}/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
        fetchStats();
        return true;
      }
    } catch (e) {
      console.error('Error deleting user:', e);
    }
    return false;
  };

  // Handle confirm action
  const handleConfirmAction = async () => {
    const { type, userId } = confirmDialog;
    let success = false;

    switch (type) {
      case 'ban':
        success = await updateUser(userId, { isBanned: true, banReason: banReason || undefined });
        break;
      case 'unban':
        success = await updateUser(userId, { isBanned: false });
        break;
      case 'delete':
        success = await deleteUser(userId);
        break;
      case 'activate':
        success = await updateUser(userId, { isActive: true });
        break;
      case 'deactivate':
        success = await updateUser(userId, { isActive: false });
        break;
    }

    if (success) {
      setConfirmDialog({ open: false, type: 'ban', userId: '', userName: '' });
      setBanReason('');
    }
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'MODERATOR': return 'Moderator';
      case 'MEMBER': return 'Mitglied';
      case 'VIP': return 'VIP';
      default: return role;
    }
  };

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive' as const;
      case 'MODERATOR': return 'default' as const;
      case 'VIP': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Benutzer-Verwaltung
          </h1>
          <p className="text-muted-foreground mt-1">
            Registrierte Benutzer von <strong>{siteName}</strong> verwalten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchUsers(); fetchStats(); }}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Aktualisieren
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Gesamt"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Aktiv"
          value={stats?.activeUsers ?? 0}
          icon={<UserCheck className="h-4 w-4 text-green-600" />}
          loading={statsLoading}
          subtitle={stats ? `${stats.newUsersThisWeek} diese Woche` : undefined}
        />
        <StatCard
          title="Gesperrt"
          value={stats?.bannedUsers ?? 0}
          icon={<Ban className="h-4 w-4 text-red-600" />}
          loading={statsLoading}
        />
        <StatCard
          title="Aktive Sitzungen"
          value={stats?.activeSessions ?? 0}
          icon={<Activity className="h-4 w-4 text-blue-600" />}
          loading={statsLoading}
        />
      </div>

      {/* Tabs: Users / Analytics */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="analytics">Statistiken</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Name oder E-Mail suchen..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="MEMBER">Mitglied</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="banned">Gesperrt</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benutzer</TableHead>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Letzter Login</TableHead>
                    <TableHead>Registriert</TableHead>
                    <TableHead>Logins</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        {search || roleFilter !== 'all' || statusFilter !== 'all'
                          ? 'Keine Benutzer gefunden.'
                          : 'Noch keine registrierten Benutzer.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openUserDetail(user.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                              ) : (
                                (user.name?.[0] || user.email?.[0] || '?').toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.name || '—'}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant(user.role)}>
                            {roleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive">Gesperrt</Badge>
                          ) : user.isActive ? (
                            <Badge variant="success">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Inaktiv</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm">{user.loginCount}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openUserDetail(user.id); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Details anzeigen
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUser(user.id, { role: 'ADMIN' });
                                }}
                              >
                                <Crown className="mr-2 h-4 w-4" />
                                Zum Admin machen
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUser(user.id, { role: 'MODERATOR' });
                                }}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Zum Moderator machen
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.isBanned ? (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDialog({
                                      open: true,
                                      type: 'unban',
                                      userId: user.id,
                                      userName: user.name || user.email,
                                    });
                                  }}
                                >
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Entsperren
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDialog({
                                      open: true,
                                      type: 'ban',
                                      userId: user.id,
                                      userName: user.name || user.email,
                                    });
                                  }}
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Sperren
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDialog({
                                    open: true,
                                    type: 'delete',
                                    userId: user.id,
                                    userName: user.name || user.email,
                                  });
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {totalCount} Benutzer insgesamt
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Seite {page} von {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Wachstum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heute</span>
                  <span className="font-medium">+{stats?.newUsersToday ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diese Woche</span>
                  <span className="font-medium">+{stats?.newUsersThisWeek ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dieser Monat</span>
                  <span className="font-medium">+{stats?.newUsersThisMonth ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Role distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Rollen-Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))
                ) : (
                  stats?.roleDistribution.map((r) => (
                    <div key={r.role} className="flex justify-between items-center">
                      <Badge variant={roleBadgeVariant(r.role)}>{roleLabel(r.role)}</Badge>
                      <span className="font-medium">{r.count}</span>
                    </div>
                  ))
                )}
                {!statsLoading && (!stats?.roleDistribution || stats.roleDistribution.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center">Keine Daten</p>
                )}
              </CardContent>
            </Card>

            {/* Provider distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Anmelde-Methoden
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))
                ) : (
                  stats?.providerDistribution.map((p) => (
                    <div key={p.provider} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{p.provider}</span>
                      <span className="font-medium">{p.count}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent signups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Neueste Registrierungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))
                ) : (
                  stats?.recentSignups.map((u) => (
                    <div key={u.id} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{u.name || u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      (selectedUser.name?.[0] || selectedUser.email?.[0] || '?').toUpperCase()
                    )}
                  </div>
                  <div>
                    <div>{selectedUser.name || 'Kein Name'}</div>
                    <div className="text-sm font-normal text-muted-foreground">{selectedUser.email}</div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Registriert am {formatDateTime(selectedUser.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={roleBadgeVariant(selectedUser.role)}>
                    {roleLabel(selectedUser.role)}
                  </Badge>
                  {selectedUser.isBanned ? (
                    <Badge variant="destructive">Gesperrt</Badge>
                  ) : selectedUser.isActive ? (
                    <Badge variant="success">Aktiv</Badge>
                  ) : (
                    <Badge variant="secondary">Inaktiv</Badge>
                  )}
                  {selectedUser.emailVerified && (
                    <Badge variant="outline">E-Mail verifiziert</Badge>
                  )}
                  {selectedUser.provider && (
                    <Badge variant="outline">{selectedUser.provider}</Badge>
                  )}
                </div>

                {selectedUser.banReason && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md p-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Sperrgrund:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{selectedUser.banReason}</p>
                  </div>
                )}

                {selectedUser.bio && (
                  <div>
                    <p className="text-sm font-medium mb-1">Bio</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.bio}</p>
                  </div>
                )}

                <Separator />

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Letzter Login</p>
                    <p className="font-medium">
                      {selectedUser.lastLoginAt ? formatDateTime(selectedUser.lastLoginAt) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Login-Anzahl</p>
                    <p className="font-medium">{selectedUser.loginCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Aktive Sitzungen</p>
                    <p className="font-medium">{selectedUser._count.sessions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bestellungen</p>
                    <p className="font-medium">{selectedUser._count.orders}</p>
                  </div>
                </div>

                {/* Recent sessions */}
                {selectedUser.sessions.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Letzte Sitzungen</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedUser.sessions.map((s) => (
                          <div key={s.id} className="text-xs bg-muted/50 p-2 rounded flex justify-between">
                            <div>
                              <span className="font-medium">{s.deviceType || 'Unbekannt'}</span>
                              {s.ipAddress && (
                                <span className="text-muted-foreground ml-2">{s.ipAddress}</span>
                              )}
                            </div>
                            <span className="text-muted-foreground">{formatDateTime(s.lastActiveAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Recent orders */}
                {selectedUser.orders.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Letzte Bestellungen</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedUser.orders.map((o) => (
                          <div key={o.id} className="text-xs bg-muted/50 p-2 rounded flex justify-between">
                            <div>
                              <Badge variant="outline" className="text-xs">{o.status}</Badge>
                              <span className="ml-2">
                                {o.totalAmount.toFixed(2)} {o.currency}
                              </span>
                            </div>
                            <span className="text-muted-foreground">{formatDate(o.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="flex-row gap-2">
                <Select
                  value={selectedUser.role}
                  onValueChange={(v) => {
                    updateUser(selectedUser.id, { role: v });
                    setSelectedUser({ ...selectedUser, role: v as SiteUser['role'] });
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="MEMBER">Mitglied</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUser.isBanned ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateUser(selectedUser.id, { isBanned: false });
                      setSelectedUser({ ...selectedUser, isBanned: false, banReason: null });
                    }}
                  >
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Entsperren
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        type: 'ban',
                        userId: selectedUser.id,
                        userName: selectedUser.name || selectedUser.email,
                      })
                    }
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Sperren
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'ban' && 'Benutzer sperren'}
              {confirmDialog.type === 'unban' && 'Benutzer entsperren'}
              {confirmDialog.type === 'delete' && 'Benutzer löschen'}
              {confirmDialog.type === 'activate' && 'Benutzer aktivieren'}
              {confirmDialog.type === 'deactivate' && 'Benutzer deaktivieren'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'ban' &&
                `Möchtest du "${confirmDialog.userName}" wirklich sperren? Alle aktiven Sitzungen werden beendet.`}
              {confirmDialog.type === 'unban' &&
                `Möchtest du "${confirmDialog.userName}" wirklich entsperren?`}
              {confirmDialog.type === 'delete' &&
                `Möchtest du "${confirmDialog.userName}" wirklich endgültig löschen? Alle Daten gehen unwiderruflich verloren.`}
              {confirmDialog.type === 'activate' &&
                `Möchtest du "${confirmDialog.userName}" aktivieren?`}
              {confirmDialog.type === 'deactivate' &&
                `Möchtest du "${confirmDialog.userName}" deaktivieren?`}
            </DialogDescription>
          </DialogHeader>
          {confirmDialog.type === 'ban' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Sperrgrund (optional)</label>
              <Input
                placeholder="Grund für die Sperre..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Abbrechen
            </Button>
            <Button
              variant={confirmDialog.type === 'delete' || confirmDialog.type === 'ban' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
            >
              {confirmDialog.type === 'ban' && 'Sperren'}
              {confirmDialog.type === 'unban' && 'Entsperren'}
              {confirmDialog.type === 'delete' && 'Endgültig löschen'}
              {confirmDialog.type === 'activate' && 'Aktivieren'}
              {confirmDialog.type === 'deactivate' && 'Deaktivieren'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// STAT CARD HELPER
// ============================================================================

function StatCard({
  title,
  value,
  icon,
  loading,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading: boolean;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-sm text-muted-foreground">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-2 bg-muted rounded-md">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
