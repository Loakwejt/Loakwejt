import { prisma } from '../src';

async function main() {
  const products = await prisma.product.findMany({ 
    include: { workspace: true }, 
    take: 10 
  });
  
  console.log('Products found:', products.length);
  
  products.forEach(p => {
    console.log('-', p.name, '| Workspace:', p.workspace.name, '| WorkspaceId:', p.workspaceId, '| Active:', p.isActive);
  });
  
  // Prüfe auch den aktuellen Workspace
  const workspaces = await prisma.workspace.findMany({
    select: { id: true, name: true }
  });
  console.log('\nWorkspaces:');
  workspaces.forEach(w => console.log('-', w.name, '| ID:', w.id));
}

main().finally(() => prisma.$disconnect());
