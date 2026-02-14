/**
 * Reference Validator
 * 
 * Validates references in BuilderTree to ensure:
 * - Assets exist before deletion
 * - Products exist before deletion
 * - Collections exist before deletion
 * - Internal links point to valid pages
 * - Symbols are properly synchronized
 */

import { prisma } from '@builderly/db';

// ============================================================================
// LOCAL TYPES (mirroring @builderly/core)
// ============================================================================

interface BuilderStyle {
  base?: Record<string, unknown>;
  mobile?: Record<string, unknown>;
  tablet?: Record<string, unknown>;
}

interface BuilderActionBinding {
  event: string;
  action: string;
  params?: Record<string, unknown>;
}

interface BuilderNodeMeta {
  name?: string;
  locked?: boolean;
  hidden?: boolean;
  notes?: string;
  symbolId?: string;
}

interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style: BuilderStyle;
  actions: BuilderActionBinding[];
  children: BuilderNode[];
  meta?: BuilderNodeMeta;
}

interface BuilderTree {
  builderVersion: number;
  root: BuilderNode;
}

// ============================================================================
// TYPES
// ============================================================================

export interface ReferenceUsage {
  pageId: string;
  pageName: string;
  nodeId: string;
  nodeType: string;
  propertyPath: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  usages: ReferenceUsage[];
}

// ============================================================================
// TREE TRAVERSAL HELPERS
// ============================================================================

/**
 * Recursively traverses a BuilderTree and collects all references of a specific type
 */
function traverseTree(
  node: BuilderNode,
  collector: (node: BuilderNode, path: string[]) => void,
  path: string[] = []
): void {
  collector(node, path);
  
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child) {
      traverseTree(child, collector, [...path, String(i)]);
    }
  }
}

/**
 * Finds all references to an asset in a BuilderTree
 */
export function findAssetReferences(tree: BuilderTree, assetUrl: string): string[] {
  const references: string[] = [];
  
  traverseTree(tree.root, (node) => {
    // Check image src
    if (node.type === 'Image' && node.props.src === assetUrl) {
      references.push(node.id);
    }
    
    // Check background images in style
    const bgImage = node.style?.base?.backgroundImage;
    if (typeof bgImage === 'string' && bgImage.includes(assetUrl)) {
      references.push(node.id);
    }
    
    // Check Video src
    if (node.type === 'Video' && node.props.src === assetUrl) {
      references.push(node.id);
    }
    
    // Check Gallery images
    if (node.type === 'Gallery' && Array.isArray(node.props.images)) {
      const images = node.props.images as string[];
      if (images.includes(assetUrl)) {
        references.push(node.id);
      }
    }
  });
  
  return references;
}

/**
 * Finds all references to a product in a BuilderTree
 */
export function findProductReferences(tree: BuilderTree, productId: string): string[] {
  const references: string[] = [];
  
  traverseTree(tree.root, (node) => {
    // ProductCard, ProductDetail, etc.
    if (node.props.productId === productId) {
      references.push(node.id);
    }
    
    // ProductGrid with specific products
    if (node.type === 'ProductGrid' && Array.isArray(node.props.productIds)) {
      const ids = node.props.productIds as string[];
      if (ids.includes(productId)) {
        references.push(node.id);
      }
    }
    
    // Actions that reference products
    for (const action of node.actions) {
      if (action.action === 'addToCart' && action.params?.productId === productId) {
        references.push(node.id);
      }
    }
  });
  
  return references;
}

/**
 * Finds all references to a CMS collection in a BuilderTree
 */
export function findCollectionReferences(tree: BuilderTree, collectionId: string): string[] {
  const references: string[] = [];
  
  traverseTree(tree.root, (node) => {
    if (node.props.collectionId === collectionId) {
      references.push(node.id);
    }
  });
  
  return references;
}

/**
 * Finds all references to a Symbol in a BuilderTree
 */
export function findSymbolReferences(tree: BuilderTree, symbolId: string): string[] {
  const references: string[] = [];
  
  traverseTree(tree.root, (node) => {
    if (node.meta?.symbolId === symbolId) {
      references.push(node.id);
    }
  });
  
  return references;
}

/**
 * Finds all internal links in a BuilderTree
 */
export function findInternalLinks(tree: BuilderTree): Array<{ nodeId: string; href: string }> {
  const links: Array<{ nodeId: string; href: string }> = [];
  
  traverseTree(tree.root, (node) => {
    // Check href props (Link, Button, etc.)
    if (typeof node.props.href === 'string' && node.props.href.startsWith('/')) {
      links.push({ nodeId: node.id, href: node.props.href });
    }
    
    // Check navigate actions
    for (const action of node.actions) {
      if (action.action === 'navigate' && typeof action.params?.url === 'string') {
        const url = action.params.url as string;
        if (url.startsWith('/')) {
          links.push({ nodeId: node.id, href: url });
        }
      }
    }
  });
  
  return links;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates that an asset can be safely deleted
 */
export async function validateAssetDeletion(
  assetId: string,
  assetUrl: string,
  workspaceId: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    usages: [],
  };
  
  // Find all pages in the workspace
  const pages = await prisma.page.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      builderTree: true,
    },
  });
  
  for (const page of pages) {
    if (!page.builderTree) continue;
    
    const tree = page.builderTree as unknown as BuilderTree;
    const refs = findAssetReferences(tree, assetUrl);
    
    for (const nodeId of refs) {
      result.usages.push({
        pageId: page.id,
        pageName: page.name,
        nodeId,
        nodeType: 'Image/Video/Gallery',
        propertyPath: 'src',
      });
    }
  }
  
  if (result.usages.length > 0) {
    result.valid = false;
    result.errors.push(
      `Asset wird auf ${result.usages.length} Seite(n) verwendet: ${
        result.usages.map(u => u.pageName).slice(0, 5).join(', ')
      }${result.usages.length > 5 ? '...' : ''}`
    );
  }
  
  return result;
}

/**
 * Validates that a product can be safely deleted
 */
export async function validateProductDeletion(
  productId: string,
  workspaceId: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    usages: [],
  };
  
  // Find all pages in the workspace
  const pages = await prisma.page.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      builderTree: true,
    },
  });
  
  for (const page of pages) {
    if (!page.builderTree) continue;
    
    const tree = page.builderTree as unknown as BuilderTree;
    const refs = findProductReferences(tree, productId);
    
    for (const nodeId of refs) {
      result.usages.push({
        pageId: page.id,
        pageName: page.name,
        nodeId,
        nodeType: 'ProductCard/ProductGrid',
        propertyPath: 'productId',
      });
    }
  }
  
  // Check if product is in any orders (warning, not error)
  const orderCount = await prisma.orderItem.count({
    where: { productId },
  });
  
  if (orderCount > 0) {
    result.warnings.push(
      `Produkt ist in ${orderCount} Bestellung(en) enthalten. Diese werden zu historischen Daten.`
    );
  }
  
  if (result.usages.length > 0) {
    result.valid = false;
    result.errors.push(
      `Produkt wird auf ${result.usages.length} Seite(n) verwendet: ${
        result.usages.map(u => u.pageName).slice(0, 5).join(', ')
      }${result.usages.length > 5 ? '...' : ''}`
    );
  }
  
  return result;
}

/**
 * Validates that a CMS collection can be safely deleted
 */
export async function validateCollectionDeletion(
  collectionId: string,
  workspaceId: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    usages: [],
  };
  
  // Find all pages in the workspace
  const pages = await prisma.page.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      builderTree: true,
    },
  });
  
  for (const page of pages) {
    if (!page.builderTree) continue;
    
    const tree = page.builderTree as unknown as BuilderTree;
    const refs = findCollectionReferences(tree, collectionId);
    
    for (const nodeId of refs) {
      result.usages.push({
        pageId: page.id,
        pageName: page.name,
        nodeId,
        nodeType: 'CollectionList',
        propertyPath: 'collectionId',
      });
    }
  }
  
  if (result.usages.length > 0) {
    result.valid = false;
    result.errors.push(
      `Collection wird auf ${result.usages.length} Seite(n) verwendet: ${
        result.usages.map(u => u.pageName).slice(0, 5).join(', ')
      }${result.usages.length > 5 ? '...' : ''}`
    );
  }
  
  return result;
}

/**
 * Validates all internal links on a page before publishing
 */
export async function validatePageLinks(
  pageId: string
): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    usages: [],
  };
  
  const page = await prisma.page.findUnique({
    where: { id: pageId },
  });
  
  if (!page || !page.builderTree) {
    result.errors.push('Seite nicht gefunden');
    result.valid = false;
    return result;
  }
  
  // Get all pages in the same workspace
  const workspacePages = await prisma.page.findMany({
    where: { workspaceId: page.workspaceId },
    select: { slug: true, id: true },
  });
  
  const tree = page.builderTree as unknown as BuilderTree;
  const links = findInternalLinks(tree);
  const validSlugs = new Set(workspacePages.map((p: { slug: string }) => `/${p.slug}`));
  validSlugs.add('/'); // Home is always valid
  
  for (const link of links) {
    // Normalize the href
    const normalizedHref = link.href.split('?')[0]?.split('#')[0] || link.href;
    
    if (!validSlugs.has(normalizedHref)) {
      result.usages.push({
        pageId: page.id,
        pageName: page.name,
        nodeId: link.nodeId,
        nodeType: 'Link/Button',
        propertyPath: `href: ${link.href}`,
      });
      result.warnings.push(`Broken Link: ${link.href}`);
    }
  }
  
  if (result.usages.length > 0) {
    result.errors.push(
      `${result.usages.length} broken Link(s) gefunden: ${
        result.usages.map(u => u.propertyPath).slice(0, 5).join(', ')
      }`
    );
    result.valid = false;
  }
  
  return result;
}

/**
 * Marks pages that use a symbol as needing republish
 */
export async function invalidateSymbolUsages(
  symbolId: string,
  workspaceId: string
): Promise<number> {
  // Find all pages using this symbol
  const pages = await prisma.page.findMany({
    where: {
      workspaceId,
    },
    select: {
      id: true,
      builderTree: true,
    },
  });
  
  const pagesToUpdate: string[] = [];
  
  for (const page of pages) {
    if (!page.builderTree) continue;
    
    const tree = page.builderTree as unknown as BuilderTree;
    const refs = findSymbolReferences(tree, symbolId);
    
    if (refs.length > 0) {
      pagesToUpdate.push(page.id);
    }
  }
  
  if (pagesToUpdate.length > 0) {
    // Note: This requires adding a 'needsRepublish' field to the Page model
    // For now, we just return the count
    // await prisma.page.updateMany({
    //   where: { id: { in: pagesToUpdate } },
    //   data: { needsRepublish: true },
    // });
  }
  
  return pagesToUpdate.length;
}
