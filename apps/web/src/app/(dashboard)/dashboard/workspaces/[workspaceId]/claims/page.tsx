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
  ShieldAlert,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';


interface Claim {
  id: string;
  claimNumber: string;
  orderId?: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  type: 'RETURN' | 'EXCHANGE' | 'REFUND' | 'DAMAGE' | 'OTHER';
  reason: string;
  status: 'OPEN' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Offen',
  IN_REVIEW: 'In Prüfung',
  APPROVED: 'Genehmigt',
  REJECTED: 'Abgelehnt',
  RESOLVED: 'Erledigt',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  OPEN: 'secondary',
  IN_REVIEW: 'default',
  APPROVED: 'default',
  REJECTED: 'destructive',
  RESOLVED: 'secondary',
};

const TYPE_LABELS: Record<string, string> = {
  RETURN: 'Rücksendung',
  EXCHANGE: 'Umtausch',
  REFUND: 'Erstattung',
  DAMAGE: 'Beschädigung',
  OTHER: 'Sonstiges',
};

export default function WorkspaceClaimsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editClaim, setEditClaim] = useState<Claim | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/claims`;

  const loadClaims = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Claims API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setClaims(data.claims || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load claims:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadClaims();
  }, [search, statusFilter, loadClaims]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Reklamation wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadClaims();
  }

  async function handleStatusChange(id: string, status: string) {
    if (!baseUrl) return;
    const body: any = { status };
    if (status === 'RESOLVED') body.resolvedAt = new Date().toISOString();
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    loadClaims();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      claimNumber: form.get('claimNumber') as string,
      orderId: (form.get('orderId') as string) || null,
      orderNumber: (form.get('orderNumber') as string) || null,
      customerName: form.get('customerName') as string,
      customerEmail: form.get('customerEmail') as string,
      type: form.get('type') as string,
      reason: form.get('reason') as string,
      status: editClaim?.status || 'OPEN',
      resolution: (form.get('resolution') as string) || null,
    };

    if (editClaim) {
      await fetch(`${baseUrl}/${editClaim.id}`, {
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
    setEditClaim(null);
    loadClaims();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reklamationen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Reklamationen, Rücksendungen und Umtausch. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditClaim(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Reklamation
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Reklamation oder Kunde suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="rounded-md border px-3 py-2 text-sm bg-background"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Alle Status</option>
          <option value="OPEN">Offen</option>
          <option value="IN_REVIEW">In Prüfung</option>
          <option value="APPROVED">Genehmigt</option>
          <option value="REJECTED">Abgelehnt</option>
          <option value="RESOLVED">Erledigt</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editClaim ? 'Reklamation bearbeiten' : 'Neue Reklamation'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="claimNumber">Reklamationsnummer *</Label>
                  <Input id="claimNumber" name="claimNumber" placeholder="RK-2026-001"
                    defaultValue={editClaim?.claimNumber || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Bestellnummer</Label>
                  <Input id="orderNumber" name="orderNumber" placeholder="Optionale Bestellnummer"
                    defaultValue={editClaim?.orderNumber || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderId">Bestell-ID</Label>
                  <Input id="orderId" name="orderId" placeholder="Optionale Bestell-ID"
                    defaultValue={editClaim?.orderId || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Art der Reklamation *</Label>
                  <select id="type" name="type"
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    defaultValue={editClaim?.type || 'RETURN'} required>
                    <option value="RETURN">Rücksendung</option>
                    <option value="EXCHANGE">Umtausch</option>
                    <option value="REFUND">Erstattung</option>
                    <option value="DAMAGE">Beschädigung</option>
                    <option value="OTHER">Sonstiges</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Kundenname *</Label>
                  <Input id="customerName" name="customerName" placeholder="Max Mustermann"
                    defaultValue={editClaim?.customerName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Kunden-E-Mail *</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" placeholder="max@example.com"
                    defaultValue={editClaim?.customerEmail || ''} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="reason">Reklamationsgrund *</Label>
                  <Textarea id="reason" name="reason" placeholder="Beschreibe den Grund der Reklamation…"
                    defaultValue={editClaim?.reason || ''} required rows={3} />
                </div>
                {editClaim && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="resolution">Lösung / Anmerkungen</Label>
                    <Textarea id="resolution" name="resolution" placeholder="Beschreibe die getroffene Lösung…"
                      defaultValue={editClaim?.resolution || ''} rows={3} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editClaim ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditClaim(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Reklamationen…</div>
      ) : claims.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Reklamationen</p>
            <p className="text-sm text-muted-foreground mt-1">Reklamationen werden hier angezeigt.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{claim.claimNumber}</span>
                      <Badge variant={STATUS_VARIANT[claim.status]}>{STATUS_LABELS[claim.status]}</Badge>
                      <Badge variant="secondary">{TYPE_LABELS[claim.type]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {claim.customerName}
                      {claim.orderNumber && ` · Bestellung ${claim.orderNumber}`}
                      {' · '}{new Date(claim.createdAt).toLocaleDateString('de-DE')}
                      {claim.resolvedAt && ` · Erledigt: ${new Date(claim.resolvedAt).toLocaleDateString('de-DE')}`}
                    </p>
                    {claim.reason && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{claim.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {claim.status === 'OPEN' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(claim.id, 'IN_REVIEW')}>
                      Prüfen
                    </Button>
                  )}
                  {claim.status === 'IN_REVIEW' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(claim.id, 'APPROVED')}>
                        Genehmigen
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive"
                        onClick={() => handleStatusChange(claim.id, 'REJECTED')}>
                        Ablehnen
                      </Button>
                    </>
                  )}
                  {claim.status === 'APPROVED' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(claim.id, 'RESOLVED')}>
                      Erledigt
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { setEditClaim(claim); setShowForm(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(claim.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
