'use client';

import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Input, cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@builderly/ui';
import { Search } from 'lucide-react';
import { templateRegistry } from '@builderly/core';
import type { BuilderNode, TemplateDefinition } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import type { DragData } from './DndProvider';

// Category icons and colors for sections
const SECTION_CATEGORY_STYLES: Record<string, { icon: string; label: string; color: string }> = {
  hero: { icon: '🦸', label: 'Hero', color: 'text-blue-400' },
  features: { icon: '✨', label: 'Features', color: 'text-purple-400' },
  pricing: { icon: '💰', label: 'Pricing', color: 'text-green-400' },
  testimonials: { icon: '💬', label: 'Bewertungen', color: 'text-yellow-400' },
  cta: { icon: '📣', label: 'Call-to-Action', color: 'text-orange-400' },
  contact: { icon: '✉️', label: 'Kontakt', color: 'text-pink-400' },
  team: { icon: '👥', label: 'Team', color: 'text-cyan-400' },
  faq: { icon: '❓', label: 'FAQ', color: 'text-indigo-400' },
  footer: { icon: '📌', label: 'Footer', color: 'text-gray-400' },
  header: { icon: '🧭', label: 'Header', color: 'text-sky-400' },
  gallery: { icon: '🖼️', label: 'Galerie', color: 'text-rose-400' },
  stats: { icon: '📊', label: 'Statistiken', color: 'text-emerald-400' },
  blog: { icon: '📝', label: 'Blog', color: 'text-violet-400' },
  ecommerce: { icon: '🛒', label: 'Shop', color: 'text-green-400' },
  content: { icon: '📄', label: 'Inhalt', color: 'text-slate-400' },
};

interface DraggableSectionProps {
  template: TemplateDefinition;
  onAdd: (template: TemplateDefinition) => void;
}

function DraggableSection({ template, onAdd }: DraggableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `section-${template.id}`,
    data: {
      type: 'section-template',
      templateId: template.id,
      node: template.node,
    } as DragData,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const categoryStyle = SECTION_CATEGORY_STYLES[template.category] || { icon: '📦', label: template.category, color: 'text-muted-foreground' };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => onAdd(template)}
            className={cn(
              'w-full p-3 rounded-lg border text-left transition-all duration-150',
              'bg-card/50 border-border/50',
              'hover:bg-accent hover:border-border',
              'cursor-grab active:cursor-grabbing',
              isDragging && 'opacity-50 ring-2 ring-primary'
            )}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">{categoryStyle.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-foreground truncate">
                  {template.name}
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {template.description}
                </div>
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="left" 
          className="max-w-[250px] p-3 bg-popover border shadow-lg"
          sideOffset={5}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryStyle.icon}</span>
              <span className="font-semibold text-sm">{template.name}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {template.description}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {template.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type FilterType = 'all' | 'shop' | 'general';

// Map WorkspaceType to default filter and available filters
const WORKSPACE_TYPE_CONFIG: Record<string, { defaultFilter: FilterType; showShopFilter: boolean }> = {
  SHOP: { defaultFilter: 'shop', showShopFilter: true },
  WEBSITE: { defaultFilter: 'all', showShopFilter: true },
  BLOG: { defaultFilter: 'general', showShopFilter: false },
  FORUM: { defaultFilter: 'general', showShopFilter: false },
  WIKI: { defaultFilter: 'general', showShopFilter: false },
  PORTFOLIO: { defaultFilter: 'general', showShopFilter: false },
  LANDING: { defaultFilter: 'all', showShopFilter: true },
};

export function SectionPicker() {
  const [search, setSearch] = useState('');
  const { addNode, selectedNodeId, workspaceType } = useEditorStore();
  
  // Get config for current workspace type
  const config = WORKSPACE_TYPE_CONFIG[workspaceType] || { defaultFilter: 'all', showShopFilter: true };
  
  // Initialize filter based on workspace type
  const [filter, setFilter] = useState<FilterType>(config.defaultFilter);

  // Get all section templates from registry
  const allSections = useMemo(() => templateRegistry.getAllSections(), []);

  // Filter sections
  const filteredSections = useMemo(() => {
    let sections = allSections;

    // Apply category filter
    if (filter === 'shop') {
      sections = sections.filter(s => s.category === 'ecommerce');
    } else if (filter === 'general') {
      sections = sections.filter(s => s.category !== 'ecommerce');
    }

    // Apply search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      sections = sections.filter(s =>
        s.name.toLowerCase().includes(lowerSearch) ||
        s.description.toLowerCase().includes(lowerSearch) ||
        s.tags.some((tag: string) => tag.toLowerCase().includes(lowerSearch))
      );
    }

    return sections;
  }, [allSections, filter, search]);

  // Group by category
  const groupedSections = useMemo(() => {
    const grouped = new Map<string, TemplateDefinition[]>();
    for (const section of filteredSections) {
      const existing = grouped.get(section.category) || [];
      existing.push(section);
      grouped.set(section.category, existing);
    }
    return grouped;
  }, [filteredSections]);

  const handleAddSection = (template: TemplateDefinition) => {
    // Clone the node and generate new IDs
    const clonedNode = cloneNodeWithNewIds(template.node);
    
    // Add to root or selected parent
    const parentId = selectedNodeId || 'root';
    
    // Use the store's insertNodeTree to add the section
    useEditorStore.getState().insertNodeTree(parentId, clonedNode);
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(220,10%,14%)]">
      {/* Filter Buttons */}
      <div className="p-2 border-b border-border flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors',
            filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
          )}
        >
          Alle
        </button>
        {config.showShopFilter && (
          <button
            onClick={() => setFilter('shop')}
            className={cn(
              'flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors flex items-center justify-center gap-1',
              filter === 'shop' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            <span>🛒</span> Shop
          </button>
        )}
        <button
          onClick={() => setFilter('general')}
          className={cn(
            'flex-1 px-2 py-1.5 rounded text-[10px] font-medium transition-colors',
            filter === 'general' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted'
          )}
        >
          Allgemein
        </button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Sektionen suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-6 pl-7 pr-2 text-[11px] bg-input border-0 rounded-[3px]"
          />
        </div>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-auto p-2 space-y-4">
        {Array.from(groupedSections.entries()).map(([category, sections]) => {
          const categoryStyle = SECTION_CATEGORY_STYLES[category] || { icon: '📦', label: category, color: 'text-muted-foreground' };
          
          return (
            <div key={category}>
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className={cn("text-[11px]", categoryStyle.color)}>{categoryStyle.icon}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
                  {categoryStyle.label}
                </span>
                <span className="text-[9px] text-muted-foreground ml-auto">
                  {sections.length}
                </span>
              </div>
              <div className="space-y-1.5">
                {sections.map((section) => (
                  <DraggableSection
                    key={section.id}
                    template={section}
                    onAdd={handleAddSection}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filteredSections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-[11px]">Keine Sektionen gefunden</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to clone a node with new IDs
function cloneNodeWithNewIds(node: BuilderNode): BuilderNode {
  const generateId = () => `${node.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  
  const cloneRecursive = (n: BuilderNode): BuilderNode => ({
    ...n,
    id: generateId(),
    children: n.children.map((child: BuilderNode) => cloneRecursive(child)),
  });
  
  return cloneRecursive(node);
}
