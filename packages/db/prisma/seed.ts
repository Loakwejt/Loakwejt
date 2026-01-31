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
