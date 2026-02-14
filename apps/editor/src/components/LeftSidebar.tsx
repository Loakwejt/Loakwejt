'use client';

import { useState } from 'react';
import { cn, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@builderly/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PagesPanel } from './PagesPanel';

// Inline Layer Panel for Left Sidebar
import { useEditorStore } from '../store/editor-store';
import type { BuilderNode } from '@builderly/core';

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function LeftSidebar({ isCollapsed, onToggleCollapse }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'layers'>('layers');

  return (
    <aside 
      className={cn(
        "flex flex-col border-r border-border bg-[hsl(220,10%,14%)] overflow-hidden",
        "transition-all duration-200 ease-out",
        isCollapsed ? "w-10" : "w-64"
      )}
    >
      {/* Collapsed state - icon buttons */}
      <div className={cn(
        "flex flex-col items-center py-2 gap-1 transition-opacity duration-200",
        isCollapsed ? "opacity-100" : "opacity-0 absolute pointer-events-none"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 mb-2"
          title="Sidebar öffnen"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <button
          onClick={() => { setActiveTab('pages'); onToggleCollapse(); }}
          className={cn(
            "h-8 w-8 rounded text-[10px] font-medium transition-colors",
            activeTab === 'pages' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          title="Seiten"
        >
          P
        </button>
        <button
          onClick={() => { setActiveTab('layers'); onToggleCollapse(); }}
          className={cn(
            "h-8 w-8 rounded text-[10px] font-medium transition-colors",
            activeTab === 'layers' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
          title="Ebenen"
        >
          L
        </button>
      </div>

      {/* Expanded state */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-opacity duration-200",
        isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        {/* Header with collapse button */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-[hsl(220,10%,12%)] shrink-0">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">Navigator</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-6 w-6"
            title="Sidebar schließen"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="h-8 rounded-none border-b border-border bg-[hsl(220,10%,15%)] p-0 justify-start gap-0 w-full shrink-0">
            <TabsTrigger 
              value="pages" 
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-2"
            >
              Seiten
            </TabsTrigger>
            <TabsTrigger 
              value="layers" 
              className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-2"
            >
              Ebenen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="flex-1 overflow-auto m-0">
            <PagesPanel />
          </TabsContent>

          <TabsContent value="layers" className="flex-1 overflow-auto m-0">
            <LayerTree />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

// ============================================================================
// LAYER TREE COMPONENT (Embedded)
// ============================================================================

function LayerTree() {
  const { tree } = useEditorStore();
  
  return (
    <div className="p-1">
      {tree.root.children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xs text-muted-foreground">Keine Elemente</p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            Füge Komponenten hinzu
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {tree.root.children.map((child) => (
            <LayerItem key={child.id} node={child} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LAYER ITEM COMPONENT
// ============================================================================

function LayerItem({ node, depth = 0 }: { node: BuilderNode; depth?: number }) {
  const { selectedNodeId, selectNode, hoveredNodeId, hoverNode } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  
  const displayName = String(node.meta?.name || node.props?.label || node.type);

  // Type icons with colors
  const getTypeIcon = (type: string) => {
    const icons: Record<string, { emoji: string; color: string }> = {
      Section: { emoji: '📦', color: 'text-blue-400' },
      Container: { emoji: '📋', color: 'text-blue-300' },
      Stack: { emoji: '≡', color: 'text-indigo-400' },
      Grid: { emoji: '#', color: 'text-indigo-300' },
      Text: { emoji: 'T', color: 'text-emerald-400' },
      Heading: { emoji: 'H', color: 'text-emerald-300' },
      Image: { emoji: '🖼', color: 'text-pink-400' },
      Button: { emoji: '▣', color: 'text-orange-400' },
      Link: { emoji: '🔗', color: 'text-cyan-400' },
      Input: { emoji: '▢', color: 'text-yellow-400' },
      Form: { emoji: '📝', color: 'text-yellow-300' },
      Card: { emoji: '▭', color: 'text-slate-400' },
      Badge: { emoji: '●', color: 'text-rose-400' },
      Divider: { emoji: '—', color: 'text-gray-400' },
      Spacer: { emoji: '↕', color: 'text-gray-500' },
    };
    return icons[type] || { emoji: '◇', color: 'text-gray-400' };
  };

  const icon = getTypeIcon(node.type);

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-1 py-0.5 rounded-sm cursor-pointer transition-colors text-[11px]',
          'hover:bg-accent/50',
          isSelected && 'bg-primary/20 text-primary-foreground',
          isHovered && !isSelected && 'bg-accent/30'
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => selectNode(node.id)}
        onMouseEnter={() => hoverNode(node.id)}
        onMouseLeave={() => hoverNode(null)}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-90')} />
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Type Icon */}
        <span className={cn('text-[10px] w-4 text-center', icon.color)}>
          {icon.emoji}
        </span>

        {/* Name */}
        <span className="flex-1 truncate">
          {displayName}
        </span>

        {/* Children count */}
        {hasChildren && (
          <span className="text-[9px] text-muted-foreground px-1">
            {node.children.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <LayerItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
