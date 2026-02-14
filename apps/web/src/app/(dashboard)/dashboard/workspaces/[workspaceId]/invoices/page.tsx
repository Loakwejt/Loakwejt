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
} from 'lucide-react';


interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELED';
  dueDate: string;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  SENT: 'Gesendet',
  PAID: 'Bezahlt',
  OVERDUE: 'Überfällig',
  CANCELED: 'Storniert',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  DRAFT: 'secondary',
  SENT: 'default',
  PAID: 'default',
  OVERDUE: 'destructive',
  CANCELED: 'destructive',
};

export default function WorkspaceInvoicesPage() {
  const params = useParams<{ workspaceId: string }>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState(19);

  const baseUrl = `/api/workspaces/${params.workspaceId}/invoices`;

  const loadInvoices = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Invoices API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setInvoices(data.invoices || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [search, statusFilter, loadInvoices]);

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
    if (!baseUrl || !confirm('Rechnung wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadInvoices();
  }

  async function handleMarkSent(id: string) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SENT', sentAt: new Date().toISOString() }),
    });
    loadInvoices();
  }

  async function handleMarkPaid(id: string) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID', paidAt: new Date().toISOString() }),
    });
    loadInvoices();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      invoiceNumber: form.get('invoiceNumber') as string,
      orderId: (form.get('orderId') as string) || null,
      customerName: form.get('customerName') as string,
      customerEmail: form.get('customerEmail') as string,
      customerAddress: form.get('customerAddress') as string,
      lineItems,
      subtotal: Math.round(subtotal * 100),
      taxRate,
      taxAmount: Math.round(taxAmount * 100),
      total: Math.round(grandTotal * 100),
      currency: (form.get('currency') as string) || 'EUR',
      dueDate: form.get('dueDate') as string,
      status: editInvoice?.status || 'DRAFT',
    };

    if (editInvoice) {
      await fetch(`${baseUrl}/${editInvoice.id}`, {
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
    setEditInvoice(null);
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    loadInvoices();
  }

  function openEdit(invoice: Invoice) {
    setEditInvoice(invoice);
    setLineItems(invoice.lineItems.length > 0 ? invoice.lineItems : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setTaxRate(invoice.taxRate);
    setShowForm(true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rechnungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Rechnungen und verfolge Zahlungseingänge. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditInvoice(null); setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Rechnung
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechnungsnummer oder Kunde suchen…"
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
          <option value="SENT">Gesendet</option>
          <option value="PAID">Bezahlt</option>
          <option value="OVERDUE">Überfällig</option>
          <option value="CANCELED">Storniert</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editInvoice ? 'Rechnung bearbeiten' : 'Neue Rechnung'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Rechnungsnummer *</Label>
                  <Input id="invoiceNumber" name="invoiceNumber" placeholder="INV-2026-001"
                    defaultValue={editInvoice?.invoiceNumber || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderId">Bestell-ID</Label>
                  <Input id="orderId" name="orderId" placeholder="Optionale Bestellreferenz"
                    defaultValue={editInvoice?.orderId || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Kundenname *</Label>
                  <Input id="customerName" name="customerName" placeholder="Max Mustermann"
                    defaultValue={editInvoice?.customerName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Kunden-E-Mail *</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" placeholder="max@example.com"
                    defaultValue={editInvoice?.customerEmail || ''} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="customerAddress">Kundenadresse *</Label>
                  <Textarea id="customerAddress" name="customerAddress" placeholder="Straße, PLZ, Ort"
                    defaultValue={editInvoice?.customerAddress || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fälligkeitsdatum *</Label>
                  <Input id="dueDate" name="dueDate" type="date"
                    defaultValue={editInvoice?.dueDate ? new Date(editInvoice.dueDate).toISOString().slice(0, 10) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" name="currency" placeholder="EUR" defaultValue={editInvoice?.currency || 'EUR'} />
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

              <div className="flex gap-2">
                <Button type="submit">{editInvoice ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditInvoice(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Rechnungen…</div>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Rechnungen</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste Rechnung.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{invoice.invoiceNumber}</span>
                      <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABELS[invoice.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.customerName}
                      {' · '}{(invoice.total / 100).toFixed(2)} {invoice.currency}
                      {' · '}Fällig: {new Date(invoice.dueDate).toLocaleDateString('de-DE')}
                      {invoice.sentAt && ` · Gesendet: ${new Date(invoice.sentAt).toLocaleDateString('de-DE')}`}
                      {invoice.paidAt && ` · Bezahlt: ${new Date(invoice.paidAt).toLocaleDateString('de-DE')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invoice.status === 'DRAFT' && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkSent(invoice.id)} className="gap-1">
                      <Send className="h-3 w-3" /> Gesendet
                    </Button>
                  )}
                  {invoice.status === 'SENT' && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkPaid(invoice.id)} className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Bezahlt
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(invoice)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(invoice.id)}>
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
