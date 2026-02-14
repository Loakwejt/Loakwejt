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
  Mail,
  Edit,
  Trash2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';


interface EmailTemplate {
  id: string;
  name: string;
  type: 'ORDER_CONFIRMATION' | 'SHIPPING_NOTIFICATION' | 'INVOICE' | 'REVIEW_REQUEST' | 'WELCOME' | 'PASSWORD_RESET' | 'REFUND_CONFIRMATION';
  subject: string;
  htmlBody: string;
  textBody?: string;
  isActive: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  ORDER_CONFIRMATION: 'Bestellbestätigung',
  SHIPPING_NOTIFICATION: 'Versandbenachrichtigung',
  INVOICE: 'Rechnung',
  REVIEW_REQUEST: 'Bewertungsanfrage',
  WELCOME: 'Willkommen',
  PASSWORD_RESET: 'Passwort zurücksetzen',
  REFUND_CONFIRMATION: 'Erstattungsbestätigung',
};

export default function WorkspaceEmailTemplatesPage() {
  const params = useParams<{ workspaceId: string }>();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EmailTemplate | null>(null);
  const [htmlBody, setHtmlBody] = useState('');
  const [textBody, setTextBody] = useState('');

  const baseUrl = `/api/workspaces/${params.workspaceId}/email-templates`;

  const loadTemplates = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50', search });
      const res = await fetch(`${baseUrl}?${qs}`);
      if (!res.ok) { console.error('Email templates API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setTemplates(data.templates || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load email templates:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search]);

  useEffect(() => {
    loadTemplates();
  }, [search, loadTemplates]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Vorlage wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadTemplates();
  }

  async function handleToggleActive(template: EmailTemplate) {
    if (!baseUrl) return;
    await fetch(`${baseUrl}/${template.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !template.isActive }),
    });
    loadTemplates();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      type: form.get('type') as string,
      subject: form.get('subject') as string,
      htmlBody,
      textBody: textBody || null,
      isActive: editTemplate ? editTemplate.isActive : true,
    };

    if (editTemplate) {
      await fetch(`${baseUrl}/${editTemplate.id}`, {
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
    setEditTemplate(null);
    setHtmlBody('');
    setTextBody('');
    loadTemplates();
  }

  function openEdit(template: EmailTemplate) {
    setEditTemplate(template);
    setHtmlBody(template.htmlBody);
    setTextBody(template.textBody || '');
    setShowForm(true);
  }

  function openCreate() {
    setEditTemplate(null);
    setHtmlBody('');
    setTextBody('');
    setShowForm(true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">E-Mail-Vorlagen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verwalte automatisierte E-Mail-Vorlagen für deinen Shop. {total > 0 && `(${total} gesamt)`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Neue Vorlage
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Vorlage suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editTemplate ? 'Vorlage bearbeiten' : 'Neue Vorlage'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Bestellbestätigung Standard"
                    defaultValue={editTemplate?.name || ''} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Vorlagentyp *</Label>
                  <select
                    id="type"
                    name="type"
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    defaultValue={editTemplate?.type || 'ORDER_CONFIRMATION'}
                    required
                  >
                    <option value="ORDER_CONFIRMATION">Bestellbestätigung</option>
                    <option value="SHIPPING_NOTIFICATION">Versandbenachrichtigung</option>
                    <option value="INVOICE">Rechnung</option>
                    <option value="REVIEW_REQUEST">Bewertungsanfrage</option>
                    <option value="WELCOME">Willkommen</option>
                    <option value="PASSWORD_RESET">Passwort zurücksetzen</option>
                    <option value="REFUND_CONFIRMATION">Erstattungsbestätigung</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input id="subject" name="subject" placeholder="Deine Bestellung {{orderNumber}} wurde bestätigt"
                    defaultValue={editTemplate?.subject || ''} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="htmlBody">HTML-Inhalt *</Label>
                  <Textarea
                    id="htmlBody"
                    value={htmlBody}
                    onChange={(e) => setHtmlBody(e.target.value)}
                    placeholder="<html><body><h1>Hallo {{customerName}}</h1>...</body></html>"
                    rows={12}
                    className="font-mono text-sm"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="textBody">Text-Fallback (optional)</Label>
                  <Textarea
                    id="textBody"
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    placeholder="Hallo {{customerName}}, ..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editTemplate ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditTemplate(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Vorlagen…</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Vorlagen</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle deine erste E-Mail-Vorlage.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{template.name}</span>
                      <Badge variant="secondary">{TYPE_LABELS[template.type]}</Badge>
                      <Badge variant={template.isActive ? 'default' : 'destructive'}>
                        {template.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Betreff: {template.subject}
                      {' · '}Erstellt: {new Date(template.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(template)} title={template.isActive ? 'Deaktivieren' : 'Aktivieren'}>
                    {template.isActive ? <ToggleRight className="h-5 w-5 text-green-500" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(template.id)}>
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
