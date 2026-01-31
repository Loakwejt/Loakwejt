'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@builderly/ui';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Crown,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';

type Template = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  style: string | null;
  websiteType: string | null;
  tags: string[];
  tree: unknown;
  isPro: boolean;
  isPublished: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

const CATEGORIES = [
  'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'CONTACT',
  'TEAM', 'FAQ', 'FOOTER', 'HEADER', 'GALLERY', 'STATS', 'BLOG',
  'ECOMMERCE', 'CONTENT', 'FULL_PAGE'
];

const CATEGORY_LABELS: Record<string, string> = {
  HERO: 'Hero Sektion',
  FEATURES: 'Features',
  PRICING: 'Preise',
  TESTIMONIALS: 'Kundenstimmen',
  CTA: 'Call to Action',
  CONTACT: 'Kontakt',
  TEAM: 'Team',
  FAQ: 'FAQ',
  FOOTER: 'Footer',
  HEADER: 'Header',
  GALLERY: 'Galerie',
  STATS: 'Statistiken',
  BLOG: 'Blog',
  ECOMMERCE: 'E-Commerce',
  CONTENT: 'Inhalt',
  FULL_PAGE: 'Komplette Seite',
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    category: 'FULL_PAGE',
    style: '',
    websiteType: '',
    tags: '',
    tree: '{}',
    isPro: false,
    isPublished: true,
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/templates');
      if (!res.ok) {
        if (res.status === 403) {
          setError('Zugriff verweigert. Admin-Rechte erforderlich.');
          return;
        }
        throw new Error('Fehler beim Laden der Templates');
      }
      const data = await res.json();
      setTemplates(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      thumbnail: '',
      category: 'FULL_PAGE',
      style: '',
      websiteType: '',
      tags: '',
      tree: '{}',
      isPro: false,
      isPublished: true,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCreate = async () => {
    try {
      let tree;
      try {
        tree = JSON.parse(formData.tree);
      } catch {
        alert('Ungültiges JSON im Tree-Feld');
        return;
      }

      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          tree,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Erstellen');
      }

      setIsCreateDialogOpen(false);
      resetForm();
      fetchTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler beim Erstellen');
    }
  };

  const handleUpdate = async () => {
    if (!editingTemplate) return;
    
    try {
      let tree;
      try {
        tree = JSON.parse(formData.tree);
      } catch {
        alert('Ungültiges JSON im Tree-Feld');
        return;
      }

      const res = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          tree,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Aktualisieren');
      }

      setIsEditDialogOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler beim Aktualisieren');
    }
  };

  const handleDelete = async (template: Template) => {
    if (!confirm(`Template "${template.name}" wirklich löschen?`)) return;

    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fehler beim Löschen');
      }

      fetchTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Fehler beim Löschen');
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      slug: template.slug,
      description: template.description || '',
      thumbnail: template.thumbnail || '',
      category: template.category,
      style: template.style || '',
      websiteType: template.websiteType || '',
      tags: template.tags.join(', '),
      tree: JSON.stringify(template.tree, null, 2),
      isPro: template.isPro,
      isPublished: template.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const handleDuplicate = async (template: Template) => {
    setFormData({
      name: `${template.name} (Kopie)`,
      slug: `${template.slug}-copy`,
      description: template.description || '',
      thumbnail: template.thumbnail || '',
      category: template.category,
      style: template.style || '',
      websiteType: template.websiteType || '',
      tags: template.tags.join(', '),
      tree: JSON.stringify(template.tree, null, 2),
      isPro: template.isPro,
      isPublished: false,
    });
    setIsCreateDialogOpen(true);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Templates werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Fehler</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const TemplateFormDialog = ({ 
    isOpen, 
    onOpenChange, 
    title, 
    description, 
    onSubmit, 
    submitLabel 
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onSubmit: () => void;
    submitLabel: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                placeholder="Handwerker Hero"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="handwerker-hero"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Eine moderne Hero-Sektion für Handwerkerbetriebe..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteType">Website-Typ</Label>
              <Input
                id="websiteType"
                value={formData.websiteType}
                onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                placeholder="handwerker, restaurant, ..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Stil</Label>
              <Input
                id="style"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="modern, classic, minimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (kommagetrennt)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="handwerker, kontakt, modern"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tree">Template Tree (JSON) *</Label>
            <Textarea
              id="tree"
              value={formData.tree}
              onChange={(e) => setFormData({ ...formData, tree: e.target.value })}
              placeholder='{ "root": { "type": "Root", ... } }'
              className="font-mono text-sm min-h-[200px]"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="isPro"
                checked={formData.isPro}
                onCheckedChange={(v) => setFormData({ ...formData, isPro: v })}
              />
              <Label htmlFor="isPro">Pro Template</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(v) => setFormData({ ...formData, isPublished: v })}
              />
              <Label htmlFor="isPublished">Veröffentlicht</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={onSubmit}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Template-Verwaltung</h1>
            <p className="text-muted-foreground">
              Erstelle und verwalte Templates für alle Benutzer
            </p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Templates suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-muted-foreground text-sm">Gesamt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isPublished).length}
            </div>
            <p className="text-muted-foreground text-sm">Veröffentlicht</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isPro).length}
            </div>
            <p className="text-muted-foreground text-sm">Pro Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {templates.filter(t => t.category === 'FULL_PAGE').length}
            </div>
            <p className="text-muted-foreground text-sm">Komplette Seiten</p>
          </CardContent>
        </Card>
      </div>

      {/* Template List */}
      <div className="grid gap-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'Keine Templates gefunden.' 
                  : 'Noch keine Templates vorhanden. Erstelle dein erstes Template!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map(template => (
            <Card key={template.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{template.name}</h3>
                      <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
                      {template.isPro && (
                        <Badge className="bg-amber-500">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      {template.isSystem && (
                        <Badge variant="secondary">System</Badge>
                      )}
                      {!template.isPublished && (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Entwurf
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {template.description || 'Keine Beschreibung'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Slug: <code className="bg-muted px-1 rounded">{template.slug}</code></span>
                      {template.websiteType && <span>Typ: {template.websiteType}</span>}
                      {template.tags.length > 0 && (
                        <span>Tags: {template.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                      title="Duplizieren"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      title="Bearbeiten"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      disabled={template.isSystem}
                      title={template.isSystem ? 'System-Templates können nicht gelöscht werden' : 'Löschen'}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {template.category === 'FULL_PAGE' && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        title="Im Editor öffnen"
                      >
                        <a href={`http://localhost:5173/?templateId=${template.id}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" /> Im Editor öffnen
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Dialog */}
      <TemplateFormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Neues Template erstellen"
        description="Erstelle ein neues Template, das für alle Benutzer verfügbar ist."
        onSubmit={handleCreate}
        submitLabel="Template erstellen"
      />

      {/* Edit Dialog */}
      <TemplateFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Template bearbeiten"
        description={`Bearbeite das Template "${editingTemplate?.name}".`}
        onSubmit={handleUpdate}
        submitLabel="Änderungen speichern"
      />
    </div>
  );
}
