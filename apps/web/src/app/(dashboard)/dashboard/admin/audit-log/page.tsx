'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@builderly/ui';
import {
  Search,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  User,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  login: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  logout: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

function getActionColor(action: string): string {
  const key = Object.keys(actionColors).find((k) =>
    action.toLowerCase().includes(k)
  );
  return key ? (actionColors[key] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground';
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(
    async (page = 1, action = '') => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '50',
        });
        if (action) params.set('action', action);

        const res = await fetch(`/api/admin/audit-logs?${params}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1, actionFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [actionFilter, fetchLogs]);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit-Log</h1>
        <p className="text-muted-foreground">
          Alle Systemaktivitäten protokolliert ({pagination.total} Einträge).
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nach Aktion filtern…"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Keine Audit-Log-Einträge gefunden.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zeitstempel</TableHead>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Aktion</TableHead>
                  <TableHead>Entität</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          {new Date(log.createdAt).toLocaleString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {log.user.name?.[0]?.toUpperCase() ||
                              log.user.email?.[0]?.toUpperCase() ||
                              '?'}
                          </div>
                          <div>
                            <p className="text-xs font-medium">
                              {log.user.name || 'Unbekannt'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getActionColor(log.action)}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.entity ? (
                        <span className="text-muted-foreground">
                          {log.entity}
                          {log.entityId && (
                            <span className="text-xs ml-1 opacity-50">
                              #{log.entityId.slice(0, 8)}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {log.details ? (
                        <pre className="text-xs text-muted-foreground truncate">
                          {typeof log.details === 'string'
                            ? log.details
                            : JSON.stringify(log.details).slice(0, 60)}
                        </pre>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {log.ipAddress || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Seite {pagination.page} von {pagination.pages} ({pagination.total}{' '}
            Einträge)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => fetchLogs(pagination.page - 1, actionFilter)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchLogs(pagination.page + 1, actionFilter)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
