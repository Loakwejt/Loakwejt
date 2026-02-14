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

// Workspace types matching Prisma enum
export type WorkspaceType = 'WEBSITE' | 'SHOP' | 'BLOG' | 'FORUM' | 'WIKI' | 'PORTFOLIO' | 'LANDING';

interface EditorState {
  // Page data
  workspaceId: string | null;
  pageId: string | null;
  pageName: string;
  workspaceType: WorkspaceType;
  
  // Site data (now workspace settings)
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
  setPageContext: (workspaceId: string, pageId: string) => void;
  setWorkspaceType: (type: WorkspaceType) => void;
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
  loadPage: (workspaceId: string, pageId: string) => Promise<void>;
  isLoadingPage: boolean;

  // Workspace products (for live product data in Canvas)
  workspaceProducts: WorkspaceProduct[];
  isLoadingProducts: boolean;
  fetchWorkspaceProducts: () => Promise<void>;
}

export interface WorkspaceProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number; // cents
  compareAtPrice: number | null;
  currency: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  sku: string | null;
  inventory: number;
  categoryId: string | null;
  tags: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Maximum number of history entries to keep.
 * Prevents memory leaks from unbounded undo history.
 */
const MAX_HISTORY_SIZE = 100;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Adds a new tree to history with automatic size limiting.
 * Removes oldest entries when limit is exceeded.
 */
function pushToHistory(
  currentHistory: BuilderTree[],
  historyIndex: number,
  newTree: BuilderTree
): { history: BuilderTree[]; historyIndex: number } {
  // Slice history up to current index (discard any redo states)
  const newHistory = currentHistory.slice(0, historyIndex + 1);
  newHistory.push(newTree);
  
  // Apply history limit - remove oldest entries if exceeded
  if (newHistory.length > MAX_HISTORY_SIZE) {
    const overflow = newHistory.length - MAX_HISTORY_SIZE;
    newHistory.splice(0, overflow);
  }
  
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

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
  pageId: null,
  pageName: 'Untitled Page',
  workspaceType: 'WEBSITE' as WorkspaceType,
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
  workspaceProducts: [],
  isLoadingProducts: false,

  // Context
  setPageContext: (workspaceId, pageId) => {
    set({ workspaceId, pageId });
  },

  setWorkspaceType: (type) => {
    set({ workspaceType: type });
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
    const historyUpdate = pushToHistory(history, historyIndex, tree);
    
    set({
      tree,
      ...historyUpdate,
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

    // Update history with limit
    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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

    const historyUpdate = pushToHistory(history, historyIndex, newTree);

    set({
      tree: newTree,
      ...historyUpdate,
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
  loadPage: async (workspaceId, pageId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    set({ isLoadingPage: true, selectedNodeId: null, hoveredNodeId: null });
    
    try {
      const response = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/pages/${pageId}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to load page');
      }

      const page = await response.json();
      
      // Update URL without reload
      const newUrl = `${window.location.origin}${window.location.pathname}?workspaceId=${workspaceId}&pageId=${pageId}`;
      window.history.pushState({ workspaceId, pageId }, '', newUrl);
      
      // Update store state
      set({
        workspaceId,
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

  // ── Workspace Products ────────────────────────────────────────────────
  fetchWorkspaceProducts: async () => {
    const { workspaceId } = get();
    if (!workspaceId) return;

    set({ isLoadingProducts: true });
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(
        `${apiUrl}/api/workspaces/${workspaceId}/products?limit=50&status=active`,
        { credentials: 'include' }
      );

      if (!res.ok) {
        console.warn('Could not fetch workspace products:', res.status);
        set({ isLoadingProducts: false });
        return;
      }

      const data = await res.json();
      const products: WorkspaceProduct[] = (data.products || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: p.name as string,
        slug: p.slug as string,
        description: (p.description as string) ?? null,
        price: p.price as number,
        compareAtPrice: (p.compareAtPrice as number) ?? null,
        currency: (p.currency as string) || 'EUR',
        images: Array.isArray(p.images) ? p.images as string[] : [],
        isActive: (p.isActive as boolean) ?? true,
        isFeatured: (p.isFeatured as boolean) ?? false,
        sku: (p.sku as string) ?? null,
        inventory: (p.inventory as number) || 0,
        categoryId: (p.categoryId as string) ?? null,
        tags: Array.isArray(p.tags) ? p.tags as string[] : [],
      }));

      set({ workspaceProducts: products, isLoadingProducts: false });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ isLoadingProducts: false });
    }
  },
}));
