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
  CreditCard,
  Edit,
  Trash2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Users,
  RefreshCw,
} from 'lucide-react';


interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  intervalCount: number;
  trialDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'PAUSED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
}

const INTERVAL_LABELS: Record<string, string> = {
  DAY: 'Täglich',
  WEEK: 'Wöchentlich',
  MONTH: 'Monatlich',
  YEAR: 'Jährlich',
};

const SUB_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Aktiv',
  TRIALING: 'Testphase',
  PAST_DUE: 'Überfällig',
  CANCELED: 'Gekündigt',
  PAUSED: 'Pausiert',
};

const SUB_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  TRIALING: 'secondary',
  PAST_DUE: 'destructive',
  CANCELED: 'destructive',
  PAUSED: 'secondary',
};

export default function WorkspaceSubscriptionsPage() {
  const params = useParams<{ workspaceId: string }>();

  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');

  // Plans state
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansTotal, setPlansTotal] = useState(0);
  const [plansSearch, setPlansSearch] = useState('');
  const [plansLoading, setPlansLoading] = useState(true);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [planFeatures, setPlanFeatures] = useState('');

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subsTotal, setSubsTotal] = useState(0);
  const [subsSearch, setSubsSearch] = useState('');
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsStatusFilter, setSubsStatusFilter] = useState<string>('');

  const plansBaseUrl = `/api/workspaces/${params.workspaceId}/subscription-plans`;

  const subsBaseUrl = `/api/workspaces/${params.workspaceId}/subscriptions`;

  const loadPlans = useCallback(async () => {
    if (!plansBaseUrl) return;
    setPlansLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search: plansSearch });
      const res = await fetch(`${plansBaseUrl}?${qs}`);
      if (!res.ok) { console.error('Plans API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setPlans(data.plans || []);
      setPlansTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setPlansLoading(false);
    }
  }, [plansBaseUrl, plansSearch]);

  const loadSubscriptions = useCallback(async () => {
    if (!subsBaseUrl) return;
    setSubsLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search: subsSearch });
      if (subsStatusFilter) qs.set('status', subsStatusFilter);
      const res = await fetch(`${subsBaseUrl}?${qs}`);
      if (!res.ok) { console.error('Subscriptions API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setSubscriptions(data.subscriptions || []);
      setSubsTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setSubsLoading(false);
    }
  }, [subsBaseUrl, subsSearch, subsStatusFilter]);

  useEffect(() => {
    loadPlans();
  }, [plansSearch, loadPlans]);

  useEffect(() => {
    loadSubscriptions();
  }, [subsSearch, subsStatusFilter, loadSubscriptions]);

  async function handleDeletePlan(id: string) {
    if (!plansBaseUrl || !confirm('Abo-Plan wirklich löschen?')) return;
    await fetch(`${plansBaseUrl}/${id}`, { method: 'DELETE' });
    loadPlans();
  }

  async function handleTogglePlan(plan: SubscriptionPlan) {
    if (!plansBaseUrl) return;
    await fetch(`${plansBaseUrl}/${plan.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !plan.isActive }),
    });
    loadPlans();
  }

  async function handleSavePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plansBaseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      description: (form.get('description') as string) || null,
      price: Math.round(parseFloat(form.get('price') as string) * 100),
      currency: (form.get('currency') as string) || 'EUR',
      interval: form.get('interval') as string,
      intervalCount: parseInt(form.get('intervalCount') as string) || 1,
      trialDays: parseInt(form.get('trialDays') as string) || 0,
      features: planFeatures.split('\n').map((f) => f.trim()).filter(Boolean),
      isActive: editPlan ? editPlan.isActive : true,
    };

    if (editPlan) {
      await fetch(`${plansBaseUrl}/${editPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(plansBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    setShowPlanForm(false);
    setEditPlan(null);
    setPlanFeatures('');
    loadPlans();
  }

  function openEditPlan(plan: SubscriptionPlan) {
    setEditPlan(plan);
    setPlanFeatures(plan.features.join('\n'));
    setShowPlanForm(true);
  }

  async function handleCancelSubscription(id: string) {
    if (!subsBaseUrl || !confirm('Abonnement wirklich kündigen?')) return;
    await fetch(`${subsBaseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELED', canceledAt: new Date().toISOString() }),
    });
    loadSubscriptions();
  }

  async function handlePauseSubscription(id: string) {
    if (!subsBaseUrl) return;
    await fetch(`${subsBaseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAUSED' }),
    });
    loadSubscriptions();
  }

  async function handleResumeSubscription(id: string) {
    if (!subsBaseUrl) return;
    await fetch(`${subsBaseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACTIVE' }),
    });
    loadSubscriptions();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Abonnements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte Abo-Pläne und Kundenabonnements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'plans' && (
            <Button onClick={() => { setEditPlan(null); setPlanFeatures(''); setShowPlanForm(true); }} className="gap-2">
              <Plus className="h-4 w-4" /> Neuer Plan
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'plans' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('plans')}
        >
          Abo-Pläne {plansTotal > 0 && `(${plansTotal})`}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subscriptions' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Kunden-Abos {subsTotal > 0 && `(${subsTotal})`}
        </button>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Plan suchen…"
              value={plansSearch}
              onChange={(e) => setPlansSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {showPlanForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editPlan ? 'Plan bearbeiten' : 'Neuer Plan'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" placeholder="Premium-Plan"
                        defaultValue={editPlan?.name || ''} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Preis (€) *</Label>
                      <Input id="price" name="price" type="number" step="0.01" placeholder="29.99"
                        defaultValue={editPlan ? (editPlan.price / 100).toFixed(2) : ''} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interval">Intervall *</Label>
                      <select
                        id="interval"
                        name="interval"
                        className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                        defaultValue={editPlan?.interval || 'MONTH'}
                        required
                      >
                        <option value="DAY">Täglich</option>
                        <option value="WEEK">Wöchentlich</option>
                        <option value="MONTH">Monatlich</option>
                        <option value="YEAR">Jährlich</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intervalCount">Intervallanzahl</Label>
                      <Input id="intervalCount" name="intervalCount" type="number" min="1" placeholder="1"
                        defaultValue={editPlan?.intervalCount || 1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trialDays">Testphase (Tage)</Label>
                      <Input id="trialDays" name="trialDays" type="number" min="0" placeholder="14"
                        defaultValue={editPlan?.trialDays || 0} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Währung</Label>
                      <Input id="currency" name="currency" placeholder="EUR" defaultValue={editPlan?.currency || 'EUR'} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea id="description" name="description" placeholder="Beschreibung des Plans…"
                        defaultValue={editPlan?.description || ''} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="features">Funktionen (eine pro Zeile)</Label>
                      <Textarea
                        id="features"
                        value={planFeatures}
                        onChange={(e) => setPlanFeatures(e.target.value)}
                        placeholder="Unbegrenzte Produkte&#10;Priority-Support&#10;Erweiterte Analysen"
                        rows={5}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">{editPlan ? 'Speichern' : 'Erstellen'}</Button>
                    <Button type="button" variant="ghost" onClick={() => { setShowPlanForm(false); setEditPlan(null); }}>Abbrechen</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {plansLoading ? (
            <div className="text-center py-12 text-muted-foreground">Lade Abo-Pläne…</div>
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Noch keine Abo-Pläne</p>
                <p className="text-sm text-muted-foreground mt-1">Erstelle deinen ersten Abo-Plan.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{plan.name}</span>
                          <Badge variant="secondary">{INTERVAL_LABELS[plan.interval]}</Badge>
                          <Badge variant={plan.isActive ? 'default' : 'destructive'}>
                            {plan.isActive ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {(plan.price / 100).toFixed(2)} {plan.currency} / {plan.intervalCount > 1 ? `${plan.intervalCount} ` : ''}{(INTERVAL_LABELS[plan.interval] ?? plan.interval).toLowerCase()}
                          {plan.trialDays > 0 && ` · ${plan.trialDays} Tage Testphase`}
                          {plan.features.length > 0 && ` · ${plan.features.length} Funktionen`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleTogglePlan(plan)} title={plan.isActive ? 'Deaktivieren' : 'Aktivieren'}>
                        {plan.isActive ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEditPlan(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kunde oder Plan suchen…"
                value={subsSearch}
                onChange={(e) => setSubsSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="rounded-md border px-3 py-2 text-sm bg-background"
              value={subsStatusFilter}
              onChange={(e) => setSubsStatusFilter(e.target.value)}
            >
              <option value="">Alle Status</option>
              <option value="ACTIVE">Aktive Abos</option>
              <option value="TRIALING">Testphase</option>
              <option value="PAST_DUE">Überfällig</option>
              <option value="CANCELED">Gekündigt</option>
              <option value="PAUSED">Pausiert</option>
            </select>
          </div>

          {subsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Lade Abonnements…</div>
          ) : subscriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Noch keine Kunden-Abos</p>
                <p className="text-sm text-muted-foreground mt-1">Kunden-Abonnements erscheinen hier, sobald sie sich anmelden.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {subscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{sub.customerName}</span>
                          <Badge variant="secondary">{sub.planName}</Badge>
                          <Badge variant={SUB_STATUS_VARIANT[sub.status]}>{SUB_STATUS_LABELS[sub.status]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sub.customerEmail}
                          {' · '}Zeitraum: {new Date(sub.currentPeriodStart).toLocaleDateString('de-DE')} – {new Date(sub.currentPeriodEnd).toLocaleDateString('de-DE')}
                          {sub.cancelAtPeriodEnd && ' · Kündigung zum Periodenende'}
                          {sub.canceledAt && ` · Gekündigt: ${new Date(sub.canceledAt).toLocaleDateString('de-DE')}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.status === 'PAUSED' && (
                        <Button size="sm" variant="outline" onClick={() => handleResumeSubscription(sub.id)} className="gap-1">
                          <RefreshCw className="h-3 w-3" /> Fortsetzen
                        </Button>
                      )}
                      {(sub.status === 'ACTIVE' || sub.status === 'TRIALING') && (
                        <Button size="sm" variant="outline" onClick={() => handlePauseSubscription(sub.id)} className="gap-1">
                          Pausieren
                        </Button>
                      )}
                      {sub.status !== 'CANCELED' && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCancelSubscription(sub.id)}>
                          Kündigen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
