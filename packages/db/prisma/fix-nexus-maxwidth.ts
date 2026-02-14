/**
 * Migration script to fix NEXUS template maxWidth values.
 * Changes maxWidth: 'xl' (576px) to maxWidth: '7xl' (1280px) for main containers.
 * Also ensures text centering works correctly.
 * 
 * Run with: npx tsx prisma/fix-nexus-maxwidth.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  children: BuilderNode[];
  actions?: unknown[];
  meta?: Record<string, unknown>;
}

interface BuilderTree {
  builderVersion?: number;
  root: BuilderNode;
}

/**
 * Recursively update maxWidth values in a node tree
 */
function updateMaxWidth(node: BuilderNode): BuilderNode {
  // Update Container maxWidth props
  if (node.type === 'Container' && node.props.maxWidth === 'xl') {
    // Change 'xl' (576px) to '7xl' (1280px) for proper desktop layout
    node.props.maxWidth = '7xl';
  }
  
  // For specific container types that should remain centered but be wider
  if (node.type === 'Container' && node.props.centered === true) {
    // Ensure mobile-friendly with full width on small screens
    if (!node.style) node.style = {};
    if (!node.style.mobile) node.style.mobile = {};
    // Mobile: use full width with padding
    if (!node.style.mobile.maxWidth) {
      node.style.mobile.maxWidth = 'full';
    }
  }

  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map(child => updateMaxWidth(child));
  }

  return node;
}

async function main() {
  console.log('🔧 Fixing NEXUS template maxWidth values...\n');

  // Find all pages with NEXUS-style templates (check for NEXUS in builder tree)
  const pages = await prisma.page.findMany({
    select: { id: true, name: true, builderTree: true, workspaceId: true },
  });

  let updatedCount = 0;

  for (const page of pages) {
    if (!page.builderTree) continue;

    const tree = page.builderTree as unknown as BuilderTree;
    if (!tree.root) continue;

    // Check if this looks like a NEXUS template (has NEXUS logo or characteristic structure)
    const treeStr = JSON.stringify(tree);
    const isNexusLike = treeStr.includes('NEXUS') || treeStr.includes('hero-banner') || treeStr.includes('category-grid');
    
    if (!isNexusLike) continue;

    // Update the tree
    const originalStr = JSON.stringify(tree);
    const updatedRoot = updateMaxWidth(tree.root);
    const updatedTree = { ...tree, root: updatedRoot };
    const updatedStr = JSON.stringify(updatedTree);

    // Only update if changes were made
    if (originalStr !== updatedStr) {
      await prisma.page.update({
        where: { id: page.id },
        data: { builderTree: updatedTree as any },
      });
      console.log(`  ✅ Updated page: ${page.name} (${page.id})`);
      updatedCount++;
    }
  }

  console.log(`\n✨ Done! Updated ${updatedCount} pages.`);
  
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
