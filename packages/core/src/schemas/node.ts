import { z } from 'zod';
import { BuilderStyleSchema } from './style';
import { BuilderActionBindingSchema } from './actions';
import { BuilderAnimationSchema, type BuilderAnimation } from './animation';

// ============================================================================
// NODE METADATA
// ============================================================================

export const BuilderNodeMetaSchema = z.object({
  name: z.string().optional(),
  locked: z.boolean().optional(),
  hidden: z.boolean().optional(),
  notes: z.string().optional(),
  symbolId: z.string().optional(),
});

export type BuilderNodeMeta = z.infer<typeof BuilderNodeMetaSchema>;

// ============================================================================
// BUILDER NODE - Core recursive structure
// ============================================================================

export const BuilderNodeSchema: z.ZodType<BuilderNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    props: z.record(z.unknown()),
    style: BuilderStyleSchema,
    actions: z.array(BuilderActionBindingSchema),
    children: z.array(BuilderNodeSchema),
    meta: BuilderNodeMetaSchema.optional(),
    animation: BuilderAnimationSchema.optional(),
  })
);

export interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style: z.infer<typeof BuilderStyleSchema>;
  actions: z.infer<typeof BuilderActionBindingSchema>[];
  children: BuilderNode[];
  meta?: BuilderNodeMeta;
  animation?: BuilderAnimation;
}

// ============================================================================
// BUILDER TREE - Root document structure
// ============================================================================

export const CURRENT_BUILDER_VERSION = 1;

export const BuilderTreeSchema = z.object({
  builderVersion: z.number().min(1).default(CURRENT_BUILDER_VERSION),
  root: BuilderNodeSchema,
});

export type BuilderTree = z.infer<typeof BuilderTreeSchema>;

// ============================================================================
// NODE OPERATIONS - Safe tree manipulation functions
// ============================================================================

export function createNode(
  type: string,
  props: Record<string, unknown> = {},
  children: BuilderNode[] = []
): BuilderNode {
  return {
    id: generateNodeId(),
    type,
    props,
    style: { base: {} },
    actions: [],
    children,
  };
}

export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function findNodeById(root: BuilderNode, id: string): BuilderNode | null {
  if (root.id === id) return root;
  
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  
  return null;
}

export function findNodePath(
  root: BuilderNode,
  id: string,
  path: string[] = []
): string[] | null {
  if (root.id === id) return path;
  
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (!child) continue;
    const found = findNodePath(child, id, [...path, root.id]);
    if (found) return found;
  }
  
  return null;
}

export function findParentNode(
  root: BuilderNode,
  childId: string
): BuilderNode | null {
  for (const child of root.children) {
    if (child.id === childId) return root;
    const found = findParentNode(child, childId);
    if (found) return found;
  }
  return null;
}

export function cloneNode(node: BuilderNode, deep = true): BuilderNode {
  const cloned: BuilderNode = {
    ...node,
    id: generateNodeId(),
    props: { ...node.props },
    style: { ...node.style, base: { ...node.style.base } },
    actions: [...node.actions],
    children: deep ? node.children.map((child) => cloneNode(child, true)) : [],
    meta: node.meta ? { ...node.meta } : undefined,
  };
  return cloned;
}

export function updateNodeInTree(
  root: BuilderNode,
  nodeId: string,
  updater: (node: BuilderNode) => BuilderNode
): BuilderNode {
  if (root.id === nodeId) {
    return updater(root);
  }
  
  return {
    ...root,
    children: root.children.map((child) => updateNodeInTree(child, nodeId, updater)),
  };
}

export function removeNodeFromTree(root: BuilderNode, nodeId: string): BuilderNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== nodeId)
      .map((child) => removeNodeFromTree(child, nodeId)),
  };
}

export function insertNodeAt(
  root: BuilderNode,
  parentId: string,
  node: BuilderNode,
  index: number
): BuilderNode {
  if (root.id === parentId) {
    const newChildren = [...root.children];
    newChildren.splice(index, 0, node);
    return { ...root, children: newChildren };
  }
  
  return {
    ...root,
    children: root.children.map((child) => insertNodeAt(child, parentId, node, index)),
  };
}

export function moveNode(
  root: BuilderNode,
  nodeId: string,
  newParentId: string,
  newIndex: number
): BuilderNode {
  const nodeToMove = findNodeById(root, nodeId);
  if (!nodeToMove) return root;
  
  // Remove from current position
  let newRoot = removeNodeFromTree(root, nodeId);
  
  // Insert at new position
  newRoot = insertNodeAt(newRoot, newParentId, nodeToMove, newIndex);
  
  return newRoot;
}

// ============================================================================
// TREE VALIDATION
// ============================================================================

export function validateBuilderTree(tree: unknown): BuilderTree {
  return BuilderTreeSchema.parse(tree);
}

export function isValidBuilderTree(tree: unknown): tree is BuilderTree {
  return BuilderTreeSchema.safeParse(tree).success;
}

// ============================================================================
// TREE TRAVERSAL
// ============================================================================

export function traverseTree(
  node: BuilderNode,
  callback: (node: BuilderNode, depth: number) => void,
  depth = 0
): void {
  callback(node, depth);
  for (const child of node.children) {
    traverseTree(child, callback, depth + 1);
  }
}

export function flattenTree(root: BuilderNode): BuilderNode[] {
  const nodes: BuilderNode[] = [];
  traverseTree(root, (node) => nodes.push(node));
  return nodes;
}

export function countNodes(root: BuilderNode): number {
  let count = 1;
  for (const child of root.children) {
    count += countNodes(child);
  }
  return count;
}
