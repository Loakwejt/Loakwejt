import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@builderly/ui';
import { Search, LayoutTemplate, Layers, Database, Loader2, AlertTriangle } from 'lucide-react';
import {
  templateRegistry,
  type TemplateDefinition,
  type FullPageTemplate,
  type TemplateCategory,
  cloneNode,
  applyThemeToNode,
  applyThemeToTree,
} from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@builderly/ui';

// Import templates to register them
import '@builderly/core/templates';

// API URL for loading DB templates
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DbTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: string;
  style: string;
  websiteType: string;
  websiteTypes: string[];
  tags: string[];
  isPro: boolean;
  tree: unknown;
  node?: unknown;
}

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'section' | 'page';
}

export function TemplatePicker({ open, onOpenChange, mode = 'section' }: TemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const { tree, replaceTree, addNode, siteSettings } = useEditorStore();
  
  // Confirmation dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSection, setPendingSection] = useState<TemplateDefinition | null>(null);
  const [pendingPage, setPendingPage] = useState<FullPageTemplate | null>(null);
  
  // DB templates state
  const [dbTemplates, setDbTemplates] = useState<DbTemplate[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch DB templates when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingDb(true);
      setDbError(null);
      fetch(`${API_BASE_URL}/api/templates`)
        .then(res => res.json())
        .then(data => {
          setDbTemplates(data.data || []);
        })
        .catch(err => {
          console.error('Failed to load DB templates:', err);
          setDbError('Konnte DB-Templates nicht laden');
        })
        .finally(() => setLoadingDb(false));
    }
  }, [open]);

  // Convert DB templates to TemplateDefinition / FullPageTemplate format
  const dbSectionTemplates: TemplateDefinition[] = useMemo(() => {
    return dbTemplates
      .filter(t => t.category !== 'full-page')
      .map(t => ({
        id: `db-${t.id}`,
        name: t.name,
        description: t.description,
        category: t.category as TemplateCategory,
        style: t.style as TemplateDefinition['style'],
        websiteTypes: t.websiteTypes as TemplateDefinition['websiteTypes'],
        tags: t.tags,
        thumbnail: t.thumbnail || undefined,
        isPro: t.isPro,
        node: (t.node || t.tree) as TemplateDefinition['node'],
      }));
  }, [dbTemplates]);

  const dbPageTemplates: FullPageTemplate[] = useMemo(() => {
    return dbTemplates
      .filter(t => t.category === 'full-page')
      .map(t => ({
        id: `db-${t.id}`,
        name: t.name,
        description: t.description,
        websiteType: t.websiteType as FullPageTemplate['websiteType'],
        style: t.style as FullPageTemplate['style'],
        tags: t.tags,
        thumbnail: t.thumbnail || undefined,
        isPro: t.isPro,
        tree: t.tree as FullPageTemplate['tree'],
      }));
  }, [dbTemplates]);

  // Get all templates (registry + DB)
  const sectionTemplates = useMemo(() => [
    ...templateRegistry.getAllSections(),
    ...dbSectionTemplates,
  ], [dbSectionTemplates]);
  
  const pageTemplates = useMemo(() => [
    ...templateRegistry.getAllPages(),
    ...dbPageTemplates,
  ], [dbPageTemplates]);
  
  const categories = useMemo(() => {
    const registryCategories = templateRegistry.getAvailableCategories();
    const dbCategories = dbSectionTemplates.map(t => t.category);
    return [...new Set([...registryCategories, ...dbCategories])];
  }, [dbSectionTemplates]);

  // Filter templates
  const filteredSections = useMemo(() => {
    let templates = sectionTemplates;
    
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory);
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }
    
    return templates;
  }, [sectionTemplates, selectedCategory, search]);

  const filteredPages = useMemo(() => {
    if (!search) return pageTemplates;
    
    const lowerSearch = search.toLowerCase();
    return pageTemplates.filter(t =>
      t.name.toLowerCase().includes(lowerSearch) ||
      t.description.toLowerCase().includes(lowerSearch) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }, [pageTemplates, search]);

  const handleSelectSection = (template: TemplateDefinition) => {
    // Show confirmation dialog
    setPendingSection(template);
    setPendingPage(null);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSection = () => {
    if (!pendingSection) return;
    
    // Clone the template node with new IDs
    const clonedNode = cloneNode(pendingSection.node, true);
    
    // Apply theme colors from site settings to the template
    const themedNode = applyThemeToNode(clonedNode, siteSettings.theme.colors);
    
    // Add to the current tree at root level
    const newTree = {
      ...tree,
      root: {
        ...tree.root,
        children: [...tree.root.children, themedNode],
      },
    };
    
    replaceTree(newTree);
    setConfirmDialogOpen(false);
    setPendingSection(null);
    onOpenChange(false);
  };

  const handleSelectPage = (template: FullPageTemplate) => {
    // Show confirmation dialog
    setPendingPage(template);
    setPendingSection(null);
    setConfirmDialogOpen(true);
  };

  const handleConfirmPage = () => {
    if (!pendingPage) return;
    
    // Replace entire tree with the page template
    const clonedTree = {
      builderVersion: pendingPage.tree.builderVersion ?? 1,
      root: cloneNode(pendingPage.tree.root, true),
    };
    
    // Apply theme colors from site settings to the entire template
    const themedTree = applyThemeToTree(clonedTree, siteSettings.theme.colors);
    
    // Ensure builderVersion is set (required by BuilderTree)
    replaceTree({
      ...themedTree,
      builderVersion: themedTree.builderVersion ?? 1,
    });
    setConfirmDialogOpen(false);
    setPendingPage(null);
    onOpenChange(false);
  };

  const handleCancelConfirm = () => {
    setConfirmDialogOpen(false);
    setPendingSection(null);
    setPendingPage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Vorlagen-Bibliothek
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Vorlagen suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue={mode} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="section" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Sektionen
              </TabsTrigger>
              <TabsTrigger value="page" className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Ganze Seiten
              </TabsTrigger>
            </TabsList>

            {/* Section Templates */}
            <TabsContent value="section" className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Alle
                </Button>
                {categories.map(category => {
                  const info = templateRegistry.getCategoryInfo(category);
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {info.icon} {info.name}
                    </Button>
                  );
                })}
              </div>

              {/* Loading indicator */}
              {loadingDb && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Lade Online-Templates...
                </div>
              )}

              {/* Template Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredSections.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => handleSelectSection(template)}
                      isFromDb={template.id.startsWith('db-')}
                    />
                  ))}
                </div>
                {filteredSections.length === 0 && !loadingDb && (
                  <div className="text-center text-muted-foreground py-8">
                    Keine Vorlagen zu deiner Suche gefunden.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Page Templates */}
            <TabsContent value="page" className="flex-1 overflow-y-auto mt-4">
              {loadingDb && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Lade Online-Templates...
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {filteredPages.map(template => (
                  <PageTemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectPage(template)}
                    isFromDb={template.id.startsWith('db-')}
                  />
                ))}
              </div>
              {filteredPages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Keine Seitenvorlagen zu deiner Suche gefunden.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {pendingPage ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Seite ersetzen?
                </>
              ) : (
                <>
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                  Template hinzufügen?
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingPage ? (
                <>
                  Möchtest du das Template <strong>"{pendingPage.name}"</strong> verwenden? 
                  <span className="text-destructive font-medium block mt-2">
                    ⚠️ Achtung: Dies ersetzt den gesamten aktuellen Seiteninhalt!
                  </span>
                </>
              ) : pendingSection ? (
                <>
                  Möchtest du die Sektion <strong>"{pendingSection.name}"</strong> zu deiner Seite hinzufügen?
                  <span className="text-muted-foreground block mt-2">
                    Die Sektion wird am Ende der Seite eingefügt.
                  </span>
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelConfirm}>
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={pendingPage ? handleConfirmPage : handleConfirmSection}
              className={pendingPage ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              {pendingPage ? 'Seite ersetzen' : 'Hinzufügen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

// Section Template Card
function TemplateCard({
  template,
  onClick,
  isFromDb,
}: {
  template: TemplateDefinition;
  onClick: () => void;
  isFromDb?: boolean;
}) {
  const categoryInfo = templateRegistry.getCategoryInfo(template.category);

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col border rounded-lg overflow-hidden text-left transition-all',
        'hover:border-primary hover:shadow-md'
      )}
    >
      {/* Preview Area */}
      <div className="h-32 bg-muted flex items-center justify-center text-4xl relative">
        {categoryInfo.icon}
        {isFromDb && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Database className="h-3 w-3" />
              Online
            </Badge>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm">{template.name}</h4>
          {template.isPro && (
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}

// Page Template Card
function PageTemplateCard({
  template,
  onClick,
  isFromDb,
}: {
  template: FullPageTemplate;
  onClick: () => void;
  isFromDb?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col border rounded-lg overflow-hidden text-left transition-all',
        'hover:border-primary hover:shadow-md'
      )}
    >
      {/* Preview Area */}
      <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
        <div className="text-6xl">📄</div>
        {isFromDb && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <Database className="h-3 w-3" />
              Online
            </Badge>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm">{template.name}</h4>
          {template.isPro && (
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs capitalize">
            {template.websiteType}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {template.style}
          </Badge>
        </div>
      </div>
    </button>
  );
}

// Export a button component to open the template picker
export function TemplatePickerButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <LayoutTemplate className="h-4 w-4" />
        Vorlagen
      </Button>
      <TemplatePicker open={open} onOpenChange={setOpen} />
    </>
  );
}
