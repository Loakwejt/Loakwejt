/**
 * Script to fix maxWidth values in all pages
 * 
 * Problem: Pages have maxWidth: 'xl' (576px) which is too narrow for desktop content.
 * Solution: Change 'xl' to '7xl' (1280px) for main content containers.
 * 
 * Run: cd packages/db && npx tsx prisma/fix-all-maxwidth.ts
 */

import { prisma } from '../src';

interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
  children: BuilderNode[];
  [key: string]: unknown;
}

interface BuilderTree {
  builderVersion: number;
  root: BuilderNode;
}

// Map of problematic maxWidth values to correct ones
const MAX_WIDTH_FIXES: Record<string, string> = {
  'xl': '7xl',    // 576px → 1280px (main content containers)
  'lg': '7xl',    // 512px → 1280px (too narrow for grids)
  'md': '2xl',    // 448px → 672px (for centered text sections like Newsletter)
  'sm': 'xl',     // 384px → 576px (small containers)
};

// Container IDs that should remain narrow (centered text content)
const NARROW_CONTAINER_TYPES = [
  'newsletter-container',
  'hero-content',
];

function fixNodeMaxWidth(node: BuilderNode, depth = 0): { node: BuilderNode; changes: number } {
  let changes = 0;
  
  // Fix maxWidth in props for Container type
  if (node.type === 'Container' && node.props.maxWidth) {
    const currentMaxWidth = node.props.maxWidth as string;
    
    // Check if this is a narrow container that should remain smaller
    const isNarrowContainer = NARROW_CONTAINER_TYPES.some(id => node.id.includes(id));
    
    if (!isNarrowContainer && MAX_WIDTH_FIXES[currentMaxWidth]) {
      const newMaxWidth = MAX_WIDTH_FIXES[currentMaxWidth];
      console.log(`  [${node.id}] Container maxWidth: '${currentMaxWidth}' → '${newMaxWidth}'`);
      node.props.maxWidth = newMaxWidth;
      changes++;
    } else if (isNarrowContainer && currentMaxWidth === 'xl') {
      // Narrow containers should use '2xl' or '3xl' for centered text
      console.log(`  [${node.id}] Narrow Container maxWidth: '${currentMaxWidth}' → '2xl'`);
      node.props.maxWidth = '2xl';
      changes++;
    }
  }
  
  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map(child => {
      const result = fixNodeMaxWidth(child, depth + 1);
      changes += result.changes;
      return result.node;
    });
  }
  
  return { node, changes };
}

async function main() {
  console.log('🔧 Fixing maxWidth values in all pages...\n');
  
  // Get all pages with builderTree
  const pages = await prisma.page.findMany({
    where: {
      builderTree: { not: null }
    }
  });
  
  console.log(`Found ${pages.length} pages to check.\n`);
  
  let totalPagesUpdated = 0;
  let totalChanges = 0;
  
  for (const page of pages) {
    if (!page.builderTree) continue;
    
    const tree = page.builderTree as unknown as BuilderTree;
    if (!tree.root) continue;
    
    console.log(`📄 ${page.name} (workspace: ${page.workspaceId})`);
    
    const { node: fixedRoot, changes } = fixNodeMaxWidth(tree.root);
    
    if (changes > 0) {
      tree.root = fixedRoot;
      
      await prisma.page.update({
        where: { id: page.id },
        data: { builderTree: tree as unknown as object }
      });
      
      console.log(`  ✅ Updated ${changes} maxWidth values\n`);
      totalPagesUpdated++;
      totalChanges += changes;
    } else {
      console.log(`  ⏭️  No changes needed\n`);
    }
  }
  
  console.log('━'.repeat(50));
  console.log(`✅ Complete: Updated ${totalChanges} maxWidth values across ${totalPagesUpdated} pages.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
