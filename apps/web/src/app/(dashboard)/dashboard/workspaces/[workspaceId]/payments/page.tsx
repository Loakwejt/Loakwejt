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
} from '@builderly/ui';
import {
  Plus,
  CreditCard,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface PaymentMethodItem {
  id: string;
  name: string;
  provider: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

const PROVIDER_LABELS: Record<string, string> = {
  STRIPE: 'Stripe (Kreditkarte)',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Banküberweisung',
  CASH_ON_DELIVERY: 'Nachnahme',
  INVOICE: 'Rechnung',
  MANUAL: 'Manuell',
};

export default function WorkspacePaymentMethodsPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [methods, setMethods] = useState<PaymentMethodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMethod, setEditMethod] = useState<PaymentMethodItem | null>(null);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/payment-methods`
    : null;

  const loadMethods = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) { console.error('Payment methods API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setMethods(data.methods || []);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (activeSiteId) loadMethods();
  }, [activeSiteId, loadMethods]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Zahlungsmethode wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadMethods();
  }

  async function handleToggleActive(method: PaymentMethodItem) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${method.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !method.isActive }),
    });
    loadMethods();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      provider: form.get('provider') as string,
      description: form.get('description') as string || null,
      isActive: true,
    };

    if (editMethod) {
      await fetch(`${baseUrl}/${editMethod.id}`, {
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
    setEditMethod(null);
    loadMethods();
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
            <p className="text-sm text-muted-foreground mt-1">Erstelle zunächst eine Site, um Zahlungsmethoden zu verwalten.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Zahlungsmethoden</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Konfiguriere, wie deine Kunden bezahlen können.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 1 && (
            <WorkspaceSiteSelector sites={sites} activeSiteId={activeSiteId!} onSelect={setActiveSiteId} />
          )}
          <Button onClick={() => { setEditMethod(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Methode hinzufügen
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editMethod ? 'Methode bearbeiten' : 'Neue Zahlungsmethode'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Anzeigename *</Label>
                  <Input id="name" name="name" placeholder="z. B. Kreditkarte" defaultValue={editMethod?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Zahlungsanbieter *</Label>
                  <select
                    id="provider"
                    name="provider"
                    defaultValue={editMethod?.provider || 'STRIPE'}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Input id="description" name="description" placeholder="Zeige Info beim Checkout an"
                  defaultValue={editMethod?.description ?? ''} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editMethod ? 'Speichern' : 'Hinzufügen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditMethod(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Zahlungsmethoden…</div>
      ) : methods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Zahlungsmethoden</p>
            <p className="text-sm text-muted-foreground mt-1">Füge mindestens eine Zahlungsmethode hinzu, damit Kunden bezahlen können.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.name}</p>
                      <Badge variant={method.isActive ? 'default' : 'secondary'}>
                        {method.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {PROVIDER_LABELS[method.provider] || method.provider}
                      {method.description && ` · ${method.description}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(method)}>
                    {method.isActive ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditMethod(method); setShowForm(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(method.id)}>
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
