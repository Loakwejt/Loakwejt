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
} from '@builderly/ui';
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  GripVertical,
  AlertCircle,
} from 'lucide-react';
import { useWorkspaceSite } from '@/hooks/use-workspace-site';
import { WorkspaceSiteSelector } from '@/components/dashboard/workspace-site-selector';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  _count?: { products: number };
}

export default function WorkspaceCategoriesPage() {
  const params = useParams<{ workspaceId: string }>();
  const { sites, activeSiteId, setActiveSiteId, loading: sitesLoading, hasSites } = useWorkspaceSite(params.workspaceId);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const baseUrl = activeSiteId
    ? `/api/workspaces/${params.workspaceId}/sites/${activeSiteId}/categories`
    : null;

  const loadCategories = useCallback(async () => {
    if (!baseUrl) return;
    setLoading(true);
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) { console.error('Categories API error:', res.status); return; }
      const text = await res.text();
      if (!text) return;
      const data = JSON.parse(text);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (activeSiteId) loadCategories();
  }, [activeSiteId, loadCategories]);

  async function handleDelete(id: string) {
    if (!baseUrl || !confirm('Kategorie wirklich löschen? Produkte werden nicht gelöscht.')) return;
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    loadCategories();
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!baseUrl) return;
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const body = {
      name,
      slug: name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: form.get('description') as string || null,
      image: form.get('image') as string || null,
    };

    if (editCategory) {
      await fetch(`${baseUrl}/${editCategory.id}`, {
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
    setEditCategory(null);
    loadCategories();
  }

  if (sitesLoading) {
    return <div className="p-8 text-center text-muted-foreground">Lade…</div>;
  }

  if (!hasSites) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Keine Site vorhanden</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle zunächst eine Site, um Kategorien zu verwalten.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produktkategorien</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organisiere deine Produkte in Kategorien.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sites.length > 1 && (
            <WorkspaceSiteSelector sites={sites} activeSiteId={activeSiteId!} onSelect={setActiveSiteId} />
          )}
          <Button onClick={() => { setEditCategory(null); setShowForm(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> Kategorie erstellen
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="z. B. T-Shirts" defaultValue={editCategory?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Bild-URL</Label>
                  <Input id="image" name="image" placeholder="https://..." defaultValue={editCategory?.image ?? ''} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Input id="description" name="description" placeholder="Kurze Beschreibung der Kategorie"
                  defaultValue={editCategory?.description ?? ''} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editCategory ? 'Speichern' : 'Erstellen'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditCategory(null); }}>Abbrechen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Kategorien…</div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderTree className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Noch keine Kategorien</p>
            <p className="text-sm text-muted-foreground mt-1">Erstelle Kategorien, um deine Produkte zu organisieren.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FolderTree className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cat._count?.products ?? 0} Produkte
                      {cat.description && ` · ${cat.description}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setEditCategory(cat); setShowForm(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(cat.id)}>
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
