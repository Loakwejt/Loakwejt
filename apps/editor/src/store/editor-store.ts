import { create } from 'zustand';
import type { BuilderTree, BuilderNode, BuilderStyle, BuilderActionBinding, SiteSettings } from '@builderly/core';
import {
  findNodeById,
  updateNodeInTree,
  removeNodeFromTree,
  insertNodeAt,
  cloneNode,
  generateNodeId,
  componentRegistry,
  getDefaultSiteSettings,
} from '@builderly/core';

// ============================================================================
// COMMAND PATTERN FOR UNDO/REDO
// ============================================================================

interface Command {
  execute: () => void;
  undo: () => void;
  description: string;
}

// ============================================================================
// EDITOR STATE
// ============================================================================

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

interface EditorState {
  // Page data
  workspaceId: string | null;
  siteId: string | null;
  pageId: string | null;
  pageName: string;
  
  // Site data
  siteName: string;
  siteSettings: SiteSettings;
  
  // Builder tree
  tree: BuilderTree;
  
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // Viewport
  breakpoint: Breakpoint;
  zoom: number;
  
  // History
  history: BuilderTree[];
  historyIndex: number;
  
  // UI State
  isPaletteOpen: boolean;
  isInspectorOpen: boolean;
  isLayerPanelOpen: boolean;
  isSiteSettingsOpen: boolean;
  isPreviewMode: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  
  // Actions
  setPageContext: (workspaceId: string, siteId: string, pageId: string) => void;
  setTree: (tree: BuilderTree) => void;
  replaceTree: (tree: BuilderTree) => void;
  setPageName: (name: string) => void;
  
  // Site settings actions
  setSiteData: (name: string, settings: SiteSettings) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  toggleSiteSettings: () => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  
  // Node operations
  addNode: (parentId: string, nodeType: string, index?: number) => void;
  updateNode: (nodeId: string, updates: Partial<BuilderNode>) => void;
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  updateNodeStyle: (nodeId: string, style: BuilderStyle) => void;
  updateNodeActions: (nodeId: string, actions: BuilderActionBinding[]) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, newParentId: string, newIndex: number) => void;
  
  // Viewport
  setBreakpoint: (breakpoint: Breakpoint) => void;
  setZoom: (zoom: number) => void;
  
  // UI
  togglePalette: () => void;
  toggleInspector: () => void;
  toggleLayerPanel: () => void;
  setPreviewMode: (isPreview: boolean) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Persistence
  setSaving: (isSaving: boolean) => void;
  setDirty: (isDirty: boolean) => void;
  setLastSaved: (date: Date) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function deepMerge(target: Record<string, unknown>, source: Partial<Record<string, unknown>>): Record<string, unknown> {
  const result = { ...target };
  
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  
  return result;
}

// ============================================================================
// DEFAULT TREE
// ============================================================================

const DEFAULT_TREE: BuilderTree = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: {},
    style: { base: { padding: 'lg' } },
    actions: [],
    children: [],
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  workspaceId: null,
  siteId: null,
  pageId: null,
  pageName: 'Untitled Page',
  siteName: 'Untitled Site',
  siteSettings: getDefaultSiteSettings(),
  tree: DEFAULT_TREE,
  selectedNodeId: null,
  hoveredNodeId: null,
  breakpoint: 'desktop',
  zoom: 100,
  history: [DEFAULT_TREE],
  historyIndex: 0,
  isPaletteOpen: true,
  isInspectorOpen: true,
  isLayerPanelOpen: false,
  isSiteSettingsOpen: false,
  isPreviewMode: false,
  isSaving: false,
  isDirty: false,
  lastSaved: null,

  // Context
  setPageContext: (workspaceId, siteId, pageId) => {
    set({ workspaceId, siteId, pageId });
  },

  setTree: (tree) => {
    set({
      tree,
      history: [tree],
      historyIndex: 0,
      isDirty: false,
    });
  },

  replaceTree: (tree) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(tree);
    
    set({
      tree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  setPageName: (name) => {
    set({ pageName: name });
  },

  // Site data
  setSiteData: (name, settings) => {
    set({ siteName: name, siteSettings: settings });
  },

  updateSiteSettings: (settings) => {
    set((state) => ({
      siteSettings: deepMerge(state.siteSettings, settings) as SiteSettings,
      isDirty: true,
    }));
  },

  toggleSiteSettings: () => {
    set((state) => ({ isSiteSettingsOpen: !state.isSiteSettingsOpen }));
  },

  // Selection
  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  hoverNode: (nodeId) => {
    set({ hoveredNodeId: nodeId });
  },

  // Node operations with history
  addNode: (parentId, nodeType, index) => {
    const { tree, history, historyIndex } = get();
    
    const definition = componentRegistry.get(nodeType);
    if (!definition) {
      console.error(`Unknown component type: ${nodeType}`);
      return;
    }

    const newNode: BuilderNode = {
      id: generateNodeId(),
      type: nodeType,
      props: { ...definition.defaultProps },
      style: { base: {} },
      actions: [],
      children: [],
    };

    const parent = findNodeById(tree.root, parentId);
    const insertIndex = index ?? (parent?.children.length ?? 0);

    const newTree: BuilderTree = {
      ...tree,
      root: insertNodeAt(tree.root, parentId, newNode, insertIndex),
    };

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedNodeId: newNode.id,
      isDirty: true,
    });
  },

  updateNode: (nodeId, updates) => {
    const { tree, history, historyIndex } = get();

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (node) => ({
        ...node,
        ...updates,
      })),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  updateNodeProps: (nodeId, props) => {
    const { tree, history, historyIndex } = get();

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (node) => ({
        ...node,
        props: { ...node.props, ...props },
      })),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  updateNodeStyle: (nodeId, style) => {
    const { tree, history, historyIndex } = get();

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (node) => ({
        ...node,
        style,
      })),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  updateNodeActions: (nodeId, actions) => {
    const { tree, history, historyIndex } = get();

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (node) => ({
        ...node,
        actions,
      })),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  deleteNode: (nodeId) => {
    const { tree, history, historyIndex, selectedNodeId } = get();

    // Don't allow deleting root
    if (nodeId === 'root') {
      console.warn('Cannot delete root node');
      return;
    }

    const newTree: BuilderTree = {
      ...tree,
      root: removeNodeFromTree(tree.root, nodeId),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      isDirty: true,
    });
  },

  duplicateNode: (nodeId) => {
    const { tree, history, historyIndex } = get();

    const node = findNodeById(tree.root, nodeId);
    if (!node || nodeId === 'root') return;

    // Find parent and index
    const findParentAndIndex = (
      root: BuilderNode,
      targetId: string
    ): { parent: BuilderNode; index: number } | null => {
      for (let i = 0; i < root.children.length; i++) {
        if (root.children[i]?.id === targetId) {
          return { parent: root, index: i };
        }
        const result = findParentAndIndex(root.children[i]!, targetId);
        if (result) return result;
      }
      return null;
    };

    const result = findParentAndIndex(tree.root, nodeId);
    if (!result) return;

    const clonedNode = cloneNode(node, true);
    const newTree: BuilderTree = {
      ...tree,
      root: insertNodeAt(tree.root, result.parent.id, clonedNode, result.index + 1),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedNodeId: clonedNode.id,
      isDirty: true,
    });
  },

  moveNode: (nodeId, newParentId, newIndex) => {
    const { tree, history, historyIndex } = get();

    const node = findNodeById(tree.root, nodeId);
    if (!node || nodeId === 'root') return;

    // Remove from old position
    let newRoot = removeNodeFromTree(tree.root, nodeId);
    // Insert at new position
    newRoot = insertNodeAt(newRoot, newParentId, node, newIndex);

    const newTree: BuilderTree = {
      ...tree,
      root: newRoot,
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  // Viewport
  setBreakpoint: (breakpoint) => {
    set({ breakpoint });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(25, Math.min(200, zoom)) });
  },

  // UI
  togglePalette: () => {
    set((state) => ({ isPaletteOpen: !state.isPaletteOpen }));
  },

  toggleInspector: () => {
    set((state) => ({ isInspectorOpen: !state.isInspectorOpen }));
  },

  toggleLayerPanel: () => {
    set((state) => ({ isLayerPanelOpen: !state.isLayerPanelOpen }));
  },

  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview, selectedNodeId: null });
  },

  // History
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        tree: history[newIndex]!,
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        tree: history[newIndex]!,
        historyIndex: newIndex,
        isDirty: true,
      });
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { historyIndex, history } = get();
    return historyIndex < history.length - 1;
  },

  // Persistence
  setSaving: (isSaving) => {
    set({ isSaving });
  },

  setDirty: (isDirty) => {
    set({ isDirty });
  },

  setLastSaved: (date) => {
    set({ lastSaved: date, isDirty: false });
  },
}));
