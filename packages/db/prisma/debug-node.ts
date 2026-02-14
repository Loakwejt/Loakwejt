import { prisma } from '../src';

async function main() {
  const ws = await prisma.workspace.findFirst({ where: { slug: 'tetete' }});
  if (!ws) { console.log('not found'); return; }
  
  const page = await prisma.page.findFirst({ where: { workspaceId: ws.id, isHomepage: true }});
  if (!page?.builderTree) { console.log('no tree'); return; }
  
  const json = JSON.stringify(page.builderTree);
  
  // Find maxWidth: 'xl' occurrences
  const xlMatches = json.match(/"maxWidth"\s*:\s*"xl"/g);
  console.log('maxWidth: xl occurrences:', xlMatches?.length || 0, xlMatches);
  
  // Find the specific node
  interface BuilderNode {
    id: string;
    type: string;
    props: Record<string, unknown>;
    style?: Record<string, unknown>;
    children?: BuilderNode[];
  }
  
  function findNodeById(node: BuilderNode, targetId: string): BuilderNode | null {
    if (node.id === targetId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, targetId);
        if (found) return found;
      }
    }
    return null;
  }
  
  const tree = page.builderTree as unknown as { root: BuilderNode };
  const targetNode = findNodeById(tree.root, 'node_1770677789059_xcklda4at');
  if (targetNode) {
    console.log('\nTarget node found:');
    console.log('  type:', targetNode.type);
    console.log('  props:', JSON.stringify(targetNode.props));
    console.log('  style:', JSON.stringify(targetNode.style));
  }
}

main().finally(() => prisma.$disconnect());
