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
  FileText,
  Edit,
  Trash2,
  AlertCircle,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';


interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  validUntil: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  notes?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  SENT: 'Versendet',
  ACCEPTED: 'Angenommen',
  REJECTED: 'Abgelehnt',
  EXPIRED: 'Abgelaufen',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  DRAFT: 'secondary',
  SENT: 'default',
  ACCEPTED: 'default',
  REJECTED: 'destructive',
  EXPIRED: 'destructive',
};

export default function WorkspaceQuotesPage() {
  const params = useParams<{ workspaceId: string }>();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState(19);

  const baseUrl = `/api/workspaces/${params.workspaceId}/quotes`;

  const loadQuotes = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Quotes API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setQuotes(data.quotes || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadQuotes();
  }, [search, statusFilter, loadQuotes]);

  function recalcLineItems(items: LineItem[]): LineItem[] {
    return items.map((item) => ({ ...item, total: item.quantity * item.unitPrice }));
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(recalcLineItems(updated));
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  }

  function removeLineItem(index: number) {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = Math.round(subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Angebot wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadQuotes();
  }

  async function handleStatusChange(id: string, status: string, extra: Record<string, string> = {}) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    });
    loadQuotes();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      quoteNumber: form.get('quoteNumber') as string,
      customerName: form.get('customerName') as string,
      customerEmail: form.get('customerEmail') as string,
      customerAddress: form.get('customerAddress') as string,
      lineItems,
      subtotal: Math.round(subtotal * 100),
      taxRate,
      taxAmount: Math.round(taxAmount * 100),
      total: Math.round(grandTotal * 100),
      currency: (form.get('currency') as string) || 'EUR',
      validUntil: form.get('validUntil') as string,
      notes: (form.get('notes') as string) || null,
      status: editQuote?.status || 'DRAFT',
    };

    if (editQuote) {
      await fetch(`${baseUrl}/${editQuote.id}`, {
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
    setEditQuote(null);
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    loadQuotes();
  }

  function openEdit(quote: Quote) {
    setEditQuote(quote);
    setLineItems(quote.lineItems.length > 0 ? quote.lineItems : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setTaxRate(quote.taxRate);
    setShowForm(true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Angebote</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle und verwalte Angebote für deine Kunden. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditQuote(null); setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neues Angebot
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Angebotsnummer oder Kunde suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="rounded-md border px-3 py-2 text-sm bg-background"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Alle Status</option>
          <option value="DRAFT">Entwurf</option>
          <option value="SENT">Versendet</option>
          <option value="ACCEPTED">Angenommen</option>
          <option value="REJECTED">Abgelehnt</option>
          <option value="EXPIRED">Abgelaufen</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editQuote ? 'Angebot bearbeiten' : 'Neues Angebot'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quoteNumber">Angebotsnummer *</Label>
                  <Input id="quoteNumber" name="quoteNumber" placeholder="ANG-2026-001"
                    defaultValue={editQuote?.quoteNumber || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Gültig bis *</Label>
                  <Input id="validUntil" name="validUntil" type="date"
                    defaultValue={editQuote?.validUntil ? new Date(editQuote.validUntil).toISOString().slice(0, 10) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Kundenname *</Label>
                  <Input id="customerName" name="customerName" placeholder="Max Mustermann"
                    defaultValue={editQuote?.customerName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Kunden-E-Mail *</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" placeholder="max@example.com"
                    defaultValue={editQuote?.customerEmail || ''} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="customerAddress">Kundenadresse *</Label>
                  <Textarea id="customerAddress" name="customerAddress" placeholder="Straße, PLZ, Ort"
                    defaultValue={editQuote?.customerAddress || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" name="currency" placeholder="EUR" defaultValue={editQuote?.currency || 'EUR'} />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <Label>Positionen</Label>
                {lineItems.map((item, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_80px_100px_100px_40px] items-end">
                    <div className="space-y-1">
                      {i === 0 && <span className="text-xs text-muted-foreground">Beschreibung</span>}
                      <Input placeholder="Beschreibung" value={item.description}
                        onChange={(e) => updateLineItem(i, 'description', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      {i === 0 && <span className="text-xs text-muted-foreground">Menge</span>}
                      <Input type="number" min="1" value={item.quantity}
                        onChange={(e) => updateLineItem(i, 'quantity', parseInt(e.target.value) || 1)} />
                    </div>
                    <div className="space-y-1">
                      {i === 0 && <span className="text-xs text-muted-foreground">Einzelpreis (€)</span>}
                      <Input type="number" step="0.01" value={item.unitPrice}
                        onChange={(e) => updateLineItem(i, 'unitPrice', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-1">
                      {i === 0 && <span className="text-xs text-muted-foreground">Gesamt</span>}
                      <Input readOnly value={(item.quantity * item.unitPrice).toFixed(2)} className="bg-muted" />
                    </div>
                    <Button type="button" size="sm" variant="ghost" className="text-destructive"
                      onClick={() => removeLineItem(i)} disabled={lineItems.length <= 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="gap-1">
                  <Plus className="h-3 w-3" /> Position hinzufügen
                </Button>
              </div>

              {/* Tax & Totals */}
              <div className="flex flex-col items-end gap-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Zwischensumme:</span>
                  <span className="font-medium">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">MwSt.:</span>
                  <Input type="number" className="w-20" value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                  <span className="text-sm">% = {taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <span>Gesamt:</span>
                  <span>{grandTotal.toFixed(2)} €</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea id="notes" name="notes" placeholder="Zusätzliche Anmerkungen…"
                  defaultValue={editQuote?.notes || ''} />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editQuote ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditQuote(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Angebote…</div>
      ) : quotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Angebote</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle dein erstes Angebot.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{quote.quoteNumber}</span>
                      <Badge variant={STATUS_VARIANT[quote.status]}>{STATUS_LABELS[quote.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {quote.customerName}
                      {' · '}{(quote.total / 100).toFixed(2)} {quote.currency}
                      {' · '}Gültig bis: {new Date(quote.validUntil).toLocaleDateString('de-DE')}
                      {quote.sentAt && ` · Versendet: ${new Date(quote.sentAt).toLocaleDateString('de-DE')}`}
                      {quote.acceptedAt && ` · Angenommen: ${new Date(quote.acceptedAt).toLocaleDateString('de-DE')}`}
                      {quote.rejectedAt && ` · Abgelehnt: ${new Date(quote.rejectedAt).toLocaleDateString('de-DE')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {quote.status === 'DRAFT' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(quote.id, 'SENT', { sentAt: new Date().toISOString() })} className="gap-1">
                      <Send className="h-3 w-3" /> Versenden
                    </Button>
                  )}
                  {quote.status === 'SENT' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(quote.id, 'ACCEPTED', { acceptedAt: new Date().toISOString() })} className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Angenommen
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive gap-1" onClick={() => handleStatusChange(quote.id, 'REJECTED', { rejectedAt: new Date().toISOString() })}>
                        <XCircle className="h-3 w-3" /> Abgelehnt
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(quote)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(quote.id)}>
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
