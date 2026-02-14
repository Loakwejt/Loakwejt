/**
 * Script to fix Grid mobile styles in tetete Home page
 * 
 * Problem: Grids have no mobile styles, showing 4 columns on mobile
 * Solution: Add mobile: { gridColumns: 1 } to all Grid components
 */

import { prisma } from '../src';

interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: {
    base?: Record<string, unknown>;
    mobile?: Record<string, unknown>;
    tablet?: Record<string, unknown>;
    desktop?: Record<string, unknown>;
  };
  children?: BuilderNode[];
  [key: string]: unknown;
}

interface BuilderTree {
  builderVersion: number;
  root: BuilderNode;
}

function fixGridMobileStyles(node: BuilderNode, changes: string[]): BuilderNode {
  // Fix Grid components
  if (node.type === 'Grid') {
    const columns = node.props.columns as number || 3;
    
    // Add mobile styles if missing or incomplete
    if (!node.style) {
      node.style = { base: {}, mobile: {} };
    }
    if (!node.style.mobile) {
      node.style.mobile = {};
    }
    
    // Set gridColumns to 1 on mobile (single column layout)
    if (!node.style.mobile.gridColumns) {
      node.style.mobile.gridColumns = 1;
      changes.push(`Grid ${node.id}: Added mobile.gridColumns: 1 (was ${columns} columns)`);
    }
  }
  
  // Fix Stack with direction: row (should be column on mobile)
  if (node.type === 'Stack' && node.props.direction === 'row') {
    if (!node.style) {
      node.style = { base: {}, mobile: {} };
    }
    if (!node.style.mobile) {
      node.style.mobile = {};
    }
    
    // Add flexDirection: column on mobile if not set
    if (!node.style.mobile.flexDirection) {
      node.style.mobile.flexDirection = 'column';
      changes.push(`Stack ${node.id}: Added mobile.flexDirection: column`);
    }
  }
  
  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map(child => fixGridMobileStyles(child, changes));
  }
  
  return node;
}

async function main() {
  console.log('🔧 Fixing Grid mobile styles in tetete Home page...\n');
  
  // Find tetete workspace
  const ws = await prisma.workspace.findFirst({ where: { slug: 'tetete' } });
  if (!ws) {
    console.log('❌ Workspace "tetete" not found');
    return;
  }
  
  // Get home page
  const page = await prisma.page.findFirst({
    where: { workspaceId: ws.id, isHomepage: true }
  });
  
  if (!page?.builderTree) {
    console.log('❌ No builderTree found for home page');
    return;
  }
  
  console.log(`📄 Found page: ${page.name} (${page.id})\n`);
  
  const tree = page.builderTree as unknown as BuilderTree;
  const changes: string[] = [];
  
  // Fix all grids and stacks
  tree.root = fixGridMobileStyles(tree.root, changes);
  
  if (changes.length === 0) {
    console.log('✅ No changes needed - all Grids already have mobile styles');
    return;
  }
  
  console.log('Changes to apply:');
  changes.forEach(c => console.log(`  • ${c}`));
  console.log('');
  
  // Update database
  await prisma.page.update({
    where: { id: page.id },
    data: { builderTree: tree as unknown as object }
  });
  
  console.log(`✅ Updated ${changes.length} components with mobile styles`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
