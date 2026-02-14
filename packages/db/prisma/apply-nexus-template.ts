import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pageId = 'cmlfql26e00085krwhj0o4ecn';
  
  // Get the NEXUS template
  const template = await prisma.template.findUnique({
    where: { slug: 'nexus-shop' },
    select: { tree: true, name: true }
  });
  
  if (!template) {
    console.log('❌ NEXUS template not found!');
    return;
  }
  
  console.log(`📋 Applying template "${template.name}" to page...`);
  
  // Update the page with the template's tree
  await prisma.page.update({
    where: { id: pageId },
    data: { builderTree: template.tree as any }
  });
  
  console.log('✅ Template applied successfully!');
  console.log('🔄 Please refresh the editor to see the changes.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
