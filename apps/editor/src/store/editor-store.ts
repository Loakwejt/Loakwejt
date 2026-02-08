import { create } from 'zustand';
import type { BuilderTree, BuilderNode, BuilderStyle, BuilderActionBinding, SiteSettings, BuilderAnimation } from '@builderly/core';
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
  isLeftSidebarOpen: boolean;
  isSiteSettingsOpen: boolean;
  isPreviewMode: boolean;
  isMobileSidebarOpen: boolean;
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
  updateNodeAnimation: (nodeId: string, animation: BuilderAnimation | undefined) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  insertNodeTree: (parentId: string, node: BuilderNode, index?: number) => void;
  replaceNodeType: (nodeId: string, newType: string) => void;
  moveNode: (nodeId: string, newParentId: string, newIndex: number) => void;
  
  // Viewport
  setBreakpoint: (breakpoint: Breakpoint) => void;
  setZoom: (zoom: number) => void;
  
  // UI
  togglePalette: () => void;
  toggleInspector: () => void;
  toggleLayerPanel: () => void;
  toggleLeftSidebar: () => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
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
  
  // Page navigation
  loadPage: (workspaceId: string, siteId: string, pageId: string) => Promise<void>;
  isLoadingPage: boolean;
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
  isLeftSidebarOpen: true,
  isSiteSettingsOpen: false,
  isPreviewMode: false,
  isMobileSidebarOpen: false,
  isSaving: false,
  isDirty: false,
  lastSaved: null,
  isLoadingPage: false,

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

  insertNodeTree: (parentId, node, index) => {
    const { tree, history, historyIndex } = get();

    const parent = findNodeById(tree.root, parentId);
    const insertIndex = index ?? (parent?.children.length ?? 0);

    const newTree: BuilderTree = {
      ...tree,
      root: insertNodeAt(tree.root, parentId, node, insertIndex),
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTree);

    set({
      tree: newTree,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedNodeId: node.id,
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

  updateNodeAnimation: (nodeId, animation) => {
    const { tree, history, historyIndex } = get();

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (node) => ({
        ...node,
        animation,
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

  replaceNodeType: (nodeId, newType) => {
    const { tree, history, historyIndex } = get();

    const node = findNodeById(tree.root, nodeId);
    if (!node || nodeId === 'root') return;

    // Get default props for new type
    const newDefinition = componentRegistry.get(newType);
    if (!newDefinition) return;

    // Props that should be carried over if they exist in both old and new component
    const transferableProps = [
      'text',       // Text, Heading, Button, Link, Badge, etc.
      'title',      // Card, Alert, etc.
      'description',// Card, Alert, etc.
      'label',      // Form inputs, etc.
      'placeholder',// Form inputs
      'href',       // Link, Button with link
      'src',        // Image, Avatar
      'alt',        // Image
      'icon',       // Icon, Button with icon
      'name',       // Icon, Form inputs
    ];

    // Build new props: start with defaults, then overlay any transferable props from old node
    const newProps = { ...newDefinition.defaultProps };
    
    for (const prop of transferableProps) {
      if (node.props?.[prop] !== undefined && prop in newDefinition.defaultProps) {
        newProps[prop] = node.props[prop];
      }
    }

    const newTree: BuilderTree = {
      ...tree,
      root: updateNodeInTree(tree.root, nodeId, (existingNode) => ({
        id: existingNode.id,
        type: newType,
        props: newProps,
        style: existingNode.style, // Keep existing styles
        actions: [], // Reset actions as they may not be compatible
        children: newDefinition.canHaveChildren ? existingNode.children : [], // Keep children if new type supports them
        meta: { 
          ...existingNode.meta,
          name: existingNode.meta?.name ? `${existingNode.meta.name} (${newType})` : newType 
        },
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

  toggleLeftSidebar: () => {
    set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen }));
  },

  toggleMobileSidebar: () => {
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }));
  },

  setMobileSidebarOpen: (isOpen) => {
    set({ isMobileSidebarOpen: isOpen });
  },

  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview, selectedNodeId: null, isMobileSidebarOpen: false });
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

  // Page navigation - smooth page switching without full reload
  loadPage: async (workspaceId, siteId, pageId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    set({ isLoadingPage: true, selectedNodeId: null, hoveredNodeId: null });
    
    try {
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/sites/${siteId}/pages/${pageId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to load page');
      }

      const page = await response.json();
      
      // Update URL without reload
      const newUrl = `${window.location.origin}${window.location.pathname}?workspaceId=${workspaceId}&siteId=${siteId}&pageId=${pageId}`;
      window.history.pushState({ workspaceId, siteId, pageId }, '', newUrl);
      
      // Update store state
      set({
        workspaceId,
        siteId,
        pageId,
        pageName: page.name,
        tree: page.builderTree || {
          builderVersion: 1,
          root: {
            id: 'root',
            type: 'Section',
            props: {},
            style: { base: { padding: 'lg' } },
            actions: [],
            children: [],
          },
        },
        history: [page.builderTree || { builderVersion: 1, root: { id: 'root', type: 'Section', props: {}, style: { base: { padding: 'lg' } }, actions: [], children: [] } }],
        historyIndex: 0,
        isDirty: false,
        isLoadingPage: false,
      });
    } catch (error) {
      console.error('Error loading page:', error);
      set({ isLoadingPage: false });
    }
  },
}));
