import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Modern Shop Template - Clean & Minimal Design
 * Different from NEXUS: More whitespace, softer colors, rounded elements
 */
const modernShopTemplate = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'auto' },
    style: { base: { backgroundColor: '#fafafa', color: '#18181b', padding: 'none' } },
    actions: [],
    meta: { name: 'Shop Seite' },
    children: [
      // ============= HEADER =============
      {
        id: 'header',
        type: 'Section',
        props: {},
        style: { 
          base: { backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: '0', zIndex: 100 },
          mobile: { position: 'relative' }
        },
        actions: [],
        meta: { name: 'Header' },
        children: [
          {
            id: 'header-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '16px 24px' }, mobile: { padding: '12px 16px' } },
            actions: [],
            meta: { name: 'Header Container' },
            children: [
              {
                id: 'header-row',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center', responsiveStack: false },
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
                actions: [],
                meta: { name: 'Header Row' },
                children: [
                  // Mobile Menu Button
                  { 
                    id: 'mobile-menu-btn', 
                    type: 'Button', 
                    props: { text: '☰', variant: 'ghost' }, 
                    style: { base: { display: 'none' }, mobile: { display: 'flex', fontSize: '24px', padding: '4px 8px', minWidth: 'auto', backgroundColor: 'transparent', border: 'none' } }, 
                    actions: [{ event: 'onClick', action: { type: 'toggleMobileSidebar' } }], 
                    meta: { name: 'Menu Button' }, 
                    children: [] 
                  },
                  // Logo
                  { 
                    id: 'logo', 
                    type: 'Heading', 
                    props: { level: 1, text: 'MODERN' }, 
                    style: { base: { fontSize: '24px', fontWeight: '700', letterSpacing: '0.05em', color: '#2563eb' }, mobile: { fontSize: '20px', flex: '1', textAlign: 'center' } }, 
                    actions: [], 
                    meta: { name: 'Logo' }, 
                    children: [] 
                  },
                  // Desktop Navigation
                  {
                    id: 'nav-links',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'lg' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'center' }, mobile: { display: 'none' } },
                    actions: [],
                    meta: { name: 'Navigation' },
                    children: [
                      { id: 'nav-produkte', type: 'Link', props: { text: 'Produkte', href: '#produkte' }, style: { base: { color: '#3f3f46', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Produkte' }, children: [] },
                      { id: 'nav-kategorien', type: 'Link', props: { text: 'Kategorien', href: '#kategorien' }, style: { base: { color: '#3f3f46', textDecoration: 'none', fontSize: '14px', fontWeight: '500' } }, actions: [], meta: { name: 'Nav: Kategorien' }, children: [] },
                      { id: 'nav-sale', type: 'Link', props: { text: 'Sale', href: '#sale' }, style: { base: { color: '#dc2626', textDecoration: 'none', fontSize: '14px', fontWeight: '600' } }, actions: [], meta: { name: 'Nav: Sale' }, children: [] },
                    ],
                  },
                  // Header Actions
                  {
                    id: 'header-actions',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'md', align: 'center', responsiveStack: false },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }, mobile: { gap: '12px' } },
                    actions: [],
                    meta: { name: 'Header Actions' },
                    children: [
                      { 
                        id: 'login-btn', 
                        type: 'Button', 
                        props: { text: 'Anmelden', variant: 'ghost' }, 
                        style: { base: { color: '#3f3f46', fontSize: '14px', fontWeight: '500', padding: '8px 16px' }, mobile: { display: 'none' } }, 
                        actions: [{ event: 'onClick', action: { type: 'openAuthModal' } }], 
                        meta: { name: 'Login Button' }, 
                        children: [] 
                      },
                      { 
                        id: 'cart-btn', 
                        type: 'Button', 
                        props: { text: '🛒 Warenkorb', variant: 'primary' }, 
                        style: { base: { backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '9999px', padding: '10px 20px', fontWeight: '600', fontSize: '14px' }, mobile: { padding: '8px 12px', fontSize: '18px' } }, 
                        actions: [{ event: 'onClick', action: { type: 'openCart' } }], 
                        meta: { name: 'Warenkorb Button' }, 
                        children: [] 
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ============= HERO SECTION =============
      {
        id: 'hero-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#ffffff', padding: '80px 0' }, mobile: { padding: '40px 0' } },
        actions: [],
        meta: { name: 'Hero Section' },
        children: [
          {
            id: 'hero-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Hero Container' },
            children: [
              {
                id: 'hero-grid',
                type: 'Grid',
                props: { columns: 2, gap: 'xl' },
                style: { base: { alignItems: 'center' }, mobile: { gridColumns: 1, gap: 'lg' } },
                actions: [],
                meta: { name: 'Hero Grid' },
                children: [
                  // Left: Text Content
                  {
                    id: 'hero-text',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: {}, mobile: { textAlign: 'center' } },
                    actions: [],
                    meta: { name: 'Hero Text' },
                    children: [
                      { 
                        id: 'hero-badge', 
                        type: 'Badge', 
                        props: { text: 'NEU EINGETROFFEN', variant: 'outline' }, 
                        style: { base: { borderColor: '#2563eb', color: '#2563eb', marginBottom: '16px', fontSize: '11px', padding: '6px 12px', fontWeight: '600', letterSpacing: '0.05em' } }, 
                        actions: [], 
                        meta: { name: 'Hero Badge' }, 
                        children: [] 
                      },
                      { 
                        id: 'hero-title', 
                        type: 'Heading', 
                        props: { level: 1, text: 'Entdecke unsere Frühlings-Kollektion' }, 
                        style: { base: { fontSize: '48px', fontWeight: '700', lineHeight: '1.1', marginBottom: '24px', color: '#18181b' }, mobile: { fontSize: '28px', marginBottom: '16px' } }, 
                        actions: [], 
                        meta: { name: 'Hero Title' }, 
                        children: [] 
                      },
                      { 
                        id: 'hero-text-desc', 
                        type: 'Text', 
                        props: { text: 'Premium Qualität trifft auf modernes Design. Entdecke unsere handverlesene Auswahl an Produkten für deinen Alltag.' }, 
                        style: { base: { fontSize: '18px', color: '#71717a', lineHeight: '1.6', marginBottom: '32px' }, mobile: { fontSize: '15px', marginBottom: '24px' } }, 
                        actions: [], 
                        meta: { name: 'Hero Description' }, 
                        children: [] 
                      },
                      {
                        id: 'hero-buttons',
                        type: 'Stack',
                        props: { direction: 'row', gap: 'md' },
                        style: { base: { display: 'flex', flexDirection: 'row', gap: '16px' }, mobile: { flexDirection: 'column', gap: '12px' } },
                        actions: [],
                        meta: { name: 'Hero Buttons' },
                        children: [
                          { 
                            id: 'hero-cta', 
                            type: 'Button', 
                            props: { text: 'Jetzt shoppen', variant: 'primary' }, 
                            style: { base: { backgroundColor: '#2563eb', color: '#ffffff', padding: '16px 32px', fontSize: '16px', fontWeight: '600', borderRadius: '12px' }, mobile: { width: '100%', padding: '14px 24px' } }, 
                            actions: [{ event: 'onClick', action: { type: 'navigate', to: '#produkte' } }], 
                            meta: { name: 'Hero CTA' }, 
                            children: [] 
                          },
                          { 
                            id: 'hero-secondary', 
                            type: 'Button', 
                            props: { text: 'Mehr erfahren', variant: 'outline' }, 
                            style: { base: { borderColor: '#e4e4e7', color: '#3f3f46', padding: '16px 32px', fontSize: '16px', fontWeight: '500', borderRadius: '12px' }, mobile: { width: '100%', padding: '14px 24px' } }, 
                            actions: [{ event: 'onClick', action: { type: 'navigate', to: '#kategorien' } }], 
                            meta: { name: 'Hero Secondary' }, 
                            children: [] 
                          },
                        ],
                      },
                    ],
                  },
                  // Right: Image
                  {
                    id: 'hero-image-wrapper',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { borderRadius: '24px', overflow: 'hidden', backgroundColor: '#f4f4f5' }, mobile: { borderRadius: '16px' } },
                    actions: [],
                    meta: { name: 'Hero Image Wrapper' },
                    children: [
                      { 
                        id: 'hero-image', 
                        type: 'Image', 
                        props: { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', alt: 'Frühlings-Kollektion' }, 
                        style: { base: { width: '100%', height: '400px', objectFit: 'cover' }, mobile: { height: '280px' } }, 
                        actions: [], 
                        meta: { name: 'Hero Image' }, 
                        children: [] 
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ============= TRUST BADGES =============
      {
        id: 'trust-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#f4f4f5', padding: '32px 0' }, mobile: { padding: '24px 0' } },
        actions: [],
        meta: { name: 'Trust Badges' },
        children: [
          {
            id: 'trust-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Trust Container' },
            children: [
              {
                id: 'trust-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 2, gap: 'md' } },
                actions: [],
                meta: { name: 'Trust Grid' },
                children: [
                  {
                    id: 'trust-1',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }, mobile: { flexDirection: 'column', textAlign: 'center', gap: '8px' } },
                    actions: [],
                    meta: { name: 'Trust Badge 1' },
                    children: [
                      { id: 'trust-icon-1', type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: '28px' }, mobile: { fontSize: '24px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'trust-text-1', type: 'Text', props: { text: 'Kostenloser Versand ab 49€' }, style: { base: { fontSize: '14px', fontWeight: '500', color: '#3f3f46' }, mobile: { fontSize: '12px' } }, actions: [], meta: { name: 'Text' }, children: [] },
                    ],
                  },
                  {
                    id: 'trust-2',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }, mobile: { flexDirection: 'column', textAlign: 'center', gap: '8px' } },
                    actions: [],
                    meta: { name: 'Trust Badge 2' },
                    children: [
                      { id: 'trust-icon-2', type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: '28px' }, mobile: { fontSize: '24px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'trust-text-2', type: 'Text', props: { text: '30 Tage Rückgaberecht' }, style: { base: { fontSize: '14px', fontWeight: '500', color: '#3f3f46' }, mobile: { fontSize: '12px' } }, actions: [], meta: { name: 'Text' }, children: [] },
                    ],
                  },
                  {
                    id: 'trust-3',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }, mobile: { flexDirection: 'column', textAlign: 'center', gap: '8px' } },
                    actions: [],
                    meta: { name: 'Trust Badge 3' },
                    children: [
                      { id: 'trust-icon-3', type: 'Text', props: { text: '🔒' }, style: { base: { fontSize: '28px' }, mobile: { fontSize: '24px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'trust-text-3', type: 'Text', props: { text: 'Sichere Bezahlung' }, style: { base: { fontSize: '14px', fontWeight: '500', color: '#3f3f46' }, mobile: { fontSize: '12px' } }, actions: [], meta: { name: 'Text' }, children: [] },
                    ],
                  },
                  {
                    id: 'trust-4',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }, mobile: { flexDirection: 'column', textAlign: 'center', gap: '8px' } },
                    actions: [],
                    meta: { name: 'Trust Badge 4' },
                    children: [
                      { id: 'trust-icon-4', type: 'Text', props: { text: '⭐' }, style: { base: { fontSize: '28px' }, mobile: { fontSize: '24px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'trust-text-4', type: 'Text', props: { text: '4.9/5 Kundenbewertung' }, style: { base: { fontSize: '14px', fontWeight: '500', color: '#3f3f46' }, mobile: { fontSize: '12px' } }, actions: [], meta: { name: 'Text' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ============= CATEGORIES =============
      {
        id: 'categories-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#ffffff', padding: '80px 0' }, mobile: { padding: '48px 0' } },
        actions: [],
        meta: { name: 'Kategorien' },
        children: [
          {
            id: 'categories-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Categories Container' },
            children: [
              // Section Header
              {
                id: 'cat-header',
                type: 'Container',
                props: { maxWidth: 'full' },
                style: { base: { textAlign: 'center', marginBottom: '48px' }, mobile: { marginBottom: '32px' } },
                actions: [],
                meta: { name: 'Section Header' },
                children: [
                  { 
                    id: 'cat-title', 
                    type: 'Heading', 
                    props: { level: 2, text: 'Shop nach Kategorie' }, 
                    style: { base: { fontSize: '36px', fontWeight: '700', marginBottom: '12px', color: '#18181b' }, mobile: { fontSize: '24px' } }, 
                    actions: [], 
                    meta: { name: 'Kategorien Titel' }, 
                    children: [] 
                  },
                  { 
                    id: 'cat-subtitle', 
                    type: 'Text', 
                    props: { text: 'Finde genau das, was du suchst' }, 
                    style: { base: { fontSize: '18px', color: '#71717a' }, mobile: { fontSize: '15px' } }, 
                    actions: [], 
                    meta: { name: 'Kategorien Untertitel' }, 
                    children: [] 
                  },
                ],
              },
              // Category Grid
              {
                id: 'category-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 2, gap: 'md' } },
                actions: [],
                meta: { name: 'Category Grid' },
                children: [
                  {
                    id: 'cat-1',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#fef3c7', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer' }, mobile: { padding: '16px', borderRadius: '12px' } },
                    actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorie/mode' } }],
                    meta: { name: 'Kategorie: Mode' },
                    children: [
                      { id: 'cat-icon-1', type: 'Text', props: { text: '👕' }, style: { base: { fontSize: '48px', marginBottom: '12px' }, mobile: { fontSize: '32px', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'cat-name-1', type: 'Text', props: { text: 'Mode' }, style: { base: { fontSize: '16px', fontWeight: '600', color: '#92400e' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    ],
                  },
                  {
                    id: 'cat-2',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#dbeafe', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer' }, mobile: { padding: '16px', borderRadius: '12px' } },
                    actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorie/elektronik' } }],
                    meta: { name: 'Kategorie: Elektronik' },
                    children: [
                      { id: 'cat-icon-2', type: 'Text', props: { text: '💻' }, style: { base: { fontSize: '48px', marginBottom: '12px' }, mobile: { fontSize: '32px', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'cat-name-2', type: 'Text', props: { text: 'Elektronik' }, style: { base: { fontSize: '16px', fontWeight: '600', color: '#1e40af' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    ],
                  },
                  {
                    id: 'cat-3',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#dcfce7', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer' }, mobile: { padding: '16px', borderRadius: '12px' } },
                    actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorie/wohnen' } }],
                    meta: { name: 'Kategorie: Wohnen' },
                    children: [
                      { id: 'cat-icon-3', type: 'Text', props: { text: '🏠' }, style: { base: { fontSize: '48px', marginBottom: '12px' }, mobile: { fontSize: '32px', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'cat-name-3', type: 'Text', props: { text: 'Wohnen' }, style: { base: { fontSize: '16px', fontWeight: '600', color: '#166534' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    ],
                  },
                  {
                    id: 'cat-4',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#fce7f3', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer' }, mobile: { padding: '16px', borderRadius: '12px' } },
                    actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorie/beauty' } }],
                    meta: { name: 'Kategorie: Beauty' },
                    children: [
                      { id: 'cat-icon-4', type: 'Text', props: { text: '💄' }, style: { base: { fontSize: '48px', marginBottom: '12px' }, mobile: { fontSize: '32px', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                      { id: 'cat-name-4', type: 'Text', props: { text: 'Beauty' }, style: { base: { fontSize: '16px', fontWeight: '600', color: '#9d174d' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ============= FEATURED PRODUCTS =============
      {
        id: 'products-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#fafafa', padding: '80px 0' }, mobile: { padding: '48px 0' } },
        actions: [],
        meta: { name: 'Produkte' },
        children: [
          {
            id: 'products-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Products Container' },
            children: [
              // Section Header
              {
                id: 'prod-header',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { marginBottom: '40px' }, mobile: { flexDirection: 'column', gap: '16px', marginBottom: '24px' } },
                actions: [],
                meta: { name: 'Section Header' },
                children: [
                  { 
                    id: 'prod-title', 
                    type: 'Heading', 
                    props: { level: 2, text: 'Beliebte Produkte' }, 
                    style: { base: { fontSize: '32px', fontWeight: '700', color: '#18181b' }, mobile: { fontSize: '24px' } }, 
                    actions: [], 
                    meta: { name: 'Produkte Titel' }, 
                    children: [] 
                  },
                  { 
                    id: 'prod-link', 
                    type: 'Link', 
                    props: { text: 'Alle ansehen →', href: '/produkte' }, 
                    style: { base: { color: '#2563eb', textDecoration: 'none', fontSize: '15px', fontWeight: '500' } }, 
                    actions: [], 
                    meta: { name: 'Alle ansehen' }, 
                    children: [] 
                  },
                ],
              },
              // Product Grid
              {
                id: 'product-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 2, gap: 'md' } },
                actions: [],
                meta: { name: 'Product Grid' },
                children: [
                  // Product 1
                  {
                    id: 'product-1',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }, mobile: { borderRadius: '12px' } },
                    actions: [],
                    meta: { name: 'Produkt 1' },
                    children: [
                      { id: 'prod-img-1', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', alt: 'Produkt' }, style: { base: { width: '100%', height: '200px', objectFit: 'cover' }, mobile: { height: '140px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                      {
                        id: 'prod-info-1',
                        type: 'Container',
                        props: { maxWidth: 'full' },
                        style: { base: { padding: '16px' }, mobile: { padding: '12px' } },
                        actions: [],
                        meta: { name: 'Info' },
                        children: [
                          { id: 'prod-name-1', type: 'Text', props: { text: 'Premium Smartwatch' }, style: { base: { fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#18181b' }, mobile: { fontSize: '13px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                          { id: 'prod-price-1', type: 'Text', props: { text: '€ 249,00' }, style: { base: { fontSize: '16px', fontWeight: '700', color: '#2563eb' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        ],
                      },
                      { id: 'prod-btn-1', type: 'Button', props: { text: 'In den Warenkorb', variant: 'primary' }, style: { base: { width: '100%', borderRadius: '0', backgroundColor: '#2563eb', padding: '14px' }, mobile: { padding: '12px', fontSize: '13px' } }, actions: [{ event: 'onClick', action: { type: 'addToCart', productId: 'product-1' } }], meta: { name: 'Warenkorb Button' }, children: [] },
                    ],
                  },
                  // Product 2
                  {
                    id: 'product-2',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }, mobile: { borderRadius: '12px' } },
                    actions: [],
                    meta: { name: 'Produkt 2' },
                    children: [
                      { id: 'prod-img-2', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', alt: 'Produkt' }, style: { base: { width: '100%', height: '200px', objectFit: 'cover' }, mobile: { height: '140px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                      {
                        id: 'prod-info-2',
                        type: 'Container',
                        props: { maxWidth: 'full' },
                        style: { base: { padding: '16px' }, mobile: { padding: '12px' } },
                        actions: [],
                        meta: { name: 'Info' },
                        children: [
                          { id: 'prod-name-2', type: 'Text', props: { text: 'Wireless Kopfhörer' }, style: { base: { fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#18181b' }, mobile: { fontSize: '13px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                          { id: 'prod-price-2', type: 'Text', props: { text: '€ 89,00' }, style: { base: { fontSize: '16px', fontWeight: '700', color: '#2563eb' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        ],
                      },
                      { id: 'prod-btn-2', type: 'Button', props: { text: 'In den Warenkorb', variant: 'primary' }, style: { base: { width: '100%', borderRadius: '0', backgroundColor: '#2563eb', padding: '14px' }, mobile: { padding: '12px', fontSize: '13px' } }, actions: [{ event: 'onClick', action: { type: 'addToCart', productId: 'product-2' } }], meta: { name: 'Warenkorb Button' }, children: [] },
                    ],
                  },
                  // Product 3
                  {
                    id: 'product-3',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }, mobile: { borderRadius: '12px' } },
                    actions: [],
                    meta: { name: 'Produkt 3' },
                    children: [
                      { id: 'prod-img-3', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1491553895911-0055uj6b?w=400&h=400&fit=crop', alt: 'Produkt' }, style: { base: { width: '100%', height: '200px', objectFit: 'cover' }, mobile: { height: '140px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                      {
                        id: 'prod-info-3',
                        type: 'Container',
                        props: { maxWidth: 'full' },
                        style: { base: { padding: '16px' }, mobile: { padding: '12px' } },
                        actions: [],
                        meta: { name: 'Info' },
                        children: [
                          { id: 'prod-name-3', type: 'Text', props: { text: 'Designer Sneakers' }, style: { base: { fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#18181b' }, mobile: { fontSize: '13px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                          { id: 'prod-price-3', type: 'Text', props: { text: '€ 179,00' }, style: { base: { fontSize: '16px', fontWeight: '700', color: '#2563eb' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        ],
                      },
                      { id: 'prod-btn-3', type: 'Button', props: { text: 'In den Warenkorb', variant: 'primary' }, style: { base: { width: '100%', borderRadius: '0', backgroundColor: '#2563eb', padding: '14px' }, mobile: { padding: '12px', fontSize: '13px' } }, actions: [{ event: 'onClick', action: { type: 'addToCart', productId: 'product-3' } }], meta: { name: 'Warenkorb Button' }, children: [] },
                    ],
                  },
                  // Product 4
                  {
                    id: 'product-4',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }, mobile: { borderRadius: '12px' } },
                    actions: [],
                    meta: { name: 'Produkt 4' },
                    children: [
                      { id: 'prod-img-4', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', alt: 'Produkt' }, style: { base: { width: '100%', height: '200px', objectFit: 'cover' }, mobile: { height: '140px' } }, actions: [], meta: { name: 'Bild' }, children: [] },
                      {
                        id: 'prod-info-4',
                        type: 'Container',
                        props: { maxWidth: 'full' },
                        style: { base: { padding: '16px' }, mobile: { padding: '12px' } },
                        actions: [],
                        meta: { name: 'Info' },
                        children: [
                          { id: 'prod-name-4', type: 'Text', props: { text: 'Parfum Collection' }, style: { base: { fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#18181b' }, mobile: { fontSize: '13px' } }, actions: [], meta: { name: 'Name' }, children: [] },
                          { id: 'prod-price-4', type: 'Text', props: { text: '€ 129,00' }, style: { base: { fontSize: '16px', fontWeight: '700', color: '#2563eb' }, mobile: { fontSize: '14px' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                        ],
                      },
                      { id: 'prod-btn-4', type: 'Button', props: { text: 'In den Warenkorb', variant: 'primary' }, style: { base: { width: '100%', borderRadius: '0', backgroundColor: '#2563eb', padding: '14px' }, mobile: { padding: '12px', fontSize: '13px' } }, actions: [{ event: 'onClick', action: { type: 'addToCart', productId: 'product-4' } }], meta: { name: 'Warenkorb Button' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ============= SALE BANNER =============
      {
        id: 'sale-section',
        type: 'Section',
        props: {},
        style: { base: { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', padding: '60px 0' }, mobile: { padding: '40px 0' } },
        actions: [],
        meta: { name: 'Sale Banner' },
        children: [
          {
            id: 'sale-container',
            type: 'Container',
            props: { maxWidth: '4xl', centered: true },
            style: { base: { textAlign: 'center', padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Sale Container' },
            children: [
              { 
                id: 'sale-badge', 
                type: 'Badge', 
                props: { text: 'LIMITED TIME', variant: 'secondary' }, 
                style: { base: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '16px', fontSize: '12px', padding: '6px 16px', fontWeight: '700', letterSpacing: '0.1em' } }, 
                actions: [], 
                meta: { name: 'Sale Badge' }, 
                children: [] 
              },
              { 
                id: 'sale-title', 
                type: 'Heading', 
                props: { level: 2, text: 'Bis zu 50% Rabatt' }, 
                style: { base: { color: '#ffffff', fontSize: '42px', fontWeight: '700', marginBottom: '16px' }, mobile: { fontSize: '28px', marginBottom: '12px' } }, 
                actions: [], 
                meta: { name: 'Sale Title' }, 
                children: [] 
              },
              { 
                id: 'sale-text', 
                type: 'Text', 
                props: { text: 'Nur noch wenige Tage! Sichere dir jetzt unsere besten Angebote.' }, 
                style: { base: { color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }, mobile: { fontSize: '15px', marginBottom: '24px' } }, 
                actions: [], 
                meta: { name: 'Sale Text' }, 
                children: [] 
              },
              { 
                id: 'sale-cta', 
                type: 'Button', 
                props: { text: 'Sale entdecken', variant: 'primary' }, 
                style: { base: { backgroundColor: '#ffffff', color: '#dc2626', padding: '16px 40px', fontSize: '16px', fontWeight: '700', borderRadius: '9999px' }, mobile: { padding: '14px 28px', fontSize: '14px' } }, 
                actions: [{ event: 'onClick', action: { type: 'navigate', to: '/sale' } }], 
                meta: { name: 'Sale CTA' }, 
                children: [] 
              },
            ],
          },
        ],
      },

      // ============= NEWSLETTER =============
      {
        id: 'newsletter-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#18181b', padding: '80px 0' }, mobile: { padding: '48px 0' } },
        actions: [],
        meta: { name: 'Newsletter' },
        children: [
          {
            id: 'newsletter-container',
            type: 'Container',
            props: { maxWidth: '2xl', centered: true },
            style: { base: { textAlign: 'center', padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Newsletter Container' },
            children: [
              { 
                id: 'nl-icon', 
                type: 'Text', 
                props: { text: '📧' }, 
                style: { base: { fontSize: '48px', marginBottom: '16px' }, mobile: { fontSize: '36px' } }, 
                actions: [], 
                meta: { name: 'Icon' }, 
                children: [] 
              },
              { 
                id: 'nl-title', 
                type: 'Heading', 
                props: { level: 2, text: 'Bleib auf dem Laufenden' }, 
                style: { base: { color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '12px' }, mobile: { fontSize: '24px' } }, 
                actions: [], 
                meta: { name: 'Newsletter Titel' }, 
                children: [] 
              },
              { 
                id: 'nl-text', 
                type: 'Text', 
                props: { text: 'Melde dich an und erhalte 10% Rabatt auf deine erste Bestellung sowie exklusive Angebote.' }, 
                style: { base: { color: '#a1a1aa', fontSize: '16px', marginBottom: '32px' }, mobile: { fontSize: '14px', marginBottom: '24px' } }, 
                actions: [], 
                meta: { name: 'Newsletter Text' }, 
                children: [] 
              },
              {
                id: 'nl-form',
                type: 'Stack',
                props: { direction: 'row', gap: 'md', justify: 'center' },
                style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', maxWidth: '480px', margin: '0 auto' }, mobile: { flexDirection: 'column' } },
                actions: [],
                meta: { name: 'Newsletter Formular' },
                children: [
                  { id: 'nl-input', type: 'Input', props: { placeholder: 'Deine E-Mail-Adresse' }, style: { base: { flex: '1', padding: '14px 18px', borderRadius: '12px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#ffffff' }, mobile: { width: '100%' } }, actions: [], meta: { name: 'Email Input' }, children: [] },
                  { id: 'nl-submit', type: 'Button', props: { text: 'Anmelden', variant: 'primary' }, style: { base: { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '12px', fontWeight: '600', whiteSpace: 'nowrap' }, mobile: { width: '100%' } }, actions: [], meta: { name: 'Submit Button' }, children: [] },
                ],
              },
            ],
          },
        ],
      },

      // ============= FOOTER =============
      {
        id: 'footer',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#09090b', padding: '64px 0 32px' }, mobile: { padding: '48px 0 24px' } },
        actions: [],
        meta: { name: 'Footer' },
        children: [
          {
            id: 'footer-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Footer Container' },
            children: [
              {
                id: 'footer-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'xl' },
                style: { base: { marginBottom: '48px' }, mobile: { gridColumns: 2, gap: 'lg', marginBottom: '32px' } },
                actions: [],
                meta: { name: 'Footer Grid' },
                children: [
                  // Column 1: About
                  {
                    id: 'footer-col-1',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: {}, mobile: { gridColumn: 'span 2' } },
                    actions: [],
                    meta: { name: 'Footer: Über uns' },
                    children: [
                      { id: 'footer-logo', type: 'Heading', props: { level: 3, text: 'MODERN' }, style: { base: { fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '16px' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                      { id: 'footer-desc', type: 'Text', props: { text: 'Premium Produkte für deinen modernen Lifestyle. Qualität, Design & Nachhaltigkeit.' }, style: { base: { color: '#71717a', fontSize: '14px', lineHeight: '1.6' } }, actions: [], meta: { name: 'Beschreibung' }, children: [] },
                    ],
                  },
                  // Column 2: Quick Links
                  {
                    id: 'footer-col-2',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Links' },
                    children: [
                      { id: 'footer-title-2', type: 'Text', props: { text: 'Quick Links' }, style: { base: { color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Titel' }, children: [] },
                      { id: 'footer-link-1', type: 'Link', props: { text: 'Über uns', href: '/about' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-2', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-3', type: 'Link', props: { text: 'FAQ', href: '/faq' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    ],
                  },
                  // Column 3: Shop
                  {
                    id: 'footer-col-3',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Shop' },
                    children: [
                      { id: 'footer-title-3', type: 'Text', props: { text: 'Shop' }, style: { base: { color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Titel' }, children: [] },
                      { id: 'footer-link-4', type: 'Link', props: { text: 'Neue Produkte', href: '/new' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-5', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-6', type: 'Link', props: { text: 'Geschenkideen', href: '/gifts' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    ],
                  },
                  // Column 4: Legal
                  {
                    id: 'footer-col-4',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Rechtliches' },
                    children: [
                      { id: 'footer-title-4', type: 'Text', props: { text: 'Rechtliches' }, style: { base: { color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, actions: [], meta: { name: 'Titel' }, children: [] },
                      { id: 'footer-link-7', type: 'Link', props: { text: 'Impressum', href: '/impressum' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-8', type: 'Link', props: { text: 'Datenschutz', href: '/datenschutz' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      { id: 'footer-link-9', type: 'Link', props: { text: 'AGB', href: '/agb' }, style: { base: { color: '#71717a', textDecoration: 'none', fontSize: '14px', display: 'block', marginBottom: '12px' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    ],
                  },
                ],
              },
              // Footer Bottom
              {
                id: 'footer-bottom',
                type: 'Container',
                props: { maxWidth: 'full' },
                style: { base: { borderTop: '1px solid #27272a', paddingTop: '24px' } },
                actions: [],
                meta: { name: 'Footer Bottom' },
                children: [
                  { 
                    id: 'copyright', 
                    type: 'Text', 
                    props: { text: '© 2026 MODERN Shop. Alle Rechte vorbehalten.' }, 
                    style: { base: { color: '#52525b', fontSize: '13px', textAlign: 'center' } }, 
                    actions: [], 
                    meta: { name: 'Copyright' }, 
                    children: [] 
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

async function main() {
  console.log('🛒 Creating Modern Shop Template...');

  // Find demo user for createdById
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo@builderly.dev' }
  });

  // Check if template exists
  const existing = await prisma.template.findFirst({
    where: { slug: 'modern-shop' }
  });

  if (existing) {
    console.log('📝 Updating existing Modern Shop template...');
    await prisma.template.update({
      where: { id: existing.id },
      data: { 
        tree: modernShopTemplate,
        name: 'Modern Shop',
        description: 'Minimalistisches E-Commerce Template mit Hero, Trust Badges, Kategorien, Produkten, Sale Banner, Newsletter und Footer',
        category: 'FULL_PAGE',
        style: 'minimal',
        websiteType: 'ecommerce',
        tags: ['shop', 'ecommerce', 'modern', 'minimal', 'clean'],
        isPro: false,
        isPublished: true,
      }
    });
  } else {
    console.log('✨ Creating new Modern Shop template...');
    await prisma.template.create({
      data: {
        name: 'Modern Shop',
        slug: 'modern-shop',
        description: 'Minimalistisches E-Commerce Template mit Hero, Trust Badges, Kategorien, Produkten, Sale Banner, Newsletter und Footer',
        thumbnail: 'https://placehold.co/600x400?text=Modern+Shop',
        category: 'FULL_PAGE',
        style: 'minimal',
        websiteType: 'ecommerce',
        tags: ['shop', 'ecommerce', 'modern', 'minimal', 'clean'],
        tree: modernShopTemplate,
        isPro: false,
        isPublished: true,
        isSystem: false,
        createdById: demoUser?.id,
      }
    });
  }

  console.log('✅ Modern Shop Template created/updated!');
  
  // Show all templates
  const templates = await prisma.template.findMany({
    select: { name: true, slug: true, category: true, isPublished: true }
  });
  console.log('\n📋 All templates:');
  templates.forEach(t => console.log(`  - ${t.name} (${t.slug}) [${t.category}] ${t.isPublished ? '✓' : '✗'}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
