import { prisma } from '../src';

async function main() {
  // Finde alle Seiten
  const pages = await prisma.page.findMany({
    where: {
      OR: [
        { name: { contains: 'NEXUS' } },
        { name: { contains: 'Nexus' } },
        { name: { contains: 'Home' } },
      ]
    },
    include: { workspace: true },
    take: 5
  });
  
  console.log('Pages found:', pages.length);
  
  for (const p of pages) {
    console.log('\n---');
    console.log('Page:', p.name, '| ID:', p.id);
    console.log('Workspace:', p.workspace.name);
    
    const tree = p.builderTree as any;
    if (tree?.root) {
      console.log('Root Type:', tree.root.type);
      console.log('Children:', tree.root.children?.length || 0);
      tree.root.children?.slice(0, 3).forEach((c: any, i: number) => {
        console.log(`  ${i}: ${c.type} - ${c.meta?.name || '-'}`);
      });
    } else {
      console.log('NO TREE!');
    }
  }
}

main().finally(() => prisma.$disconnect());
