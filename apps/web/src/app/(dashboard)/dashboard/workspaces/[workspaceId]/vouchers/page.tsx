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
  Gift,
  Edit,
  Trash2,
  AlertCircle,
  Copy,
} from 'lucide-react';


interface Voucher {
  id: string;
  code: string;
  initialValue: number;
  currentBalance: number;
  currency: string;
  expiresAt?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'DISABLED';
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktiv',
  USED: 'Eingelöst',
  EXPIRED: 'Abgelaufen',
  DISABLED: 'Deaktiviert',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  USED: 'secondary',
  EXPIRED: 'destructive',
  DISABLED: 'secondary',
};

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function WorkspaceVouchersPage() {
  const params = useParams<{ workspaceId: string }>();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/vouchers`;

  const loadVouchers = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Vouchers API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setVouchers(data.vouchers || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search]);

  useEffect(() => {
    loadVouchers();
  }, [search, loadVouchers]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Gutschein wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadVouchers();
  }

  async function handleToggleStatus(voucher: Voucher) {
    if (!baseUrl) return;
    const newStatus = voucher.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await fetch(`${baseUrl}/${voucher.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    loadVouchers();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      code: (form.get('code') as string).toUpperCase(),
      initialValue: Math.round(parseFloat(form.get('initialValue') as string) * 100),
      currentBalance: editVoucher
        ? Math.round(parseFloat(form.get('currentBalance') as string) * 100)
        : Math.round(parseFloat(form.get('initialValue') as string) * 100),
      currency: (form.get('currency') as string) || 'EUR',
      expiresAt: form.get('expiresAt') || null,
      customerName: (form.get('customerName') as string) || null,
      customerEmail: (form.get('customerEmail') as string) || null,
      status: 'ACTIVE',
    };

    if (editVoucher) {
      await fetch(`${baseUrl}/${editVoucher.id}`, {
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
    setEditVoucher(null);
    loadVouchers();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gutscheine</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Geschenkgutscheine und deren Guthaben. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditVoucher(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neuer Gutschein
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Gutscheincode oder Kunde suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editVoucher ? 'Gutschein bearbeiten' : 'Neuer Gutschein'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">Gutscheincode *</Label>
                  <div className="flex gap-2">
                    <Input id="code" name="code" placeholder="XXXX-XXXX-XXXX-XXXX"
                      defaultValue={editVoucher?.code || generateCode()} required className="font-mono" />
                    {!editVoucher && (
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => {
                          const input = document.getElementById('code') as HTMLInputElement;
                          if (input) input.value = generateCode();
                        }}>
                        Neu generieren
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" name="currency" placeholder="EUR" defaultValue={editVoucher?.currency || 'EUR'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialValue">Guthaben (€) *</Label>
                  <Input id="initialValue" name="initialValue" type="number" step="0.01" placeholder="50.00"
                    defaultValue={editVoucher ? (editVoucher.initialValue / 100).toFixed(2) : ''} required />
                </div>
                {editVoucher && (
                  <div className="space-y-2">
                    <Label htmlFor="currentBalance">Restwert (€)</Label>
                    <Input id="currentBalance" name="currentBalance" type="number" step="0.01" placeholder="50.00"
                      defaultValue={(editVoucher.currentBalance / 100).toFixed(2)} />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Gültig bis</Label>
                  <Input id="expiresAt" name="expiresAt" type="datetime-local"
                    defaultValue={editVoucher?.expiresAt ? new Date(editVoucher.expiresAt).toISOString().slice(0, 16) : ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Kundenname</Label>
                  <Input id="customerName" name="customerName" placeholder="Max Mustermann"
                    defaultValue={editVoucher?.customerName ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Kunden-E-Mail</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" placeholder="max@example.com"
                    defaultValue={editVoucher?.customerEmail ?? ''} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editVoucher ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditVoucher(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Gutscheine…</div>
      ) : vouchers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Gutscheine</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deinen ersten Geschenkgutschein.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {vouchers.map((voucher) => (
            <Card key={voucher.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{voucher.code}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyCode(voucher.code)} title="Code kopieren">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Badge variant={STATUS_VARIANT[voucher.status]}>{STATUS_LABELS[voucher.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Guthaben: {(voucher.initialValue / 100).toFixed(2)} {voucher.currency}
                      {' · '}Restwert: {(voucher.currentBalance / 100).toFixed(2)} {voucher.currency}
                      {voucher.customerName && ` · ${voucher.customerName}`}
                      {voucher.expiresAt && ` · bis ${new Date(voucher.expiresAt).toLocaleDateString('de-DE')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(voucher)}>
                    {voucher.status === 'ACTIVE' ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditVoucher(voucher); setShowForm(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(voucher.id)}>
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
