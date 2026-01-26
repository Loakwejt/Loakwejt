import { useState, useCallback, createContext, useContext } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import { componentRegistry } from '@builderly/core';
import { useEditorStore } from '../store/editor-store';

// Types for drag data
export interface DragData {
  type: 'new-component' | 'existing-node';
  componentType?: string;
  nodeId?: string;
}

interface DndState {
  activeId: string | null;
  activeData: DragData | null;
  overId: string | null;
}

const DndStateContext = createContext<DndState>({
  activeId: null,
  activeData: null,
  overId: null,
});

export function useDndState() {
  return useContext(DndStateContext);
}

interface DndProviderProps {
  children: React.ReactNode;
}

export function DndProvider({ children }: DndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<DragData | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const { addNode, moveNode, tree } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveData(active.data.current as DragData);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveData(null);
      setOverId(null);
      return;
    }

    const dragData = active.data.current as DragData;
    const dropId = over.id as string;
    const dropData = over.data.current as { accepts?: boolean; nodeId?: string } | undefined;

    // Get the target node info
    const targetNodeId = dropData?.nodeId || dropId;

    if (dragData.type === 'new-component' && dragData.componentType) {
      // Adding a new component from palette
      const definition = componentRegistry.get(dragData.componentType);
      if (definition) {
        // Find a valid parent (one that can have children)
        let parentId = targetNodeId;
        const targetDef = componentRegistry.get(getNodeType(tree.root, targetNodeId));
        
        if (targetDef && !targetDef.canHaveChildren) {
          // Find parent of target
          parentId = findParentId(tree.root, targetNodeId) || 'root';
        }
        
        addNode(parentId, dragData.componentType);
      }
    } else if (dragData.type === 'existing-node' && dragData.nodeId) {
      // Moving an existing node
      if (dragData.nodeId !== targetNodeId) {
        const targetDef = componentRegistry.get(getNodeType(tree.root, targetNodeId));
        
        let parentId = targetNodeId;
        let index = 0;

        if (targetDef?.canHaveChildren || targetNodeId === 'root') {
          // Drop into container
          parentId = targetNodeId;
          index = 0;
        } else {
          // Drop as sibling
          const parentNode = findParentId(tree.root, targetNodeId);
          if (parentNode) {
            parentId = parentNode;
            index = findNodeIndex(tree.root, targetNodeId) + 1;
          }
        }

        moveNode(dragData.nodeId, parentId, index);
      }
    }

    setActiveId(null);
    setActiveData(null);
    setOverId(null);
  }, [addNode, moveNode, tree]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DndStateContext.Provider value={{ activeId, activeData, overId }}>
        {children}
        <DragOverlay dropAnimation={null}>
          {activeId && activeData && (
            <DragOverlayContent data={activeData} />
          )}
        </DragOverlay>
      </DndStateContext.Provider>
    </DndContext>
  );
}

function DragOverlayContent({ data }: { data: DragData }) {
  if (data.type === 'new-component' && data.componentType) {
    const definition = componentRegistry.get(data.componentType);
    return (
      <div className="bg-background border shadow-lg rounded-lg px-3 py-2 text-sm font-medium">
        {definition?.displayName || data.componentType}
      </div>
    );
  }

  return (
    <div className="bg-background border shadow-lg rounded-lg px-3 py-2 text-sm font-medium">
      Moving...
    </div>
  );
}

// Helper functions
function getNodeType(root: any, nodeId: string): string {
  if (root.id === nodeId) return root.type;
  for (const child of root.children || []) {
    const type = getNodeType(child, nodeId);
    if (type) return type;
  }
  return '';
}

function findParentId(root: any, nodeId: string, parentId: string | null = null): string | null {
  if (root.id === nodeId) return parentId;
  for (const child of root.children || []) {
    const found = findParentId(child, nodeId, root.id);
    if (found) return found;
  }
  return null;
}

function findNodeIndex(root: any, nodeId: string): number {
  for (let i = 0; i < (root.children || []).length; i++) {
    if (root.children[i].id === nodeId) return i;
    const found = findNodeIndex(root.children[i], nodeId);
    if (found >= 0) return found;
  }
  return -1;
}
