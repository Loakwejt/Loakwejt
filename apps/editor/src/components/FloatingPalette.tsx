'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Input, Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@builderly/ui';
import { Search, X, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { componentRegistry, type ComponentDefinition } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import type { DragData } from './DndProvider';

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

  // Get short abbreviation from component name (first 2-3 letters)
  const abbr = component.type.slice(0, 3).toUpperCase();

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
            'h-9 px-2 flex items-center justify-center rounded border bg-[hsl(220,10%,18%)]',
            'hover:bg-[hsl(220,10%,25%)] hover:border-primary/50',
            'transition-all duration-150 cursor-grab active:cursor-grabbing',
            'text-[10px] font-medium text-muted-foreground hover:text-foreground',
            isDragging && 'opacity-50 scale-105 shadow-lg z-50'
          )}
        >
          {abbr}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-10 w-10 rounded-lg shadow-lg text-xs font-medium"
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-[hsl(220,10%,14%)] border border-border rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(220,10%,12%)] border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Komponenten</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="h-7 pl-7 pr-7 text-xs bg-[hsl(220,10%,18%)] border-border"
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
          <div className="flex gap-1 p-2 overflow-x-auto border-b border-border scrollbar-hide">
            <button
              className={cn(
                "h-6 px-2 text-[10px] font-medium rounded flex-shrink-0 transition-colors",
                activeCategory === null 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setActiveCategory(null)}
            >
              Alle
            </button>
            {categoriesWithComponents.map(([category]) => (
              <button
                key={category.id}
                className={cn(
                  "h-6 px-2 text-[10px] font-medium rounded flex-shrink-0 transition-colors",
                  activeCategory === category.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Components Grid */}
          <div className="max-h-64 overflow-y-auto p-2">
            {categoriesWithComponents
              .filter(([category]) => !activeCategory || category.id === activeCategory)
              .map(([category, components]) => (
                <div key={category.id} className="mb-3 last:mb-0">
                  {!activeCategory && (
                    <div className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                      {category.name}
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-1">
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
