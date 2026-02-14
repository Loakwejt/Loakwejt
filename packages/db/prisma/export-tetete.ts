import { prisma } from '../src';

async function main() {
  const ws = await prisma.workspace.findFirst({ where: { slug: 'tetete' } });
  if (!ws) {
    console.log('Workspace not found');
    return;
  }

  const page = await prisma.page.findFirst({ 
    where: { workspaceId: ws.id, isHomepage: true } 
  });
  
  if (!page?.builderTree) {
    console.log('No builderTree found');
    return;
  }

  console.log(JSON.stringify(page.builderTree, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
