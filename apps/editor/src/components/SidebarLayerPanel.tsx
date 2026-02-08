import { useState, useRef, useEffect } from 'react';
import { cn, Button, ScrollArea, Input, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuLabel, DropdownMenuSeparator } from '@builderly/ui';
import { 
  ChevronDown, 
  ChevronRight, 
  Trash2,
  Copy,
  Layers,
  Pencil,
  Check,
  X,
  ArrowRightLeft,
  MoreHorizontal
} from 'lucide-react';
import { useEditorStore } from '../store/editor-store';
import type { BuilderNode } from '@builderly/core';

// Component categories for swap menu
const swapCategories: Record<string, { label: string; types: string[] }> = {
  layout: { label: '📐 Layout', types: ['Section', 'Container', 'Stack', 'Grid'] },
  text: { label: '📝 Text', types: ['Text', 'Heading', 'Link'] },
  media: { label: '🖼️ Medien', types: ['Image', 'Icon', 'Avatar'] },
  interactive: { label: '👆 Interaktiv', types: ['Button', 'Link', 'Badge'] },
  form: { label: '📋 Formular', types: ['Input', 'Textarea', 'Form'] },
  cards: { label: '🃏 Karten', types: ['Card', 'FeatureCard', 'PricingCard', 'TestimonialCard'] },
};

// Component type icon with color
function TypeIcon({ type }: { type: string }) {
  const iconMap: Record<string, { letter: string; bg: string; text: string }> = {
    // Layout
    Section: { letter: 'S', bg: 'bg-blue-500', text: 'text-white' },
    Container: { letter: 'C', bg: 'bg-blue-400', text: 'text-white' },
    Stack: { letter: '≡', bg: 'bg-indigo-500', text: 'text-white' },
    Grid: { letter: '#', bg: 'bg-indigo-400', text: 'text-white' },
    // Content
    Text: { letter: 'T', bg: 'bg-emerald-500', text: 'text-white' },
    Heading: { letter: 'H', bg: 'bg-emerald-600', text: 'text-white' },
    Image: { letter: '🖼', bg: 'bg-pink-500', text: 'text-white' },
    Icon: { letter: '✦', bg: 'bg-purple-500', text: 'text-white' },
    Link: { letter: '🔗', bg: 'bg-cyan-500', text: 'text-white' },
    Button: { letter: 'B', bg: 'bg-orange-500', text: 'text-white' },
    // Form
    Input: { letter: '▢', bg: 'bg-yellow-500', text: 'text-black' },
    Form: { letter: 'F', bg: 'bg-yellow-600', text: 'text-white' },
    Textarea: { letter: '▤', bg: 'bg-yellow-400', text: 'text-black' },
    // Other
    Badge: { letter: '●', bg: 'bg-rose-500', text: 'text-white' },
    Card: { letter: '▭', bg: 'bg-slate-500', text: 'text-white' },
    Divider: { letter: '—', bg: 'bg-gray-400', text: 'text-white' },
    Spacer: { letter: '↕', bg: 'bg-gray-300', text: 'text-gray-600' },
  };

  const icon = iconMap[type] || { letter: type[0]?.toUpperCase() || '?', bg: 'bg-gray-500', text: 'text-white' };

  return (
    <span className={cn(
      'flex-shrink-0 w-3.5 h-3.5 rounded-[2px] text-[8px] font-bold flex items-center justify-center',
      icon.bg,
      icon.text
    )}>
      {icon.letter}
    </span>
  );
}

// Helper function to check if a node contains a descendant with given id
function containsNode(node: BuilderNode, targetId: string): boolean {
  if (node.id === targetId) return true;
  if (node.children) {
    return node.children.some(child => containsNode(child, targetId));
  }
  return false;
}

// Recursive layer item component
function LayerItem({ 
  node, 
  depth = 0 
}: { 
  node: BuilderNode; 
  depth?: number;
}) {
  const { selectedNodeId, selectNode, deleteNode, duplicateNode, replaceNodeType, updateNodeProps } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const isRoot = node.id === 'root';

  // Get display name - priority: meta.name (from template) > props.label (user set) > type
  const displayName = String(node.meta?.name || node.props?.label || node.type);

  // Auto-expand parent nodes when a child is selected
  useEffect(() => {
    if (selectedNodeId && hasChildren && !isExpanded) {
      // Check if selected node is a descendant
      const hasSelectedDescendant = node.children?.some(child => containsNode(child, selectedNodeId));
      if (hasSelectedDescendant) {
        setIsExpanded(true);
      }
    }
  }, [selectedNodeId, hasChildren, node.children]);

  // Auto-scroll to selected item when selection changes
  useEffect(() => {
    if (isSelected && rowRef.current) {
      // Small delay to allow parent expansion animation
      const timer = setTimeout(() => {
        rowRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(displayName);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== displayName) {
      updateNodeProps(node.id, { label: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div>
      <div
        ref={rowRef}
        className={cn(
          'group flex items-center gap-1 py-0.5 px-1.5 cursor-pointer transition-colors text-[11px]',
          'hover:bg-accent/50',
          isSelected && 'bg-primary/15 border-l-2 border-primary'
        )}
        style={{ paddingLeft: `${depth * 10 + 6}px` }}
        onClick={() => !isEditing && selectNode(node.id)}
      >
        {/* Expand/Collapse */}
        <button
          className="p-0.5 hover:bg-muted rounded flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-2.5 w-2.5" />
            ) : (
              <ChevronRight className="h-2.5 w-2.5" />
            )
          ) : (
            <span className="w-2.5" />
          )}
        </button>

        {/* Type Icon */}
        <TypeIcon type={node.type} />

        {/* Component name - editable */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-0.5 min-w-0">
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="h-5 text-[10px] px-1 py-0 flex-1 bg-input border-0 rounded-[2px]"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="p-0.5 hover:bg-green-500/20 hover:text-green-500 rounded-[2px] flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveEdit();
              }}
            >
              <Check className="h-2.5 w-2.5" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 hover:text-destructive rounded-[2px] flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelEdit();
              }}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ) : (
          <>
            <span 
              className="flex-1 truncate text-[11px] min-w-0 text-foreground/80"
              onDoubleClick={handleStartEdit}
            >
              {displayName}
            </span>

            {/* Actions on hover - stays visible when menu is open */}
            {!isRoot && (
              <div className={cn(
                "items-center flex-shrink-0",
                isMenuOpen ? "flex" : "hidden group-hover:flex"
              )}>
                {/* More Actions Dropdown */}
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "p-0.5 rounded-[2px] transition-colors",
                        isMenuOpen ? "bg-accent" : "hover:bg-accent"
                      )}
                      onClick={(e) => e.stopPropagation()}
                      title="Aktionen"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    side="bottom"
                    sideOffset={4}
                    collisionPadding={16}
                    className="w-52 z-[100]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground py-1">
                      {node.type} bearbeiten
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Rename */}
                    <DropdownMenuItem
                      className="text-[11px] gap-2 cursor-pointer h-7"
                      onSelect={() => {
                        setEditName(displayName);
                        setIsEditing(true);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                      Umbenennen
                    </DropdownMenuItem>
                    
                    {/* Duplicate */}
                    <DropdownMenuItem
                      className="text-[11px] gap-2 cursor-pointer h-7"
                      onSelect={() => duplicateNode(node.id)}
                    >
                      <Copy className="h-3 w-3" />
                      Duplizieren
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Swap Type - Sub Menu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-[11px] gap-2 h-7">
                        <ArrowRightLeft className="h-3 w-3" />
                        Typ ändern
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-44 max-h-72 overflow-y-auto">
                        <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground py-1">
                          Aktuell: {node.type}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.entries(swapCategories).map(([key, { label, types }]) => (
                          <div key={key}>
                            <DropdownMenuLabel className="text-[9px] text-muted-foreground/70 py-0.5">
                              {label}
                            </DropdownMenuLabel>
                            {types.map((type) => (
                              <DropdownMenuItem
                                key={type}
                                className={cn(
                                  "text-[11px] gap-2 cursor-pointer h-6",
                                  type === node.type && "bg-accent"
                                )}
                                disabled={type === node.type}
                                onSelect={() => {
                                  if (type !== node.type) {
                                    replaceNodeType(node.id, type);
                                  }
                                }}
                              >
                                <TypeIcon type={type} />
                                <span className="flex-1">{type}</span>
                                {type === node.type && (
                                  <Check className="h-2.5 w-2.5 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </div>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Delete */}
                    <DropdownMenuItem
                      className="text-[11px] gap-2 cursor-pointer h-7 text-destructive focus:text-destructive"
                      onSelect={() => deleteNode(node.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <LayerItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarLayerPanel() {
  const { tree, isLayerPanelOpen } = useEditorStore();

  if (!isLayerPanelOpen) return null;

  return (
    <div className="h-full flex flex-col bg-[hsl(220,10%,14%)]">
      {/* Header - Photoshop style */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(220,10%,12%)] border-b border-border flex-shrink-0">
        <Layers className="h-3 w-3 text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">Layers</span>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="py-0.5">
          {tree?.root ? (
            <LayerItem node={tree.root} />
          ) : (
            <div className="p-4 text-center">
              <div className="text-muted-foreground text-[11px]">
                No elements yet
              </div>
              <div className="text-muted-foreground/60 text-[10px] mt-0.5">
                Drag components to canvas
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
