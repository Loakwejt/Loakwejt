'use client';

import { useEffect, useState } from 'react';
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
} from '@builderly/ui';
import {
  Plus,
  FileText,
  Trash2,
  Edit,
  Inbox,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';


interface FormDef {
  id: string;
  name: string;
  slug: string;
  description?: string;
  schema: Record<string, unknown>;
  submitLabel: string;
  successMessage: string;
  redirectUrl?: string;
  notifyEmails: string[];
  isActive: boolean;
  createdAt: string;
  _count?: { submissions: number };
}

interface Submission {
  id: string;
  data: Record<string, unknown>;
  status: string;
  createdAt: string;
  ipAddress?: string;
}

export default function WorkspaceFormsPage() {
  const params = useParams<{ workspaceId: string }>();
  const [forms, setForms] = useState<FormDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<FormDef | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormDef | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subTotal, setSubTotal] = useState(0);

  const baseUrl = `/api/workspaces/${params.workspaceId}/forms`;

  async function loadForms() {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      const data = await res.json();
      setForms(data.forms || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions(formId: string) {
    if (!baseUrl) return;
    const res = await fetch(`${baseUrl}/${formId}`);
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setSubTotal(data.total || 0);
  }

  useEffect(() => {
    loadForms();
  }, []);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Formular wirklich löschen?')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadForms();
    if (selectedForm?.id === id) setSelectedForm(null);
  }

  async function handleSaveForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get('name') as string,
      slug: fd.get('slug') as string,
      description: fd.get('description') as string,
      submitLabel: fd.get('submitLabel') as string || 'Absenden',
      successMessage: fd.get('successMessage') as string || 'Vielen Dank!',
      notifyEmails: (fd.get('notifyEmails') as string || '').split(',').map(e => e.trim()).filter(Boolean),
      schema: editForm?.schema || {},
    };

    if (editForm) {
      await fetch(`${baseUrl}/${editForm.id}`, {
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
    setEditForm(null);
    loadForms();
  }

  // Submissions view
  if (selectedForm) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedForm(null)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Zurück
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedForm.name}</h1>
            <p className="text-muted-foreground">{subTotal} Einsendung{subTotal !== 1 ? 'en' : ''}</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Noch keine Einsendungen.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={sub.status === 'NEW' ? 'default' : 'secondary'}>
                      {sub.status === 'NEW' ? 'Neu' : sub.status === 'READ' ? 'Gelesen' : sub.status}
                    </Badge>
                    <time className="text-xs text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleString('de-DE')}
                    </time>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(sub.data).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key}:</span>{' '}
                        <span className="font-medium">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Formulare</h1>
          <p className="text-muted-foreground">{forms.length} Formular{forms.length !== 1 ? 'e' : ''}</p>
        </div>
        <Button onClick={() => { setEditForm(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Formular erstellen
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editForm ? 'Formular bearbeiten' : 'Neues Formular'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveForm} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" required defaultValue={editForm?.name || ''} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input name="slug" required defaultValue={editForm?.slug || ''} />
              </div>
              <div className="col-span-2">
                <Label>Beschreibung</Label>
                <Input name="description" defaultValue={editForm?.description || ''} />
              </div>
              <div>
                <Label>Button-Text</Label>
                <Input name="submitLabel" defaultValue={editForm?.submitLabel || 'Absenden'} />
              </div>
              <div>
                <Label>Erfolgsmeldung</Label>
                <Input name="successMessage" defaultValue={editForm?.successMessage || 'Vielen Dank!'} />
              </div>
              <div className="col-span-2">
                <Label>Benachrichtigungs-E-Mails (kommagetrennt)</Label>
                <Input name="notifyEmails" defaultValue={(editForm?.notifyEmails || []).join(', ')} />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button type="submit">{editForm ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditForm(null); }}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Form List */}
      {loading ? (
        <p className="text-muted-foreground">Laden...</p>
      ) : forms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Keine Formulare</h3>
            <p className="text-sm text-muted-foreground mb-4">Erstelle dein erstes Formular.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Formular erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{form.name}</CardTitle>
                  <Badge variant={form.isActive ? 'default' : 'secondary'}>
                    {form.isActive ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {form.description && (
                  <p className="text-sm text-muted-foreground mb-3">{form.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {form._count?.submissions || 0} Einsendungen
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedForm(form);
                        loadSubmissions(form.id);
                      }}
                    >
                      <Inbox className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditForm(form); setShowForm(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(form.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
