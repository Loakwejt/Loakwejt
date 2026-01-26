import { useState } from 'react';
import type { BuilderNode } from '@builderly/core';
import { componentRegistry } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';
import { cn } from '@builderly/ui';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  GripVertical,
} from 'lucide-react';

interface LayerItemProps {
  node: BuilderNode;
  depth: number;
  onDragStart?: (nodeId: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (nodeId: string) => void;
  draggedNodeId?: string | null;
  dragOverNodeId?: string | null;
}

function LayerItem({
  node,
  depth,
  onDragStart,
  onDragEnd,
  onDragOver,
  draggedNodeId,
  dragOverNodeId,
}: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    selectedNodeId,
    hoveredNodeId,
    selectNode,
    hoverNode,
    deleteNode,
    duplicateNode,
  } = useEditorStore();

  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const isDragging = draggedNodeId === node.id;
  const isDragOver = dragOverNodeId === node.id;
  const hasChildren = node.children.length > 0;
  const definition = componentRegistry.get(node.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.id !== 'root') {
      deleteNode(node.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.id !== 'root') {
      duplicateNode(node.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (node.id === 'root') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const canHaveChildren = definition?.canHaveChildren ?? false;
    if (canHaveChildren || node.id === 'root') {
      e.dataTransfer.dropEffect = 'move';
      onDragOver?.(node.id);
    }
  };

  const handleDragLeave = () => {
    onDragOver?.(null as unknown as string);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer group',
          'hover:bg-accent/50',
          isSelected && 'bg-primary/10 text-primary',
          isHovered && !isSelected && 'bg-accent',
          isDragging && 'opacity-50',
          isDragOver && 'ring-2 ring-primary'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => hoverNode(node.id)}
        onMouseLeave={() => hoverNode(null)}
        draggable={node.id !== 'root'}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={onDragEnd}
      >
        {/* Drag handle */}
        {node.id !== 'root' && (
          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
        )}

        {/* Expand/collapse toggle */}
        <button
          className={cn(
            'p-0.5 hover:bg-accent rounded',
            !hasChildren && 'invisible'
          )}
          onClick={handleToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>

        {/* Icon */}
        <span className="text-xs">
          {getNodeIcon(node.type)}
        </span>

        {/* Name */}
        <span className="flex-1 text-xs truncate">
          {node.meta?.name || definition?.displayName || node.type}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
          {node.id !== 'root' && (
            <>
              <button
                className="p-1 hover:bg-accent rounded"
                onClick={handleDuplicate}
                title="Duplicate"
              >
                <Copy className="h-3 w-3" />
              </button>
              <button
                className="p-1 hover:bg-destructive/20 hover:text-destructive rounded"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <LayerItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              draggedNodeId={draggedNodeId}
              dragOverNodeId={dragOverNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getNodeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    Section: '📐',
    Container: '📦',
    Stack: '📚',
    Grid: '⊞',
    Text: '📝',
    Heading: '🔤',
    Button: '🔘',
    Image: '🖼️',
    Card: '💳',
    Divider: '➖',
    Spacer: '↕️',
    Form: '📄',
    Input: '✏️',
    Link: '🔗',
    Badge: '🏷️',
    Alert: '⚠️',
  };
  return iconMap[type] || '📦';
}

export function LayerPanel() {
  const { tree, moveNode } = useEditorStore();
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('text/plain');
    
    if (nodeId && dragOverNodeId && nodeId !== dragOverNodeId) {
      // Move node to new parent
      moveNode(nodeId, dragOverNodeId, 0);
    }
    
    setDraggedNodeId(null);
    setDragOverNodeId(null);
  };

  return (
    <div 
      className="p-2"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <h3 className="text-sm font-semibold px-2 mb-2">Layers</h3>
      <div className="space-y-0.5">
        <LayerItem
          node={tree.root}
          depth={0}
          onDragStart={setDraggedNodeId}
          onDragEnd={() => {
            setDraggedNodeId(null);
            setDragOverNodeId(null);
          }}
          onDragOver={setDragOverNodeId}
          draggedNodeId={draggedNodeId}
          dragOverNodeId={dragOverNodeId}
        />
      </div>
    </div>
  );
}
