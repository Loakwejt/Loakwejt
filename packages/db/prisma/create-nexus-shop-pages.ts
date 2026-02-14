import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Standard-Template für leere Seiten
function createEmptyPageTemplate(pageName: string, pageTitle: string) {
  return {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: { minHeight: 'full' },
      style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
      actions: [],
      meta: { name: pageName },
      children: [
        // Header
        {
          id: 'header',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 }, mobile: { position: 'relative' } },
          actions: [],
          meta: { name: 'Header' },
          children: [
            {
              id: 'header-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '16px 24px' }, mobile: { padding: '12px 16px' } },
              actions: [],
              meta: { name: 'Header Container' },
              children: [
                {
                  id: 'header-row',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
                  actions: [],
                  meta: { name: 'Header Row' },
                  children: [
                    { id: 'logo', type: 'Heading', props: { level: 1, text: 'NEXUS' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a' }, mobile: { fontSize: '22px' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                    {
                      id: 'nav',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'lg' },
                      style: { base: { display: 'flex', gap: '32px' }, mobile: { display: 'none' } },
                      actions: [],
                      meta: { name: 'Navigation' },
                      children: [
                        { id: 'nav-home', type: 'Link', props: { text: 'Home', href: '/' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Home Link' }, children: [] },
                        { id: 'nav-shop', type: 'Link', props: { text: 'Shop', href: '/shop' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Shop Link' }, children: [] },
                        { id: 'nav-about', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'About Link' }, children: [] },
                        { id: 'nav-contact', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Contact Link' }, children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Page Content
        {
          id: 'content',
          type: 'Container',
          props: { maxWidth: 'xl', centered: true },
          style: { base: { padding: '48px 24px', minHeight: '60vh' }, mobile: { padding: '32px 16px' } },
          actions: [],
          meta: { name: 'Inhalt' },
          children: [
            { id: 'page-title', type: 'Heading', props: { level: 1, text: pageTitle }, style: { base: { fontSize: '36px', fontWeight: '700', marginBottom: '24px', color: '#1a1a1a' }, mobile: { fontSize: '28px' } }, actions: [], meta: { name: 'Seitentitel' }, children: [] },
            { id: 'page-content', type: 'Text', props: { text: 'Inhalt wird hier eingefügt...' }, style: { base: { fontSize: '16px', color: '#666666', lineHeight: '1.6' } }, actions: [], meta: { name: 'Seiteninhalt' }, children: [] },
          ],
        },
        // Footer
        {
          id: 'footer',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#1a1a1a', color: '#ffffff', padding: '48px 0' }, mobile: { padding: '32px 0' } },
          actions: [],
          meta: { name: 'Footer' },
          children: [
            {
              id: 'footer-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
              actions: [],
              meta: { name: 'Footer Container' },
              children: [
                {
                  id: 'footer-grid',
                  type: 'Stack',
                  props: { direction: 'row', gap: 'xl' },
                  style: { base: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }, mobile: { gridTemplateColumns: '1fr 1fr', gap: '24px' } },
                  actions: [],
                  meta: { name: 'Footer Grid' },
                  children: [
                    {
                      id: 'footer-col-1',
                      type: 'Container',
                      props: {},
                      style: { base: {} },
                      actions: [],
                      meta: { name: 'Spalte 1' },
                      children: [
                        { id: 'footer-logo', type: 'Heading', props: { level: 3, text: 'NEXUS' }, style: { base: { fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#ffffff' } }, actions: [], meta: { name: 'Footer Logo' }, children: [] },
                        { id: 'footer-desc', type: 'Text', props: { text: 'Dein Online-Shop für Premium-Produkte.' }, style: { base: { fontSize: '14px', color: '#a3a3a3', lineHeight: '1.5' } }, actions: [], meta: { name: 'Footer Beschreibung' }, children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-2',
                      type: 'Container',
                      props: {},
                      style: { base: {} },
                      actions: [],
                      meta: { name: 'Spalte 2' },
                      children: [
                        { id: 'footer-title-2', type: 'Heading', props: { level: 4, text: 'Links' }, style: { base: { fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Links Titel' }, children: [] },
                        { id: 'footer-link-shop', type: 'Link', props: { text: 'Shop', href: '/shop' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Shop Link' }, children: [] },
                        { id: 'footer-link-about', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'About Link' }, children: [] },
                        { id: 'footer-link-contact', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Contact Link' }, children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-3',
                      type: 'Container',
                      props: {},
                      style: { base: {} },
                      actions: [],
                      meta: { name: 'Spalte 3' },
                      children: [
                        { id: 'footer-title-3', type: 'Heading', props: { level: 4, text: 'Rechtliches' }, style: { base: { fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Rechtliches Titel' }, children: [] },
                        { id: 'footer-link-imprint', type: 'Link', props: { text: 'Impressum', href: '/imprint' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Impressum Link' }, children: [] },
                        { id: 'footer-link-privacy', type: 'Link', props: { text: 'Datenschutz', href: '/privacy' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Datenschutz Link' }, children: [] },
                        { id: 'footer-link-agb', type: 'Link', props: { text: 'AGB', href: '/terms' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'AGB Link' }, children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-4',
                      type: 'Container',
                      props: {},
                      style: { base: {} },
                      actions: [],
                      meta: { name: 'Spalte 4' },
                      children: [
                        { id: 'footer-title-4', type: 'Heading', props: { level: 4, text: 'Hilfe' }, style: { base: { fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Hilfe Titel' }, children: [] },
                        { id: 'footer-link-faq', type: 'Link', props: { text: 'FAQ', href: '/faq' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'FAQ Link' }, children: [] },
                        { id: 'footer-link-shipping', type: 'Link', props: { text: 'Versand', href: '/shipping' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Versand Link' }, children: [] },
                        { id: 'footer-link-returns', type: 'Link', props: { text: 'Rückgabe', href: '/returns' }, style: { base: { color: '#a3a3a3', textDecoration: 'none', display: 'block', marginBottom: '8px', fontSize: '14px' } }, actions: [], meta: { name: 'Rückgabe Link' }, children: [] },
                      ],
                    },
                  ],
                },
                // Copyright
                {
                  id: 'copyright',
                  type: 'Container',
                  props: {},
                  style: { base: { borderTop: '1px solid #333333', marginTop: '40px', paddingTop: '24px', textAlign: 'center' } },
                  actions: [],
                  meta: { name: 'Copyright' },
                  children: [
                    { id: 'copyright-text', type: 'Text', props: { text: '© 2026 NEXUS. Alle Rechte vorbehalten.' }, style: { base: { fontSize: '12px', color: '#666666' } }, actions: [], meta: { name: 'Copyright Text' }, children: [] },
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

// Shop-Seite mit Produktgrid
const shopPageTemplate = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'full' },
    style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
    actions: [],
    meta: { name: 'Shop Seite' },
    children: [
      // Header (same as above)
      {
        id: 'header',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 }, mobile: { position: 'relative' } },
        actions: [],
        meta: { name: 'Header' },
        children: [
          {
            id: 'header-container',
            type: 'Container',
            props: { maxWidth: 'xl', centered: true },
            style: { base: { padding: '16px 24px' }, mobile: { padding: '12px 16px' } },
            actions: [],
            meta: { name: 'Header Container' },
            children: [
              {
                id: 'header-row',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
                actions: [],
                meta: { name: 'Header Row' },
                children: [
                  { id: 'logo', type: 'Heading', props: { level: 1, text: 'NEXUS' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a' }, mobile: { fontSize: '22px' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                  {
                    id: 'nav',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'lg' },
                    style: { base: { display: 'flex', gap: '32px' }, mobile: { display: 'none' } },
                    actions: [],
                    meta: { name: 'Navigation' },
                    children: [
                      { id: 'nav-home', type: 'Link', props: { text: 'Home', href: '/' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Home Link' }, children: [] },
                      { id: 'nav-shop', type: 'Link', props: { text: 'Shop', href: '/shop' }, style: { base: { color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '600' } }, actions: [], meta: { name: 'Shop Link' }, children: [] },
                      { id: 'nav-about', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'About Link' }, children: [] },
                      { id: 'nav-contact', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Contact Link' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      // Shop Content
      {
        id: 'shop-content',
        type: 'Container',
        props: { maxWidth: 'xl', centered: true },
        style: { base: { padding: '48px 24px' }, mobile: { padding: '24px 16px' } },
        actions: [],
        meta: { name: 'Shop Inhalt' },
        children: [
          // Page Title
          { id: 'shop-title', type: 'Heading', props: { level: 1, text: 'Alle Produkte' }, style: { base: { fontSize: '36px', fontWeight: '700', marginBottom: '32px', textAlign: 'center', color: '#1a1a1a' }, mobile: { fontSize: '28px', marginBottom: '24px' } }, actions: [], meta: { name: 'Shop Titel' }, children: [] },
          // Filter Bar
          {
            id: 'filter-bar',
            type: 'Stack',
            props: { direction: 'row', gap: 'md', justify: 'between', align: 'center' },
            style: { base: { display: 'flex', marginBottom: '32px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }, mobile: { flexDirection: 'column', gap: '12px' } },
            actions: [],
            meta: { name: 'Filter Bar' },
            children: [
              { id: 'filter-label', type: 'Text', props: { text: 'Filter & Sortieren' }, style: { base: { fontSize: '14px', fontWeight: '600', color: '#1a1a1a' } }, actions: [], meta: { name: 'Filter Label' }, children: [] },
              {
                id: 'filter-buttons',
                type: 'Stack',
                props: { direction: 'row', gap: 'sm' },
                style: { base: { display: 'flex', gap: '8px' }, mobile: { flexWrap: 'wrap', justifyContent: 'center' } },
                actions: [],
                meta: { name: 'Filter Buttons' },
                children: [
                  { id: 'filter-btn-all', type: 'Button', props: { text: 'Alle', variant: 'default' }, style: { base: { padding: '8px 16px', fontSize: '12px' } }, actions: [], meta: { name: 'Alle Button' }, children: [] },
                  { id: 'filter-btn-new', type: 'Button', props: { text: 'Neu', variant: 'outline' }, style: { base: { padding: '8px 16px', fontSize: '12px' } }, actions: [], meta: { name: 'Neu Button' }, children: [] },
                  { id: 'filter-btn-sale', type: 'Button', props: { text: 'Sale', variant: 'outline' }, style: { base: { padding: '8px 16px', fontSize: '12px' } }, actions: [], meta: { name: 'Sale Button' }, children: [] },
                ],
              },
            ],
          },
          // Product Grid
          {
            id: 'product-grid',
            type: 'ProductGrid',
            props: { 
              columns: 4,
              gap: 'lg',
              showPrice: true,
              showName: true,
              imageAspect: 'square'
            },
            style: { 
              base: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }, 
              mobile: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' } 
            },
            actions: [],
            meta: { name: 'Produkt Grid' },
            children: [],
          },
        ],
      },
      // Footer (same as above, shortened for brevity)
      {
        id: 'footer',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#1a1a1a', color: '#ffffff', padding: '48px 0' }, mobile: { padding: '32px 0' } },
        actions: [],
        meta: { name: 'Footer' },
        children: [
          {
            id: 'footer-container',
            type: 'Container',
            props: { maxWidth: 'xl', centered: true },
            style: { base: { padding: '0 24px', textAlign: 'center' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Footer Container' },
            children: [
              { id: 'copyright-text', type: 'Text', props: { text: '© 2026 NEXUS. Alle Rechte vorbehalten.' }, style: { base: { fontSize: '14px', color: '#a3a3a3' } }, actions: [], meta: { name: 'Copyright' }, children: [] },
            ],
          },
        ],
      },
    ],
  },
};

// Warenkorb-Seite
const cartPageTemplate = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'full' },
    style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
    actions: [],
    meta: { name: 'Warenkorb Seite' },
    children: [
      // Header
      {
        id: 'header',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5' } },
        actions: [],
        meta: { name: 'Header' },
        children: [
          {
            id: 'header-container',
            type: 'Container',
            props: { maxWidth: 'xl', centered: true },
            style: { base: { padding: '16px 24px' }, mobile: { padding: '12px 16px' } },
            actions: [],
            meta: { name: 'Header Container' },
            children: [
              { id: 'logo', type: 'Heading', props: { level: 1, text: 'NEXUS' }, style: { base: { fontSize: '28px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center' }, mobile: { fontSize: '22px' } }, actions: [], meta: { name: 'Logo' }, children: [] },
            ],
          },
        ],
      },
      // Cart Content
      {
        id: 'cart-content',
        type: 'Container',
        props: { maxWidth: 'lg', centered: true },
        style: { base: { padding: '48px 24px', minHeight: '60vh' }, mobile: { padding: '24px 16px' } },
        actions: [],
        meta: { name: 'Warenkorb Inhalt' },
        children: [
          { id: 'cart-title', type: 'Heading', props: { level: 1, text: 'Warenkorb' }, style: { base: { fontSize: '36px', fontWeight: '700', marginBottom: '32px', color: '#1a1a1a' }, mobile: { fontSize: '28px', marginBottom: '24px' } }, actions: [], meta: { name: 'Warenkorb Titel' }, children: [] },
          // Cart Items Placeholder
          {
            id: 'cart-empty',
            type: 'Container',
            props: {},
            style: { base: { textAlign: 'center', padding: '64px 0' } },
            actions: [],
            meta: { name: 'Leerer Warenkorb' },
            children: [
              { id: 'cart-empty-icon', type: 'Text', props: { text: '🛒' }, style: { base: { fontSize: '64px', marginBottom: '24px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
              { id: 'cart-empty-text', type: 'Text', props: { text: 'Dein Warenkorb ist leer' }, style: { base: { fontSize: '18px', color: '#666666', marginBottom: '24px' } }, actions: [], meta: { name: 'Text' }, children: [] },
              { id: 'cart-empty-cta', type: 'Button', props: { text: 'Weiter einkaufen', variant: 'default' }, style: { base: { padding: '12px 32px' } }, actions: [{ event: 'onClick', action: { type: 'navigate', url: '/shop' } }], meta: { name: 'CTA Button' }, children: [] },
            ],
          },
        ],
      },
    ],
  },
};

// Liste der zu erstellenden Seiten
const pagesToCreate = [
  { name: 'Shop', slug: 'shop', path: '/shop', template: shopPageTemplate },
  { name: 'Warenkorb', slug: 'cart', path: '/cart', template: cartPageTemplate },
  { name: 'Checkout', slug: 'checkout', path: '/checkout', template: createEmptyPageTemplate('Checkout Seite', 'Kasse') },
  { name: 'Über uns', slug: 'about', path: '/about', template: createEmptyPageTemplate('Über uns Seite', 'Über uns') },
  { name: 'Kontakt', slug: 'contact', path: '/contact', template: createEmptyPageTemplate('Kontakt Seite', 'Kontakt') },
  { name: 'FAQ', slug: 'faq', path: '/faq', template: createEmptyPageTemplate('FAQ Seite', 'Häufig gestellte Fragen') },
  { name: 'Impressum', slug: 'imprint', path: '/imprint', template: createEmptyPageTemplate('Impressum', 'Impressum') },
  { name: 'Datenschutz', slug: 'privacy', path: '/privacy', template: createEmptyPageTemplate('Datenschutz', 'Datenschutzerklärung') },
  { name: 'AGB', slug: 'terms', path: '/terms', template: createEmptyPageTemplate('AGB Seite', 'Allgemeine Geschäftsbedingungen') },
  { name: 'Versand', slug: 'shipping', path: '/shipping', template: createEmptyPageTemplate('Versand Seite', 'Versandinformationen') },
  { name: 'Rückgabe', slug: 'returns', path: '/returns', template: createEmptyPageTemplate('Rückgabe Seite', 'Rückgabe & Widerruf') },
  { name: 'Anmelden', slug: 'login', path: '/login', template: createEmptyPageTemplate('Login Seite', 'Anmelden') },
  { name: 'Registrieren', slug: 'register', path: '/register', template: createEmptyPageTemplate('Registrierung Seite', 'Registrieren') },
  { name: 'Wunschliste', slug: 'wishlist', path: '/wishlist', template: createEmptyPageTemplate('Wunschliste Seite', 'Meine Wunschliste') },
  { name: 'Mein Konto', slug: 'account', path: '/account', template: createEmptyPageTemplate('Konto Seite', 'Mein Konto') },
];

async function main() {
  console.log('🔍 Suche Tetete Workspace...');
  
  const workspace = await prisma.workspace.findFirst({
    where: { name: 'Tetete' },
  });

  if (!workspace) {
    console.error('❌ Workspace "Tetete" nicht gefunden!');
    process.exit(1);
  }

  console.log(`✅ Workspace gefunden: ${workspace.id}`);

  // Benutzer finden für createdById
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!user) {
    console.error('❌ Kein Benutzer gefunden!');
    process.exit(1);
  }

  console.log(`👤 Benutzer gefunden: ${user.email}`);
  
  // Bestehende Seiten laden
  const existingPages = await prisma.page.findMany({
    where: { workspaceId: workspace.id },
    select: { slug: true, name: true },
  });

  console.log(`📄 ${existingPages.length} bestehende Seiten gefunden:`);
  existingPages.forEach(p => console.log(`   - ${p.name} (/${p.slug})`));

  const existingSlugs = new Set(existingPages.map(p => p.slug));
  let createdCount = 0;

  console.log('\n🚀 Erstelle fehlende Seiten...\n');

  for (const page of pagesToCreate) {
    if (existingSlugs.has(page.slug)) {
      console.log(`⏭️  Seite "${page.name}" existiert bereits, überspringe...`);
      continue;
    }

    try {
      const newPage = await prisma.page.create({
        data: {
          workspaceId: workspace.id,
          createdById: user.id,
          name: page.name,
          slug: page.slug,
          builderTree: page.template as any,
          isDraft: false,
          isHomepage: false,
          metaTitle: page.name,
          metaDescription: `${page.name} - NEXUS Shop`,
        },
      });

      console.log(`✅ Seite erstellt: ${page.name} (ID: ${newPage.id})`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen von "${page.name}":`, error);
    }
  }

  console.log(`\n✨ Fertig! ${createdCount} neue Seiten erstellt.`);
  
  // Finale Seitenanzahl
  const totalPages = await prisma.page.count({
    where: { workspaceId: workspace.id },
  });
  console.log(`📊 Gesamte Seiten im Workspace: ${totalPages}`);
}

main()
  .catch((e) => {
    console.error('Fehler:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
