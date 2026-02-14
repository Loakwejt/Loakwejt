import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import the shared components from create-nexus-pages.ts
// For now, we'll inline the header/footer generators

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
              { id: 'logo', type: 'Link', props: { text: 'NEXUS', href: '/home' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a', textDecoration: 'none' } }, actions: [], meta: { name: 'Logo' }, children: [] },
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

// Homepage content (between header and footer)
function createHomeContent() {
  return [
    // HERO BANNER
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
                    { id: 'hero-badge', type: 'Badge', props: { text: 'TECH WEEK', variant: 'secondary' }, style: { base: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '16px', fontSize: '11px', padding: '6px 16px', fontWeight: '700', letterSpacing: '0.1em' } }, actions: [], meta: { name: 'Hero Badge' }, children: [] },
                    { id: 'hero-title', type: 'Heading', props: { level: 1, text: 'Bis zu 40% Rabatt auf Elektronik' }, style: { base: { color: '#ffffff', fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' } }, actions: [], meta: { name: 'Hero Title' }, children: [] },
                    { id: 'hero-subtitle', type: 'Text', props: { text: 'Smartphones, Laptops, Gaming & mehr. Nur noch 3 Tage!' }, style: { base: { color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' } }, actions: [], meta: { name: 'Hero Subtitle' }, children: [] },
                    { id: 'hero-cta', type: 'Button', props: { text: 'Jetzt Deals entdecken', variant: 'primary' }, style: { base: { backgroundColor: '#ffffff', color: '#764ba2', padding: '16px 32px', fontSize: '15px', fontWeight: '600', borderRadius: '8px' } }, actions: [], meta: { name: 'Hero CTA' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // CATEGORY GRID
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
                { id: 'cat-1', type: 'Card', props: { title: 'Elektronik', description: 'Smartphones, Tablets & mehr' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Elektronik' }, children: [] },
                { id: 'cat-2', type: 'Card', props: { title: 'Haus & Garten', description: 'Möbel, Dekoration, Werkzeug' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Haushalt' }, children: [] },
                { id: 'cat-3', type: 'Card', props: { title: 'Sport & Outdoor', description: 'Fitness, Camping, Fahrräder' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Sport' }, children: [] },
                { id: 'cat-4', type: 'Card', props: { title: 'Beauty', description: 'Pflege, Düfte, Wellness' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Beauty' }, children: [] },
              ],
            },
          ],
        },
      ],
    },

    // BESTSELLER
    {
      id: 'bestseller-section',
      type: 'Section',
      props: {},
      style: { base: { backgroundColor: '#f9fafb', padding: '60px 0' } },
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
              style: { base: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' } },
              actions: [],
              meta: { name: 'Bestseller Header' },
              children: [
                { id: 'best-title', type: 'Heading', props: { level: 2, text: 'Bestseller' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' } }, actions: [], meta: { name: 'Bestseller Title' }, children: [] },
                { id: 'best-more', type: 'Link', props: { text: 'Alle anzeigen', href: '#' }, style: { base: { color: '#111827', textDecoration: 'none', fontWeight: '500', fontSize: '14px' } }, actions: [], meta: { name: 'Mehr Link' }, children: [] },
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
                  style: { base: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Produkt 1' },
                  children: [
                    { id: 'p1-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', alt: 'Laptop' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                    { id: 'p1-name', type: 'Text', props: { text: 'MacBook Pro 14"' }, style: { base: { fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    { id: 'p1-rating', type: 'Text', props: { text: '4.9 (2.847)' }, style: { base: { fontSize: '11px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                    { id: 'p1-price', type: 'Text', props: { text: '1.999 €' }, style: { base: { fontWeight: '700', fontSize: '15px', color: '#111827' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                  ],
                },
                {
                  id: 'prod-2',
                  type: 'Container',
                  props: {},
                  style: { base: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Produkt 2' },
                  children: [
                    { id: 'p2-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', alt: 'Phone' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                    { id: 'p2-name', type: 'Text', props: { text: 'iPhone 15 Pro' }, style: { base: { fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    { id: 'p2-rating', type: 'Text', props: { text: '4.8 (5.123)' }, style: { base: { fontSize: '11px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                    { id: 'p2-price', type: 'Text', props: { text: '1.199 €' }, style: { base: { fontWeight: '700', fontSize: '15px', color: '#111827' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                  ],
                },
                {
                  id: 'prod-3',
                  type: 'Container',
                  props: {},
                  style: { base: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Produkt 3' },
                  children: [
                    { id: 'p3-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', alt: 'Camera' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                    { id: 'p3-name', type: 'Text', props: { text: 'Sony Alpha 7 IV' }, style: { base: { fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    { id: 'p3-rating', type: 'Text', props: { text: '4.9 (892)' }, style: { base: { fontSize: '11px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                    { id: 'p3-price', type: 'Text', props: { text: '2.499 €' }, style: { base: { fontWeight: '700', fontSize: '15px', color: '#111827' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                  ],
                },
                {
                  id: 'prod-4',
                  type: 'Container',
                  props: {},
                  style: { base: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Produkt 4' },
                  children: [
                    { id: 'p4-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop', alt: 'Console' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                    { id: 'p4-name', type: 'Text', props: { text: 'PlayStation 5' }, style: { base: { fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    { id: 'p4-rating', type: 'Text', props: { text: '4.7 (12.456)' }, style: { base: { fontSize: '11px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                    { id: 'p4-price', type: 'Text', props: { text: '549 €' }, style: { base: { fontWeight: '700', fontSize: '15px', color: '#111827' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                  ],
                },
                {
                  id: 'prod-5',
                  type: 'Container',
                  props: {},
                  style: { base: { backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' } },
                  actions: [],
                  meta: { name: 'Produkt 5' },
                  children: [
                    { id: 'p5-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', alt: 'Vacuum' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                    { id: 'p5-name', type: 'Text', props: { text: 'Dyson V15' }, style: { base: { fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: '#111827' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    { id: 'p5-rating', type: 'Text', props: { text: '4.8 (3.291)' }, style: { base: { fontSize: '11px', color: '#6b7280', marginBottom: '8px' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                    { id: 'p5-price', type: 'Text', props: { text: '699 €' }, style: { base: { fontWeight: '700', fontSize: '15px', color: '#111827' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // NEWSLETTER
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
            { id: 'nl-label', type: 'Text', props: { text: 'NEWSLETTER' }, style: { base: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' } }, actions: [], meta: { name: 'Label' }, children: [] },
            { id: 'nl-title', type: 'Heading', props: { level: 2, text: '10€ Geschenkt' }, style: { base: { color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' } }, actions: [], meta: { name: 'Title' }, children: [] },
            { id: 'nl-desc', type: 'Text', props: { text: 'Melde dich an und erhalte 10€ Rabatt auf deine erste Bestellung ab 50€' }, style: { base: { color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' } }, actions: [], meta: { name: 'Description' }, children: [] },
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
            { id: 'nl-privacy', type: 'Text', props: { text: 'Mit der Anmeldung akzeptierst du unsere Datenschutzbestimmungen' }, style: { base: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '16px' } }, actions: [], meta: { name: 'Privacy Note' }, children: [] },
          ],
        },
      ],
    },
  ];
}

async function main() {
  console.log('🏠 Updating Home Page with shared Header/Footer...\n');

  // Find the home page
  const homePage = await prisma.page.findFirst({
    where: { slug: 'home' },
  });

  if (!homePage) {
    console.log('❌ Home page not found!');
    return;
  }

  console.log(`📝 Updating page: ${homePage.name}`);

  const homeTree = {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: { minHeight: 'auto' },
      style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
      actions: [],
      meta: { name: 'Home' },
      children: [
        createHeader('home'),
        ...createHomeContent(),
        createFooter(),
      ],
    },
  };

  await prisma.page.update({
    where: { id: homePage.id },
    data: { builderTree: homeTree as any }
  });

  console.log('✅ Home page updated with shared Header/Footer!');
  console.log('🔄 Please refresh the editor to see the changes.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
