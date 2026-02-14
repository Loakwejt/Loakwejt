'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Textarea,
} from '@builderly/ui';
import {
  Plus,
  Search,
  Tag,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  usedCount: number;
  startsAt: string;
  expiresAt?: string;
  isActive: boolean;
  _count?: { orders: number };
}

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: 'Prozent',
  FIXED_AMOUNT: 'Festbetrag',
  FREE_SHIPPING: 'Kostenloser Versand',
};

const TYPE_ICONS: Record<string, typeof Percent> = {
  PERCENTAGE: Percent,
  FIXED_AMOUNT: DollarSign,
  FREE_SHIPPING: Truck,
};

export default function WorkspaceCouponsPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/coupons`
    : null;

  const loadCoupons = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Coupons API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setCoupons(data.coupons || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search]);

  useEffect(() => {
    if (activeSiteId) loadCoupons();
  }, [activeSiteId, search, loadCoupons]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Coupon wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadCoupons();
  }

  async function handleToggleActive(coupon: Coupon) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${coupon.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    loadCoupons();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      code: (form.get('code') as string).toUpperCase(),
      description: form.get('description') as string,
      type: form.get('type') as string,
      value: parseInt(form.get('value') as string),
      minOrderAmount: form.get('minOrderAmount') ? parseInt(form.get('minOrderAmount') as string) * 100 : null,
      maxUses: form.get('maxUses') ? parseInt(form.get('maxUses') as string) : null,
      expiresAt: form.get('expiresAt') || null,
      isActive: true,
    };

    if (editCoupon) {
      await fetch(`${baseUrl}/${editCoupon.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    setShowForm(false);
    setEditCoupon(null);
    loadCoupons();
  }

  function formatValue(coupon: Coupon) {
    if (coupon.type === 'PERCENTAGE') return `${coupon.value}%`;
    if (coupon.type === 'FIXED_AMOUNT') return `${(coupon.value / 100).toFixed(2)} €`;
    return 'Kostenloser Versand';
  }

  if (sitesLoading) {
    return <div className="p-8 text-center text-muted-foreground">Lade…</div>;
  }

  if (!hasSites) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Site vorhanden</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle zunächst eine Site, um Coupons zu verwalten.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons &amp; Rabatte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle Gutscheincodes und Rabattaktionen für deinen Shop.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 1 && (
            <WorkspaceSiteSelector sites={sites} activeSiteId={activeSiteId!} onSelect={setActiveSiteId} />
          )}
          <Button onClick={() => { setEditCoupon(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Coupon erstellen
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Coupon-Code suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editCoupon ? 'Coupon bearbeiten' : 'Neuer Coupon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon-Code *</Label>
                  <Input id="code" name="code" placeholder="SOMMER20" defaultValue={editCoupon?.code} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Rabatttyp *</Label>
                  <select
                    id="type"
                    name="type"
                    defaultValue={editCoupon?.type || 'PERCENTAGE'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="PERCENTAGE">Prozent (%)</option>
                    <option value="FIXED_AMOUNT">Festbetrag (€)</option>
                    <option value="FREE_SHIPPING">Kostenloser Versand</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Wert *</Label>
                  <Input id="value" name="value" type="number" placeholder="10" defaultValue={editCoupon?.value} required />
                  <p className="text-xs text-muted-foreground">Für Prozent: z.B. 10 = 10%. Für Festbetrag: Wert in Cent.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Mindestbestellwert (€)</Label>
                  <Input id="minOrderAmount" name="minOrderAmount" type="number" step="0.01" placeholder="0.00"
                    defaultValue={editCoupon?.minOrderAmount ? (editCoupon.minOrderAmount / 100).toFixed(2) : ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Max. Verwendungen</Label>
                  <Input id="maxUses" name="maxUses" type="number" placeholder="Unbegrenzt" defaultValue={editCoupon?.maxUses ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Gültig bis</Label>
                  <Input id="expiresAt" name="expiresAt" type="datetime-local"
                    defaultValue={editCoupon?.expiresAt ? new Date(editCoupon.expiresAt).toISOString().slice(0, 16) : ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea id="description" name="description" rows={2} placeholder="z. B. Sommeraktion 2026"
                  defaultValue={editCoupon?.description ?? ''} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editCoupon ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditCoupon(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Coupons…</div>
      ) : coupons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Coupons</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deinen ersten Gutscheincode.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {coupons.map((coupon) => {
            const Icon = TYPE_ICONS[coupon.type] || Tag;
            return (
              <Card key={coupon.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{coupon.code}</span>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatValue(coupon)} · {TYPE_LABELS[coupon.type]} · {coupon.usedCount}× verwendet
                        {coupon.expiresAt && ` · bis ${new Date(coupon.expiresAt).toLocaleDateString('de-DE')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleToggleActive(coupon)}>
                      {coupon.isActive ? 'Deaktivieren' : 'Aktivieren'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditCoupon(coupon); setShowForm(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
