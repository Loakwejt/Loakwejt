'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@builderly/ui';
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  Globe,
  Key,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  Building2,
  FileText,
  Download,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Crown,
} from 'lucide-react';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
  privacyConsentAt: string | null;
  privacyConsentVersion: string | null;
  marketingConsent: boolean;
  marketingConsentAt: string | null;
  isActive: boolean;
  deletedAt: string | null;
  anonymizedAt: string | null;
  accounts: {
    id: string;
    type: string;
    provider: string;
    providerAccountId: string | null;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
  }[];
  sessions: {
    id: string;
    expires: string;
    ipAddress: string | null;
    userAgent: string | null;
    deviceType: string | null;
    lastActive: string;
    createdAt: string;
  }[];
  memberships: {
    id: string;
    role: string;
    createdAt: string;
    workspace: {
      id: string;
      name: string;
      slug: string;
      plan: string;
      createdAt: string;
    };
  }[];
  auditLogs: {
    id: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    details: any;
    ipAddress: string | null;
    createdAt: string;
  }[];
  dataExports: {
    id: string;
    status: string;
    createdAt: string;
    processedAt: string | null;
    expiresAt: string | null;
  }[];
  passwordResets: {
    id: string;
    used: boolean;
    usedAt: string | null;
    createdAt: string;
    expires: string;
    ipAddress: string | null;
  }[];
  _count: {
    memberships: number;
    createdPages: number;
    revisions: number;
    records: number;
    assets: number;
    auditLogs: number;
  };
}

const roleBadge: Record<string, string> = {
  OWNER: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  ADMIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  EDITOR: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  VIEWER: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const planColors: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  PRO: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  BUSINESS: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  ENTERPRISE: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

const deviceIcon: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

function formatDate(date: string | null | undefined) {
  if (!date) return '—';
  return new Date(date).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(date: string | null | undefined) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function MaskedField({ label, value }: { label: string; value: string | null }) {
  const [visible, setVisible] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
          {visible ? value : '••••••••••••'}
        </code>
        <button
          onClick={() => setVisible(!visible)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title={visible ? 'Verbergen' : 'Anzeigen (maskiert)'}
        >
          {visible ? (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Fehler beim Laden');
          return;
        }
        setUser(await res.json());
      } catch {
        setError('Netzwerkfehler');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p>{error || 'Benutzer nicht gefunden'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSessions = user.sessions.filter(
    (s) => new Date(s.expires) > new Date()
  );

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Alle Benutzer
        </Button>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="h-20 w-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border-2 border-border">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold truncate">
                  {user.name || 'Unbenannter Benutzer'}
                </h1>
                {user.isActive ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Aktiv
                  </Badge>
                ) : (
                  <Badge variant="destructive">Deaktiviert</Badge>
                )}
                {user.deletedAt && (
                  <Badge variant="destructive">Gelöscht</Badge>
                )}
              </div>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Registriert: {formatDateShort(user.createdAt)}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {user._count.memberships} Workspace{user._count.memberships !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {user._count.createdPages} Seiten erstellt
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" />
                  {activeSessions.length} aktive Session{activeSessions.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="accounts">Accounts & Keys</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="activity">Aktivität</TabsTrigger>
        </TabsList>

        {/* === OVERVIEW TAB === */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account-Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded">{user.id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-Mail</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{user.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-Mail verifiziert</span>
                  <span className="flex items-center gap-1">
                    {user.emailVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        {formatDateShort(user.emailVerified)}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                        Nein
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registriert</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Letztes Update</span>
                  <span>{formatDate(user.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* GDPR / Consent */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Datenschutz & DSGVO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Datenschutz akzeptiert</span>
                  <span>
                    {user.privacyConsentAt
                      ? formatDate(user.privacyConsentAt)
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span>{user.privacyConsentVersion || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marketing-Einwilligung</span>
                  <span className="flex items-center gap-1">
                    {user.marketingConsent ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        Ja
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        Nein
                      </>
                    )}
                  </span>
                </div>
                {user.marketingConsentAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marketing-Einwilligung am</span>
                    <span>{formatDate(user.marketingConsentAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account gelöscht</span>
                  <span>
                    {user.deletedAt ? formatDate(user.deletedAt) : 'Nein'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anonymisiert</span>
                  <span>
                    {user.anonymizedAt ? formatDate(user.anonymizedAt) : 'Nein'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Nutzungsstatistiken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { label: 'Workspaces', value: user._count.memberships },
                    { label: 'Seiten', value: user._count.createdPages },
                    { label: 'Revisionen', value: user._count.revisions },
                    { label: 'Datensätze', value: user._count.records },
                    { label: 'Assets', value: user._count.assets },
                    { label: 'Audit-Logs', value: user._count.auditLogs },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === WORKSPACES TAB === */}
        <TabsContent value="workspaces">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workspace-Mitgliedschaften</CardTitle>
              <CardDescription>Alle Workspaces, in denen der Benutzer Mitglied ist.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {user.memberships.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">
                  Keine Workspace-Mitgliedschaften.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workspace</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Beigetreten</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.memberships.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.workspace.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {m.workspace.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={planColors[m.workspace.plan] || ''}>
                            {m.workspace.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleBadge[m.role] || ''}>
                            {m.role === 'OWNER' && <Crown className="h-3 w-3 mr-1" />}
                            {m.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                            {m.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateShort(m.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SESSIONS TAB === */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aktive Sessions</CardTitle>
              <CardDescription>
                {activeSessions.length} aktiv von {user.sessions.length} gesamt.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {user.sessions.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">
                  Keine Sessions vorhanden.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gerät</TableHead>
                      <TableHead>IP-Adresse</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>Zuletzt aktiv</TableHead>
                      <TableHead>Erstellt</TableHead>
                      <TableHead>Läuft ab</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.sessions.map((session) => {
                      const isActive = new Date(session.expires) > new Date();
                      const DeviceIcon = deviceIcon[session.deviceType || ''] || Globe;
                      return (
                        <TableRow key={session.id} className={!isActive ? 'opacity-50' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm capitalize">
                                {session.deviceType || 'Unbekannt'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {session.ipAddress || '—'}
                            </code>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-xs text-muted-foreground truncate">
                              {session.userAgent || '—'}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(session.lastActive)}</TableCell>
                          <TableCell className="text-sm">{formatDate(session.createdAt)}</TableCell>
                          <TableCell className="text-sm">{formatDate(session.expires)}</TableCell>
                          <TableCell>
                            {isActive ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Aktiv
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Abgelaufen</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ACCOUNTS & KEYS TAB === */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4" />
                Verknüpfte Accounts & Tokens
              </CardTitle>
              <CardDescription>
                Alle Tokens und API-Keys sind maskiert. Klicke auf das Auge-Symbol, um die maskierten Werte zu sehen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.accounts.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Keine verknüpften Accounts.
                </p>
              ) : (
                <div className="space-y-6">
                  {user.accounts.map((account) => (
                    <div
                      key={account.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{account.provider}</p>
                          <p className="text-xs text-muted-foreground">
                            Typ: {account.type} · Token-Typ: {account.token_type || '—'}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-1 text-sm">
                        <MaskedField label="Provider Account ID" value={account.providerAccountId} />
                        <MaskedField label="Access Token" value={account.access_token} />
                        <MaskedField label="Refresh Token" value={account.refresh_token} />
                        <MaskedField label="ID Token" value={account.id_token} />
                        <MaskedField label="Session State" value={account.session_state} />
                        {account.scope && (
                          <div className="flex items-center justify-between py-1">
                            <span className="text-muted-foreground">Scope</span>
                            <span className="text-xs">{account.scope}</span>
                          </div>
                        )}
                        {account.expires_at && (
                          <div className="flex items-center justify-between py-1">
                            <span className="text-muted-foreground">Läuft ab</span>
                            <span className="text-xs">
                              {new Date(account.expires_at * 1000).toLocaleString('de-DE')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SECURITY TAB === */}
        <TabsContent value="security" className="space-y-4">
          {/* Password Resets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Passwort-Zurücksetzungen
              </CardTitle>
              <CardDescription>Letzte 10 Anfragen. Tokens sind nicht sichtbar.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {user.passwordResets.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">
                  Keine Passwort-Zurücksetzungen.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verwendet am</TableHead>
                      <TableHead>Läuft ab</TableHead>
                      <TableHead>IP-Adresse</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.passwordResets.map((pr) => (
                      <TableRow key={pr.id}>
                        <TableCell className="text-sm">{formatDate(pr.createdAt)}</TableCell>
                        <TableCell>
                          {pr.used ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              Verwendet
                            </Badge>
                          ) : new Date(pr.expires) < new Date() ? (
                            <Badge variant="secondary">Abgelaufen</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                              Ausstehend
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(pr.usedAt)}</TableCell>
                        <TableCell className="text-sm">{formatDate(pr.expires)}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {pr.ipAddress || '—'}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Data Exports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4" />
                Datenexport-Anfragen (DSGVO)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {user.dataExports.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">
                  Keine Datenexport-Anfragen.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verarbeitet am</TableHead>
                      <TableHead>Läuft ab</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.dataExports.map((de) => {
                      const statusColors: Record<string, string> = {
                        PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                        PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                        COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                        FAILED: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                        EXPIRED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                      };
                      return (
                        <TableRow key={de.id}>
                          <TableCell className="text-sm">{formatDate(de.createdAt)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[de.status] || ''}>
                              {de.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(de.processedAt)}</TableCell>
                          <TableCell className="text-sm">{formatDate(de.expiresAt)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ACTIVITY TAB === */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Letzte Aktivitäten
              </CardTitle>
              <CardDescription>
                Die letzten 50 Audit-Log-Einträge ({user._count.auditLogs} insgesamt).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {user.auditLogs.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">
                  Keine Aktivitäten protokolliert.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zeitpunkt</TableHead>
                      <TableHead>Aktion</TableHead>
                      <TableHead>Entität</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.entity ? (
                            <span>
                              {log.entity}
                              {log.entityId && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  #{log.entityId.slice(0, 8)}
                                </span>
                              )}
                            </span>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {log.details ? (
                            <pre className="text-xs text-muted-foreground truncate">
                              {typeof log.details === 'string'
                                ? log.details
                                : JSON.stringify(log.details).slice(0, 80)}
                            </pre>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {log.ipAddress || '—'}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
