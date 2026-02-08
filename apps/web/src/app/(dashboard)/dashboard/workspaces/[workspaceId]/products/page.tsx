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
  Input,
  Label,
  Checkbox,
} from '@builderly/ui';
import {
  Plus,
  Search,
  Package,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  sku?: string;
  barcode?: string;
  inventory: number;
  weight?: number;
  vendor?: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function WorkspaceProductsPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/products`
    : null;

  async function loadProducts() {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) {
        console.error('Products API error:', res.status, res.statusText);
        return;
      }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (activeSiteId) loadProducts();
  }, [activeSiteId, page, search]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Produkt wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadProducts();
  }

  async function handleToggleActive(product: Product) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    loadProducts();
  }

  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    
    const compareAtPriceValue = form.get('compareAtPrice') as string;
    const weightValue = form.get('weight') as string;
    const tagsValue = form.get('tags') as string;
    
    const body = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      description: form.get('description') as string,
      price: Math.round(parseFloat(form.get('price') as string) * 100),
      compareAtPrice: compareAtPriceValue ? Math.round(parseFloat(compareAtPriceValue) * 100) : undefined,
      currency: 'EUR',
      sku: form.get('sku') as string || undefined,
      barcode: form.get('barcode') as string || undefined,
      inventory: parseInt(form.get('inventory') as string) || 0,
      weight: weightValue ? parseFloat(weightValue) : undefined,
      vendor: form.get('vendor') as string || undefined,
      tags: tagsValue ? tagsValue.split(',').map(t => t.trim()).filter(t => t) : [],
      isActive: true,
      isFeatured: form.get('isFeatured') === 'on',
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

  if (sitesLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Produkte</h1>
        <p className="text-muted-foreground mt-2">Laden...</p>
      </div>
    );
  }

  if (!hasSites) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Produkte</h1>
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Keine Site vorhanden</h3>
            <p className="text-sm text-muted-foreground">Erstelle zuerst eine Site, um Produkte zu verwalten.</p>
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
                <Label>Vergleichspreis (€)</Label>
                <Input name="compareAtPrice" type="number" step="0.01" defaultValue={editProduct?.compareAtPrice ? (editProduct.compareAtPrice / 100).toFixed(2) : ''} placeholder="Optional" />
              </div>
              <div>
                <Label>SKU</Label>
                <Input name="sku" defaultValue={editProduct?.sku || ''} />
              </div>
              <div>
                <Label>Barcode</Label>
                <Input name="barcode" defaultValue={editProduct?.barcode || ''} placeholder="EAN/UPC/GTIN" />
              </div>
              <div>
                <Label>Bestand</Label>
                <Input name="inventory" type="number" defaultValue={editProduct?.inventory || 0} />
              </div>
              <div>
                <Label>Gewicht (g)</Label>
                <Input name="weight" type="number" step="0.01" defaultValue={editProduct?.weight || ''} placeholder="Optional" />
              </div>
              <div>
                <Label>Hersteller/Marke</Label>
                <Input name="vendor" defaultValue={editProduct?.vendor || ''} placeholder="Optional" />
              </div>
              <div>
                <Label>Tags (kommagetrennt)</Label>
                <Input name="tags" defaultValue={editProduct?.tags?.join(', ') || ''} placeholder="z.B. Sale, Neu, Featured" />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox id="isFeatured" name="isFeatured" defaultChecked={editProduct?.isFeatured || false} />
                <Label htmlFor="isFeatured" className="cursor-pointer">Als Featured-Produkt markieren</Label>
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
        <div className="rounded-lg border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Produkt</th>
                <th className="p-3 font-medium">Preis</th>
                <th className="p-3 font-medium">SKU</th>
                <th className="p-3 font-medium">Barcode</th>
                <th className="p-3 font-medium">Bestand</th>
                <th className="p-3 font-medium">Gewicht</th>
                <th className="p-3 font-medium">Hersteller</th>
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
                        <div className="font-medium flex items-center gap-2">
                          {p.name}
                          {p.isFeatured && (
                            <Badge variant="default" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{p.slug}</div>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {p.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono">€{(p.price / 100).toFixed(2)}</div>
                    {p.compareAtPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        €{(p.compareAtPrice / 100).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-muted-foreground">{p.sku || '—'}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-muted-foreground font-mono text-xs">{p.barcode || '—'}</span>
                  </td>
                  <td className="p-3">{p.inventory}</td>
                  <td className="p-3">
                    <span className="text-muted-foreground">{p.weight ? `${p.weight}g` : '—'}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-muted-foreground">{p.vendor || '—'}</span>
                  </td>
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
