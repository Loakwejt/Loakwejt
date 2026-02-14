/**
 * Debug script to find where maxWidth: 'xl' comes from
 */
import { prisma } from '../src';

interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  style?: Record<string, unknown>;
  children?: BuilderNode[];
}

async function main() {
  const ws = await prisma.workspace.findFirst({ where: { slug: 'tetete' } });
  if (!ws) {
    console.log('Workspace not found');
    return;
  }

  const page = await prisma.page.findFirst({ where: { workspaceId: ws.id, isHomepage: true } });
  if (!page?.builderTree) {
    console.log('No builderTree found');
    return;
  }

  // Find all Container nodes and their maxWidth props
  function findContainers(node: BuilderNode, path: string = ''): void {
    if (node.type === 'Container') {
      console.log(`Container at ${path}:`);
      console.log(`  props.maxWidth: ${node.props.maxWidth || 'NOT SET'}`);
      if (node.style) {
        const style = node.style as { base?: { maxWidth?: string }; mobile?: { maxWidth?: string } };
        console.log(`  style.base.maxWidth: ${style.base?.maxWidth || 'NOT SET'}`);
        console.log(`  style.mobile.maxWidth: ${style.mobile?.maxWidth || 'NOT SET'}`);
      }
      console.log('');
    }
    
    if (node.children) {
      node.children.forEach((child, i) => {
        findContainers(child, `${path}/${node.type}[${i}]`);
      });
    }
  }

  const tree = page.builderTree as unknown as { root: BuilderNode };
  console.log('Finding all Container nodes...\n');
  findContainers(tree.root, 'root');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
