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

  // Krankes Handwerker Template (Modern, Gradients, Glassmorphism)
  await prisma.template.upsert({
    where: { slug: 'handwerker-seite' },
    update: {
      tree: createKrankesTemplate(),
    },
    create: {
      name: 'Handwerker Deluxe',
      slug: 'handwerker-seite',
      description: 'Premium Handwerker-Template mit modernem Design, Gradienten und Glassmorphism-Effekten',
      thumbnail: 'https://placehold.co/600x400?text=Handwerker+Deluxe',
      category: 'FULL_PAGE',
      style: 'modern',
      websiteType: 'handwerker',
      tags: ['handwerk', 'premium', 'modern', 'gradient', 'glassmorphism'],
      tree: createKrankesTemplate(),
      isPro: false,
      isPublished: true,
      isSystem: false,
      createdById: demoUser.id,
    },
  });
  console.log('✅ Created Krankes Handwerker Template');

  // Shop Template (Minimalist E-Commerce)
  await prisma.template.upsert({
    where: { slug: 'minimalist-shop' },
    update: {
      tree: createShopTemplate(),
      category: 'FULL_PAGE',
    },
    create: {
      name: 'Minimalist Shop',
      slug: 'minimalist-shop',
      description: 'Elegantes E-Commerce Template mit klarem Design und Fokus auf Produktpräsentation',
      thumbnail: 'https://placehold.co/600x400?text=Minimalist+Shop',
      category: 'FULL_PAGE',
      style: 'minimalist',
      websiteType: 'ecommerce',
      tags: ['shop', 'ecommerce', 'minimalist', 'produkte', 'modern'],
      tree: createShopTemplate(),
      isPro: false,
      isPublished: true,
      isSystem: false,
      createdById: demoUser.id,
    },
  });
  console.log('✅ Created Minimalist Shop Template');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@builderly.dev');
  console.log('  Password: demo1234');
}

// ============================================================================
// KRANKES HANDWERKER TEMPLATE
// ============================================================================

function createKrankesTemplate() {
  return {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: { minHeight: 'auto' },
      style: {
        base: {
          backgroundColor: '#0a0a0f',
          color: '#ffffff',
          padding: 'none',
        },
      },
      actions: [],
      children: [
        // ═══════════════════════════════════════════════════════════════════
        // HERO SECTION - Gradient Background + Glassmorphism CTA
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'hero-section',
          type: 'Section',
          props: { minHeight: 'screen', verticalAlign: 'center' },
          style: {
            base: {
              gradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #2d1b4e 50%, #1a1a2e 75%, #0a0a0f 100%)',
              padding: 'xl',
            },
          },
          actions: [],
          children: [
            // Floating decoration
            {
              id: 'hero-deco-1',
              type: 'Container',
              props: { maxWidth: 'none' },
              style: {
                base: {
                  position: 'absolute',
                  width: '400px',
                  height: '400px',
                  gradient: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                  blur: 'xl',
                  opacity: 60,
                },
              },
              actions: [],
              children: [],
            },
            {
              id: 'hero-content',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: { position: 'relative', zIndex: 10 } },
              actions: [],
              children: [
                // Pre-title badge
                {
                  id: 'hero-badge',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'center', gap: 'sm' },
                  style: { base: { marginBottom: 'lg' } },
                  actions: [],
                  children: [
                    {
                      id: 'hero-badge-inner',
                      type: 'Badge',
                      props: { text: '⚡ 24/7 Notdienst verfügbar', variant: 'outline' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          borderColor: '#f59e0b',
                          color: '#f59e0b',
                          paddingX: 'md',
                          paddingY: 'sm',
                          borderRadius: 'full',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                // Main headline with gradient text effect
                {
                  id: 'hero-headline',
                  type: 'Heading',
                  props: { level: 1, text: 'Handwerkskunst auf höchstem Niveau' },
                  style: {
                    base: {
                      textAlign: 'center',
                      fontSize: '5xl',
                      fontWeight: 'bold',
                      marginBottom: 'md',
                      color: '#ffffff',
                    },
                  },
                  actions: [],
                  children: [],
                },
                // Accent line
                {
                  id: 'hero-accent',
                  type: 'Heading',
                  props: { level: 2, text: 'Meisterbetrieb seit 2003' },
                  style: {
                    base: {
                      textAlign: 'center',
                      color: '#f59e0b',
                      fontSize: '2xl',
                      fontWeight: 'semibold',
                      marginBottom: 'lg',
                    },
                  },
                  actions: [],
                  children: [],
                },
                // Subtitle
                {
                  id: 'hero-subtitle',
                  type: 'Text',
                  props: { text: 'Von der Reparatur bis zur Komplettsanierung – wir sind Ihre Experten für alle Gewerke. Schnell, zuverlässig und mit einer Qualitätsgarantie, die überzeugt.' },
                  style: {
                    base: {
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 'lg',
                      marginBottom: 'xl',
                      maxWidth: '700px',
                      marginX: 'auto',
                    },
                  },
                  actions: [],
                  children: [],
                },
                // CTA Buttons - Glassmorphism Container
                {
                  id: 'hero-cta-container',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'center', gap: 'md' },
                  style: { base: { marginBottom: 'xl' } },
                  actions: [],
                  children: [
                    {
                      id: 'hero-btn-primary',
                      type: 'Button',
                      props: { text: '🛠️ Kostenloses Angebot', variant: 'primary', size: 'lg' },
                      style: {
                        base: {
                          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#0a0a0f',
                          fontWeight: 'bold',
                          paddingX: 'xl',
                          paddingY: 'md',
                          borderRadius: 'xl',
                          boxShadow: '0 10px 40px rgba(245, 158, 11, 0.4)',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                    {
                      id: 'hero-btn-secondary',
                      type: 'Button',
                      props: { text: '📞 Jetzt anrufen', variant: 'outline', size: 'lg' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          backdropBlur: 'md',
                          paddingX: 'xl',
                          paddingY: 'md',
                          borderRadius: 'xl',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                // Trust badges
                {
                  id: 'hero-trust',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'center', gap: 'lg', wrap: 'wrap' },
                  style: { base: { opacity: 70 } },
                  actions: [],
                  children: [
                    { id: 'trust-1', type: 'Text', props: { text: '✓ Meisterbetrieb' }, style: { base: { color: '#a3a3a3', fontSize: 'sm' } }, actions: [], children: [] },
                    { id: 'trust-2', type: 'Text', props: { text: '✓ TÜV geprüft' }, style: { base: { color: '#a3a3a3', fontSize: 'sm' } }, actions: [], children: [] },
                    { id: 'trust-3', type: 'Text', props: { text: '✓ 5-Sterne Bewertungen' }, style: { base: { color: '#a3a3a3', fontSize: 'sm' } }, actions: [], children: [] },
                    { id: 'trust-4', type: 'Text', props: { text: '✓ Faire Festpreise' }, style: { base: { color: '#a3a3a3', fontSize: 'sm' } }, actions: [], children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // STATS SECTION - Floating Cards with Glassmorphism
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'stats-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              backgroundColor: '#0f0f14',
              padding: 'xl',
              marginTop: '-80px',
              position: 'relative',
              zIndex: 20,
            },
          },
          actions: [],
          children: [
            {
              id: 'stats-container',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: 'stats-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    // Stat 1
                    {
                      id: 'stat-card-1',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          backdropBlur: 'lg',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                          textAlign: 'center',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's1-icon', type: 'Text', props: { text: '⏱️' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's1-value', type: 'Heading', props: { level: 2, text: '20+' }, style: { base: { color: '#f59e0b', fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 's1-label', type: 'Text', props: { text: 'Jahre Erfahrung' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)' } }, actions: [], children: [] },
                      ],
                    },
                    // Stat 2
                    {
                      id: 'stat-card-2',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          backdropBlur: 'lg',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                          textAlign: 'center',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's2-icon', type: 'Text', props: { text: '👥' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's2-value', type: 'Heading', props: { level: 2, text: '2.500+' }, style: { base: { color: '#f59e0b', fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 's2-label', type: 'Text', props: { text: 'Zufriedene Kunden' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)' } }, actions: [], children: [] },
                      ],
                    },
                    // Stat 3
                    {
                      id: 'stat-card-3',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          backdropBlur: 'lg',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                          textAlign: 'center',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's3-icon', type: 'Text', props: { text: '🏆' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's3-value', type: 'Heading', props: { level: 2, text: '15' }, style: { base: { color: '#f59e0b', fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 's3-label', type: 'Text', props: { text: 'Fachbereiche' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)' } }, actions: [], children: [] },
                      ],
                    },
                    // Stat 4
                    {
                      id: 'stat-card-4',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          backdropBlur: 'lg',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                          textAlign: 'center',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's4-icon', type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's4-value', type: 'Heading', props: { level: 2, text: '24/7' }, style: { base: { color: '#f59e0b', fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 's4-label', type: 'Text', props: { text: 'Notdienst' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // SERVICES SECTION - Bento Grid Layout
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'services-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              backgroundColor: '#0f0f14',
              padding: 'xl',
            },
          },
          actions: [],
          children: [
            {
              id: 'services-container',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                // Section Header
                {
                  id: 'services-header',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'md' },
                  style: { base: { marginBottom: '2xl' } },
                  actions: [],
                  children: [
                    { id: 'services-label', type: 'Badge', props: { text: 'UNSERE LEISTUNGEN', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                    { id: 'services-title', type: 'Heading', props: { level: 2, text: 'Alles aus einer Hand' }, style: { base: { fontSize: '4xl', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }, actions: [], children: [] },
                    { id: 'services-subtitle', type: 'Text', props: { text: 'Von kleinen Reparaturen bis zur kompletten Sanierung – wir bieten das volle Spektrum' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', maxWidth: '600px' } }, actions: [], children: [] },
                  ],
                },
                // Bento Grid
                {
                  id: 'services-bento',
                  type: 'Grid',
                  props: { columns: 3, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    // Main service (large card)
                    {
                      id: 'service-main',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'xl',
                          gridColumnSpan: 2,
                          minHeight: '300px',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sm-icon', type: 'Text', props: { text: '🔧' }, style: { base: { fontSize: '4xl', marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 'sm-title', type: 'Heading', props: { level: 3, text: 'Sanitär & Heizung' }, style: { base: { color: '#ffffff', fontSize: '2xl', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 'sm-desc', type: 'Text', props: { text: 'Komplette Badsanierung, Heizungsinstallation, Rohrreinigung und Notdienst bei Rohrbrüchen. Wir sorgen dafür, dass bei Ihnen alles fließt.' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', marginBottom: 'lg' } }, actions: [], children: [] },
                        { id: 'sm-cta', type: 'Button', props: { text: 'Mehr erfahren →', variant: 'ghost' }, style: { base: { color: '#f59e0b' } }, actions: [], children: [] },
                      ],
                    },
                    // Service 2
                    {
                      id: 'service-2',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's2-icon', type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '3xl', marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 's2-title', type: 'Heading', props: { level: 4, text: 'Elektro' }, style: { base: { color: '#ffffff', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's2-desc', type: 'Text', props: { text: 'Sicherungskästen, Steckdosen, Smart Home' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Service 3
                    {
                      id: 'service-3',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's3-icon', type: 'Text', props: { text: '🎨' }, style: { base: { fontSize: '3xl', marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 's3-title', type: 'Heading', props: { level: 4, text: 'Maler & Fassade' }, style: { base: { color: '#ffffff', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's3-desc', type: 'Text', props: { text: 'Innenraum, Außenfassade, Tapezieren' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Service 4
                    {
                      id: 'service-4',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's4-icon', type: 'Text', props: { text: '🪵' }, style: { base: { fontSize: '3xl', marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 's4-title', type: 'Heading', props: { level: 4, text: 'Tischler & Schreiner' }, style: { base: { color: '#ffffff', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 's4-desc', type: 'Text', props: { text: 'Möbel, Türen, Fenster, Trockenbau' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Service 5 (wide)
                    {
                      id: 'service-5',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          gradient: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                          borderColor: 'rgba(139, 92, 246, 0.3)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                          gridColumnSpan: 2,
                        },
                      },
                      actions: [],
                      children: [
                        {
                          id: 's5-content',
                          type: 'Stack',
                          props: { direction: 'row', align: 'center', gap: 'lg' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 's5-icon', type: 'Text', props: { text: '🏗️' }, style: { base: { fontSize: '4xl' } }, actions: [], children: [] },
                            {
                              id: 's5-text',
                              type: 'Stack',
                              props: { direction: 'column', gap: 'xs' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                { id: 's5-title', type: 'Heading', props: { level: 4, text: 'Komplettsanierung' }, style: { base: { color: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                                { id: 's5-desc', type: 'Text', props: { text: 'Schlüsselfertige Renovierung von Wohnungen, Häusern und Gewerberäumen – koordiniert aus einer Hand' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)' } }, actions: [], children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // TESTIMONIALS SECTION - Modern Cards
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'testimonials-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              gradient: 'linear-gradient(180deg, #0f0f14 0%, #1a1a2e 100%)',
              padding: 'xl',
            },
          },
          actions: [],
          children: [
            {
              id: 'testimonials-container',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                // Section Header
                {
                  id: 'testimonials-header',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'md' },
                  style: { base: { marginBottom: '2xl' } },
                  actions: [],
                  children: [
                    { id: 'testimonials-label', type: 'Badge', props: { text: 'KUNDENSTIMMEN', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                    { id: 'testimonials-title', type: 'Heading', props: { level: 2, text: 'Das sagen unsere Kunden' }, style: { base: { fontSize: '4xl', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }, actions: [], children: [] },
                  ],
                },
                // Testimonials Grid
                {
                  id: 'testimonials-grid',
                  type: 'Grid',
                  props: { columns: 3, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    // Testimonial 1
                    {
                      id: 'testimonial-1',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't1-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 't1-quote', type: 'Text', props: { text: '"Schnell da, super Arbeit, fairer Preis. Besser geht es nicht! Absolute Empfehlung für jeden der zuverlässige Handwerker sucht."' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic', marginBottom: 'lg' } }, actions: [], children: [] },
                        {
                          id: 't1-author',
                          type: 'Stack',
                          props: { direction: 'row', align: 'center', gap: 'sm' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't1-avatar', type: 'Text', props: { text: '👩' }, style: { base: { fontSize: 'xl' } }, actions: [], children: [] },
                            { id: 't1-name', type: 'Text', props: { text: 'Sandra M. — München' }, style: { base: { color: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                    // Testimonial 2
                    {
                      id: 'testimonial-2',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)',
                          borderColor: 'rgba(245, 158, 11, 0.2)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't2-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 't2-quote', type: 'Text', props: { text: '"Notdienst um 3 Uhr nachts – nach 25 Minuten war der Klempner da und hat den Rohrbruch behoben. Einfach klasse!"' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic', marginBottom: 'lg' } }, actions: [], children: [] },
                        {
                          id: 't2-author',
                          type: 'Stack',
                          props: { direction: 'row', align: 'center', gap: 'sm' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't2-avatar', type: 'Text', props: { text: '👨' }, style: { base: { fontSize: 'xl' } }, actions: [], children: [] },
                            { id: 't2-name', type: 'Text', props: { text: 'Thomas K. — Hamburg' }, style: { base: { color: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                    // Testimonial 3
                    {
                      id: 'testimonial-3',
                      type: 'Card',
                      props: {},
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't3-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
                        { id: 't3-quote', type: 'Text', props: { text: '"Die komplette Badsanierung in nur 2 Wochen – perfekt koordiniert und das Ergebnis ist ein Traum!"' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic', marginBottom: 'lg' } }, actions: [], children: [] },
                        {
                          id: 't3-author',
                          type: 'Stack',
                          props: { direction: 'row', align: 'center', gap: 'sm' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't3-avatar', type: 'Text', props: { text: '👩' }, style: { base: { fontSize: 'xl' } }, actions: [], children: [] },
                            { id: 't3-name', type: 'Text', props: { text: 'Maria L. — Berlin' }, style: { base: { color: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // CTA SECTION - Bold Gradient
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'cta-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              padding: 'xl',
            },
          },
          actions: [],
          children: [
            {
              id: 'cta-container',
              type: 'Container',
              props: { maxWidth: 'lg' },
              style: { base: { textAlign: 'center' } },
              actions: [],
              children: [
                { id: 'cta-title', type: 'Heading', props: { level: 2, text: 'Bereit für Ihr Projekt?' }, style: { base: { color: '#0a0a0f', fontSize: '4xl', fontWeight: 'bold', marginBottom: 'md' } }, actions: [], children: [] },
                { id: 'cta-subtitle', type: 'Text', props: { text: 'Lassen Sie uns jetzt über Ihr Vorhaben sprechen – kostenlos und unverbindlich' }, style: { base: { color: 'rgba(0, 0, 0, 0.7)', fontSize: 'lg', marginBottom: 'xl' } }, actions: [], children: [] },
                {
                  id: 'cta-buttons',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'center', gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    { id: 'cta-btn-1', type: 'Button', props: { text: '📧 Anfrage senden', variant: 'primary', size: 'lg' }, style: { base: { backgroundColor: '#0a0a0f', color: '#ffffff', paddingX: 'xl', paddingY: 'md', borderRadius: 'xl' } }, actions: [], children: [] },
                    { id: 'cta-btn-2', type: 'Button', props: { text: '📞 0800 123 4567', variant: 'outline', size: 'lg' }, style: { base: { backgroundColor: 'rgba(0, 0, 0, 0.1)', borderColor: '#0a0a0f', color: '#0a0a0f', paddingX: 'xl', paddingY: 'md', borderRadius: 'xl' } }, actions: [], children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // EMERGENCY BANNER - Pulsing Attention
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'emergency-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              gradient: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
              padding: 'lg',
            },
          },
          actions: [],
          children: [
            {
              id: 'emergency-container',
              type: 'Container',
              props: { maxWidth: 'lg' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: 'emergency-content',
                  type: 'Stack',
                  props: { direction: 'row', align: 'center', justify: 'center', gap: 'lg', wrap: 'wrap' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    { id: 'emergency-icon', type: 'Text', props: { text: '🚨' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                    {
                      id: 'emergency-text-stack',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'xs' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'emergency-title', type: 'Heading', props: { level: 3, text: '24h Notdienst: 0800 123 4567' }, style: { base: { color: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'emergency-subtitle', type: 'Text', props: { text: 'Rohrbruch? Heizungsausfall? Wir sind rund um die Uhr für Sie da!' }, style: { base: { color: 'rgba(255, 255, 255, 0.9)' } }, actions: [], children: [] },
                      ],
                    },
                    { id: 'emergency-btn', type: 'Button', props: { text: 'Jetzt anrufen', variant: 'primary' }, style: { base: { backgroundColor: '#ffffff', color: '#dc2626', fontWeight: 'bold', borderRadius: 'xl' } }, actions: [], children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // FOOTER
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'footer-section',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              backgroundColor: '#0a0a0f',
              padding: 'xl',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
          actions: [],
          children: [
            {
              id: 'footer-container',
              type: 'Container',
              props: { maxWidth: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: 'footer-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'xl' },
                  style: { base: { marginBottom: 'xl' } },
                  actions: [],
                  children: [
                    // Company Info
                    {
                      id: 'footer-company',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'footer-logo', type: 'Heading', props: { level: 3, text: '🛠️ MeisterWerk' }, style: { base: { color: '#f59e0b' } }, actions: [], children: [] },
                        { id: 'footer-desc', type: 'Text', props: { text: 'Ihr Partner für alle handwerklichen Arbeiten seit über 20 Jahren.' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Links 1
                    {
                      id: 'footer-links-1',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'fl1-title', type: 'Heading', props: { level: 5, text: 'Leistungen' }, style: { base: { color: '#ffffff', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 'fl1-1', type: 'Link', props: { text: 'Sanitär & Heizung', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fl1-2', type: 'Link', props: { text: 'Elektroarbeiten', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fl1-3', type: 'Link', props: { text: 'Renovierung', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Links 2
                    {
                      id: 'footer-links-2',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'fl2-title', type: 'Heading', props: { level: 5, text: 'Unternehmen' }, style: { base: { color: '#ffffff', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 'fl2-1', type: 'Link', props: { text: 'Über uns', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fl2-2', type: 'Link', props: { text: 'Karriere', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fl2-3', type: 'Link', props: { text: 'Kontakt', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    // Contact
                    {
                      id: 'footer-contact',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'fc-title', type: 'Heading', props: { level: 5, text: 'Kontakt' }, style: { base: { color: '#ffffff', marginBottom: 'sm' } }, actions: [], children: [] },
                        { id: 'fc-1', type: 'Text', props: { text: '📍 Musterstraße 123, 12345 Stadt' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fc-2', type: 'Text', props: { text: '📞 0800 123 4567' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'fc-3', type: 'Text', props: { text: '✉️ info@meisterwerk.de' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
                // Copyright
                {
                  id: 'footer-bottom',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 'lg' } },
                  actions: [],
                  children: [
                    { id: 'copyright', type: 'Text', props: { text: '© 2024 MeisterWerk. Alle Rechte vorbehalten.' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'sm' } }, actions: [], children: [] },
                    {
                      id: 'footer-legal',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'legal-1', type: 'Link', props: { text: 'Impressum', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'legal-2', type: 'Link', props: { text: 'Datenschutz', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'legal-3', type: 'Link', props: { text: 'AGB', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

// ============================================================================
// MULTI-CATEGORY SHOP TEMPLATE
// ============================================================================

function createShopTemplate() {
  return {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: { minHeight: 'auto' },
      style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
      actions: [],
      meta: { name: 'Shop Seite' },
      children: [
        // ═══════════════════════════════════════════════════════════════════
        // HEADER - Full Navigation with Search & Account
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'header',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 } },
          actions: [],
          meta: { name: 'Header' },
          children: [
            // Top Bar
            {
              id: 'top-bar',
              type: 'Container',
              props: { maxWidth: 'full' },
              style: { base: { backgroundColor: '#1a1a1a', padding: '8px 0' } },
              actions: [],
              meta: { name: 'Top Bar' },
              children: [
                {
                  id: 'top-bar-content',
                  type: 'Container',
                  props: { maxWidth: 'xl', centered: true },
                  style: { base: { display: 'flex', justifyContent: 'center' } },
                  actions: [],
                  meta: { name: 'Top Bar Content' },
                  children: [
                    { id: 'promo-text', type: 'Text', props: { text: '🚚 Kostenloser Versand ab 29€ | ⚡ Express-Lieferung verfügbar' }, style: { base: { color: '#ffffff', fontSize: '12px', textAlign: 'center' } }, actions: [], meta: { name: 'Promo Text' }, children: [] },
                  ],
                },
              ],
            },
            // Main Header
            {
              id: 'main-header',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '16px 24px' } },
              actions: [],
              meta: { name: 'Main Header' },
              children: [
                {
                  id: 'header-row',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                  actions: [],
                  meta: { name: 'Header Row' },
                  children: [
                    // Logo
                    { id: 'logo', type: 'Heading', props: { level: 1, text: 'NEXUS' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                    // Search Bar
                    {
                      id: 'search-container',
                      type: 'Container',
                      props: { maxWidth: 'full' },
                      style: { base: { display: 'flex', flex: '1', maxWidth: '500px', margin: '0 40px' } },
                      actions: [],
                      meta: { name: 'Search Container' },
                      children: [
                        { id: 'search-input', type: 'Input', props: { placeholder: '🔍 Produkte, Marken und mehr...' }, style: { base: { width: '100%', border: '2px solid #e5e5e5', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' } }, actions: [], meta: { name: 'Suchfeld' }, children: [] },
                      ],
                    },
                    // Account & Cart
                    {
                      id: 'header-actions',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'md', align: 'center' },
                      style: { base: { display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Header Actions' },
                      children: [
                        { id: 'login-link', type: 'Link', props: { text: '👤 Anmelden', href: '/login' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Login Link' }, children: [] },
                        { id: 'wishlist-link', type: 'Link', props: { text: '♡', href: '/wishlist' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '20px' } }, actions: [], meta: { name: 'Wishlist' }, children: [] },
                        { id: 'cart-link', type: 'Button', props: { text: '🛒 Warenkorb (0)', variant: 'outline' }, style: { base: { border: '2px solid #1a1a1a', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Warenkorb' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
            // Category Navigation
            {
              id: 'category-nav',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { borderTop: '1px solid #f0f0f0', padding: '0 24px' } },
              actions: [],
              meta: { name: 'Category Navigation' },
              children: [
                {
                  id: 'nav-links',
                  type: 'Stack',
                  props: { direction: 'row', gap: 'lg', justify: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', gap: '32px', justifyContent: 'center', padding: '16px 0' } },
                  actions: [],
                  meta: { name: 'Navigation Links' },
                  children: [
                    { id: 'nav-elektronik', type: 'Link', props: { text: 'Elektronik', href: '#elektronik' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Elektronik' }, children: [] },
                    { id: 'nav-haushalt', type: 'Link', props: { text: 'Haus & Garten', href: '#haushalt' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Haushalt' }, children: [] },
                    { id: 'nav-sport', type: 'Link', props: { text: 'Sport & Outdoor', href: '#sport' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Sport' }, children: [] },
                    { id: 'nav-beauty', type: 'Link', props: { text: 'Beauty & Gesundheit', href: '#beauty' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Beauty' }, children: [] },
                    { id: 'nav-baby', type: 'Link', props: { text: 'Baby & Kind', href: '#baby' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Baby' }, children: [] },
                    { id: 'nav-marken', type: 'Link', props: { text: 'Marken', href: '#marken' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Marken' }, children: [] },
                    { id: 'nav-sale', type: 'Link', props: { text: '🔥 SALE', href: '#sale' }, style: { base: { color: '#dc2626', textDecoration: 'none', fontSize: '14px', fontWeight: '700' } }, actions: [], meta: { name: 'Nav: Sale' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // HERO BANNER CAROUSEL
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'hero-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#f8f9fa' } },
          actions: [],
          meta: { name: 'Hero Banner' },
          children: [
            {
              id: 'hero-container',
              type: 'Container',
              props: { maxWidth: 'full' },
              style: { base: { padding: '0' } },
              actions: [],
              meta: { name: 'Hero Container' },
              children: [
                {
                  id: 'hero-banner',
                  type: 'Container',
                  props: { maxWidth: 'full' },
                  style: { base: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' } },
                  actions: [],
                  meta: { name: 'Hero Banner' },
                  children: [
                    {
                      id: 'hero-content',
                      type: 'Container',
                      props: { maxWidth: 'lg', centered: true },
                      style: { base: { textAlign: 'center', padding: '60px 24px' } },
                      actions: [],
                      meta: { name: 'Hero Content' },
                      children: [
                        { id: 'hero-badge', type: 'Badge', props: { text: '⚡ TECH WEEK', variant: 'secondary' }, style: { base: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '16px', fontSize: '12px', padding: '6px 16px' } }, actions: [], meta: { name: 'Hero Badge' }, children: [] },
                        { id: 'hero-title', type: 'Heading', props: { level: 1, text: 'Bis zu 40% Rabatt auf Elektronik' }, style: { base: { color: '#ffffff', fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' } }, actions: [], meta: { name: 'Hero Title' }, children: [] },
                        { id: 'hero-subtitle', type: 'Text', props: { text: 'Smartphones, Laptops, Gaming & mehr. Nur noch 3 Tage!' }, style: { base: { color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' } }, actions: [], meta: { name: 'Hero Subtitle' }, children: [] },
                        { id: 'hero-cta', type: 'Button', props: { text: 'Jetzt Deals entdecken →', variant: 'primary' }, style: { base: { backgroundColor: '#ffffff', color: '#764ba2', padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '8px' } }, actions: [], meta: { name: 'Hero CTA' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // CATEGORY GRID (8 Categories)
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'categories-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', padding: '60px 0' } },
          actions: [],
          meta: { name: 'Kategorien' },
          children: [
            {
              id: 'categories-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Categories Container' },
              children: [
                { id: 'cat-title', type: 'Heading', props: { level: 2, text: 'Shop nach Kategorie' }, style: { base: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' } }, actions: [], meta: { name: 'Kategorien Titel' }, children: [] },
                {
                  id: 'category-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Category Grid' },
                  children: [
                    { id: 'cat-1', type: 'Card', props: { title: '📱 Elektronik', description: 'Smartphones, Tablets & mehr' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Elektronik' }, children: [] },
                    { id: 'cat-2', type: 'Card', props: { title: '🏠 Haus & Garten', description: 'Möbel, Dekoration, Werkzeug' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Haushalt' }, children: [] },
                    { id: 'cat-3', type: 'Card', props: { title: '🏃 Sport & Outdoor', description: 'Fitness, Camping, Fahrräder' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Sport' }, children: [] },
                    { id: 'cat-4', type: 'Card', props: { title: '💄 Beauty', description: 'Pflege, Düfte, Wellness' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Beauty' }, children: [] },
                    { id: 'cat-5', type: 'Card', props: { title: '👶 Baby & Kind', description: 'Spielzeug, Kleidung, Zubehör' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Baby' }, children: [] },
                    { id: 'cat-6', type: 'Card', props: { title: '🐾 Tierbedarf', description: 'Futter, Spielzeug, Pflege' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Tiere' }, children: [] },
                    { id: 'cat-7', type: 'Card', props: { title: '🚗 Auto & Motor', description: 'Zubehör, Ersatzteile, Pflege' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Auto' }, children: [] },
                    { id: 'cat-8', type: 'Card', props: { title: '📚 Bücher & Medien', description: 'Bücher, Filme, Musik' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Bücher' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // FLASH DEALS (with urgency)
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'deals-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#fef2f2', padding: '60px 0' } },
          actions: [],
          meta: { name: 'Flash Deals' },
          children: [
            {
              id: 'deals-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Deals Container' },
              children: [
                {
                  id: 'deals-header',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' } },
                  actions: [],
                  meta: { name: 'Deals Header' },
                  children: [
                    {
                      id: 'deals-title-group',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'md', align: 'center' },
                      style: { base: { display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Deals Title Group' },
                      children: [
                        { id: 'deals-icon', type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Deals Icon' }, children: [] },
                        { id: 'deals-title', type: 'Heading', props: { level: 2, text: 'TAGESANGEBOTE' }, style: { base: { fontSize: '24px', fontWeight: '700', color: '#dc2626' } }, actions: [], meta: { name: 'Deals Title' }, children: [] },
                      ],
                    },
                    { id: 'deals-timer', type: 'Badge', props: { text: '⏰ Endet in 05:32:17', variant: 'destructive' }, style: { base: { backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', fontSize: '14px', fontWeight: '600' } }, actions: [], meta: { name: 'Countdown' }, children: [] },
                  ],
                },
                {
                  id: 'deals-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Deals Grid' },
                  children: [
                    {
                      id: 'deal-1',
                      type: 'Card',
                      props: { title: 'Wireless Earbuds Pro', description: '149€ → 82€' },
                      style: { base: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', position: 'relative' } },
                      actions: [],
                      meta: { name: 'Deal 1' },
                      children: [
                        { id: 'd1-badge', type: 'Badge', props: { text: '-45%', variant: 'destructive' }, style: { base: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dc2626', color: '#ffffff' } }, actions: [], meta: { name: 'Rabatt Badge' }, children: [] },
                        { id: 'd1-img', type: 'Image', props: { src: 'https://placehold.co/200x200?text=Earbuds', alt: 'Earbuds' }, style: { base: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Produkt Bild' }, children: [] },
                        { id: 'd1-progress', type: 'Text', props: { text: '████████░░ 67% verkauft' }, style: { base: { fontSize: '11px', color: '#dc2626', marginTop: '8px' } }, actions: [], meta: { name: 'Progress' }, children: [] },
                      ],
                    },
                    {
                      id: 'deal-2',
                      type: 'Card',
                      props: { title: 'Smart Watch Ultra', description: '299€ → 179€' },
                      style: { base: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', position: 'relative' } },
                      actions: [],
                      meta: { name: 'Deal 2' },
                      children: [
                        { id: 'd2-badge', type: 'Badge', props: { text: '-40%', variant: 'destructive' }, style: { base: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dc2626', color: '#ffffff' } }, actions: [], meta: { name: 'Rabatt Badge' }, children: [] },
                        { id: 'd2-img', type: 'Image', props: { src: 'https://placehold.co/200x200?text=Watch', alt: 'Watch' }, style: { base: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Produkt Bild' }, children: [] },
                        { id: 'd2-progress', type: 'Text', props: { text: '██████░░░░ 45% verkauft' }, style: { base: { fontSize: '11px', color: '#dc2626', marginTop: '8px' } }, actions: [], meta: { name: 'Progress' }, children: [] },
                      ],
                    },
                    {
                      id: 'deal-3',
                      type: 'Card',
                      props: { title: 'Gaming Headset RGB', description: '89€ → 49€' },
                      style: { base: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', position: 'relative' } },
                      actions: [],
                      meta: { name: 'Deal 3' },
                      children: [
                        { id: 'd3-badge', type: 'Badge', props: { text: '-45%', variant: 'destructive' }, style: { base: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dc2626', color: '#ffffff' } }, actions: [], meta: { name: 'Rabatt Badge' }, children: [] },
                        { id: 'd3-img', type: 'Image', props: { src: 'https://placehold.co/200x200?text=Headset', alt: 'Headset' }, style: { base: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Produkt Bild' }, children: [] },
                        { id: 'd3-progress', type: 'Text', props: { text: '██████████ 95% verkauft' }, style: { base: { fontSize: '11px', color: '#dc2626', marginTop: '8px' } }, actions: [], meta: { name: 'Progress' }, children: [] },
                      ],
                    },
                    {
                      id: 'deal-4',
                      type: 'Card',
                      props: { title: 'Bluetooth Speaker', description: '79€ → 39€' },
                      style: { base: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', position: 'relative' } },
                      actions: [],
                      meta: { name: 'Deal 4' },
                      children: [
                        { id: 'd4-badge', type: 'Badge', props: { text: '-50%', variant: 'destructive' }, style: { base: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#dc2626', color: '#ffffff' } }, actions: [], meta: { name: 'Rabatt Badge' }, children: [] },
                        { id: 'd4-img', type: 'Image', props: { src: 'https://placehold.co/200x200?text=Speaker', alt: 'Speaker' }, style: { base: { width: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Produkt Bild' }, children: [] },
                        { id: 'd4-progress', type: 'Text', props: { text: '████░░░░░░ 34% verkauft' }, style: { base: { fontSize: '11px', color: '#dc2626', marginTop: '8px' } }, actions: [], meta: { name: 'Progress' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // BESTSELLER PRODUCTS
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'bestseller-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', padding: '60px 0' } },
          actions: [],
          meta: { name: 'Bestseller' },
          children: [
            {
              id: 'bestseller-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Bestseller Container' },
              children: [
                {
                  id: 'bestseller-header',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' } },
                  actions: [],
                  meta: { name: 'Bestseller Header' },
                  children: [
                    { id: 'best-title', type: 'Heading', props: { level: 2, text: '🏆 Bestseller' }, style: { base: { fontSize: '28px', fontWeight: '700' } }, actions: [], meta: { name: 'Bestseller Title' }, children: [] },
                    { id: 'best-more', type: 'Link', props: { text: 'Alle anzeigen →', href: '#' }, style: { base: { color: '#667eea', textDecoration: 'none', fontWeight: '600' } }, actions: [], meta: { name: 'Mehr Link' }, children: [] },
                  ],
                },
                {
                  id: 'bestseller-grid',
                  type: 'Grid',
                  props: { columns: 5, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Bestseller Grid' },
                  children: [
                    {
                      id: 'prod-1',
                      type: 'Container',
                      props: {},
                      style: { base: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Produkt 1' },
                      children: [
                        { id: 'p1-rating', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: '12px', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                        { id: 'p1-img', type: 'Image', props: { src: 'https://placehold.co/150x150?text=Laptop', alt: 'Laptop' }, style: { base: { width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                        { id: 'p1-name', type: 'Text', props: { text: 'MacBook Pro 14"' }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'p1-price', type: 'Text', props: { text: '1.999,00€' }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        { id: 'p1-btn', type: 'Button', props: { text: '🛒', variant: 'outline' }, style: { base: { marginTop: '12px', width: '100%' } }, actions: [], meta: { name: 'Add Cart' }, children: [] },
                      ],
                    },
                    {
                      id: 'prod-2',
                      type: 'Container',
                      props: {},
                      style: { base: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Produkt 2' },
                      children: [
                        { id: 'p2-rating', type: 'Text', props: { text: '⭐⭐⭐⭐☆' }, style: { base: { fontSize: '12px', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                        { id: 'p2-img', type: 'Image', props: { src: 'https://placehold.co/150x150?text=Phone', alt: 'Phone' }, style: { base: { width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                        { id: 'p2-name', type: 'Text', props: { text: 'iPhone 15 Pro' }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'p2-price', type: 'Text', props: { text: '1.199,00€' }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        { id: 'p2-btn', type: 'Button', props: { text: '🛒', variant: 'outline' }, style: { base: { marginTop: '12px', width: '100%' } }, actions: [], meta: { name: 'Add Cart' }, children: [] },
                      ],
                    },
                    {
                      id: 'prod-3',
                      type: 'Container',
                      props: {},
                      style: { base: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Produkt 3' },
                      children: [
                        { id: 'p3-rating', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: '12px', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                        { id: 'p3-img', type: 'Image', props: { src: 'https://placehold.co/150x150?text=Camera', alt: 'Camera' }, style: { base: { width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                        { id: 'p3-name', type: 'Text', props: { text: 'Sony Alpha 7 IV' }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'p3-price', type: 'Text', props: { text: '2.499,00€' }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        { id: 'p3-btn', type: 'Button', props: { text: '🛒', variant: 'outline' }, style: { base: { marginTop: '12px', width: '100%' } }, actions: [], meta: { name: 'Add Cart' }, children: [] },
                      ],
                    },
                    {
                      id: 'prod-4',
                      type: 'Container',
                      props: {},
                      style: { base: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Produkt 4' },
                      children: [
                        { id: 'p4-rating', type: 'Text', props: { text: '⭐⭐⭐⭐☆' }, style: { base: { fontSize: '12px', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                        { id: 'p4-img', type: 'Image', props: { src: 'https://placehold.co/150x150?text=Console', alt: 'Console' }, style: { base: { width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                        { id: 'p4-name', type: 'Text', props: { text: 'PlayStation 5' }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'p4-price', type: 'Text', props: { text: '549,00€' }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        { id: 'p4-btn', type: 'Button', props: { text: '🛒', variant: 'outline' }, style: { base: { marginTop: '12px', width: '100%' } }, actions: [], meta: { name: 'Add Cart' }, children: [] },
                      ],
                    },
                    {
                      id: 'prod-5',
                      type: 'Container',
                      props: {},
                      style: { base: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '16px', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Produkt 5' },
                      children: [
                        { id: 'p5-rating', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: '12px', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                        { id: 'p5-img', type: 'Image', props: { src: 'https://placehold.co/150x150?text=Vacuum', alt: 'Vacuum' }, style: { base: { width: '100%', height: '120px', objectFit: 'contain', marginBottom: '12px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                        { id: 'p5-name', type: 'Text', props: { text: 'Dyson V15' }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'p5-price', type: 'Text', props: { text: '699,00€' }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#1a1a1a' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        { id: 'p5-btn', type: 'Button', props: { text: '🛒', variant: 'outline' }, style: { base: { marginTop: '12px', width: '100%' } }, actions: [], meta: { name: 'Add Cart' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // PROMOTIONAL BANNERS
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'promo-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#f8f9fa', padding: '60px 0' } },
          actions: [],
          meta: { name: 'Promo Banner' },
          children: [
            {
              id: 'promo-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Promo Container' },
              children: [
                {
                  id: 'promo-grid',
                  type: 'Grid',
                  props: { columns: 2, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Promo Grid' },
                  children: [
                    {
                      id: 'promo-1',
                      type: 'Container',
                      props: {},
                      style: { base: { background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', borderRadius: '16px', padding: '40px', color: '#ffffff' } },
                      actions: [],
                      meta: { name: 'Gaming Zone' },
                      children: [
                        { id: 'pr1-icon', type: 'Text', props: { text: '🎮' }, style: { base: { fontSize: '48px', marginBottom: '16px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 'pr1-title', type: 'Heading', props: { level: 3, text: 'GAMING ZONE' }, style: { base: { color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'pr1-desc', type: 'Text', props: { text: 'PS5, Xbox, Gaming PCs & Zubehör' }, style: { base: { color: 'rgba(255,255,255,0.8)', marginBottom: '24px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                        { id: 'pr1-btn', type: 'Button', props: { text: 'Entdecken →', variant: 'secondary' }, style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', fontWeight: '600' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                      ],
                    },
                    {
                      id: 'promo-2',
                      type: 'Container',
                      props: {},
                      style: { base: { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: '16px', padding: '40px', color: '#ffffff' } },
                      actions: [],
                      meta: { name: 'Fitness Zone' },
                      children: [
                        { id: 'pr2-icon', type: 'Text', props: { text: '🏋️' }, style: { base: { fontSize: '48px', marginBottom: '16px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 'pr2-title', type: 'Heading', props: { level: 3, text: 'FITNESS ESSENTIALS' }, style: { base: { color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'pr2-desc', type: 'Text', props: { text: 'Alles für dein Home Workout' }, style: { base: { color: 'rgba(255,255,255,0.8)', marginBottom: '24px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                        { id: 'pr2-btn', type: 'Button', props: { text: 'Jetzt shoppen →', variant: 'secondary' }, style: { base: { backgroundColor: '#ffffff', color: '#059669', fontWeight: '600' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // TRUST BADGES
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'trust-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', padding: '60px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' } },
          actions: [],
          meta: { name: 'Trust Badges' },
          children: [
            {
              id: 'trust-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Trust Container' },
              children: [
                {
                  id: 'trust-grid',
                  type: 'Grid',
                  props: { columns: 5, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Trust Grid' },
                  children: [
                    {
                      id: 'trust-1',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'sm' },
                      style: { base: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Versand' },
                      children: [
                        { id: 't1-icon', type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 't1-title', type: 'Text', props: { text: 'Gratis Versand' }, style: { base: { fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 't1-desc', type: 'Text', props: { text: 'Ab 29€ Bestellwert' }, style: { base: { color: '#666', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      ],
                    },
                    {
                      id: 'trust-2',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'sm' },
                      style: { base: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Rückgabe' },
                      children: [
                        { id: 't2-icon', type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 't2-title', type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 't2-desc', type: 'Text', props: { text: 'Kostenlos & unkompliziert' }, style: { base: { color: '#666', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      ],
                    },
                    {
                      id: 'trust-3',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'sm' },
                      style: { base: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Sicherheit' },
                      children: [
                        { id: 't3-icon', type: 'Text', props: { text: '🔒' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 't3-title', type: 'Text', props: { text: 'Sichere Zahlung' }, style: { base: { fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 't3-desc', type: 'Text', props: { text: 'SSL-verschlüsselt' }, style: { base: { color: '#666', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      ],
                    },
                    {
                      id: 'trust-4',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'sm' },
                      style: { base: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Rechnung' },
                      children: [
                        { id: 't4-icon', type: 'Text', props: { text: '💳' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 't4-title', type: 'Text', props: { text: 'Kauf auf Rechnung' }, style: { base: { fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 't4-desc', type: 'Text', props: { text: 'Mit Klarna' }, style: { base: { color: '#666', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      ],
                    },
                    {
                      id: 'trust-5',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'sm' },
                      style: { base: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                      actions: [],
                      meta: { name: 'Support' },
                      children: [
                        { id: 't5-icon', type: 'Text', props: { text: '📞' }, style: { base: { fontSize: '32px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 't5-title', type: 'Text', props: { text: '24/7 Support' }, style: { base: { fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 't5-desc', type: 'Text', props: { text: 'Wir sind für dich da' }, style: { base: { color: '#666', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // NEWSLETTER
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'newsletter-section',
          type: 'Section',
          props: {},
          style: { base: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 0' } },
          actions: [],
          meta: { name: 'Newsletter' },
          children: [
            {
              id: 'newsletter-container',
              type: 'Container',
              props: { maxWidth: 'md', centered: true },
              style: { base: { textAlign: 'center', padding: '0 24px' } },
              actions: [],
              meta: { name: 'Newsletter Container' },
              children: [
                { id: 'nl-icon', type: 'Text', props: { text: '📧' }, style: { base: { fontSize: '48px', marginBottom: '16px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                { id: 'nl-title', type: 'Heading', props: { level: 2, text: '10€ Geschenkt!' }, style: { base: { color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '12px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                { id: 'nl-desc', type: 'Text', props: { text: 'Melde dich an und erhalte 10€ Rabatt auf deine erste Bestellung ab 50€' }, style: { base: { color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '32px' } }, actions: [], meta: { name: 'Description' }, children: [] },
                {
                  id: 'nl-form-wrapper',
                  type: 'Container',
                  props: { maxWidth: 'full', centered: true },
                  style: { base: { display: 'flex', justifyContent: 'center' } },
                  actions: [],
                  meta: { name: 'Form Wrapper' },
                  children: [
                    {
                      id: 'nl-form',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'sm' },
                      style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', maxWidth: '450px', width: '100%' } },
                      actions: [],
                      meta: { name: 'Newsletter Form' },
                      children: [
                        { id: 'nl-input', type: 'Input', props: { placeholder: 'Deine E-Mail Adresse' }, style: { base: { flex: '1', padding: '14px 20px', borderRadius: '8px', border: 'none', fontSize: '16px' } }, actions: [], meta: { name: 'Email Input' }, children: [] },
                        { id: 'nl-btn', type: 'Button', props: { text: 'Anmelden', variant: 'primary' }, style: { base: { backgroundColor: '#1a1a1a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', whiteSpace: 'nowrap' } }, actions: [], meta: { name: 'Submit' }, children: [] },
                      ],
                    },
                  ],
                },
                { id: 'nl-privacy', type: 'Text', props: { text: '✓ Mit der Anmeldung akzeptierst du unsere Datenschutzbestimmungen' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '16px' } }, actions: [], meta: { name: 'Privacy Note' }, children: [] },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // FOOTER
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'footer',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#1a1a1a', padding: '60px 0 30px' } },
          actions: [],
          meta: { name: 'Footer' },
          children: [
            {
              id: 'footer-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Footer Container' },
              children: [
                {
                  id: 'footer-grid',
                  type: 'Grid',
                  props: { columns: 5, gap: 'lg' },
                  style: { base: { marginBottom: '48px' } },
                  actions: [],
                  meta: { name: 'Footer Grid' },
                  children: [
                    // Brand Column
                    {
                      id: 'footer-brand',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: { base: { display: 'flex', flexDirection: 'column', gap: '16px' } },
                      actions: [],
                      meta: { name: 'Footer Brand' },
                      children: [
                        { id: 'f-logo', type: 'Heading', props: { level: 3, text: 'NEXUS' }, style: { base: { color: '#ffffff', fontSize: '24px', fontWeight: '700' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                        { id: 'f-desc', type: 'Text', props: { text: 'Dein Online-Marktplatz für alles. Millionen Produkte, beste Preise.' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' } }, actions: [], meta: { name: 'Beschreibung' }, children: [] },
                      ],
                    },
                    // Shop Column
                    {
                      id: 'footer-shop',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                      actions: [],
                      meta: { name: 'Footer Shop' },
                      children: [
                        { id: 'fs-title', type: 'Text', props: { text: 'SHOP' }, style: { base: { color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'fs-1', type: 'Link', props: { text: 'Alle Kategorien', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fs-2', type: 'Link', props: { text: 'Bestseller', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fs-3', type: 'Link', props: { text: 'Neuheiten', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fs-4', type: 'Link', props: { text: 'Sale', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    // Service Column
                    {
                      id: 'footer-service',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                      actions: [],
                      meta: { name: 'Footer Service' },
                      children: [
                        { id: 'fse-title', type: 'Text', props: { text: 'SERVICE' }, style: { base: { color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'fse-1', type: 'Link', props: { text: 'Hilfe & FAQ', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fse-2', type: 'Link', props: { text: 'Versand & Lieferung', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fse-3', type: 'Link', props: { text: 'Rückgabe', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fse-4', type: 'Link', props: { text: 'Kontakt', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    // Company Column
                    {
                      id: 'footer-company',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                      actions: [],
                      meta: { name: 'Footer Company' },
                      children: [
                        { id: 'fc-title', type: 'Text', props: { text: 'UNTERNEHMEN' }, style: { base: { color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'fc-1', type: 'Link', props: { text: 'Über uns', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fc-2', type: 'Link', props: { text: 'Karriere', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fc-3', type: 'Link', props: { text: 'Presse', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'fc-4', type: 'Link', props: { text: 'Partner werden', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    // Payment Column
                    {
                      id: 'footer-payment',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                      actions: [],
                      meta: { name: 'Footer Payment' },
                      children: [
                        { id: 'fp-title', type: 'Text', props: { text: 'ZAHLARTEN' }, style: { base: { color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'fp-icons', type: 'Text', props: { text: '💳 Visa | Mastercard | PayPal' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px' } }, actions: [], meta: { name: 'Icons' }, children: [] },
                        { id: 'fp-icons2', type: 'Text', props: { text: '📱 Apple Pay | Google Pay' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px' } }, actions: [], meta: { name: 'Icons 2' }, children: [] },
                        { id: 'fp-icons3', type: 'Text', props: { text: '🏦 Klarna | SOFORT' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px' } }, actions: [], meta: { name: 'Icons 3' }, children: [] },
                      ],
                    },
                  ],
                },
                // Bottom Bar
                {
                  id: 'footer-bottom',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' } },
                  actions: [],
                  meta: { name: 'Footer Bottom' },
                  children: [
                    { id: 'copyright', type: 'Text', props: { text: '© 2026 NEXUS. Alle Rechte vorbehalten.' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px' } }, actions: [], meta: { name: 'Copyright' }, children: [] },
                    {
                      id: 'legal-links',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'lg' },
                      style: { base: { display: 'flex', flexDirection: 'row', gap: '24px' } },
                      actions: [],
                      meta: { name: 'Legal Links' },
                      children: [
                        { id: 'll-1', type: 'Link', props: { text: 'Impressum', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' } }, actions: [], meta: { name: 'Impressum' }, children: [] },
                        { id: 'll-2', type: 'Link', props: { text: 'Datenschutz', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' } }, actions: [], meta: { name: 'Datenschutz' }, children: [] },
                        { id: 'll-3', type: 'Link', props: { text: 'AGB', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' } }, actions: [], meta: { name: 'AGB' }, children: [] },
                        { id: 'll-4', type: 'Link', props: { text: 'Cookies', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' } }, actions: [], meta: { name: 'Cookies' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
