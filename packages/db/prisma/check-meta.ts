import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findFirst();
  
  if (!page?.builderTree) {
    console.log('No page found');
    return;
  }
  
  const tree = page.builderTree as any;
  
  console.log('=== ROOT ===');
  console.log('meta:', JSON.stringify(tree.root?.meta, null, 2));
  
  console.log('\n=== FIRST CHILDREN ===');
  tree.root?.children?.slice(0, 3).forEach((child: any, i: number) => {
    console.log(`Child ${i}: type=${child.type}, meta.name="${child.meta?.name}"`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
