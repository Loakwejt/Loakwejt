import { PrismaClient, TemplateCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Wrap a section node in a BuilderTree structure
function wrapInTree(node: any) {
  return {
    version: '1.0',
    root: {
      id: 'root',
      type: 'Root',
      props: {},
      style: { base: {} },
      actions: [],
      meta: { name: 'Root' },
      children: [node],
    },
  };
}

// ============================================================================
// ADD HEADER SECTION TEMPLATES TO DATABASE
// ============================================================================

async function addHeaderTemplates() {
  console.log('🧭 Adding Header Section Templates...');

  // Find any user to use as creator
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error('❌ No user found. Please create a user first.');
    return;
  }

  // E-Commerce Header Template
  const ecommerceHeader = {
    name: 'E-Commerce Header (Responsive)',
    slug: 'header-ecommerce-responsive',
    description: 'Full-featured e-commerce header with logo, search, cart, and mobile menu toggle',
    category: 'header',
    style: 'modern',
    websiteType: 'ecommerce',
    websiteTypes: ['ecommerce', 'business'],
    tags: ['navigation', 'mobile', 'responsive', 'ecommerce', 'search', 'cart'],
    isPro: false,
    node: {
      id: 'header-ecom',
      type: 'Section',
      props: {},
      style: { 
        base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 } 
      },
      actions: [],
      meta: { name: 'Header' },
      children: [
        // Announcement Bar
        {
          id: 'announcement-bar',
          type: 'Container',
          props: { maxWidth: 'full' },
          style: { 
            base: { backgroundColor: '#1a1a1a', padding: '8px 0' },
            mobile: { display: 'none' }
          },
          actions: [],
          meta: { name: 'Announcement Bar' },
          children: [
            {
              id: 'announcement-content',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { display: 'flex', justifyContent: 'center' } },
              actions: [],
              meta: { name: 'Content' },
              children: [
                { 
                  id: 'promo-text', 
                  type: 'Text', 
                  props: { text: 'Kostenloser Versand ab 29€  ·  Express-Lieferung verfügbar' }, 
                  style: { base: { color: '#ffffff', fontSize: '12px', textAlign: 'center', letterSpacing: '0.02em' } }, 
                  actions: [], 
                  meta: { name: 'Promo Text' }, 
                  children: [] 
                },
              ],
            },
          ],
        },
        // Main Header
        {
          id: 'main-header',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { 
            base: { padding: '16px 24px' },
            mobile: { padding: '12px 16px' }
          },
          actions: [],
          meta: { name: 'Main Header' },
          children: [
            {
              id: 'header-row',
              type: 'Stack',
              props: { direction: 'row', justify: 'between', align: 'center' },
              style: { 
                base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px' },
                mobile: { gap: '8px' }
              },
              actions: [],
              meta: { name: 'Header Row' },
              children: [
                // Mobile Menu Button
                {
                  id: 'mobile-menu-btn',
                  type: 'Button',
                  props: { text: '☰', variant: 'ghost' },
                  style: { 
                    base: { display: 'none', fontSize: '20px', padding: '8px', minWidth: '40px' },
                    mobile: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
                  },
                  actions: [
                    { event: 'onClick', action: { type: 'toggleMobileSidebar' } }
                  ],
                  meta: { name: 'Mobile Menu' },
                  children: []
                },
                // Logo
                { 
                  id: 'logo', 
                  type: 'Link', 
                  props: { text: 'SHOPNAME', href: '/' }, 
                  style: { 
                    base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a', textDecoration: 'none' },
                    mobile: { fontSize: '22px' }
                  }, 
                  actions: [], 
                  meta: { name: 'Logo' }, 
                  children: [] 
                },
                // Desktop Search
                {
                  id: 'search-container',
                  type: 'Container',
                  props: { maxWidth: 'full' },
                  style: { 
                    base: { display: 'flex', flex: '1', maxWidth: '500px', margin: '0 40px' },
                    tablet: { maxWidth: '300px', margin: '0 20px' },
                    mobile: { display: 'none' }
                  },
                  actions: [],
                  meta: { name: 'Search' },
                  children: [
                    { 
                      id: 'search-input', 
                      type: 'Input', 
                      props: { placeholder: 'Produkte suchen...' }, 
                      style: { base: { width: '100%', border: '2px solid #e5e5e5', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' } }, 
                      actions: [], 
                      meta: { name: 'Suchfeld' }, 
                      children: [] 
                    },
                  ],
                },
                // Header Actions
                {
                  id: 'header-actions',
                  type: 'Stack',
                  props: { direction: 'row', gap: 'md', align: 'center' },
                  style: { 
                    base: { display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' },
                    mobile: { gap: '12px' }
                  },
                  actions: [],
                  meta: { name: 'Actions' },
                  children: [
                    { 
                      id: 'login-link', 
                      type: 'Link', 
                      props: { text: 'Anmelden', href: '/login' }, 
                      style: { 
                        base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
                        mobile: { display: 'none' }
                      }, 
                      actions: [], 
                      meta: { name: 'Login' }, 
                      children: [] 
                    },
                    { 
                      id: 'wishlist-link', 
                      type: 'Link', 
                      props: { text: '♡', href: '/wishlist' }, 
                      style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '20px' } }, 
                      actions: [], 
                      meta: { name: 'Wishlist' }, 
                      children: [] 
                    },
                    { 
                      id: 'cart-btn', 
                      type: 'Button', 
                      props: { text: 'Warenkorb (0)', variant: 'outline' }, 
                      style: { 
                        base: { border: '2px solid #1a1a1a', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px' },
                        mobile: { padding: '8px 12px', fontSize: '12px' }
                      }, 
                      actions: [], 
                      meta: { name: 'Warenkorb' }, 
                      children: [] 
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Mobile Search
        {
          id: 'mobile-search',
          type: 'Container',
          props: { maxWidth: 'full' },
          style: { 
            base: { display: 'none', padding: '0 16px 12px' },
            mobile: { display: 'block' }
          },
          actions: [],
          meta: { name: 'Mobile Search' },
          children: [
            { 
              id: 'mobile-search-input', 
              type: 'Input', 
              props: { placeholder: 'Suchen...' }, 
              style: { base: { width: '100%', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px 14px', fontSize: '14px' } }, 
              actions: [], 
              meta: { name: 'Suchfeld' }, 
              children: [] 
            },
          ],
        },
        // Desktop Navigation
        {
          id: 'category-nav',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { 
            base: { borderTop: '1px solid #f0f0f0', padding: '0 24px' },
            mobile: { display: 'none' }
          },
          actions: [],
          meta: { name: 'Navigation' },
          children: [
            {
              id: 'nav-links',
              type: 'Stack',
              props: { direction: 'row', gap: 'lg', justify: 'center' },
              style: { 
                base: { display: 'flex', flexDirection: 'row', gap: '32px', justifyContent: 'center', padding: '16px 0' },
                tablet: { gap: '20px' }
              },
              actions: [],
              meta: { name: 'Nav Links' },
              children: [
                { id: 'nav-1', type: 'Link', props: { text: 'Alle Produkte', href: '/produkte' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav Link' }, children: [] },
                { id: 'nav-2', type: 'Link', props: { text: 'Kategorien', href: '/kategorien' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav Link' }, children: [] },
                { id: 'nav-3', type: 'Link', props: { text: 'Neuheiten', href: '/neu' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav Link' }, children: [] },
                { id: 'nav-4', type: 'Link', props: { text: 'Bestseller', href: '/bestseller' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav Link' }, children: [] },
                { id: 'nav-5', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { color: '#dc2626', textDecoration: 'none', fontSize: '14px', fontWeight: '700' } }, actions: [], meta: { name: 'Sale Link' }, children: [] },
              ],
            },
          ],
        },
      ],
    },
  };

  // Business Header Template
  const businessHeader = {
    name: 'Business Header (Simple)',
    slug: 'header-business-simple',
    description: 'Clean business header with logo, navigation, and CTA button',
    category: 'header',
    style: 'minimal',
    websiteType: 'business',
    websiteTypes: ['business', 'agency', 'saas', 'landing'],
    tags: ['navigation', 'simple', 'cta', 'business'],
    isPro: false,
    node: {
      id: 'header-business',
      type: 'Section',
      props: {},
      style: { 
        base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 } 
      },
      actions: [],
      meta: { name: 'Header' },
      children: [
        {
          id: 'header-container',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { 
            base: { padding: '16px 24px' },
            mobile: { padding: '12px 16px' }
          },
          actions: [],
          meta: { name: 'Container' },
          children: [
            {
              id: 'header-row',
              type: 'Stack',
              props: { direction: 'row', justify: 'between', align: 'center' },
              style: { base: { display: 'flex', alignItems: 'center' } },
              actions: [],
              meta: { name: 'Row' },
              children: [
                // Mobile Menu
                {
                  id: 'mobile-menu',
                  type: 'Button',
                  props: { text: '☰', variant: 'ghost' },
                  style: { 
                    base: { display: 'none', fontSize: '20px', padding: '8px' },
                    mobile: { display: 'flex' }
                  },
                  actions: [
                    { event: 'onClick', action: { type: 'toggleMobileSidebar' } }
                  ],
                  meta: { name: 'Mobile Menu' },
                  children: []
                },
                // Logo
                { 
                  id: 'logo', 
                  type: 'Heading', 
                  props: { level: 4, text: 'Company' }, 
                  style: { 
                    base: { fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a' },
                    mobile: { fontSize: '20px' }
                  }, 
                  actions: [], 
                  meta: { name: 'Logo' }, 
                  children: [] 
                },
                // Desktop Nav
                {
                  id: 'desktop-nav',
                  type: 'Stack',
                  props: { direction: 'row', gap: 'lg' },
                  style: { 
                    base: { display: 'flex', gap: '32px' },
                    mobile: { display: 'none' }
                  },
                  actions: [],
                  meta: { name: 'Navigation' },
                  children: [
                    { id: 'nav-1', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-2', type: 'Link', props: { text: 'Leistungen', href: '/services' }, style: { base: { color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-3', type: 'Link', props: { text: 'Projekte', href: '/projects' }, style: { base: { color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-4', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Link' }, children: [] },
                  ],
                },
                // CTA
                { 
                  id: 'cta-btn', 
                  type: 'Button', 
                  props: { text: 'Kontakt aufnehmen', variant: 'primary' }, 
                  style: { 
                    base: { padding: '10px 24px', fontWeight: '600', fontSize: '14px', borderRadius: '8px' },
                    mobile: { padding: '8px 16px', fontSize: '13px' }
                  }, 
                  actions: [], 
                  meta: { name: 'CTA' }, 
                  children: [] 
                },
              ],
            },
          ],
        },
      ],
    },
  };

  // Restaurant Header Template
  const restaurantHeader = {
    name: 'Restaurant Header',
    slug: 'header-restaurant',
    description: 'Elegant restaurant header with reservation button',
    category: 'header',
    style: 'elegant',
    websiteType: 'restaurant',
    websiteTypes: ['restaurant', 'business'],
    tags: ['navigation', 'restaurant', 'gastro', 'reservation', 'elegant'],
    isPro: false,
    node: {
      id: 'header-restaurant',
      type: 'Section',
      props: {},
      style: { 
        base: { backgroundColor: '#0a0a0a', padding: '0' } 
      },
      actions: [],
      meta: { name: 'Header' },
      children: [
        {
          id: 'header-container',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { 
            base: { padding: '20px 24px' },
            mobile: { padding: '16px' }
          },
          actions: [],
          meta: { name: 'Container' },
          children: [
            {
              id: 'header-row',
              type: 'Stack',
              props: { direction: 'row', justify: 'between', align: 'center' },
              style: { base: { display: 'flex', alignItems: 'center' } },
              actions: [],
              meta: { name: 'Row' },
              children: [
                // Mobile Menu
                {
                  id: 'mobile-menu',
                  type: 'Button',
                  props: { text: '☰', variant: 'ghost' },
                  style: { 
                    base: { display: 'none', fontSize: '20px', padding: '8px', color: '#ffffff' },
                    mobile: { display: 'flex' }
                  },
                  actions: [
                    { event: 'onClick', action: { type: 'toggleMobileSidebar' } }
                  ],
                  meta: { name: 'Mobile Menu' },
                  children: []
                },
                // Logo
                { 
                  id: 'logo', 
                  type: 'Text', 
                  props: { text: 'RISTORANTE' }, 
                  style: { 
                    base: { fontSize: '24px', fontWeight: '300', letterSpacing: '0.2em', color: '#d4af37' },
                    mobile: { fontSize: '18px', letterSpacing: '0.1em' }
                  }, 
                  actions: [], 
                  meta: { name: 'Logo' }, 
                  children: [] 
                },
                // Desktop Nav
                {
                  id: 'desktop-nav',
                  type: 'Stack',
                  props: { direction: 'row', gap: 'lg' },
                  style: { 
                    base: { display: 'flex', gap: '40px' },
                    mobile: { display: 'none' }
                  },
                  actions: [],
                  meta: { name: 'Navigation' },
                  children: [
                    { id: 'nav-1', type: 'Link', props: { text: 'Speisekarte', href: '/menu' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-2', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-3', type: 'Link', props: { text: 'Galerie', href: '/gallery' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'nav-4', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' } }, actions: [], meta: { name: 'Link' }, children: [] },
                  ],
                },
                // Reservation Button
                { 
                  id: 'reserve-btn', 
                  type: 'Button', 
                  props: { text: 'Tisch reservieren', variant: 'outline' }, 
                  style: { 
                    base: { border: '1px solid #d4af37', color: '#d4af37', padding: '12px 28px', fontWeight: '400', fontSize: '13px', letterSpacing: '0.05em', borderRadius: '0' },
                    mobile: { padding: '10px 16px', fontSize: '12px' }
                  }, 
                  actions: [], 
                  meta: { name: 'Reservation' }, 
                  children: [] 
                },
              ],
            },
          ],
        },
      ],
    },
  };

  // Portfolio Header Template
  const portfolioHeader = {
    name: 'Portfolio Header (Creative)',
    slug: 'header-portfolio-creative',
    description: 'Creative portfolio header with glassmorphism navigation',
    category: 'header',
    style: 'creative',
    websiteType: 'portfolio',
    websiteTypes: ['portfolio', 'agency', 'personal'],
    tags: ['navigation', 'portfolio', 'creative', 'modern', 'glassmorphism'],
    isPro: false,
    node: {
      id: 'header-portfolio',
      type: 'Section',
      props: {},
      style: { 
        base: { backgroundColor: 'transparent', position: 'fixed', top: '0', left: '0', right: '0', zIndex: 100, padding: '24px 0' },
        mobile: { padding: '16px 0' }
      },
      actions: [],
      meta: { name: 'Header' },
      children: [
        {
          id: 'header-container',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { 
            base: { padding: '0 24px' },
            mobile: { padding: '0 16px' }
          },
          actions: [],
          meta: { name: 'Container' },
          children: [
            {
              id: 'header-row',
              type: 'Stack',
              props: { direction: 'row', justify: 'between', align: 'center' },
              style: { base: { display: 'flex', alignItems: 'center' } },
              actions: [],
              meta: { name: 'Row' },
              children: [
                // Logo
                { 
                  id: 'logo', 
                  type: 'Text', 
                  props: { text: 'JD.' }, 
                  style: { 
                    base: { fontSize: '32px', fontWeight: '800', color: '#ffffff' },
                    mobile: { fontSize: '24px' }
                  }, 
                  actions: [], 
                  meta: { name: 'Logo' }, 
                  children: [] 
                },
                // Desktop Nav (Glassmorphism pill)
                {
                  id: 'nav-pill',
                  type: 'Container',
                  props: {},
                  style: { 
                    base: { backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '999px', padding: '8px 8px' },
                    mobile: { display: 'none' }
                  },
                  actions: [],
                  meta: { name: 'Nav Pill' },
                  children: [
                    {
                      id: 'nav-links',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'sm' },
                      style: { base: { display: 'flex', gap: '4px' } },
                      actions: [],
                      meta: { name: 'Links' },
                      children: [
                        { id: 'nav-1', type: 'Link', props: { text: 'Work', href: '/work' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.15)' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'nav-2', type: 'Link', props: { text: 'About', href: '/about' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'nav-3', type: 'Link', props: { text: 'Services', href: '/services' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'nav-4', type: 'Link', props: { text: 'Contact', href: '/contact' }, style: { base: { color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '8px 16px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                  ],
                },
                // Mobile Menu
                {
                  id: 'mobile-menu',
                  type: 'Button',
                  props: { text: '☰', variant: 'ghost' },
                  style: { 
                    base: { display: 'none', fontSize: '24px', color: '#ffffff', padding: '8px' },
                    mobile: { display: 'flex' }
                  },
                  actions: [
                    { event: 'onClick', action: { type: 'toggleMobileSidebar' } }
                  ],
                  meta: { name: 'Mobile Menu' },
                  children: []
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const templates = [ecommerceHeader, businessHeader, restaurantHeader, portfolioHeader];

  for (const template of templates) {
    // Check if template already exists
    const existing = await prisma.template.findUnique({
      where: { slug: template.slug },
    });

    // Wrap the node in a tree structure
    const tree = wrapInTree(template.node);

    if (existing) {
      // Update existing
      await prisma.template.update({
        where: { slug: template.slug },
        data: {
          name: template.name,
          description: template.description,
          category: TemplateCategory.HEADER,
          style: template.style,
          websiteType: template.websiteType,
          tags: template.tags,
          isPro: template.isPro,
          tree: tree as any,
        },
      });
      console.log(`  ✏️ Updated: ${template.name}`);
    } else {
      // Create new
      await prisma.template.create({
        data: {
          name: template.name,
          slug: template.slug,
          description: template.description,
          category: TemplateCategory.HEADER,
          style: template.style,
          websiteType: template.websiteType,
          tags: template.tags,
          isPro: template.isPro,
          tree: tree as any,
          createdById: user.id,
        },
      });
      console.log(`  ✅ Created: ${template.name}`);
    }
  }

  console.log('\n🎉 Header templates added successfully!');
  console.log('📱 All headers include mobile menu toggle for sidebar integration.');
}

addHeaderTemplates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
