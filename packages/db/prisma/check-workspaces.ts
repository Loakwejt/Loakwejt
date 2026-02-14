import { prisma } from '../src';

async function main() {
  const workspaces = await prisma.workspace.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      pages: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  console.log('Gefundene Workspaces:', workspaces.length);
  console.log(JSON.stringify(workspaces, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
