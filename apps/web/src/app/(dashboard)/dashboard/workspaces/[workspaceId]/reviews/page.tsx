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
  Star,
  Search,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';


interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  response?: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ausstehend',
  APPROVED: 'Genehmigt',
  REJECTED: 'Abgelehnt',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

export default function WorkspaceReviewsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<Review | null>(null);
  const [detailReview, setDetailReview] = useState<Review | null>(null);

  const baseUrl = `/api/workspaces/${params.workspaceId}/reviews`;

  const loadReviews = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      if (statusFilter) qs.set('status', statusFilter);
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Reviews API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, statusFilter]);

  useEffect(() => {
    loadReviews();
  }, [search, statusFilter, loadReviews]);

  async function handleUpdateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadReviews();
  }

  async function handleRespond(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl || !respondingTo) return;
    const form = new FormData(e.currentTarget);
    const response = form.get('response') as string;
    await fetch(`${baseUrl}/${respondingTo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response }),
    });
    setRespondingTo(null);
    loadReviews();
  }

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Bewertung wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadReviews();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bewertungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Kundenbewertungen und antworte auf Feedback. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Produkt oder Kunde suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Alle Status</option>
          <option value="PENDING">Ausstehend</option>
          <option value="APPROVED">Genehmigt</option>
          <option value="REJECTED">Abgelehnt</option>
        </select>
      </div>

      {/* Response Form */}
      {respondingTo && (
        <Card>
          <CardHeader>
            <CardTitle>Antworten auf Bewertung von {respondingTo.customerName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={respondingTo.rating} />
                <span className="font-medium text-sm">{respondingTo.title}</span>
              </div>
              <p className="text-sm text-muted-foreground">{respondingTo.comment}</p>
            </div>
            <form onSubmit={handleRespond} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="response">Deine Antwort</Label>
                <Textarea
                  id="response"
                  name="response"
                  rows={3}
                  placeholder="Danke für Ihre Bewertung…"
                  defaultValue={respondingTo.response ?? ''}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Antwort speichern</Button>
                <Button type="button" variant="ghost" onClick={() => setRespondingTo(null)}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Detail View */}
      {detailReview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Bewertung von {detailReview.customerName}</span>
              <Button size="sm" variant="ghost" onClick={() => setDetailReview(null)}>Schließen</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <StarRating rating={detailReview.rating} />
              <Badge variant={STATUS_VARIANT[detailReview.status]}>{STATUS_LABELS[detailReview.status]}</Badge>
            </div>
            <p className="font-medium">{detailReview.title}</p>
            <p className="text-sm text-muted-foreground">{detailReview.comment}</p>
            <p className="text-xs text-muted-foreground">
              Produkt: {detailReview.productName} · {detailReview.customerEmail} · {new Date(detailReview.createdAt).toLocaleDateString('de-DE')}
            </p>
            {detailReview.response && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-xs font-medium mb-1">Deine Antwort:</p>
                <p className="text-sm">{detailReview.response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Bewertungen…</div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Bewertungen</p>
            <p className="text-sm text-muted-foreground mt-1">Bewertungen von Kunden werden hier angezeigt.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="font-medium text-sm">{review.title}</span>
                      <Badge variant={STATUS_VARIANT[review.status]}>{STATUS_LABELS[review.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.customerName} · {review.productName} · {new Date(review.createdAt).toLocaleDateString('de-DE')}
                      {review.response && ' · Beantwortet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setDetailReview(review)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {review.status === 'PENDING' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(review.id, 'APPROVED')} title="Bewertung genehmigen">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(review.id, 'REJECTED')} title="Bewertung ablehnen">
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setRespondingTo(review)}>
                    <MessageSquare className="h-4 w-4" />
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
