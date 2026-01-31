'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Input, Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@builderly/ui';
import { Search, X, GripVertical, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { componentRegistry, type ComponentDefinition } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import type { DragData } from './DndProvider';

// Compact icon mapping
const ICON_MAP: Record<string, string> = {
  layout: '📐', type: '📝', heading: '🔤', image: '🖼️', square: '⬜',
  layers: '📚', grid: '⊞', minus: '➖', smile: '😊', 'credit-card': '💳',
  tag: '🏷️', 'alert-circle': '⚠️', 'file-text': '📄', 'text-cursor-input': '✏️',
  'align-left': '≡', 'chevron-down': '⌄', 'check-square': '☑️', send: '📤',
  menu: '☰', 'panel-bottom': '▬', link: '🔗', list: '📋', shield: '🛡️',
  play: '▶️', 'map-pin': '📍', share: '📱', folder: '📁', file: '📄',
  loader: '⏳', star: '⭐', hash: '#️⃣', quote: '💬', 'message-circle': '💭',
  user: '👤', megaphone: '📢', table: '📊', code: '💻', 'git-branch': '🌿',
  clock: '⏰', 'arrow-right': '→', 'move-vertical': '↕️',
};

interface DraggableItemProps {
  component: ComponentDefinition;
  onAdd: (component: ComponentDefinition) => void;
}

function DraggableItem({ component, onAdd }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `floating-palette-${component.type}`,
    data: {
      type: 'new-component',
      componentType: component.type,
    } as DragData,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const icon = ICON_MAP[component.icon] || '📦';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onClick={() => onAdd(component)}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg border bg-background',
            'hover:bg-muted hover:border-primary/50 hover:scale-105',
            'transition-all duration-150 cursor-grab active:cursor-grabbing',
            isDragging && 'opacity-50 scale-110 shadow-lg z-50'
          )}
        >
          <span className="text-lg">{icon}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[200px]">
        <p className="font-medium">{component.displayName}</p>
        <p className="text-xs text-muted-foreground">{component.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingPalette() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { selectedNodeId, addNode, tree } = useEditorStore();

  const groupedComponents = componentRegistry.getGroupedByCategory();

  // Filter components
  const filteredGroups = search
    ? new Map(
        Array.from(groupedComponents.entries()).map(([category, components]) => [
          category,
          components.filter(
            (c) =>
              c.displayName.toLowerCase().includes(search.toLowerCase()) ||
              c.type.toLowerCase().includes(search.toLowerCase())
          ),
        ])
      )
    : groupedComponents;

  // Get only categories with components
  const categoriesWithComponents = Array.from(filteredGroups.entries())
    .filter(([_, components]) => components.length > 0);

  const handleAddComponent = (component: ComponentDefinition) => {
    const parentId = selectedNodeId || 'root';
    addNode(parentId, component.type);
  };

  // Category icons
  const categoryIcons: Record<string, string> = {
    layout: '🏗️', content: '✍️', typography: '✍️', media: '📸',
    forms: '📝', navigation: '🧭', feedback: '💬', data: '📊',
    advanced: '⚡', ui: '🎨', cards: '🃏', marketing: '📢', social: '📱',
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-background/95 backdrop-blur border rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <span className="text-sm font-semibold">Components</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Search */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-7 pl-7 pr-7 text-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1 p-2 overflow-x-auto border-b scrollbar-hide">
            <Button
              variant={activeCategory === null ? 'default' : 'ghost'}
              size="sm"
              className="h-6 px-2 text-xs flex-shrink-0"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Button>
            {categoriesWithComponents.map(([category]) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-xs flex-shrink-0"
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="mr-1">{categoryIcons[category.id] || '📦'}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Components Grid */}
          <div className="max-h-64 overflow-y-auto p-2">
            {categoriesWithComponents
              .filter(([category]) => !activeCategory || category.id === activeCategory)
              .map(([category, components]) => (
                <div key={category.id} className="mb-3 last:mb-0">
                  {!activeCategory && (
                    <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <span>{categoryIcons[category.id] || '📦'}</span>
                      {category.name}
                    </div>
                  )}
                  <div className="grid grid-cols-5 gap-1.5">
                    {components.map((component) => (
                      <DraggableItem
                        key={component.type}
                        component={component}
                        onAdd={handleAddComponent}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
