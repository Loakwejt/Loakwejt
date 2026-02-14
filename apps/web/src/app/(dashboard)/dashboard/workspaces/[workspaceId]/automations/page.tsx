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
  Zap,
  Edit,
  Trash2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Play,
} from 'lucide-react';


interface Automation {
  id: string;
  name: string;
  trigger: 'ORDER_CREATED' | 'ORDER_PAID' | 'ORDER_SHIPPED' | 'CART_ABANDONED' | 'REVIEW_SUBMITTED' | 'SUBSCRIPTION_EXPIRING';
  conditions: string;
  actions: string;
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
}

const TRIGGER_LABELS: Record<string, string> = {
  ORDER_CREATED: 'Bestellung erstellt',
  ORDER_PAID: 'Bestellung bezahlt',
  ORDER_SHIPPED: 'Bestellung versendet',
  CART_ABANDONED: 'Warenkorb verlassen',
  REVIEW_SUBMITTED: 'Bewertung eingereicht',
  SUBSCRIPTION_EXPIRING: 'Abo läuft aus',
};

const ACTION_TYPES: Record<string, string> = {
  SEND_EMAIL: 'E-Mail senden',
  UPDATE_STATUS: 'Status aktualisieren',
  CREATE_TASK: 'Aufgabe erstellen',
  NOTIFY_ADMIN: 'Admin benachrichtigen',
};

export default function WorkspaceAutomationsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAutomation, setEditAutomation] = useState<Automation | null>(null);
  const [conditions, setConditions] = useState('');
  const [actions, setActions] = useState('');

  const baseUrl = `/api/workspaces/${params.workspaceId}/automations`;

  const loadAutomations = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Automations API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setAutomations(data.automations || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load automations:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search]);

  useEffect(() => {
    loadAutomations();
  }, [search, loadAutomations]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Automatisierung wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadAutomations();
  }

  async function handleToggleActive(automation: Automation) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${automation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !automation.isActive }),
    });
    loadAutomations();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);

    let parsedConditions: any = {};
    let parsedActions: any = {};
    try { parsedConditions = conditions ? JSON.parse(conditions) : {}; } catch { /* keep empty */ }
    try { parsedActions = actions ? JSON.parse(actions) : {}; } catch { /* keep empty */ }

    const body = {
      name: form.get('name') as string,
      trigger: form.get('trigger') as string,
      conditions: parsedConditions,
      actions: parsedActions,
      isActive: editAutomation ? editAutomation.isActive : true,
    };

    if (editAutomation) {
      await fetch(`${baseUrl}/${editAutomation.id}`, {
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
    setEditAutomation(null);
    setConditions('');
    setActions('');
    loadAutomations();
  }

  function openEdit(automation: Automation) {
    setEditAutomation(automation);
    setConditions(typeof automation.conditions === 'string' ? automation.conditions : JSON.stringify(automation.conditions, null, 2));
    setActions(typeof automation.actions === 'string' ? automation.actions : JSON.stringify(automation.actions, null, 2));
    setShowForm(true);
  }

  function openCreate() {
    setEditAutomation(null);
    setConditions('');
    setActions('');
    setShowForm(true);
  }

  function parseActionLabels(actionsStr: string): string {
    try {
      const parsed = typeof actionsStr === 'string' ? JSON.parse(actionsStr) : actionsStr;
      if (Array.isArray(parsed)) {
        return parsed.map((a: any) => ACTION_TYPES[a.type] || a.type).join(', ');
      }
      if (parsed.type) return ACTION_TYPES[parsed.type] || parsed.type;
      return 'Konfiguriert';
    } catch {
      return 'Konfiguriert';
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Automatisierungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Erstelle Regeln, die automatisch auf Ereignisse reagieren. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Regel
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Automatisierung suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editAutomation ? 'Regel bearbeiten' : 'Neue Regel'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Bestellbestätigung senden"
                    defaultValue={editAutomation?.name || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger">Auslöser *</Label>
                  <select
                    id="trigger"
                    name="trigger"
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    defaultValue={editAutomation?.trigger || 'ORDER_CREATED'}
                    required
                  >
                    <option value="ORDER_CREATED">Bestellung erstellt</option>
                    <option value="ORDER_PAID">Bestellung bezahlt</option>
                    <option value="ORDER_SHIPPED">Bestellung versendet</option>
                    <option value="CART_ABANDONED">Warenkorb verlassen</option>
                    <option value="REVIEW_SUBMITTED">Bewertung eingereicht</option>
                    <option value="SUBSCRIPTION_EXPIRING">Abo läuft aus</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="conditions">Bedingungen (JSON)</Label>
                  <Textarea
                    id="conditions"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder='{"minOrderValue": 5000, "customerTag": "vip"}'
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">Optionale Bedingungen als JSON-Objekt, die erfüllt sein müssen.</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="actions">Aktionen (JSON) *</Label>
                  <Textarea
                    id="actions"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    placeholder='[{"type": "SEND_EMAIL", "templateId": "..."}, {"type": "NOTIFY_ADMIN"}]'
                    rows={6}
                    className="font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Verfügbare Aktionstypen: {Object.entries(ACTION_TYPES).map(([k, v]) => `${k} (${v})`).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editAutomation ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditAutomation(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Automatisierungen…</div>
      ) : automations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Automatisierungen</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste Automatisierungsregel.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {automations.map((automation) => (
            <Card key={automation.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{automation.name}</span>
                      <Badge variant="secondary">{TRIGGER_LABELS[automation.trigger]}</Badge>
                      <Badge variant={automation.isActive ? 'default' : 'destructive'}>
                        {automation.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aktionen: {parseActionLabels(automation.actions)}
                      {' · '}{automation.executionCount} Ausführungen
                      {automation.lastExecutedAt && ` · Zuletzt: ${new Date(automation.lastExecutedAt).toLocaleDateString('de-DE')}`}
                      {' · '}Erstellt: {new Date(automation.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(automation)} title={automation.isActive ? 'Deaktivieren' : 'Aktivieren'}>
                    {automation.isActive ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(automation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(automation.id)}>
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
