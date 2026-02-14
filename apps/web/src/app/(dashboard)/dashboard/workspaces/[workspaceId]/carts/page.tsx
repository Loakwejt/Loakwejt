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
  Search,
  ShoppingCart,
  AlertCircle,
  Clock,
  User,
  Eye,
} from 'lucide-react';


interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Cart {
  id: string;
  sessionId: string;
  customerEmail?: string;
  items: CartItem[];
  subtotal: number;
  currency: string;
  status: 'ACTIVE' | 'ABANDONED' | 'CONVERTED';
  lastActivityAt: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktiv',
  ABANDONED: 'Verlassen',
  CONVERTED: 'Bestellt',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  ABANDONED: 'destructive',
  CONVERTED: 'secondary',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
}

export default function WorkspaceCartsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [detailCart, setDetailCart] = useState<Cart | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/carts`;

  const loadCarts = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Carts API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setCarts(data.carts || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load carts:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadCarts();
  }, [search, statusFilter, loadCarts]);

  const activeCarts = carts.filter((c) => c.status === 'ACTIVE');
  const abandonedCarts = carts.filter((c) => c.status === 'ABANDONED');
  const convertedCarts = carts.filter((c) => c.status === 'CONVERTED');

  const totalAbandonedValue = abandonedCarts.reduce((sum, c) => sum + c.subtotal, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Warenkörbe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Übersicht über aktive und verlassene Warenkörbe. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktive Warenkörbe</p>
                <p className="text-2xl font-bold">{activeCarts.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verlassene Warenkörbe</p>
                <p className="text-2xl font-bold">{abandonedCarts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entgangener Umsatz</p>
                <p className="text-2xl font-bold">{(totalAbandonedValue / 100).toFixed(2)} €</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kunde oder Session suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle Warenkörbe</option>
          <option value="ACTIVE">Aktive Warenkörbe</option>
          <option value="ABANDONED">Verlassene Warenkörbe</option>
          <option value="CONVERTED">Bestellte Warenkörbe</option>
        </select>
      </div>

      {/* Detail View */}
      {detailCart && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Warenkorb-Details</span>
              <Button size="sm" variant="ghost" onClick={() => setDetailCart(null)}>Schließen</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-muted-foreground">Session-ID:</span>{' '}
                <span className="font-mono text-xs">{detailCart.sessionId}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Kunde:</span>{' '}
                {detailCart.customerEmail || 'Gast'}
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{' '}
                <Badge variant={STATUS_VARIANT[detailCart.status]}>{STATUS_LABELS[detailCart.status]}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Letzte Aktivität:</span>{' '}
                {timeAgo(detailCart.lastActivityAt)}
              </div>
            </div>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted text-xs font-medium text-muted-foreground">
                <span>Produkt</span>
                <span className="text-right">Menge</span>
                <span className="text-right">Preis</span>
                <span className="text-right">Gesamt</span>
              </div>
              {(detailCart.items || []).map((item, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0 text-sm">
                  <span>{item.productName}</span>
                  <span className="text-right">{item.quantity}</span>
                  <span className="text-right">{(item.price / 100).toFixed(2)} €</span>
                  <span className="text-right font-medium">{((item.price * item.quantity) / 100).toFixed(2)} €</span>
                </div>
              ))}
              <div className="grid grid-cols-4 gap-4 p-3 bg-muted text-sm font-bold">
                <span className="col-span-3 text-right">Zwischensumme:</span>
                <span className="text-right">{(detailCart.subtotal / 100).toFixed(2)} {detailCart.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Warenkörbe…</div>
      ) : carts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Warenkörbe</p>
            <p className="text-sm text-muted-foreground mt-1">Warenkörbe von Besuchern werden hier angezeigt.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {carts.map((cart) => (
            <Card key={cart.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {cart.customerEmail || 'Gast'}
                      </span>
                      <Badge variant={STATUS_VARIANT[cart.status]}>{STATUS_LABELS[cart.status]}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(cart.items || []).length} Artikel
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(cart.subtotal / 100).toFixed(2)} {cart.currency}
                      {' · '}Letzte Aktivität: {timeAgo(cart.lastActivityAt)}
                      {' · '}Erstellt: {new Date(cart.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setDetailCart(cart)}>
                    <Eye className="h-4 w-4" />
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
