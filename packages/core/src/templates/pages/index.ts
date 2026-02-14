import type { BuilderTree } from '../../schemas/node';
import { templateRegistry, type FullPageTemplate } from '../template-registry';

// ============================================================================
// FULL-PAGE SHOP TEMPLATE
// ============================================================================

export const shopFullPage: FullPageTemplate = {
  id: 'shop-full-page',
  name: 'Online-Shop – Komplett',
  description: 'Komplette Shop-Startseite mit Hero, Produkten, Kategorien, Bewertungen, Newsletter und Footer – vollständig mobiloptimiert',
  websiteType: 'ecommerce',
  style: 'modern',
  tags: ['shop', 'ecommerce', 'store', 'online-shop', 'produkte', 'mobile'],
  tree: {
    builderVersion: 1,
    root: {
      id: 'shop-page-root',
      type: 'Section',
      props: {},
      style: { base: { display: 'flex', flexDirection: 'column', gap: 'none' } },
      actions: [],
      children: [
        // ── HEADER / NAVIGATION ──
        {
          id: 'sp-nav',
          type: 'Navbar',
          props: {
            brand: 'Mein Shop',
            links: [
              { label: 'Produkte', href: '/products' },
              { label: 'Kategorien', href: '/categories' },
              { label: 'Sale', href: '/sale' },
              { label: 'Über uns', href: '/about' },
            ],
            sticky: true,
          },
          style: { base: {} },
          actions: [],
          children: [],
        },

        // ── HERO ──
        {
          id: 'sp-hero',
          type: 'Section',
          props: {},
          style: {
            base: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'xl', padding: '2xl', minHeight: '50vh' },
            mobile: { flexDirection: 'column', padding: 'lg', minHeight: 'auto', gap: 'lg', textAlign: 'center' },
          },
          actions: [],
          children: [
            {
              id: 'sp-hero-left',
              type: 'Container',
              props: {},
              style: { base: { flex: '1', display: 'flex', flexDirection: 'column', gap: 'md' }, mobile: { alignItems: 'center' } },
              actions: [],
              children: [
                { id: 'sp-hero-badge', type: 'Badge', props: { text: 'Neue Kollektion', variant: 'secondary' }, style: { base: {} }, actions: [], children: [] },
                {
                  id: 'sp-hero-h1',
                  type: 'Heading',
                  props: { level: 1, text: 'Style trifft Qualität' },
                  style: { base: { fontSize: '4xl', fontWeight: 'bold', lineHeight: 'tight' }, mobile: { fontSize: '2xl' } },
                  actions: [],
                  children: [],
                },
                {
                  id: 'sp-hero-desc',
                  type: 'Text',
                  props: { text: 'Entdecke unsere handverlesene Auswahl an Premium-Produkten. Fair produziert, schnell geliefert.' },
                  style: { base: { fontSize: 'lg', maxWidth: 'xl' }, mobile: { fontSize: 'base' } },
                  actions: [],
                  children: [],
                },
                {
                  id: 'sp-hero-btns',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', gap: 'sm' }, mobile: { flexDirection: 'column', width: '100%' } },
                  actions: [],
                  children: [
                    { id: 'sp-hero-cta1', type: 'Button', props: { text: 'Jetzt shoppen', variant: 'primary' }, style: { base: {} }, actions: [], children: [] },
                    { id: 'sp-hero-cta2', type: 'Button', props: { text: 'Alle Kategorien', variant: 'outline' }, style: { base: {} }, actions: [], children: [] },
                  ],
                },
              ],
            },
            {
              id: 'sp-hero-img',
              type: 'Image',
              props: { src: '/placeholder.svg', alt: 'Kollektion' },
              style: { base: { flex: '1', borderRadius: 'xl' }, mobile: { width: '100%' } },
              actions: [],
              children: [],
            },
          ],
        },

        // ── TRUST BADGES ──
        {
          id: 'sp-trust',
          type: 'Section',
          props: {},
          style: { base: { padding: 'lg', borderBottom: '1px solid #e5e7eb' }, mobile: { padding: 'md' } },
          actions: [],
          children: [
            {
              id: 'sp-trust-row',
              type: 'Container',
              props: {},
              style: { base: { display: 'grid', gridColumns: 4, gap: 'lg', textAlign: 'center' }, mobile: { gridColumns: 2, gap: 'md' } },
              actions: [],
              children: [
                { id: 'sp-trust-1', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-trust-1i', type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                  { id: 'sp-trust-1t', type: 'Text', props: { text: 'Gratis Versand ab 50 €' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold' } }, actions: [], children: [] },
                ]},
                { id: 'sp-trust-2', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-trust-2i', type: 'Text', props: { text: '🔒' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                  { id: 'sp-trust-2t', type: 'Text', props: { text: 'Sichere Bezahlung' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold' } }, actions: [], children: [] },
                ]},
                { id: 'sp-trust-3', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-trust-3i', type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                  { id: 'sp-trust-3t', type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold' } }, actions: [], children: [] },
                ]},
                { id: 'sp-trust-4', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-trust-4i', type: 'Text', props: { text: '💬' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                  { id: 'sp-trust-4t', type: 'Text', props: { text: 'Support Mo–Fr' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold' } }, actions: [], children: [] },
                ]},
              ],
            },
          ],
        },

        // ── FEATURED PRODUCTS ──
        {
          id: 'sp-products',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl' }, mobile: { padding: 'lg' } },
          actions: [],
          children: [
            {
              id: 'sp-products-header',
              type: 'Container',
              props: {},
              style: { base: { display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'xl' }, mobile: { flexDirection: 'column', gap: 'sm', textAlign: 'center' } },
              actions: [],
              children: [
                { id: 'sp-products-h2', type: 'Heading', props: { level: 2, text: 'Beliebte Produkte' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
                { id: 'sp-products-link', type: 'Link', props: { text: 'Alle ansehen →', href: '/products' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              ],
            },
            {
              id: 'sp-products-grid',
              type: 'ProductList',
              props: { layout: 'grid', columns: 4, limit: 8, sortBy: 'createdAt', sortOrder: 'desc', categoryFilter: '' },
              style: { base: {} },
              actions: [],
              children: [],
            },
          ],
        },

        // ── SALE BANNER ──
        {
          id: 'sp-sale',
          type: 'Section',
          props: {},
          style: {
            base: { padding: '2xl', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'md', backgroundColor: 'primary', color: 'primary-foreground', borderRadius: 'xl', marginX: 'lg' },
            mobile: { padding: 'lg', marginX: 'sm', borderRadius: 'lg' },
          },
          actions: [],
          children: [
            { id: 'sp-sale-badge', type: 'Badge', props: { text: 'Limitiert', variant: 'secondary' }, style: { base: {} }, actions: [], children: [] },
            { id: 'sp-sale-h2', type: 'Heading', props: { level: 2, text: 'Bis zu 50% Rabatt' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' }, mobile: { fontSize: '2xl' } }, actions: [], children: [] },
            { id: 'sp-sale-p', type: 'Text', props: { text: 'Nur dieses Wochenende – spare bei ausgewählten Produkten.' }, style: { base: { maxWidth: 'lg', fontSize: 'lg' }, mobile: { fontSize: 'base' } }, actions: [], children: [] },
            { id: 'sp-sale-btn', type: 'Button', props: { text: 'Sale entdecken', variant: 'secondary' }, style: { base: {} }, actions: [], children: [] },
          ],
        },

        // ── CATEGORIES ──
        {
          id: 'sp-cats',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl', textAlign: 'center' }, mobile: { padding: 'lg' } },
          actions: [],
          children: [
            { id: 'sp-cats-h2', type: 'Heading', props: { level: 2, text: 'Shop nach Kategorie' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold' }, mobile: { fontSize: 'xl', marginBottom: 'lg' } }, actions: [], children: [] },
            {
              id: 'sp-cats-grid',
              type: 'Container',
              props: {},
              style: { base: { display: 'grid', gridColumns: 3, gap: 'lg' }, mobile: { gridColumns: 1 }, tablet: { gridColumns: 2 } },
              actions: [],
              children: [
                { id: 'sp-cats-1', type: 'Container', props: {}, style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } }, actions: [], children: [
                  { id: 'sp-cats-1-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bekleidung' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
                  { id: 'sp-cats-1-ov', type: 'Container', props: {}, style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } }, actions: [], children: [
                    { id: 'sp-cats-1-t', type: 'Heading', props: { level: 3, text: 'Bekleidung' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  ]},
                ]},
                { id: 'sp-cats-2', type: 'Container', props: {}, style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } }, actions: [], children: [
                  { id: 'sp-cats-2-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Accessoires' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
                  { id: 'sp-cats-2-ov', type: 'Container', props: {}, style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } }, actions: [], children: [
                    { id: 'sp-cats-2-t', type: 'Heading', props: { level: 3, text: 'Accessoires' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  ]},
                ]},
                { id: 'sp-cats-3', type: 'Container', props: {}, style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } }, actions: [], children: [
                  { id: 'sp-cats-3-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Schuhe' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
                  { id: 'sp-cats-3-ov', type: 'Container', props: {}, style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } }, actions: [], children: [
                    { id: 'sp-cats-3-t', type: 'Heading', props: { level: 3, text: 'Schuhe' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  ]},
                ]},
              ],
            },
          ],
        },

        // ── CUSTOMER REVIEWS ──
        {
          id: 'sp-reviews',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl' }, mobile: { padding: 'lg' } },
          actions: [],
          children: [
            { id: 'sp-reviews-h2', type: 'Heading', props: { level: 2, text: 'Das sagen unsere Kunden' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' }, mobile: { fontSize: 'xl' } }, actions: [], children: [] },
            {
              id: 'sp-reviews-grid',
              type: 'Container',
              props: {},
              style: { base: { display: 'grid', gridColumns: 3, gap: 'lg' }, mobile: { gridColumns: 1 }, tablet: { gridColumns: 2 } },
              actions: [],
              children: [
                { id: 'sp-rev-1', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } }, actions: [], children: [
                  { id: 'sp-rev-1s', type: 'Text', props: { text: '★★★★★' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                  { id: 'sp-rev-1t', type: 'Text', props: { text: '"Super Qualität, sitzt perfekt und kam blitzschnell!"' }, style: { base: {} }, actions: [], children: [] },
                  { id: 'sp-rev-1n', type: 'Text', props: { text: '— Anna M.' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                ]},
                { id: 'sp-rev-2', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } }, actions: [], children: [
                  { id: 'sp-rev-2s', type: 'Text', props: { text: '★★★★★' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                  { id: 'sp-rev-2t', type: 'Text', props: { text: '"Toller Shop, faire Preise. Sneaker sind mega bequem."' }, style: { base: {} }, actions: [], children: [] },
                  { id: 'sp-rev-2n', type: 'Text', props: { text: '— Markus K.' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                ]},
                { id: 'sp-rev-3', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } }, actions: [], children: [
                  { id: 'sp-rev-3s', type: 'Text', props: { text: '★★★★☆' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                  { id: 'sp-rev-3t', type: 'Text', props: { text: '"Rucksack ist top verarbeitet, Versand war super schnell."' }, style: { base: {} }, actions: [], children: [] },
                  { id: 'sp-rev-3n', type: 'Text', props: { text: '— Julia S.' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                ]},
              ],
            },
          ],
        },

        // ── NEWSLETTER ──
        {
          id: 'sp-newsletter',
          type: 'Section',
          props: {},
          style: {
            base: { padding: '2xl', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'md', backgroundColor: 'muted', borderRadius: 'xl', marginX: 'lg' },
            mobile: { padding: 'lg', marginX: 'sm' },
          },
          actions: [],
          children: [
            { id: 'sp-nl-h2', type: 'Heading', props: { level: 2, text: '10% auf deine erste Bestellung' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' }, mobile: { fontSize: 'xl' } }, actions: [], children: [] },
            { id: 'sp-nl-p', type: 'Text', props: { text: 'Melde dich an und erhalte exklusive Angebote direkt in dein Postfach.' }, style: { base: { maxWidth: 'lg' } }, actions: [], children: [] },
            {
              id: 'sp-nl-form',
              type: 'Form',
              props: { submitLabel: 'Anmelden' },
              style: { base: { display: 'flex', flexDirection: 'row', gap: 'sm', maxWidth: 'md', width: '100%' }, mobile: { flexDirection: 'column' } },
              actions: [],
              children: [
                { id: 'sp-nl-email', type: 'FormField', props: { label: '', name: 'email', type: 'email', required: true, placeholder: 'Deine E-Mail-Adresse' }, style: { base: { flex: '1' } }, actions: [], children: [] },
              ],
            },
          ],
        },

        // ── FOOTER ──
        {
          id: 'sp-footer',
          type: 'Section',
          props: {},
          style: { base: { padding: 'xl', backgroundColor: 'muted', marginTop: 'xl' }, mobile: { padding: 'lg' } },
          actions: [],
          children: [
            {
              id: 'sp-foot-grid',
              type: 'Container',
              props: {},
              style: { base: { display: 'grid', gridColumns: 4, gap: 'xl' }, mobile: { gridColumns: 1, gap: 'lg' }, tablet: { gridColumns: 2 } },
              actions: [],
              children: [
                { id: 'sp-foot-brand', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } }, actions: [], children: [
                  { id: 'sp-foot-logo', type: 'Heading', props: { level: 3, text: 'Mein Shop' }, style: { base: { fontWeight: 'bold' } }, actions: [], children: [] },
                  { id: 'sp-foot-desc', type: 'Text', props: { text: 'Hochwertige Produkte, fair und nachhaltig.' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                ]},
                { id: 'sp-foot-l1', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-foot-l1h', type: 'Heading', props: { level: 4, text: 'Shop' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
                  { id: 'sp-foot-l1a', type: 'Link', props: { text: 'Alle Produkte', href: '/products' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l1b', type: 'Link', props: { text: 'Neuheiten', href: '/new' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l1c', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                ]},
                { id: 'sp-foot-l2', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-foot-l2h', type: 'Heading', props: { level: 4, text: 'Hilfe' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
                  { id: 'sp-foot-l2a', type: 'Link', props: { text: 'Versand', href: '/shipping' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l2b', type: 'Link', props: { text: 'Rückgabe', href: '/returns' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l2c', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                ]},
                { id: 'sp-foot-l3', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } }, actions: [], children: [
                  { id: 'sp-foot-l3h', type: 'Heading', props: { level: 4, text: 'Rechtliches' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
                  { id: 'sp-foot-l3a', type: 'Link', props: { text: 'Impressum', href: '/impressum' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l3b', type: 'Link', props: { text: 'Datenschutz', href: '/datenschutz' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                  { id: 'sp-foot-l3c', type: 'Link', props: { text: 'AGB', href: '/agb' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                ]},
              ],
            },
            {
              id: 'sp-foot-bottom',
              type: 'Container',
              props: {},
              style: { base: { marginTop: 'xl', paddingTop: 'lg', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'between', alignItems: 'center' }, mobile: { flexDirection: 'column', gap: 'sm', textAlign: 'center' } },
              actions: [],
              children: [
                { id: 'sp-foot-copy', type: 'Text', props: { text: '© 2026 Mein Shop. Alle Rechte vorbehalten.' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                { id: 'sp-foot-pay', type: 'Text', props: { text: '💳 Visa · Mastercard · PayPal · Klarna · Apple Pay' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              ],
            },
          ],
        },
      ],
    },
  },
};

// ============================================================================
// MODERN SHOP TEMPLATE - Mit allen Shop-Funktionen
// ============================================================================

export const shopModernPage: FullPageTemplate = {
  id: 'shop-modern-page',
  name: 'Online-Shop – Modern',
  description: 'Modernes Shop-Template mit Header, Warenkorb, Login und allen Shop-Aktionen',
  websiteType: 'ecommerce',
  style: 'modern',
  tags: ['shop', 'ecommerce', 'modern', 'warenkorb', 'login', 'mobile'],
  tree: {
    builderVersion: 1,
    root: {
      id: 'shop-modern-root',
      type: 'Section',
      props: { minHeight: 'auto' },
      style: { base: { backgroundColor: 'background', color: 'foreground' } },
      actions: [],
      meta: { name: 'Shop Modern' },
      children: [
        // ═══════════════════════════════════════════════════════════════════
        // HEADER
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'sm-header',
          type: 'Section',
          props: {},
          style: {
            base: { padding: 'md', borderBottom: '1px solid', borderColor: 'border', position: 'sticky' },
            mobile: { padding: 'sm' },
          },
          actions: [],
          meta: { name: 'Header' },
          children: [
            {
              id: 'sm-header-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: { base: { display: 'flex', justifyContent: 'between', alignItems: 'center' } },
              actions: [],
              meta: { name: 'Header Container' },
              children: [
                {
                  id: 'sm-logo',
                  type: 'Heading',
                  props: { level: 3, text: 'Mein Shop' },
                  style: { base: { fontWeight: 'bold', fontSize: 'xl' } },
                  actions: [],
                  meta: { name: 'Logo' },
                  children: [],
                },
                {
                  id: 'sm-nav',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', gap: 'lg', alignItems: 'center' }, mobile: { display: 'none' } },
                  actions: [],
                  meta: { name: 'Navigation' },
                  children: [
                    { id: 'sm-nav-1', type: 'Link', props: { text: 'Home', href: '/' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'sm-nav-2', type: 'Link', props: { text: 'Produkte', href: '/produkte' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'sm-nav-3', type: 'Link', props: { text: 'Kategorien', href: '/kategorien' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                    { id: 'sm-nav-4', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                  ],
                },
                {
                  id: 'sm-header-actions',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', gap: 'sm', alignItems: 'center' } },
                  actions: [],
                  meta: { name: 'Actions' },
                  children: [
                    {
                      id: 'sm-cart-btn',
                      type: 'Button',
                      props: { text: '🛒 Warenkorb', variant: 'ghost' },
                      style: { base: {}, mobile: { padding: 'xs' } },
                      actions: [{ event: 'onClick', action: { type: 'navigate', to: '/warenkorb' } }],
                      meta: { name: 'Cart' },
                      children: [],
                    },
                    {
                      id: 'sm-login-btn',
                      type: 'Button',
                      props: { text: 'Anmelden', variant: 'outline' },
                      style: { base: {}, mobile: { display: 'none' } },
                      actions: [{ event: 'onClick', action: { type: 'navigate', to: '/login' } }],
                      meta: { name: 'Login' },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // HERO
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'sm-hero',
          type: 'Section',
          props: {},
          style: {
            base: { padding: '2xl', backgroundColor: 'muted', minHeight: '50vh', display: 'flex', alignItems: 'center' },
            mobile: { padding: 'lg', minHeight: 'auto' },
          },
          actions: [],
          meta: { name: 'Hero' },
          children: [
            {
              id: 'sm-hero-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: {
                base: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'xl' },
                mobile: { flexDirection: 'column', gap: 'lg', textAlign: 'center' },
              },
              actions: [],
              meta: { name: 'Hero Container' },
              children: [
                {
                  id: 'sm-hero-content',
                  type: 'Container',
                  props: {},
                  style: { base: { flex: '1', display: 'flex', flexDirection: 'column', gap: 'md' }, mobile: { alignItems: 'center' } },
                  actions: [],
                  meta: { name: 'Content' },
                  children: [
                    { id: 'sm-hero-badge', type: 'Badge', props: { text: '✨ Neu im Shop', variant: 'secondary' }, style: { base: {} }, actions: [], meta: { name: 'Badge' }, children: [] },
                    {
                      id: 'sm-hero-title',
                      type: 'Heading',
                      props: { level: 1, text: 'Willkommen in unserem Shop' },
                      style: { base: { fontSize: '4xl', fontWeight: 'bold', lineHeight: 'tight' }, mobile: { fontSize: '2xl' } },
                      actions: [],
                      meta: { name: 'Title' },
                      children: [],
                    },
                    {
                      id: 'sm-hero-desc',
                      type: 'Text',
                      props: { text: 'Entdecke unsere handverlesene Auswahl an hochwertigen Produkten. Schneller Versand, faire Preise und erstklassiger Service.' },
                      style: { base: { fontSize: 'lg', color: 'muted-foreground', maxWidth: 'xl' }, mobile: { fontSize: 'base' } },
                      actions: [],
                      meta: { name: 'Description' },
                      children: [],
                    },
                    {
                      id: 'sm-hero-btns',
                      type: 'Container',
                      props: {},
                      style: { base: { display: 'flex', gap: 'sm', marginTop: 'md' }, mobile: { flexDirection: 'column', width: '100%' } },
                      actions: [],
                      meta: { name: 'Buttons' },
                      children: [
                        {
                          id: 'sm-hero-cta1',
                          type: 'Button',
                          props: { text: 'Jetzt shoppen', variant: 'primary' },
                          style: { base: {}, mobile: { width: '100%' } },
                          actions: [{ event: 'onClick', action: { type: 'navigate', to: '/produkte' } }],
                          meta: { name: 'Primary CTA' },
                          children: [],
                        },
                        {
                          id: 'sm-hero-cta2',
                          type: 'Button',
                          props: { text: 'Alle Kategorien', variant: 'outline' },
                          style: { base: {}, mobile: { width: '100%' } },
                          actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorien' } }],
                          meta: { name: 'Secondary CTA' },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'sm-hero-img',
                  type: 'Image',
                  props: { src: 'https://placehold.co/600x400?text=Shop+Banner', alt: 'Shop Banner' },
                  style: { base: { flex: '1', borderRadius: 'xl', maxWidth: '2xl' }, mobile: { width: '100%', maxWidth: 'full' } },
                  actions: [],
                  meta: { name: 'Image' },
                  children: [],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // TRUST BADGES
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'sm-trust',
          type: 'Section',
          props: {},
          style: { base: { padding: 'lg', borderBottom: '1px solid', borderColor: 'border' }, mobile: { padding: 'md' } },
          actions: [],
          meta: { name: 'Trust Badges' },
          children: [
            {
              id: 'sm-trust-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: { base: { display: 'flex', justifyContent: 'center', gap: 'xl' }, mobile: { flexDirection: 'column', gap: 'md', textAlign: 'center' } },
              actions: [],
              meta: { name: 'Trust Container' },
              children: [
                {
                  id: 'sm-trust-1',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', alignItems: 'center', gap: 'sm' } },
                  actions: [],
                  meta: { name: 'Trust Item' },
                  children: [
                    { id: 'sm-trust-1i', type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: '2xl' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                    { id: 'sm-trust-1t', type: 'Text', props: { text: 'Kostenloser Versand ab 50€' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Text' }, children: [] },
                  ],
                },
                {
                  id: 'sm-trust-2',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', alignItems: 'center', gap: 'sm' } },
                  actions: [],
                  meta: { name: 'Trust Item' },
                  children: [
                    { id: 'sm-trust-2i', type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: '2xl' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                    { id: 'sm-trust-2t', type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Text' }, children: [] },
                  ],
                },
                {
                  id: 'sm-trust-3',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', alignItems: 'center', gap: 'sm' } },
                  actions: [],
                  meta: { name: 'Trust Item' },
                  children: [
                    { id: 'sm-trust-3i', type: 'Text', props: { text: '🔒' }, style: { base: { fontSize: '2xl' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                    { id: 'sm-trust-3t', type: 'Text', props: { text: 'Sichere Bezahlung' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Text' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // FEATURED PRODUCTS
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'sm-products',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl' }, mobile: { padding: 'lg' } },
          actions: [],
          meta: { name: 'Featured Products' },
          children: [
            {
              id: 'sm-products-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: { base: {} },
              actions: [],
              meta: { name: 'Products Container' },
              children: [
                {
                  id: 'sm-products-header',
                  type: 'Container',
                  props: {},
                  style: {
                    base: { display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'xl' },
                    mobile: { flexDirection: 'column', gap: 'sm', textAlign: 'center', marginBottom: 'lg' },
                  },
                  actions: [],
                  meta: { name: 'Header' },
                  children: [
                    { id: 'sm-products-title', type: 'Heading', props: { level: 2, text: 'Beliebte Produkte' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' } }, actions: [], meta: { name: 'Title' }, children: [] },
                    { id: 'sm-products-link', type: 'Link', props: { text: 'Alle Produkte →', href: '/produkte' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                  ],
                },
                {
                  id: 'sm-products-grid',
                  type: 'ProductList',
                  props: { layout: 'grid', columns: 4, limit: 4, sortBy: 'createdAt', sortOrder: 'desc', categoryFilter: '' },
                  style: { base: {} },
                  actions: [],
                  meta: { name: 'Product Grid' },
                  children: [],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════════════
        // CATEGORIES
        // ═══════════════════════════════════════════════════════════════════
        {
          id: 'sm-categories',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl', backgroundColor: 'muted' }, mobile: { padding: 'lg' } },
          actions: [],
          meta: { name: 'Categories' },
          children: [
            {
              id: 'sm-cat-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: { base: { textAlign: 'center' } },
              actions: [],
              meta: { name: 'Categories Container' },
              children: [
                { id: 'sm-cat-title', type: 'Heading', props: { level: 2, text: 'Shop nach Kategorie' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', marginBottom: 'xl' }, mobile: { marginBottom: 'lg' } }, actions: [], meta: { name: 'Title' }, children: [] },
                {
                  id: 'sm-cat-grid',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'grid', gridColumns: 3, gap: 'lg' }, mobile: { gridColumns: 1, gap: 'md' } },
                  actions: [],
                  meta: { name: 'Grid' },
                  children: [
                    {
                      id: 'sm-cat-1',
                      type: 'Container',
                      props: {},
                      style: { base: { padding: 'xl', backgroundColor: 'background', borderRadius: 'lg', border: '1px solid', borderColor: 'border', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Category Card' },
                      children: [
                        { id: 'sm-cat-1i', type: 'Text', props: { text: '👕' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 'sm-cat-1n', type: 'Heading', props: { level: 3, text: 'Bekleidung' }, style: { base: { fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'sm-cat-1c', type: 'Text', props: { text: '120 Produkte' }, style: { base: { fontSize: 'sm', color: 'muted-foreground' } }, actions: [], meta: { name: 'Count' }, children: [] },
                      ],
                    },
                    {
                      id: 'sm-cat-2',
                      type: 'Container',
                      props: {},
                      style: { base: { padding: 'xl', backgroundColor: 'background', borderRadius: 'lg', border: '1px solid', borderColor: 'border', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Category Card' },
                      children: [
                        { id: 'sm-cat-2i', type: 'Text', props: { text: '👟' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 'sm-cat-2n', type: 'Heading', props: { level: 3, text: 'Schuhe' }, style: { base: { fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'sm-cat-2c', type: 'Text', props: { text: '85 Produkte' }, style: { base: { fontSize: 'sm', color: 'muted-foreground' } }, actions: [], meta: { name: 'Count' }, children: [] },
                      ],
                    },
                    {
                      id: 'sm-cat-3',
                      type: 'Container',
                      props: {},
                      style: { base: { padding: 'xl', backgroundColor: 'background', borderRadius: 'lg', border: '1px solid', borderColor: 'border', textAlign: 'center' } },
                      actions: [],
                      meta: { name: 'Category Card' },
                      children: [
                        { id: 'sm-cat-3i', type: 'Text', props: { text: '🎒' }, style: { base: { fontSize: '3xl', marginBottom: 'sm' } }, actions: [], meta: { name: 'Icon' }, children: [] },
                        { id: 'sm-cat-3n', type: 'Heading', props: { level: 3, text: 'Accessoires' }, style: { base: { fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], meta: { name: 'Name' }, children: [] },
                        { id: 'sm-cat-3c', type: 'Text', props: { text: '64 Produkte' }, style: { base: { fontSize: 'sm', color: 'muted-foreground' } }, actions: [], meta: { name: 'Count' }, children: [] },
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
          id: 'sm-newsletter',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl', backgroundColor: 'primary', color: 'primary-foreground' }, mobile: { padding: 'lg' } },
          actions: [],
          meta: { name: 'Newsletter' },
          children: [
            {
              id: 'sm-nl-container',
              type: 'Container',
              props: { maxWidth: '3xl', centered: true },
              style: { base: { textAlign: 'center' } },
              actions: [],
              meta: { name: 'Newsletter Container' },
              children: [
                { id: 'sm-nl-title', type: 'Heading', props: { level: 2, text: '10% Rabatt auf deine erste Bestellung' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' }, mobile: { fontSize: 'xl' } }, actions: [], meta: { name: 'Title' }, children: [] },
                { id: 'sm-nl-desc', type: 'Text', props: { text: 'Melde dich für unseren Newsletter an und erhalte exklusive Angebote.' }, style: { base: { fontSize: 'base', marginBottom: 'lg' }, mobile: { fontSize: 'sm' } }, actions: [], meta: { name: 'Description' }, children: [] },
                {
                  id: 'sm-nl-form',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'flex', gap: 'sm', justifyContent: 'center' }, mobile: { flexDirection: 'column' } },
                  actions: [],
                  meta: { name: 'Form' },
                  children: [
                    { id: 'sm-nl-input', type: 'Input', props: { placeholder: 'Deine E-Mail-Adresse', type: 'email' }, style: { base: { minWidth: '300px' }, mobile: { minWidth: 'auto', width: '100%' } }, actions: [], meta: { name: 'Input' }, children: [] },
                    { id: 'sm-nl-btn', type: 'Button', props: { text: 'Abonnieren', variant: 'secondary' }, style: { base: {}, mobile: { width: '100%' } }, actions: [], meta: { name: 'Submit' }, children: [] },
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
          id: 'sm-footer',
          type: 'Section',
          props: {},
          style: { base: { padding: '2xl', backgroundColor: 'secondary', color: 'secondary-foreground' }, mobile: { padding: 'lg' } },
          actions: [],
          meta: { name: 'Footer' },
          children: [
            {
              id: 'sm-foot-container',
              type: 'Container',
              props: { maxWidth: '7xl', centered: true },
              style: { base: {} },
              actions: [],
              meta: { name: 'Footer Container' },
              children: [
                {
                  id: 'sm-foot-grid',
                  type: 'Container',
                  props: {},
                  style: { base: { display: 'grid', gridColumns: 4, gap: 'xl' }, mobile: { gridColumns: 2, gap: 'lg' } },
                  actions: [],
                  meta: { name: 'Footer Grid' },
                  children: [
                    {
                      id: 'sm-foot-col1',
                      type: 'Container',
                      props: {},
                      style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } },
                      actions: [],
                      meta: { name: 'Column' },
                      children: [
                        { id: 'sm-foot-c1h', type: 'Heading', props: { level: 4, text: 'Shop' }, style: { base: { fontSize: 'sm', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'sm-foot-c1a', type: 'Link', props: { text: 'Alle Produkte', href: '/produkte' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c1b', type: 'Link', props: { text: 'Kategorien', href: '/kategorien' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c1c', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    {
                      id: 'sm-foot-col2',
                      type: 'Container',
                      props: {},
                      style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } },
                      actions: [],
                      meta: { name: 'Column' },
                      children: [
                        { id: 'sm-foot-c2h', type: 'Heading', props: { level: 4, text: 'Hilfe' }, style: { base: { fontSize: 'sm', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'sm-foot-c2a', type: 'Link', props: { text: 'FAQ', href: '/faq' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c2b', type: 'Link', props: { text: 'Versand', href: '/versand' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c2c', type: 'Link', props: { text: 'Kontakt', href: '/kontakt' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    {
                      id: 'sm-foot-col3',
                      type: 'Container',
                      props: {},
                      style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } },
                      actions: [],
                      meta: { name: 'Column' },
                      children: [
                        { id: 'sm-foot-c3h', type: 'Heading', props: { level: 4, text: 'Rechtliches' }, style: { base: { fontSize: 'sm', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'sm-foot-c3a', type: 'Link', props: { text: 'Impressum', href: '/impressum' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c3b', type: 'Link', props: { text: 'Datenschutz', href: '/datenschutz' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c3c', type: 'Link', props: { text: 'AGB', href: '/agb' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                    {
                      id: 'sm-foot-col4',
                      type: 'Container',
                      props: {},
                      style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } },
                      actions: [],
                      meta: { name: 'Column' },
                      children: [
                        { id: 'sm-foot-c4h', type: 'Heading', props: { level: 4, text: 'Folge uns' }, style: { base: { fontSize: 'sm', fontWeight: 'bold', marginBottom: 'sm' } }, actions: [], meta: { name: 'Title' }, children: [] },
                        { id: 'sm-foot-c4a', type: 'Link', props: { text: 'Instagram', href: '#' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c4b', type: 'Link', props: { text: 'TikTok', href: '#' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                        { id: 'sm-foot-c4c', type: 'Link', props: { text: 'Facebook', href: '#' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Link' }, children: [] },
                      ],
                    },
                  ],
                },
                {
                  id: 'sm-foot-bottom',
                  type: 'Container',
                  props: {},
                  style: { base: { marginTop: 'xl', paddingTop: 'lg', borderTop: '1px solid', borderColor: 'border', display: 'flex', justifyContent: 'between', alignItems: 'center' }, mobile: { flexDirection: 'column', gap: 'md', textAlign: 'center' } },
                  actions: [],
                  meta: { name: 'Bottom' },
                  children: [
                    { id: 'sm-foot-copy', type: 'Text', props: { text: '© 2026 Mein Shop. Alle Rechte vorbehalten.' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Copyright' }, children: [] },
                    { id: 'sm-foot-pay', type: 'Text', props: { text: '💳 Visa · Mastercard · PayPal · Klarna' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Payment' }, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

// Register page templates
templateRegistry.registerPage(shopFullPage);
templateRegistry.registerPage(shopModernPage);

// Export individual templates
export { demoPageTemplate } from './demo-page';

export { type FullPageTemplate };
