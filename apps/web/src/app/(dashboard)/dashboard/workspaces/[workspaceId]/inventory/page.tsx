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
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';


interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
  reference?: string;
  createdAt: string;
  createdBy?: string;
}

const TYPE_LABELS: Record<string, string> = {
  IN: 'Eingang',
  OUT: 'Ausgang',
  ADJUSTMENT: 'Korrektur',
};

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  IN: 'default',
  OUT: 'destructive',
  ADJUSTMENT: 'secondary',
};

const TYPE_ICONS: Record<string, typeof ArrowDownCircle> = {
  IN: ArrowDownCircle,
  OUT: ArrowUpCircle,
  ADJUSTMENT: RefreshCw,
};

export default function WorkspaceInventoryPage() {
  const params = useParams<{ workspaceId: string }>();
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const baseUrl = `/api/workspaces/${params.workspaceId}/inventory`;

  const loadMovements = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (typeFilter) qs.set('type', typeFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Inventory API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setMovements(data.movements || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load inventory movements:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, typeFilter]);

  useEffect(() => {
    loadMovements();
  }, [search, typeFilter, loadMovements]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Lagerbewegung wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadMovements();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      productId: form.get('productId') as string,
      type: form.get('type') as string,
      quantity: parseInt(form.get('quantity') as string),
      reason: (form.get('reason') as string) || null,
      reference: (form.get('reference') as string) || null,
    };

    await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    loadMovements();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lagerverwaltung</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verfolge Bestandsbewegungen und erstelle manuelle Anpassungen. {total > 0 && `(${total} Bewegungen)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Bewegung
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Produkt suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle Typen</option>
          <option value="IN">Eingang</option>
          <option value="OUT">Ausgang</option>
          <option value="ADJUSTMENT">Korrektur</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Neue Lagerbewegung</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productId">Produkt-ID *</Label>
                  <Input id="productId" name="productId" placeholder="Produkt-ID eingeben" required />
                  <p className="text-xs text-muted-foreground">Die ID des Produkts aus dem Produktkatalog.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Bewegungstyp *</Label>
                  <select
                    id="type"
                    name="type"
                    defaultValue="IN"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="IN">Eingang</option>
                    <option value="OUT">Ausgang</option>
                    <option value="ADJUSTMENT">Korrektur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Menge *</Label>
                  <Input id="quantity" name="quantity" type="number" placeholder="10" required />
                  <p className="text-xs text-muted-foreground">Positive Zahl für Zugang, negative für Abgang bei Korrektur.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Referenz</Label>
                  <Input id="reference" name="reference" placeholder="z. B. Bestellnummer, Lieferschein" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Grund / Bemerkung</Label>
                <Textarea id="reason" name="reason" rows={2} placeholder="z. B. Wareneingang Lieferant, Inventur-Korrektur" />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Bewegung erfassen</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Lagerbewegungen…</div>
      ) : movements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Lagerbewegungen</p>
            <p className="text-sm text-muted-foreground mt-1">Erfasse die erste Bestandsbewegung für dein Lager.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {movements.map((movement) => {
            const Icon = TYPE_ICONS[movement.type] || Package;
            return (
              <Card key={movement.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{movement.productName}</p>
                        <Badge variant={TYPE_VARIANT[movement.type]}>
                          {TYPE_LABELS[movement.type]}
                        </Badge>
                        <span className={`font-mono font-bold text-sm ${movement.type === 'OUT' ? 'text-destructive' : 'text-green-600'}`}>
                          {movement.type === 'OUT' ? '-' : '+'}{Math.abs(movement.quantity)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movement.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        {movement.reason && ` · ${movement.reason}`}
                        {movement.reference && ` · Ref: ${movement.reference}`}
                        {movement.createdBy && ` · von ${movement.createdBy}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(movement.id)}>
                      Löschen
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
