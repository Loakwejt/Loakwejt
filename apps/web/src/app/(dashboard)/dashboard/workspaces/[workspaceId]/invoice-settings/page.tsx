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
  Settings,
  Save,
  AlertCircle,
  Building,
  CreditCard,
} from 'lucide-react';


interface InvoiceSettings {
  id: string;
  prefix: string;
  nextNumber: number;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  taxNumber: string;
  vatId: string;
  defaultPaymentTermsDays: number;
  bankName: string;
  iban: string;
  bic: string;
  footerText: string;
}

const DEFAULT_SETTINGS: Omit<InvoiceSettings, 'id'> = {
  prefix: 'INV',
  nextNumber: 1,
  companyName: '',
  companyAddress: '',
  companyEmail: '',
  taxNumber: '',
  vatId: '',
  defaultPaymentTermsDays: 14,
  bankName: '',
  iban: '',
  bic: '',
  footerText: '',
};

export default function WorkspaceInvoiceSettingsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const baseUrl = `/api/workspaces/${params.workspaceId}/invoice-settings`;

  const loadSettings = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) {
        if (res.status === 404) {
          setSettings({ id: '', ...DEFAULT_SETTINGS });
          return;
        }
        console.error('Invoice settings API error:', res.status);
        return;
      }
      const text = await res.text();
      if (!text) {
        setSettings({ id: '', ...DEFAULT_SETTINGS });
        return;
      }
      const data = JSON.parse(text);
      setSettings(data.settings || data);
    } catch (err) {
      console.error('Failed to load invoice settings:', err);
      setSettings({ id: '', ...DEFAULT_SETTINGS });
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    setSaving(true);
    setSaved(false);
    const form = new FormData(e.currentTarget);
    const body = {
      prefix: form.get('prefix') as string,
      nextNumber: parseInt(form.get('nextNumber') as string) || 1,
      companyName: form.get('companyName') as string,
      companyAddress: form.get('companyAddress') as string,
      companyEmail: form.get('companyEmail') as string,
      taxNumber: form.get('taxNumber') as string,
      vatId: form.get('vatId') as string,
      defaultPaymentTermsDays: parseInt(form.get('defaultPaymentTermsDays') as string) || 14,
      bankName: form.get('bankName') as string,
      iban: form.get('iban') as string,
      bic: form.get('bic') as string,
      footerText: form.get('footerText') as string,
    };

    try {
      const res = await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings || data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save invoice settings:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <div className="p-8 text-center text-muted-foreground">Lade Einstellungen…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rechnungseinstellungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Konfiguriere Firmendaten, Bankverbindung und Rechnungsnummern.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Numbering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Rechnungsnummern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prefix">Rechnungspräfix</Label>
                <Input id="prefix" name="prefix" placeholder="INV"
                  defaultValue={settings.prefix} />
                <p className="text-xs text-muted-foreground">z.B. &quot;INV&quot; → INV-0001</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextNumber">Nächste Rechnungsnummer</Label>
                <Input id="nextNumber" name="nextNumber" type="number" min="1"
                  defaultValue={settings.nextNumber} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultPaymentTermsDays">Zahlungsziel (Tage)</Label>
                <Input id="defaultPaymentTermsDays" name="defaultPaymentTermsDays" type="number" min="0"
                  defaultValue={settings.defaultPaymentTermsDays} />
                <p className="text-xs text-muted-foreground">Standard-Zahlungsfrist in Tagen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" /> Firmendaten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmenname *</Label>
                <Input id="companyName" name="companyName" placeholder="Meine Firma GmbH"
                  defaultValue={settings.companyName} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Firmen-E-Mail *</Label>
                <Input id="companyEmail" name="companyEmail" type="email" placeholder="rechnung@meinefirma.de"
                  defaultValue={settings.companyEmail} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyAddress">Firmenadresse *</Label>
                <Textarea id="companyAddress" name="companyAddress" placeholder="Straße, PLZ, Ort"
                  defaultValue={settings.companyAddress} required rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Steuernummer</Label>
                <Input id="taxNumber" name="taxNumber" placeholder="12/345/67890"
                  defaultValue={settings.taxNumber} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatId">USt-IdNr.</Label>
                <Input id="vatId" name="vatId" placeholder="DE123456789"
                  defaultValue={settings.vatId} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Bankverbindung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bankname</Label>
                <Input id="bankName" name="bankName" placeholder="Sparkasse Musterstadt"
                  defaultValue={settings.bankName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" name="iban" placeholder="DE89 3704 0044 0532 0130 00"
                  defaultValue={settings.iban} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC</Label>
                <Input id="bic" name="bic" placeholder="COBADEFFXXX"
                  defaultValue={settings.bic} className="font-mono" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <Card>
          <CardHeader>
            <CardTitle>Fußzeile / Hinweise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="footerText">Fußtext auf Rechnungen</Label>
              <Textarea id="footerText" name="footerText" rows={4}
                placeholder="Vielen Dank für Ihren Einkauf. Bitte überweisen Sie den Betrag innerhalb der angegebenen Frist."
                defaultValue={settings.footerText} />
              <p className="text-xs text-muted-foreground">Wird am Ende jeder Rechnung angezeigt.</p>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Speichere…' : 'Einstellungen speichern'}
          </Button>
          {saved && (
            <Badge variant="default" className="bg-green-600">Gespeichert!</Badge>
          )}
        </div>
      </form>
    </div>
  );
}
