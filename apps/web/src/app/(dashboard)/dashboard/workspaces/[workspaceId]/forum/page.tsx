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
  MessageSquare,
  FolderOpen,
  ArrowLeft,
  Pin,
  Lock,
} from 'lucide-react';


interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  _count?: { threads: number };
}

interface ForumThread {
  id: string;
  title: string;
  slug: string;
  authorEmail: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string;
  category: ForumCategory;
  _count?: { posts: number };
}

export default function WorkspaceForumPage() {
  const params = useParams<{ workspaceId: string }>();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [totalThreads, setTotalThreads] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [view, setView] = useState<'categories' | 'threads'>('categories');

  const baseUrl = `/api/workspaces/${params.workspaceId}/forum`;

  async function loadCategories() {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/categories`);
      const data = await res.json();
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadThreads(categoryId?: string) {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page) });
      if (categoryId) qs.set('categoryId', categoryId);
      const res = await fetch(`${baseUrl}/threads?${qs}`);
      const data = await res.json();
      setThreads(data.threads || []);
      setTotalThreads(data.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (view === 'threads') {
      loadThreads(selectedCategory || undefined);
    }
  }, [view, page, selectedCategory]);

  async function handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const fd = new FormData(e.currentTarget);
    await fetch(`${baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fd.get('name'),
        slug: fd.get('slug'),
        description: fd.get('description'),
      }),
    });
    setShowCatForm(false);
    loadCategories();
  }

  // Categories View
  if (view === 'categories') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Forum-Verwaltung</h1>
            <p className="text-muted-foreground">{categories.length} Kategorien</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setView('threads'); loadThreads(); }}>
              <MessageSquare className="w-4 h-4 mr-2" /> Alle Themen
            </Button>
            <Button onClick={() => setShowCatForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Kategorie erstellen
            </Button>
          </div>
        </div>

        {showCatForm && (
          <Card>
            <CardHeader><CardTitle>Neue Kategorie</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input name="slug" required />
                </div>
                <div className="col-span-2">
                  <Label>Beschreibung</Label>
                  <Input name="description" />
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button type="submit">Erstellen</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCatForm(false)}>Abbrechen</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <p className="text-muted-foreground">Laden...</p>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">Keine Kategorien</h3>
              <p className="text-sm text-muted-foreground mb-4">Erstelle die erste Forum-Kategorie.</p>
              <Button onClick={() => setShowCatForm(true)}>
                <Plus className="w-4 h-4 mr-2" /> Kategorie erstellen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setView('threads');
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {cat._count?.threads || 0} Themen
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Threads View
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => { setView('categories'); setSelectedCategory(''); }}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Kategorien
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Themen' : 'Alle Themen'}
          </h1>
          <p className="text-muted-foreground">{totalThreads} Themen</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Laden...</p>
      ) : threads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Keine Themen vorhanden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Thema</th>
                <th className="p-3 font-medium">Kategorie</th>
                <th className="p-3 font-medium">Autor</th>
                <th className="p-3 font-medium">Antworten</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Datum</th>
              </tr>
            </thead>
            <tbody>
              {threads.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {t.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                      {t.isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span className="font-medium">{t.title}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">{t.category?.name || '–'}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{t.authorEmail}</td>
                  <td className="p-3">{t._count?.posts || t.replyCount || 0}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {t.isPinned && <Badge className="text-xs">Angepinnt</Badge>}
                      {t.isLocked && <Badge variant="secondary" className="text-xs">Gesperrt</Badge>}
                      {!t.isPinned && !t.isLocked && <span className="text-muted-foreground">–</span>}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalThreads > 20 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Zurück
          </Button>
          <span className="text-sm text-muted-foreground">
            Seite {page} von {Math.ceil(totalThreads / 20)}
          </span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(totalThreads / 20)} onClick={() => setPage(p => p + 1)}>
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
