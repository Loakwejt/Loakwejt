'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@builderly/ui';
import {
  BarChart3,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ArrowUp,
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  viewsByDay: Array<{ date: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  days: number;
}

const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export default function AnalyticsPage() {
  const params = useParams<{ workspaceId: string; siteId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const baseUrl = `/api/workspaces/${params.workspaceId}/sites/${params.siteId}/analytics`;

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?days=${days}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analyse</h1>
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  const maxDayViews = Math.max(...data.viewsByDay.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analyse</h1>
          <p className="text-muted-foreground">
            Seitenaufrufe der letzten {data.days} Tage
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d} Tage
            </Button>
          ))}
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gesamt-Aufrufe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold">{data.totalViews.toLocaleString('de-DE')}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ø pro Tag</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold">
                {data.viewsByDay.length > 0
                  ? Math.round(data.totalViews / data.viewsByDay.length).toLocaleString('de-DE')
                  : '0'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Seiten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold">{data.topPages.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Views chart (simple bar chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aufrufe pro Tag</CardTitle>
        </CardHeader>
        <CardContent>
          {data.viewsByDay.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Noch keine Daten vorhanden.
            </p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {data.viewsByDay.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group"
                  style={{ height: `${(d.count / maxDayViews) * 100}%`, minHeight: '2px' }}
                  title={`${new Date(d.date).toLocaleDateString('de-DE')}: ${d.count} Aufrufe`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block text-xs bg-popover border rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                    {d.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top-Seiten</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Daten</p>
            ) : (
              <div className="space-y-3">
                {data.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                      <span className="text-sm truncate">{p.path}</span>
                    </div>
                    <Badge variant="secondary">{p.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geräte</CardTitle>
          </CardHeader>
          <CardContent>
            {data.devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Daten</p>
            ) : (
              <div className="space-y-3">
                {data.devices.map((d) => {
                  const Icon = DEVICE_ICONS[d.device] || Monitor;
                  const total = data.devices.reduce((s, x) => s + x.count, 0);
                  const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={d.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{d.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                        <Badge variant="secondary">{d.count}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browser</CardTitle>
          </CardHeader>
          <CardContent>
            {data.browsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Daten</p>
            ) : (
              <div className="space-y-3">
                {data.browsers.map((b) => (
                  <div key={b.browser} className="flex items-center justify-between">
                    <span className="text-sm">{b.browser}</span>
                    <Badge variant="secondary">{b.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quellen</CardTitle>
          </CardHeader>
          <CardContent>
            {data.referrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Daten</p>
            ) : (
              <div className="space-y-3">
                {data.referrers.map((r) => (
                  <div key={r.referrer} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <ArrowUp className="w-3 h-3 text-muted-foreground rotate-45" />
                      <span className="text-sm truncate">{r.referrer}</span>
                    </div>
                    <Badge variant="secondary">{r.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
