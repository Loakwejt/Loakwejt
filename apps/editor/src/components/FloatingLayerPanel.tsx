import { useState, useRef, useEffect } from 'react';
import { cn, Button, ScrollArea, Input } from '@builderly/ui';
import { 
  ChevronDown, 
  ChevronRight, 
  Trash2,
  Copy,
  Layers,
  Minus,
  Maximize2,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { useEditorStore } from '../store/editor-store';
import type { BuilderNode } from '@builderly/core';

// Recursive layer item component
function LayerItem({ 
  node, 
  depth = 0 
}: { 
  node: BuilderNode; 
  depth?: number;
}) {
  const { selectedNodeId, selectNode, deleteNode, duplicateNode, updateNodeProps } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;
  const isRoot = node.id === 'root';

  // Get display name - use custom label if set, otherwise type
  const displayName = String(node.props?.label || node.type);

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
        className={cn(
          'group flex items-center gap-1 py-1 px-2 cursor-pointer transition-colors text-xs',
          'hover:bg-accent',
          isSelected && 'bg-primary/10 text-primary'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
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
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : (
            <span className="w-3" />
          )}
        </button>

        {/* Component name - editable */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="h-5 text-xs px-1 py-0"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="p-0.5 hover:bg-green-500/20 hover:text-green-600 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveEdit();
              }}
            >
              <Check className="h-3 w-3" />
            </button>
            <button
              className="p-0.5 hover:bg-destructive/20 hover:text-destructive rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelEdit();
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <span 
              className="flex-1 truncate text-xs"
              onDoubleClick={handleStartEdit}
            >
              {displayName}
            </span>

            {/* Actions on hover */}
            {!isRoot && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0">
                <button
                  className="p-0.5 hover:bg-muted rounded"
                  onClick={handleStartEdit}
                  title="Umbenennen"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  className="p-0.5 hover:bg-muted rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateNode(node.id);
                  }}
                  title="Duplizieren"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  className="p-0.5 hover:bg-destructive/20 hover:text-destructive rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  title="Löschen"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
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

export function FloatingLayerPanel() {
  const { tree, isLayerPanelOpen } = useEditorStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isLayerPanelOpen) return null;

  return (
    <div 
      className={cn(
        "absolute bottom-4 right-4 bg-background border rounded-lg shadow-xl z-50 transition-all duration-200",
        isMinimized ? "w-auto" : isExpanded ? "w-80 h-96" : "w-64 h-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Ebenen</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Einklappen" : "Ausklappen"}
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Anzeigen" : "Minimieren"}
          >
            <Minus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <ScrollArea className={cn(isExpanded ? "h-[340px]" : "h-[232px]")}>
          <div className="py-1">
            {tree?.root ? (
              <LayerItem node={tree.root} />
            ) : (
              <div className="p-4 text-center text-muted-foreground text-xs">
                Noch keine Elemente. Ziehe Komponenten auf die Leinwand.
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
