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
  Globe,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';


interface TaxZone {
  id: string;
  name: string;
  country: string;
  state?: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function WorkspaceTaxZonesPage() {
  const params = useParams<{ workspaceId: string }>();
  const [taxZones, setTaxZones] = useState<TaxZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editZone, setEditZone] = useState<TaxZone | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/tax-zones`;

  const loadTaxZones = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) { console.error('Tax zones API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setTaxZones(data.taxZones || []);
    } catch (err) {
      console.error('Failed to load tax zones:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadTaxZones();
  }, [loadTaxZones]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Steuerzone wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadTaxZones();
  }

  async function handleToggleActive(zone: TaxZone) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${zone.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !zone.isActive }),
    });
    loadTaxZones();
  }

  async function handleSetDefault(zone: TaxZone) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${zone.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDefault: true }),
    });
    loadTaxZones();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      country: form.get('country') as string,
      state: (form.get('state') as string) || null,
      rate: parseFloat(form.get('rate') as string),
      isDefault: form.get('isDefault') === 'on',
      isActive: true,
    };

    if (editZone) {
      await fetch(`${baseUrl}/${editZone.id}`, {
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
    setEditZone(null);
    loadTaxZones();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Steuerzonen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Steuersätze für verschiedene Regionen und Länder.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditZone(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Steuerzone
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editZone ? 'Steuerzone bearbeiten' : 'Neue Steuerzone'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="z. B. Deutschland Standard" defaultValue={editZone?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Land *</Label>
                  <Input id="country" name="country" placeholder="z. B. DE" defaultValue={editZone?.country} required />
                  <p className="text-xs text-muted-foreground">ISO-Ländercode (z. B. DE, AT, CH)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Bundesland / Region</Label>
                  <Input id="state" name="state" placeholder="z. B. BY" defaultValue={editZone?.state ?? ''} />
                  <p className="text-xs text-muted-foreground">Optional. Leer lassen für landesweiten Steuersatz.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Steuersatz (%) *</Label>
                  <Input id="rate" name="rate" type="number" step="0.01" placeholder="19.00" defaultValue={editZone?.rate} required />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  defaultChecked={editZone?.isDefault ?? false}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="isDefault" className="text-sm font-normal">
                  Als Standard-Steuerzone festlegen
                </Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editZone ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditZone(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Steuerzonen…</div>
      ) : taxZones.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Steuerzonen</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste Steuerzone für die Steuerberechnung.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {taxZones.map((zone) => (
            <Card key={zone.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{zone.name}</p>
                      <Badge variant={zone.isActive ? 'default' : 'secondary'}>
                        {zone.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                      {zone.isDefault && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" /> Standard
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {zone.country}{zone.state ? ` / ${zone.state}` : ''} · Steuersatz: {zone.rate}%
                      {' · '}Erstellt am {new Date(zone.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!zone.isDefault && (
                    <Button size="sm" variant="ghost" onClick={() => handleSetDefault(zone)}>
                      Als Standard
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(zone)}>
                    {zone.isActive ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditZone(zone); setShowForm(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(zone.id)}>
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
