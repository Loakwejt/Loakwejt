import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// SHARED COMPONENTS - Header & Footer
// ============================================================================

/**
 * Creates the NEXUS header with navigation
 * @param activeSlug - The slug of the currently active page to highlight
 */
function createHeader(activeSlug: string = 'home') {
  const navItems = [
    { id: 'nav-elektronik', text: 'Elektronik', slug: 'elektronik' },
    { id: 'nav-haushalt', text: 'Haus & Garten', slug: 'haus-garten' },
    { id: 'nav-sport', text: 'Sport & Outdoor', slug: 'sport-outdoor' },
    { id: 'nav-beauty', text: 'Beauty & Gesundheit', slug: 'beauty' },
    { id: 'nav-baby', text: 'Baby & Kind', slug: 'baby-kind' },
    { id: 'nav-marken', text: 'Marken', slug: 'marken' },
    { id: 'nav-sale', text: 'SALE', slug: 'sale', isSpecial: true },
  ];

  return {
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
              { id: 'promo-text', type: 'Text', props: { text: 'Kostenloser Versand ab 29€  ·  Express-Lieferung verfügbar' }, style: { base: { color: '#ffffff', fontSize: '12px', textAlign: 'center', letterSpacing: '0.02em' } }, actions: [], meta: { name: 'Promo Text' }, children: [] },
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
              { id: 'logo', type: 'Link', props: { text: 'NEXUS', href: '/' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a', textDecoration: 'none' } }, actions: [], meta: { name: 'Logo' }, children: [] },
              {
                id: 'search-container',
                type: 'Container',
                props: { maxWidth: 'full' },
                style: { base: { display: 'flex', flex: '1', maxWidth: '500px', margin: '0 40px' } },
                actions: [],
                meta: { name: 'Search Container' },
                children: [
                  { id: 'search-input', type: 'Input', props: { placeholder: 'Produkte, Marken und mehr suchen...' }, style: { base: { width: '100%', border: '2px solid #e5e5e5', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' } }, actions: [], meta: { name: 'Suchfeld' }, children: [] },
                ],
              },
              {
                id: 'header-actions',
                type: 'Stack',
                props: { direction: 'row', gap: 'md', align: 'center' },
                style: { base: { display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' } },
                actions: [],
                meta: { name: 'Header Actions' },
                children: [
                  { id: 'login-link', type: 'Link', props: { text: 'Anmelden', href: '/login' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Login Link' }, children: [] },
                  { id: 'wishlist-link', type: 'Link', props: { text: '♡', href: '/wishlist' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '20px' } }, actions: [], meta: { name: 'Wishlist' }, children: [] },
                  { id: 'cart-link', type: 'Button', props: { text: 'Warenkorb (0)', variant: 'outline' }, style: { base: { border: '2px solid #1a1a1a', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px' } }, actions: [], meta: { name: 'Warenkorb' }, children: [] },
                ],
              },
            ],
          },
        ],
      },
      // Category Navigation with active highlighting
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
            children: navItems.map(item => ({
              id: item.id,
              type: 'Link',
              props: { text: item.text, href: `/${item.slug}` },
              style: { 
                base: { 
                  color: item.isSpecial ? '#dc2626' : (activeSlug === item.slug ? '#667eea' : '#1a1a1a'), 
                  textDecoration: 'none', 
                  fontSize: '14px', 
                  fontWeight: activeSlug === item.slug ? '700' : (item.isSpecial ? '700' : '500'),
                  borderBottom: activeSlug === item.slug ? '2px solid #667eea' : 'none',
                  paddingBottom: '2px'
                } 
              },
              actions: [],
              meta: { name: `Nav: ${item.text}` },
              children: []
            })),
          },
        ],
      },
    ],
  };
}

/**
 * Creates the NEXUS footer
 */
function createFooter() {
  return {
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
                  { id: 'fs-4', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
                ],
              },
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
              {
                id: 'footer-payment',
                type: 'Stack',
                props: { direction: 'column', gap: 'sm' },
                style: { base: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                actions: [],
                meta: { name: 'Footer Payment' },
                children: [
                  { id: 'fp-title', type: 'Text', props: { text: 'ZAHLARTEN' }, style: { base: { color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '12px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                  { id: 'fp-icons', type: 'Text', props: { text: 'Visa · Mastercard · PayPal' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.8' } }, actions: [], meta: { name: 'Icons' }, children: [] },
                  { id: 'fp-icons2', type: 'Text', props: { text: 'Apple Pay · Google Pay' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.8' } }, actions: [], meta: { name: 'Icons 2' }, children: [] },
                  { id: 'fp-icons3', type: 'Text', props: { text: 'Klarna · SOFORT' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.8' } }, actions: [], meta: { name: 'Icons 3' }, children: [] },
                ],
              },
            ],
          },
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
  };
}

// ============================================================================
// PAGE CONTENT GENERATORS
// ============================================================================

interface CategoryPageConfig {
  slug: string;
  name: string;
  title: string;
  description: string;
  heroColor: string;
  products: { name: string; price: string; image: string; rating: string }[];
}

function createCategoryPage(config: CategoryPageConfig) {
  return {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: { minHeight: 'auto' },
      style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
      actions: [],
      meta: { name: config.name },
      children: [
        createHeader(config.slug),
        
        // Category Hero
        {
          id: 'category-hero',
          type: 'Section',
          props: {},
          style: { base: { background: config.heroColor, padding: '60px 0' } },
          actions: [],
          meta: { name: 'Category Hero' },
          children: [
            {
              id: 'hero-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Hero Container' },
              children: [
                { id: 'cat-title', type: 'Heading', props: { level: 1, text: config.title }, style: { base: { color: '#ffffff', fontSize: '42px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' } }, actions: [], meta: { name: 'Category Title' }, children: [] },
                { id: 'cat-desc', type: 'Text', props: { text: config.description }, style: { base: { color: 'rgba(255,255,255,0.85)', fontSize: '16px', maxWidth: '600px' } }, actions: [], meta: { name: 'Category Description' }, children: [] },
              ],
            },
          ],
        },

        // Filters & Products
        {
          id: 'products-section',
          type: 'Section',
          props: {},
          style: { base: { backgroundColor: '#ffffff', padding: '48px 0' } },
          actions: [],
          meta: { name: 'Products Section' },
          children: [
            {
              id: 'products-container',
              type: 'Container',
              props: { maxWidth: 'xl', centered: true },
              style: { base: { padding: '0 24px' } },
              actions: [],
              meta: { name: 'Products Container' },
              children: [
                // Filters Bar
                {
                  id: 'filters-bar',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Filters Bar' },
                  children: [
                    { id: 'results-count', type: 'Text', props: { text: `${config.products.length * 3} Produkte gefunden` }, style: { base: { fontSize: '14px', color: '#6b7280' } }, actions: [], meta: { name: 'Results Count' }, children: [] },
                    {
                      id: 'sort-options',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'sm' },
                      style: { base: { display: 'flex', gap: '12px' } },
                      actions: [],
                      meta: { name: 'Sort Options' },
                      children: [
                        { id: 'sort-label', type: 'Text', props: { text: 'Sortieren:' }, style: { base: { fontSize: '14px', color: '#6b7280' } }, actions: [], meta: { name: 'Label' }, children: [] },
                        { id: 'sort-btn', type: 'Button', props: { text: 'Beliebtheit', variant: 'outline' }, style: { base: { fontSize: '13px', padding: '6px 12px' } }, actions: [], meta: { name: 'Sort Button' }, children: [] },
                      ],
                    },
                  ],
                },
                // Products Grid
                {
                  id: 'products-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Products Grid' },
                  children: config.products.map((product, i) => ({
                    id: `product-${i}`,
                    type: 'Container',
                    props: {},
                    style: { base: { backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' } },
                    actions: [],
                    meta: { name: product.name },
                    children: [
                      { id: `prod-${i}-img`, type: 'Image', props: { src: product.image, alt: product.name }, style: { base: { width: '100%', height: '180px', objectFit: 'cover', marginBottom: '16px', borderRadius: '8px' } }, actions: [], meta: { name: 'Image' }, children: [] },
                      { id: `prod-${i}-name`, type: 'Text', props: { text: product.name }, style: { base: { fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                      { id: `prod-${i}-rating`, type: 'Text', props: { text: product.rating }, style: { base: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                      { id: `prod-${i}-price`, type: 'Text', props: { text: product.price }, style: { base: { fontWeight: '700', fontSize: '16px', color: '#111827' } }, actions: [], meta: { name: 'Price' }, children: [] },
                    ],
                  })),
                },
              ],
            },
          ],
        },

        createFooter(),
      ],
    },
  };
}

// ============================================================================
// PAGE CONFIGURATIONS
// ============================================================================

const categoryPages: CategoryPageConfig[] = [
  {
    slug: 'elektronik',
    name: 'Elektronik',
    title: 'Elektronik',
    description: 'Smartphones, Laptops, Tablets, Gaming und mehr – entdecke die neueste Technik.',
    heroColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    products: [
      { name: 'MacBook Pro 14"', price: '1.999 €', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', rating: '4.9 (2.847)' },
      { name: 'iPhone 15 Pro', price: '1.199 €', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', rating: '4.8 (5.123)' },
      { name: 'Sony Alpha 7 IV', price: '2.499 €', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', rating: '4.9 (892)' },
      { name: 'PlayStation 5', price: '549 €', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop', rating: '4.7 (12.456)' },
      { name: 'AirPods Pro 2', price: '279 €', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop', rating: '4.8 (8.234)' },
      { name: 'iPad Pro 12.9"', price: '1.449 €', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop', rating: '4.9 (3.567)' },
      { name: 'Samsung Galaxy S24', price: '899 €', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop', rating: '4.7 (2.145)' },
      { name: 'Nintendo Switch OLED', price: '349 €', image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=300&h=300&fit=crop', rating: '4.8 (6.789)' },
    ],
  },
  {
    slug: 'haus-garten',
    name: 'Haus & Garten',
    title: 'Haus & Garten',
    description: 'Möbel, Dekoration, Werkzeuge und alles für dein Zuhause und deinen Garten.',
    heroColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    products: [
      { name: 'Dyson V15', price: '699 €', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', rating: '4.8 (3.291)' },
      { name: 'Bosch Akkuschrauber Set', price: '189 €', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop', rating: '4.7 (1.456)' },
      { name: 'Lounge Gartenmöbel', price: '799 €', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&h=300&fit=crop', rating: '4.6 (567)' },
      { name: 'Philips Hue Starter Set', price: '149 €', image: 'https://images.unsplash.com/photo-1558618047-f4b511736f20?w=300&h=300&fit=crop', rating: '4.8 (4.123)' },
      { name: 'Weber Gasgrill', price: '599 €', image: 'https://images.unsplash.com/photo-1529262253293-0be9d6506e93?w=300&h=300&fit=crop', rating: '4.9 (2.345)' },
      { name: 'Kärcher Hochdruckreiniger', price: '249 €', image: 'https://images.unsplash.com/photo-1621600411688-4be93c68ae67?w=300&h=300&fit=crop', rating: '4.7 (1.678)' },
      { name: 'Relaxsessel Leder', price: '449 €', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop', rating: '4.5 (892)' },
      { name: 'Rasenmäher Roboter', price: '899 €', image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=300&h=300&fit=crop', rating: '4.6 (456)' },
    ],
  },
  {
    slug: 'sport-outdoor',
    name: 'Sport & Outdoor',
    title: 'Sport & Outdoor',
    description: 'Fitness, Camping, Fahrräder und alles für deine sportlichen Aktivitäten.',
    heroColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    products: [
      { name: 'E-Bike Trekking', price: '2.499 €', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop', rating: '4.8 (567)' },
      { name: 'Laufband ProFit', price: '799 €', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=300&h=300&fit=crop', rating: '4.6 (1.234)' },
      { name: 'Camping Zelt 4P', price: '299 €', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop', rating: '4.7 (892)' },
      { name: 'Yoga Set Premium', price: '89 €', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop', rating: '4.9 (3.456)' },
      { name: 'Kletterschuhe Pro', price: '149 €', image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=300&h=300&fit=crop', rating: '4.8 (678)' },
      { name: 'SUP Board Set', price: '449 €', image: 'https://images.unsplash.com/photo-1526188717906-ab4a2f949f78?w=300&h=300&fit=crop', rating: '4.7 (345)' },
      { name: 'Hantelset 40kg', price: '179 €', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop', rating: '4.8 (2.123)' },
      { name: 'Wanderrucksack 40L', price: '129 €', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=300&h=300&fit=crop', rating: '4.9 (1.567)' },
    ],
  },
  {
    slug: 'beauty',
    name: 'Beauty & Gesundheit',
    title: 'Beauty & Gesundheit',
    description: 'Pflege, Düfte, Wellness und alles für dein Wohlbefinden.',
    heroColor: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    products: [
      { name: 'Dyson Airwrap', price: '549 €', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop', rating: '4.8 (4.567)' },
      { name: 'La Mer Creme', price: '199 €', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop', rating: '4.9 (2.345)' },
      { name: 'Oral-B iO Series 9', price: '299 €', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop', rating: '4.7 (3.456)' },
      { name: 'Parfum Set Luxus', price: '149 €', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop', rating: '4.8 (1.234)' },
      { name: 'Massagepistole Pro', price: '199 €', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop', rating: '4.6 (2.678)' },
      { name: 'Make-up Set Pro', price: '89 €', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop', rating: '4.7 (4.567)' },
      { name: 'Philips Lumea IPL', price: '449 €', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', rating: '4.5 (1.890)' },
      { name: 'Vitamine Set Premium', price: '49 €', image: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=300&h=300&fit=crop', rating: '4.8 (5.678)' },
    ],
  },
  {
    slug: 'baby-kind',
    name: 'Baby & Kind',
    title: 'Baby & Kind',
    description: 'Spielzeug, Kleidung, Zubehör und alles für die Kleinen.',
    heroColor: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    products: [
      { name: 'Kinderwagen Premium', price: '899 €', image: 'https://images.unsplash.com/photo-1544776193-a55f24e4d4a5?w=300&h=300&fit=crop', rating: '4.9 (1.234)' },
      { name: 'LEGO Technic Set', price: '149 €', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop', rating: '4.8 (5.678)' },
      { name: 'Babyphone mit Kamera', price: '129 €', image: 'https://images.unsplash.com/photo-1544776193-a55f24e4d4a5?w=300&h=300&fit=crop', rating: '4.7 (2.345)' },
      { name: 'Kindersitz Isofix', price: '249 €', image: 'https://images.unsplash.com/photo-1544776193-a55f24e4d4a5?w=300&h=300&fit=crop', rating: '4.9 (3.456)' },
      { name: 'Holzspielzeug Set', price: '59 €', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop', rating: '4.8 (1.890)' },
      { name: 'Kinder Fahrrad 20"', price: '299 €', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=300&h=300&fit=crop', rating: '4.6 (678)' },
      { name: 'Baby Starter Set', price: '89 €', image: 'https://images.unsplash.com/photo-1544776193-a55f24e4d4a5?w=300&h=300&fit=crop', rating: '4.9 (4.567)' },
      { name: 'Spielküche Deluxe', price: '179 €', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop', rating: '4.7 (567)' },
    ],
  },
  {
    slug: 'marken',
    name: 'Marken',
    title: 'Top Marken',
    description: 'Entdecke die beliebtesten Marken und exklusive Angebote.',
    heroColor: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
    products: [
      { name: 'Apple Watch Ultra 2', price: '899 €', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop', rating: '4.9 (3.456)' },
      { name: 'Bose QuietComfort', price: '399 €', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', rating: '4.8 (6.789)' },
      { name: 'Nike Air Max', price: '179 €', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', rating: '4.7 (12.345)' },
      { name: 'Samsung QLED 65"', price: '1.299 €', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop', rating: '4.8 (2.123)' },
      { name: 'Adidas Ultraboost', price: '189 €', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=300&h=300&fit=crop', rating: '4.8 (8.901)' },
      { name: 'Rolex Submariner', price: '9.999 €', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop', rating: '5.0 (234)' },
      { name: 'Canon EOS R6 II', price: '2.799 €', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', rating: '4.9 (567)' },
      { name: 'DJI Mavic 3 Pro', price: '2.199 €', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=300&fit=crop', rating: '4.8 (1.234)' },
    ],
  },
  {
    slug: 'sale',
    name: 'Sale',
    title: 'SALE – Bis zu 70% sparen!',
    description: 'Die besten Angebote und Schnäppchen – nur für kurze Zeit.',
    heroColor: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    products: [
      { name: 'Gaming Stuhl Pro', price: '199 € statt 349 €', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&h=300&fit=crop', rating: '4.6 (2.345)' },
      { name: 'Bluetooth Speaker', price: '49 € statt 89 €', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', rating: '4.5 (4.567)' },
      { name: 'Fitness Tracker', price: '79 € statt 149 €', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop', rating: '4.4 (3.456)' },
      { name: 'Kaffeevollautomat', price: '399 € statt 599 €', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop', rating: '4.7 (1.234)' },
      { name: 'LED TV 55"', price: '449 € statt 699 €', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop', rating: '4.6 (2.678)' },
      { name: 'Wireless Earbuds', price: '59 € statt 99 €', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop', rating: '4.5 (5.678)' },
      { name: 'Smartwatch Sport', price: '149 € statt 249 €', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop', rating: '4.6 (1.890)' },
      { name: 'Laptop Stand', price: '29 € statt 49 €', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', rating: '4.8 (678)' },
    ],
  },
];

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
  console.log('🚀 Creating NEXUS Shop Pages...\n');

  // Find the workspace
  const workspace = await prisma.workspace.findFirst({
    where: { slug: 'nexus-shop' },
    include: { pages: true, members: true }
  });

  if (!workspace) {
    // Try to find the demo workspace
    const demoWorkspace = await prisma.workspace.findFirst({
      include: { pages: true, members: true }
    });
    
    if (!demoWorkspace) {
      console.log('❌ No workspace found! Please create a workspace first.');
      return;
    }
    
    console.log(`📍 Using workspace: ${demoWorkspace.name} (${demoWorkspace.id})\n`);
    
    // Get the creator from the workspace
    const creator = demoWorkspace.members[0];
    if (!creator) {
      console.log('❌ No workspace member found!');
      return;
    }

    // Create pages for each category
    for (const config of categoryPages) {
      const existingPage = demoWorkspace.pages.find(p => p.slug === config.slug);
      
      if (existingPage) {
        console.log(`📝 Updating page: ${config.name}`);
        await prisma.page.update({
          where: { id: existingPage.id },
          data: { 
            builderTree: createCategoryPage(config) as any,
            name: config.name
          }
        });
      } else {
        console.log(`✨ Creating page: ${config.name}`);
        await prisma.page.create({
          data: {
            workspaceId: demoWorkspace.id,
            name: config.name,
            slug: config.slug,
            description: config.description,
            builderTree: createCategoryPage(config) as any,
            createdById: creator.userId,
          }
        });
      }
    }

    console.log('\n✅ All pages created/updated!');
    
    // List all pages
    const allPages = await prisma.page.findMany({
      where: { workspaceId: demoWorkspace.id },
      select: { name: true, slug: true }
    });
    
    console.log('\n📋 Pages:');
    allPages.forEach(p => console.log(`  - ${p.name} (/${p.slug})`));
    
    return;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
