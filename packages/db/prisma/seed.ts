import { PrismaClient, Role, Plan, RecordStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@builderly.dev' },
    update: {},
    create: {
      email: 'demo@builderly.dev',
      name: 'Demo User',
      passwordHash,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A demo workspace for testing',
      plan: Plan.PRO,
      members: {
        create: {
          userId: demoUser.id,
          role: Role.OWNER,
        },
      },
    },
  });
  console.log('✅ Created demo workspace:', workspace.slug);

  // Create demo site
  const site = await prisma.site.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'demo-site',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: 'Demo Site',
      slug: 'demo-site',
      description: 'A demo website',
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Created demo site:', site.slug);

  // Create demo page with builder tree
  const demoBuilderTree = {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: {},
      style: {
        base: {
          padding: 'lg',
          backgroundColor: 'background',
        },
      },
      actions: [],
      children: [
        {
          id: 'container-1',
          type: 'Container',
          props: { maxWidth: 'lg' },
          style: { base: {} },
          actions: [],
          children: [
            {
              id: 'heading-1',
              type: 'Heading',
              props: {
                level: 1,
                text: 'Welcome to Builderly',
              },
              style: {
                base: {
                  textAlign: 'center',
                  marginBottom: 'md',
                },
              },
              actions: [],
              children: [],
            },
            {
              id: 'text-1',
              type: 'Text',
              props: {
                text: 'This is a demo page built with the Builderly website builder platform. You can edit this page in the visual editor.',
              },
              style: {
                base: {
                  textAlign: 'center',
                  color: 'muted-foreground',
                },
              },
              actions: [],
              children: [],
            },
            {
              id: 'stack-1',
              type: 'Stack',
              props: {
                direction: 'row',
                gap: 'md',
                justify: 'center',
              },
              style: {
                base: {
                  marginTop: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'button-1',
                  type: 'Button',
                  props: {
                    text: 'Get Started',
                    variant: 'primary',
                  },
                  style: { base: {} },
                  actions: [
                    {
                      event: 'onClick',
                      action: {
                        type: 'navigate',
                        to: '/dashboard',
                      },
                    },
                  ],
                  children: [],
                },
                {
                  id: 'button-2',
                  type: 'Button',
                  props: {
                    text: 'Learn More',
                    variant: 'outline',
                  },
                  style: { base: {} },
                  actions: [
                    {
                      event: 'onClick',
                      action: {
                        type: 'navigate',
                        to: '#features',
                      },
                    },
                  ],
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 'divider-1',
          type: 'Divider',
          props: {},
          style: {
            base: {
              marginY: 'xl',
            },
          },
          actions: [],
          children: [],
        },
        {
          id: 'container-2',
          type: 'Container',
          props: { maxWidth: 'lg' },
          style: { base: {} },
          actions: [],
          children: [
            {
              id: 'heading-2',
              type: 'Heading',
              props: {
                level: 2,
                text: 'Features',
              },
              style: {
                base: {
                  textAlign: 'center',
                  marginBottom: 'lg',
                },
              },
              actions: [],
              children: [],
              meta: { name: 'Features Heading' },
            },
            {
              id: 'grid-1',
              type: 'Grid',
              props: {
                columns: 3,
                gap: 'md',
              },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: 'card-1',
                  type: 'Card',
                  props: {
                    title: 'Visual Editor',
                    description: 'Drag and drop components to build your pages',
                  },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: 'card-2',
                  type: 'Card',
                  props: {
                    title: 'CMS',
                    description: 'Manage your content with collections and records',
                  },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: 'card-3',
                  type: 'Card',
                  props: {
                    title: 'E-Commerce',
                    description: 'Sell products with built-in shop functionality',
                  },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const page = await prisma.page.upsert({
    where: {
      siteId_slug: {
        siteId: site.id,
        slug: 'home',
      },
    },
    update: {
      builderTree: demoBuilderTree,
    },
    create: {
      siteId: site.id,
      name: 'Home',
      slug: 'home',
      builderTree: demoBuilderTree,
      isHomepage: true,
      isDraft: false,
      createdById: demoUser.id,
    },
  });
  console.log('✅ Created demo page:', page.slug);

  // Create published revision
  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      builderTree: demoBuilderTree,
      version: 1,
      comment: 'Initial publish',
      createdById: demoUser.id,
    },
  });

  await prisma.page.update({
    where: { id: page.id },
    data: { publishedRevisionId: revision.id },
  });
  console.log('✅ Created page revision');

  // Create blog collection
  const blogCollection = await prisma.collection.upsert({
    where: {
      siteId_slug: {
        siteId: site.id,
        slug: 'posts',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      siteId: site.id,
      name: 'Blog Posts',
      slug: 'posts',
      description: 'Blog posts for the site',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'slug', required: true },
        { name: 'content', type: 'richtext', required: false },
        { name: 'excerpt', type: 'text', required: false },
        { name: 'featuredImage', type: 'image', required: false },
        { name: 'publishedAt', type: 'datetime', required: false },
      ],
    },
  });
  console.log('✅ Created blog collection:', blogCollection.slug);

  // Create sample blog post
  await prisma.record.upsert({
    where: {
      collectionId_slug: {
        collectionId: blogCollection.id,
        slug: 'hello-world',
      },
    },
    update: {},
    create: {
      collectionId: blogCollection.id,
      slug: 'hello-world',
      status: RecordStatus.PUBLISHED,
      publishedAt: new Date(),
      createdById: demoUser.id,
      data: {
        title: 'Hello World',
        slug: 'hello-world',
        content: 'This is the first blog post on our new website!',
        excerpt: 'Welcome to our blog.',
        publishedAt: new Date().toISOString(),
      },
    },
  });
  console.log('✅ Created sample blog post');

  // Create products collection
  await prisma.product.upsert({
    where: {
      siteId_slug: {
        siteId: site.id,
        slug: 'demo-product',
      },
    },
    update: {},
    create: {
      siteId: site.id,
      name: 'Demo Product',
      slug: 'demo-product',
      description: 'This is a demo product for testing the shop functionality.',
      price: 2999, // $29.99
      currency: 'USD',
      inventory: 100,
      images: ['https://placehold.co/600x400'],
      isActive: true,
    },
  });
  console.log('✅ Created demo product');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@builderly.dev');
  console.log('  Password: demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
