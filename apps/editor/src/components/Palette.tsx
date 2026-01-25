import { useState } from 'react';
import { Input, Separator } from '@builderly/ui';
import { Search } from 'lucide-react';
import { componentRegistry, type ComponentDefinition } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';

// Icon mapping (simple approach)
const ICON_MAP: Record<string, string> = {
  layout: '📐',
  type: '📝',
  heading: '🔤',
  image: '🖼️',
  square: '⬜',
  layers: '📚',
  grid: '⊞',
  minus: '➖',
  'move-vertical': '↕️',
  smile: '😊',
  'credit-card': '💳',
  tag: '🏷️',
  'alert-circle': '⚠️',
  'file-text': '📄',
  'text-cursor-input': '✏️',
  'align-left': '≡',
  'chevron-down': '⌄',
  'check-square': '☑️',
  send: '📤',
  menu: '☰',
  'panel-bottom': '▬',
  link: '🔗',
  list: '📋',
  'chevrons-left-right': '⟷',
  shield: '🛡️',
};

export function Palette() {
  const [search, setSearch] = useState('');
  const { selectedNodeId, addNode, tree } = useEditorStore();

  const categories = componentRegistry.getCategories();
  const groupedComponents = componentRegistry.getGroupedByCategory();

  const filteredGroups = search
    ? new Map(
        Array.from(groupedComponents.entries()).map(([category, components]) => [
          category,
          components.filter(
            (c) =>
              c.displayName.toLowerCase().includes(search.toLowerCase()) ||
              c.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
          ),
        ])
      )
    : groupedComponents;

  const handleAddComponent = (component: ComponentDefinition) => {
    // Determine where to add the component
    let targetParentId = selectedNodeId || 'root';
    
    // If selected node can't have children, add to its parent (root)
    if (selectedNodeId) {
      const selectedDef = componentRegistry.get(
        findNodeType(tree.root, selectedNodeId) || ''
      );
      if (selectedDef && !selectedDef.canHaveChildren) {
        targetParentId = 'root';
      }
    }

    addNode(targetParentId, component.type);
  };

  // Find node type by ID
  const findNodeType = (
    node: { id: string; type: string; children: Array<{ id: string; type: string; children: unknown[] }> },
    id: string
  ): string | null => {
    if (node.id === id) return node.type;
    for (const child of node.children) {
      const found = findNodeType(child as typeof node, id);
      if (found) return found;
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold">Components</h2>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Component groups */}
      <div className="space-y-4">
        {Array.from(filteredGroups.entries()).map(([category, components]) => {
          if (components.length === 0) return null;
          
          return (
            <div key={category.id}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {components.map((component) => (
                  <button
                    key={component.type}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border bg-card hover:bg-accent hover:border-accent-foreground/20 transition-colors text-center component-item"
                    onClick={() => handleAddComponent(component)}
                    title={component.description}
                  >
                    <span className="text-lg">
                      {ICON_MAP[component.icon] || '📦'}
                    </span>
                    <span className="text-xs font-medium truncate w-full">
                      {component.displayName}
                    </span>
                  </button>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
