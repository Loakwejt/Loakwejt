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
  FileMinus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';


interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CreditNote {
  id: string;
  creditNoteNumber: string;
  orderId?: string;
  orderNumber?: string;
  reason: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'DRAFT' | 'ISSUED' | 'VOID';
  issuedAt?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  ISSUED: 'Ausgestellt',
  VOID: 'Storniert',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  DRAFT: 'secondary',
  ISSUED: 'default',
  VOID: 'destructive',
};

export default function WorkspaceCreditNotesPage() {
  const params = useParams<{ workspaceId: string }>();
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<CreditNote | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [taxRate, setTaxRate] = useState(19);

  const baseUrl = `/api/workspaces/${params.workspaceId}/credit-notes`;

  const loadCreditNotes = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Credit notes API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setCreditNotes(data.creditNotes || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load credit notes:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadCreditNotes();
  }, [search, statusFilter, loadCreditNotes]);

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    setLineItems(updated.map((item) => ({ ...item, total: item.quantity * item.unitPrice })));
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
    if (!baseUrl || !confirm('Gutschrift wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadCreditNotes();
  }

  async function handleIssue(id: string) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ISSUED', issuedAt: new Date().toISOString() }),
    });
    loadCreditNotes();
  }

  async function handleVoid(id: string) {
    if (!baseUrl || !confirm('Gutschrift wirklich stornieren?')) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'VOID' }),
    });
    loadCreditNotes();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      creditNoteNumber: form.get('creditNoteNumber') as string,
      orderId: (form.get('orderId') as string) || null,
      orderNumber: (form.get('orderNumber') as string) || null,
      reason: form.get('reason') as string,
      lineItems,
      subtotal: Math.round(subtotal * 100),
      taxRate,
      taxAmount: Math.round(taxAmount * 100),
      total: Math.round(grandTotal * 100),
      currency: (form.get('currency') as string) || 'EUR',
      status: editNote?.status || 'DRAFT',
    };

    if (editNote) {
      await fetch(`${baseUrl}/${editNote.id}`, {
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
    setEditNote(null);
    setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    loadCreditNotes();
  }

  function openEdit(note: CreditNote) {
    setEditNote(note);
    setLineItems(note.lineItems.length > 0 ? note.lineItems : [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    setTaxRate(note.taxRate);
    setShowForm(true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gutschriften</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Gutschriften für Rückerstattungen und Korrekturen. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditNote(null); setLineItems([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Gutschrift
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Gutschriftsnummer oder Bestellung suchen…"
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
          <option value="ISSUED">Ausgestellt</option>
          <option value="VOID">Storniert</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editNote ? 'Gutschrift bearbeiten' : 'Neue Gutschrift'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="creditNoteNumber">Gutschriftsnummer *</Label>
                  <Input id="creditNoteNumber" name="creditNoteNumber" placeholder="GS-2026-001"
                    defaultValue={editNote?.creditNoteNumber || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Bestellnummer</Label>
                  <Input id="orderNumber" name="orderNumber" placeholder="Optionale Bestellnummer"
                    defaultValue={editNote?.orderNumber || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderId">Bestell-ID</Label>
                  <Input id="orderId" name="orderId" placeholder="Optionale Bestell-ID"
                    defaultValue={editNote?.orderId || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" name="currency" placeholder="EUR" defaultValue={editNote?.currency || 'EUR'} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="reason">Grund *</Label>
                  <Textarea id="reason" name="reason" placeholder="Grund für die Gutschrift…"
                    defaultValue={editNote?.reason || ''} required rows={2} />
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
                <Button type="submit">{editNote ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditNote(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Gutschriften…</div>
      ) : creditNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileMinus className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Gutschriften</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste Gutschrift.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {creditNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileMinus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{note.creditNoteNumber}</span>
                      <Badge variant={STATUS_VARIANT[note.status]}>{STATUS_LABELS[note.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(note.total / 100).toFixed(2)} {note.currency}
                      {note.orderNumber && ` · Bestellung ${note.orderNumber}`}
                      {' · '}{new Date(note.createdAt).toLocaleDateString('de-DE')}
                      {note.issuedAt && ` · Ausgestellt: ${new Date(note.issuedAt).toLocaleDateString('de-DE')}`}
                    </p>
                    {note.reason && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{note.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {note.status === 'DRAFT' && (
                    <Button size="sm" variant="outline" onClick={() => handleIssue(note.id)} className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Ausstellen
                    </Button>
                  )}
                  {note.status === 'ISSUED' && (
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleVoid(note.id)}>
                      Stornieren
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => openEdit(note)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(note.id)}>
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
