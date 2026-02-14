'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Separator,
} from '@builderly/ui';
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  sku?: string;
  inventory: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const params = useParams<{ workspaceId: string; siteId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/sites/${params.siteId}/products`;

  async function loadProducts() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, [page, search]);

  async function handleDelete(id: string) {
    if (!confirm('Produkt wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadProducts();
  }

  async function handleToggleActive(product: Product) {
    await fetch(`${baseUrl}/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    loadProducts();
  }

  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      description: form.get('description') as string,
      price: Math.round(parseFloat(form.get('price') as string) * 100),
      currency: 'EUR',
      sku: form.get('sku') as string || undefined,
      inventory: parseInt(form.get('inventory') as string) || 0,
      isActive: true,
    };

    if (editProduct) {
      await fetch(`${baseUrl}/${editProduct.id}`, {
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
    setEditProduct(null);
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produkte</h1>
          <p className="text-muted-foreground">{total} Produkt{total !== 1 ? 'e' : ''} insgesamt</p>
        </div>
        <Button onClick={() => { setEditProduct(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Produkt hinzufügen
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Produkte suchen..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      {/* Product Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" required defaultValue={editProduct?.name || ''} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input name="slug" required defaultValue={editProduct?.slug || ''} />
              </div>
              <div className="col-span-2">
                <Label>Beschreibung</Label>
                <Input name="description" defaultValue={editProduct?.description || ''} />
              </div>
              <div>
                <Label>Preis (€)</Label>
                <Input name="price" type="number" step="0.01" required defaultValue={editProduct ? (editProduct.price / 100).toFixed(2) : ''} />
              </div>
              <div>
                <Label>SKU</Label>
                <Input name="sku" defaultValue={editProduct?.sku || ''} />
              </div>
              <div>
                <Label>Bestand</Label>
                <Input name="inventory" type="number" defaultValue={editProduct?.inventory || 0} />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit">{editProduct ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditProduct(null); }}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Product List */}
      {loading ? (
        <p className="text-muted-foreground">Laden...</p>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Keine Produkte</h3>
            <p className="text-sm text-muted-foreground mb-4">Erstelle dein erstes Produkt, um loszulegen.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Produkt hinzufügen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Produkt</th>
                <th className="p-3 font-medium">Preis</th>
                <th className="p-3 font-medium">Bestand</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono">€{(p.price / 100).toFixed(2)}</td>
                  <td className="p-3">{p.inventory}</td>
                  <td className="p-3">
                    <Badge variant={p.isActive ? 'default' : 'secondary'}>
                      {p.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(p)}
                        title={p.isActive ? 'Deaktivieren' : 'Aktivieren'}
                      >
                        {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditProduct(p); setShowForm(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
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
  );
}
