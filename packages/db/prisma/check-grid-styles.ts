import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findFirst({ 
    where: { name: 'Home' }, 
    select: { builderTree: true }
  });
  
  if (!page) {
    console.log('Page not found');
    return;
  }
  
  // Check if it's a BuilderTree with root
  const tree = page.builderTree as any;
  if (!tree || !tree.root) {
    console.log('No valid builderTree found');
    console.log('Keys:', Object.keys(tree || {}));
    return;
  }
  
  // Find first few nodes with their type and style
  function inspectNode(node: any, depth = 0): void {
    if (depth > 3) return;
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.type} (${node.id}) - style.base:`, JSON.stringify(node.style?.base || {}).substring(0, 100));
    if (node.style?.mobile) {
      console.log(`${indent}  mobile:`, JSON.stringify(node.style.mobile));
    }
    if (node.children) {
      node.children.slice(0, 3).forEach((c: any) => inspectNode(c, depth + 1));
    }
  }
  
  inspectNode(tree.root);
  
  await prisma.$disconnect();
}

main();
