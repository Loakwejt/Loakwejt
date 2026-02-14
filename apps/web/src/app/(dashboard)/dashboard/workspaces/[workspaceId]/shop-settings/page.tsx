'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
} from '@builderly/ui';
import {
  Settings,
  Save,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface ShopSettingsData {
  currency: string;
  taxRate: number;
  taxIncluded: boolean;
  requireAccount: boolean;
  enableGuestCheckout: boolean;
  orderNotifyEmail?: string;
  termsUrl?: string;
  privacyUrl?: string;
  returnPolicyUrl?: string;
  imprintUrl?: string;
  shopName?: string;
  shopLogo?: string;
}

export default function WorkspaceShopSettingsPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [settings, setSettings] = useState<ShopSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/shop-settings`
    : null;

  const loadSettings = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) { console.error('Shop settings API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setSettings(data.settings || null);
    } catch (err) {
      console.error('Failed to load shop settings:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (activeSiteId) loadSettings();
  }, [activeSiteId, loadSettings]);

  async function handleSave() {
    if (!baseUrl || !settings) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function update(partial: Partial<ShopSettingsData>) {
    setSettings((prev) => prev ? { ...prev, ...partial } : null);
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
            <p className="text-sm text-muted-foreground mt-1">Erstelle zunächst eine Site, um die Shop-Einstellungen zu konfigurieren.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || !settings) {
    return <div className="p-8 text-center text-muted-foreground">Lade Shop-Einstellungen…</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shop-Einstellungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Grundkonfiguration deines Online-Shops.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 1 && (
            <WorkspaceSiteSelector sites={sites} activeSiteId={activeSiteId!} onSelect={setActiveSiteId} />
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saved ? 'Gespeichert!' : 'Speichern'}
          </Button>
        </div>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allgemein</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Shopname</Label>
              <Input placeholder="Mein Shop" value={settings.shopName || ''} onChange={(e) => update({ shopName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Shop-Logo URL</Label>
              <Input placeholder="https://..." value={settings.shopLogo || ''} onChange={(e) => update({ shopLogo: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Währung</Label>
              <select
                value={settings.currency}
                onChange={(e) => update({ currency: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (Fr.)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Benachrichtigungs-E-Mail</Label>
              <Input type="email" placeholder="shop@firma.de" value={settings.orderNotifyEmail || ''}
                onChange={(e) => update({ orderNotifyEmail: e.target.value })} />
              <p className="text-xs text-muted-foreground">E-Mail für neue Bestellbenachrichtigungen.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Steuern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Standard-Steuersatz (%)</Label>
              <Input type="number" step="0.1" value={settings.taxRate} onChange={(e) => update({ taxRate: parseFloat(e.target.value) })} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={settings.taxIncluded} onCheckedChange={(v) => update({ taxIncluded: v })} />
              <Label>Preise inkl. MwSt.</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Gast-Checkout erlauben</p>
              <p className="text-sm text-muted-foreground">Kunden können ohne Konto bestellen.</p>
            </div>
            <Switch checked={settings.enableGuestCheckout} onCheckedChange={(v) => update({ enableGuestCheckout: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Konto erforderlich</p>
              <p className="text-sm text-muted-foreground">Kunden müssen sich registrieren, um zu bestellen.</p>
            </div>
            <Switch checked={settings.requireAccount} onCheckedChange={(v) => update({ requireAccount: v })} />
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rechtliches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>AGB-URL</Label>
              <Input placeholder="https://..." value={settings.termsUrl || ''} onChange={(e) => update({ termsUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Datenschutz-URL</Label>
              <Input placeholder="https://..." value={settings.privacyUrl || ''} onChange={(e) => update({ privacyUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Widerrufsbelehrung-URL</Label>
              <Input placeholder="https://..." value={settings.returnPolicyUrl || ''} onChange={(e) => update({ returnPolicyUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Impressum-URL</Label>
              <Input placeholder="https://..." value={settings.imprintUrl || ''} onChange={(e) => update({ imprintUrl: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
