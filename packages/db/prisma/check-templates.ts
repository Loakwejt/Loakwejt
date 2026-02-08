import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany({
    select: {
      name: true,
      slug: true,
      category: true,
      isPublished: true,
    },
  });
  
  console.log('📋 Templates in der Datenbank:');
  console.log(JSON.stringify(templates, null, 2));
  console.log(`\nGesamt: ${templates.length} Templates`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
