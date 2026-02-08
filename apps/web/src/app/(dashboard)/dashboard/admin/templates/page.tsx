'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
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
  DialogFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
  ChevronDown,
  ChevronRight,
  Layout,
  Puzzle,
  FileText,
  Sparkles,
  MessageSquare,
  Users,
  HelpCircle,
  Image,
  BarChart3,
  ShoppingCart,
  DollarSign,
  Phone,
  Megaphone,
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

// Section modules - not full pages
const MODULE_CATEGORIES = [
  'HEADER', 'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 
  'CONTACT', 'TEAM', 'FAQ', 'FOOTER', 'GALLERY', 'STATS', 'BLOG',
  'ECOMMERCE', 'CONTENT'
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

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  HERO: <Sparkles className="h-4 w-4" />,
  FEATURES: <Puzzle className="h-4 w-4" />,
  PRICING: <DollarSign className="h-4 w-4" />,
  TESTIMONIALS: <MessageSquare className="h-4 w-4" />,
  CTA: <Megaphone className="h-4 w-4" />,
  CONTACT: <Phone className="h-4 w-4" />,
  TEAM: <Users className="h-4 w-4" />,
  FAQ: <HelpCircle className="h-4 w-4" />,
  FOOTER: <Layout className="h-4 w-4" />,
  HEADER: <Layout className="h-4 w-4" />,
  GALLERY: <Image className="h-4 w-4" />,
  STATS: <BarChart3 className="h-4 w-4" />,
  BLOG: <FileText className="h-4 w-4" />,
  ECOMMERCE: <ShoppingCart className="h-4 w-4" />,
  CONTENT: <FileText className="h-4 w-4" />,
  FULL_PAGE: <Layout className="h-4 w-4" />,
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState('full-pages');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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

  // Split templates by type
  const fullPageTemplates = templates.filter(t => t.category === 'FULL_PAGE');
  const moduleTemplates = templates.filter(t => t.category !== 'FULL_PAGE');

  // Get templates by category
  const getTemplatesByCategory = (category: string) => 
    moduleTemplates.filter(t => t.category === category);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Template-Verwaltung</h1>
            <p className="text-muted-foreground text-sm">
              Erstelle und verwalte Templates für alle Benutzer
            </p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-muted-foreground text-sm">Gesamt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.isPublished).length}
            </div>
            <p className="text-muted-foreground text-sm">Veröffentlicht</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-500">
              {templates.filter(t => t.isPro).length}
            </div>
            <p className="text-muted-foreground text-sm">Pro Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {moduleTemplates.length}
            </div>
            <p className="text-muted-foreground text-sm">Module</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full-pages" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Komplette Seiten
            <Badge variant="secondary" className="ml-1">{fullPageTemplates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Module
            <Badge variant="secondary" className="ml-1">{moduleTemplates.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Full Pages Tab */}
        <TabsContent value="full-pages" className="space-y-4">
          {fullPageTemplates.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  Noch keine kompletten Seiten-Templates vorhanden.
                </p>
                <Button onClick={() => { resetForm(); setFormData(prev => ({ ...prev, category: 'FULL_PAGE' })); setIsCreateDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Erstes Seiten-Template erstellen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fullPageTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-3">
          {MODULE_CATEGORIES.map(category => {
            const categoryTemplates = getTemplatesByCategory(category);
            const isExpanded = expandedCategories.includes(category);
            
            return (
              <Card key={category} className="overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      {CATEGORY_ICONS[category]}
                    </div>
                    <div>
                      <h3 className="font-medium">{CATEGORY_LABELS[category]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryTemplates.length} Template{categoryTemplates.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                        setFormData(prev => ({ ...prev, category }));
                        setIsCreateDialogOpen(true);
                      }}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Hinzufügen
                    </Button>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="border-t">
                    {categoryTemplates.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground text-sm">
                        Noch keine {CATEGORY_LABELS[category]} Templates vorhanden.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {categoryTemplates.map(template => (
                          <TemplateCard key={template.id} template={template} compact />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

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

  // Template Card Component
  function TemplateCard({ template, compact = false }: { template: Template; compact?: boolean }) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className={`${compact ? 'aspect-[16/9]' : 'aspect-video'} bg-muted relative overflow-hidden`}>
          {template.thumbnail ? (
            <img 
              src={template.thumbnail} 
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
              <span className="text-3xl opacity-50">{CATEGORY_ICONS[template.category] || '📄'}</span>
            </div>
          )}
          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {template.isPro && (
              <Badge className="bg-amber-500 text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
            {template.isSystem && (
              <Badge variant="secondary" className="text-xs">System</Badge>
            )}
            {!template.isPublished && (
              <Badge variant="secondary" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                Entwurf
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className={compact ? 'p-3' : 'p-4'}>
          {/* Title */}
          <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} mb-1 line-clamp-1`}>{template.name}</h3>
          
          {/* Description */}
          {!compact && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
              {template.description || 'Keine Beschreibung'}
            </p>
          )}
          
          {/* Actions */}
          <div className={`flex items-center justify-between ${compact ? 'pt-2' : 'pt-3 border-t'}`}>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDuplicate(template)}
                title="Duplizieren"
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(template)}
                title="Bearbeiten"
                className="h-7 w-7 p-0"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(template)}
                disabled={template.isSystem}
                title={template.isSystem ? 'System-Templates können nicht gelöscht werden' : 'Löschen'}
                className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {template.category === 'FULL_PAGE' && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <a href={`http://localhost:5173/?templateId=${template.id}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-3 w-3 mr-1" /> Öffnen
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}
