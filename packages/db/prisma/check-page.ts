import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { id: 'cml05pgqp0007rdvesgt03wif' },
    select: { id: true, name: true, builderTree: true }
  });
  
  console.log('Page:', page?.name);
  console.log('Tree root ID:', (page?.builderTree as any)?.root?.id);
  console.log('Root children count:', (page?.builderTree as any)?.root?.children?.length || 0);
  
  // Show first few children
  const children = (page?.builderTree as any)?.root?.children || [];
  children.slice(0, 3).forEach((child: any, i: number) => {
    console.log(`Child ${i}: type=${child.type}, id=${child.id}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
