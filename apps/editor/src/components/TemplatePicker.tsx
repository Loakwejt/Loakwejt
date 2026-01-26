import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from '@builderly/ui';
import { Search, LayoutTemplate, Layers } from 'lucide-react';
import {
  templateRegistry,
  type TemplateDefinition,
  type FullPageTemplate,
  type TemplateCategory,
  cloneNode,
} from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@builderly/ui';

// Import templates to register them
import '@builderly/core/templates';

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'section' | 'page';
}

export function TemplatePicker({ open, onOpenChange, mode = 'section' }: TemplatePickerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const { tree, setTree, addNode } = useEditorStore();

  // Get all templates
  const sectionTemplates = useMemo(() => templateRegistry.getAllSections(), []);
  const pageTemplates = useMemo(() => templateRegistry.getAllPages(), []);
  const categories = useMemo(() => templateRegistry.getAvailableCategories(), []);

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
    // Clone the template node with new IDs
    const clonedNode = cloneNode(template.node, true);
    
    // Add to the current tree at root level
    const newTree = {
      ...tree,
      root: {
        ...tree.root,
        children: [...tree.root.children, clonedNode],
      },
    };
    
    setTree(newTree);
    onOpenChange(false);
  };

  const handleSelectPage = (template: FullPageTemplate) => {
    // Replace entire tree with the page template
    const clonedTree = {
      ...template.tree,
      root: cloneNode(template.tree.root, true),
    };
    
    setTree(clonedTree);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Template Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
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
                Sections
              </TabsTrigger>
              <TabsTrigger value="page" className="flex items-center gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Full Pages
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
                  All
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

              {/* Template Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredSections.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onClick={() => handleSelectSection(template)}
                    />
                  ))}
                </div>
                {filteredSections.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No templates found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Page Templates */}
            <TabsContent value="page" className="flex-1 overflow-y-auto mt-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredPages.map(template => (
                  <PageTemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => handleSelectPage(template)}
                  />
                ))}
              </div>
              {filteredPages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No page templates found matching your search.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Section Template Card
function TemplateCard({
  template,
  onClick,
}: {
  template: TemplateDefinition;
  onClick: () => void;
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
      <div className="h-32 bg-muted flex items-center justify-center text-4xl">
        {categoryInfo.icon}
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
}: {
  template: FullPageTemplate;
  onClick: () => void;
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
      <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="text-6xl">📄</div>
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
        Templates
      </Button>
      <TemplatePicker open={open} onOpenChange={setOpen} />
    </>
  );
}
