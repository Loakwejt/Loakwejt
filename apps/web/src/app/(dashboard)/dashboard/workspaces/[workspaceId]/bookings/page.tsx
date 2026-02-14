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
  Calendar,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';


interface Booking {
  id: string;
  bookingNumber: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  startTime: string;
  endTime: string;
  price: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  confirmedAt?: string;
  canceledAt?: string;
  completedAt?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ausstehend',
  CONFIRMED: 'Bestätigt',
  CANCELED: 'Storniert',
  COMPLETED: 'Abgeschlossen',
  NO_SHOW: 'Nicht erschienen',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  CANCELED: 'destructive',
  COMPLETED: 'default',
  NO_SHOW: 'destructive',
};

export default function WorkspaceBookingsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/bookings`;

  const loadBookings = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Bookings API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setBookings(data.bookings || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadBookings();
  }, [search, statusFilter, loadBookings]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Buchung wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadBookings();
  }

  async function handleStatusChange(id: string, status: string, extra: Record<string, string> = {}) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    });
    loadBookings();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      bookingNumber: form.get('bookingNumber') as string,
      serviceName: form.get('serviceName') as string,
      customerName: form.get('customerName') as string,
      customerEmail: form.get('customerEmail') as string,
      startTime: form.get('startTime') as string,
      endTime: form.get('endTime') as string,
      price: Math.round(parseFloat(form.get('price') as string) * 100),
      currency: (form.get('currency') as string) || 'EUR',
      notes: (form.get('notes') as string) || null,
      status: editBooking?.status || 'PENDING',
    };

    if (editBooking) {
      await fetch(`${baseUrl}/${editBooking.id}`, {
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
    setEditBooking(null);
    loadBookings();
  }

  function openEdit(booking: Booking) {
    setEditBooking(booking);
    setShowForm(true);
  }

  // Sort bookings by startTime (nearest first)
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Buchungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Termine und Buchungen für deine Dienstleistungen. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setEditBooking(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Buchung
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buchungsnummer oder Kunde suchen…"
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
          <option value="PENDING">Ausstehend</option>
          <option value="CONFIRMED">Bestätigt</option>
          <option value="CANCELED">Storniert</option>
          <option value="COMPLETED">Abgeschlossen</option>
          <option value="NO_SHOW">Nicht erschienen</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editBooking ? 'Buchung bearbeiten' : 'Neue Buchung'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bookingNumber">Buchungsnummer *</Label>
                  <Input id="bookingNumber" name="bookingNumber" placeholder="BUC-2026-001"
                    defaultValue={editBooking?.bookingNumber || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Dienstleistung *</Label>
                  <Input id="serviceName" name="serviceName" placeholder="Beratungsgespräch"
                    defaultValue={editBooking?.serviceName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Kundenname *</Label>
                  <Input id="customerName" name="customerName" placeholder="Max Mustermann"
                    defaultValue={editBooking?.customerName || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Kunden-E-Mail *</Label>
                  <Input id="customerEmail" name="customerEmail" type="email" placeholder="max@example.com"
                    defaultValue={editBooking?.customerEmail || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Startzeit *</Label>
                  <Input id="startTime" name="startTime" type="datetime-local"
                    defaultValue={editBooking?.startTime ? new Date(editBooking.startTime).toISOString().slice(0, 16) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Endzeit *</Label>
                  <Input id="endTime" name="endTime" type="datetime-local"
                    defaultValue={editBooking?.endTime ? new Date(editBooking.endTime).toISOString().slice(0, 16) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preis (€) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="99.00"
                    defaultValue={editBooking ? (editBooking.price / 100).toFixed(2) : ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Währung</Label>
                  <Input id="currency" name="currency" placeholder="EUR" defaultValue={editBooking?.currency || 'EUR'} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Notizen</Label>
                  <Textarea id="notes" name="notes" placeholder="Besondere Hinweise…"
                    defaultValue={editBooking?.notes || ''} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editBooking ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditBooking(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Buchungen…</div>
      ) : sortedBookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Buchungen</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste Buchung.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {sortedBookings.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const dateStr = start.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = `${start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <Card key={booking.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{booking.bookingNumber}</span>
                        <Badge variant={STATUS_VARIANT[booking.status]}>{STATUS_LABELS[booking.status]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.serviceName} · {booking.customerName}
                        {' · '}{(booking.price / 100).toFixed(2)} {booking.currency}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {dateStr}, {timeStr}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === 'PENDING' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(booking.id, 'CONFIRMED', { confirmedAt: new Date().toISOString() })} className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Bestätigen
                      </Button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(booking.id, 'COMPLETED', { completedAt: new Date().toISOString() })} className="gap-1">
                          <CheckCircle className="h-3 w-3" /> Abgeschlossen
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive gap-1" onClick={() => handleStatusChange(booking.id, 'CANCELED', { canceledAt: new Date().toISOString() })}>
                          <XCircle className="h-3 w-3" /> Stornieren
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openEdit(booking)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(booking.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
