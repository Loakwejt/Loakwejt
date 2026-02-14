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
  Separator,
} from '@builderly/ui';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string };
}

interface Order {
  id: string;
  email: string;
  name?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ausstehend',
  PAID: 'Bezahlt',
  SHIPPED: 'Versendet',
  DELIVERED: 'Geliefert',
  CANCELLED: 'Storniert',
  REFUNDED: 'Erstattet',
};

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  PAID: 'default',
  SHIPPED: 'default',
  DELIVERED: 'secondary',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

export default function WorkspaceOrdersPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/orders`
    : null;

  async function loadOrders() {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Orders API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeSiteId) loadOrders();
  }, [activeSiteId, page, statusFilter]);

  async function handleUpdateStatus(orderId: string, status: string) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  }

  function formatPrice(cents: number) {
    return `€${(cents / 100).toFixed(2)}`;
  }

  if (sitesLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bestellungen</h1>
        <p className="text-muted-foreground mt-2">Laden...</p>
      </div>
    );
  }

  if (!hasSites) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bestellungen</h1>
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Keine Site vorhanden</h3>
            <p className="text-sm text-muted-foreground">Erstelle zuerst eine Site, um Bestellungen zu sehen.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <WorkspaceSiteSelector
        sites={sites}
        activeSiteId={activeSiteId!}
        onSelect={setActiveSiteId}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bestellungen</h1>
          <p className="text-muted-foreground">{total} Bestellung{total !== 1 ? 'en' : ''} insgesamt</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setStatusFilter(s); setPage(1); }}
          >
            {s ? STATUS_LABELS[s] : 'Alle'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-muted-foreground">Laden...</p>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">Keine Bestellungen</h3>
                <p className="text-sm text-muted-foreground">Noch keine Bestellungen eingegangen.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-muted-foreground">
                    <th className="p-3 font-medium">Bestellung</th>
                    <th className="p-3 font-medium">Kunde</th>
                    <th className="p-3 font-medium">Summe</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className={`border-b last:border-0 hover:bg-muted/50 cursor-pointer ${selectedOrder?.id === o.id ? 'bg-muted/50' : ''}`}
                      onClick={() => setSelectedOrder(o)}
                    >
                      <td className="p-3 font-mono text-xs">{o.id.slice(-8)}</td>
                      <td className="p-3">
                        <div className="font-medium">{o.name || '–'}</div>
                        <div className="text-xs text-muted-foreground">{o.email}</div>
                      </td>
                      <td className="p-3 font-mono">{formatPrice(o.total)}</td>
                      <td className="p-3">
                        <Badge variant={STATUS_COLORS[o.status] || 'outline'}>
                          {STATUS_LABELS[o.status] || o.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString('de-DE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 20 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Zurück
              </Button>
              <span className="text-sm text-muted-foreground">
                Seite {page} von {Math.ceil(total / 20)}
              </span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>
                Weiter
              </Button>
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div>
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Bestelldetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-mono text-xs">{selectedOrder.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kunde</span>
                    <span>{selectedOrder.name || selectedOrder.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">E-Mail</span>
                    <span className="text-xs">{selectedOrder.email}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MwSt.</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                  )}
                  {selectedOrder.shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Versand</span>
                      <span>{formatPrice(selectedOrder.shipping)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Gesamt</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Artikel</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product?.name || '–'} × {item.quantity}</span>
                        <span className="font-mono">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Status ändern</h4>
                  <div className="flex flex-wrap gap-1">
                    {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].map((s) => (
                      <Button
                        key={s}
                        variant={selectedOrder.status === s ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      >
                        {STATUS_LABELS[s]}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">Wähle eine Bestellung aus, um Details zu sehen.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
