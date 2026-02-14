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
  Truck,
  Edit,
  Trash2,
} from 'lucide-react';


interface ShippingMethodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  freeAbove?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  countries: string[];
  maxWeight?: number;
  sortOrder: number;
  isActive: boolean;
}

export default function WorkspaceShippingPage() {
  const params = useParams<{ workspaceId: string }>();
  const [methods, setMethods] = useState<ShippingMethodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMethod, setEditMethod] = useState<ShippingMethodItem | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/shipping-methods`;

  const loadMethods = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) { console.error('Shipping methods API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setMethods(data.methods || []);
    } catch (err) {
      console.error('Failed to load shipping methods:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadMethods();
  }, [loadMethods]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Versandmethode wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadMethods();
  }

  async function handleToggleActive(method: ShippingMethodItem) {
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
      description: form.get('description') as string || null,
      price: Math.round(parseFloat(form.get('price') as string || '0') * 100),
      freeAbove: form.get('freeAbove') ? Math.round(parseFloat(form.get('freeAbove') as string) * 100) : null,
      estimatedDaysMin: form.get('estimatedDaysMin') ? parseInt(form.get('estimatedDaysMin') as string) : 3,
      estimatedDaysMax: form.get('estimatedDaysMax') ? parseInt(form.get('estimatedDaysMax') as string) : 5,
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Versandoptionen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Definiere Versandmethoden, Preise und Lieferzeiten.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditMethod(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Versandmethode hinzufügen
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editMethod ? 'Versandmethode bearbeiten' : 'Neue Versandmethode'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="z. B. Standardversand" defaultValue={editMethod?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preis (€) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="4.99"
                    defaultValue={editMethod ? (editMethod.price / 100).toFixed(2) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeAbove">Kostenlos ab (€)</Label>
                  <Input id="freeAbove" name="freeAbove" type="number" step="0.01" placeholder="z. B. 50.00"
                    defaultValue={editMethod?.freeAbove ? (editMethod.freeAbove / 100).toFixed(2) : ''} />
                </div>
                <div className="space-y-2">
                  <Label>Lieferzeit (Tage)</Label>
                  <div className="flex items-center gap-2">
                    <Input name="estimatedDaysMin" type="number" placeholder="3" className="w-20"
                      defaultValue={editMethod?.estimatedDaysMin ?? 3} />
                    <span className="text-muted-foreground">–</span>
                    <Input name="estimatedDaysMax" type="number" placeholder="5" className="w-20"
                      defaultValue={editMethod?.estimatedDaysMax ?? 5} />
                    <span className="text-sm text-muted-foreground">Werktage</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Input id="description" name="description" placeholder="z. B. DHL Paket, Deutsche Post"
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
        <div className="text-center py-12 text-muted-foreground">Lade Versandmethoden…</div>
      ) : methods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Versandmethoden</p>
            <p className="text-sm text-muted-foreground mt-1">Füge Versandoptionen hinzu, damit Kunden eine Liefermethode wählen können.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {methods.map((method) => (
            <Card key={method.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.name}</p>
                      <Badge variant={method.isActive ? 'default' : 'secondary'}>
                        {method.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(method.price / 100).toFixed(2)} €
                      {method.freeAbove && ` · Kostenlos ab ${(method.freeAbove / 100).toFixed(2)} €`}
                      {method.estimatedDaysMin && method.estimatedDaysMax && ` · ${method.estimatedDaysMin}–${method.estimatedDaysMax} Werktage`}
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
