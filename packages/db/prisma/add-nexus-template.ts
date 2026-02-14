import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nexusShopTemplate = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'auto' },
    style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: 'none' } },
    actions: [],
    meta: { name: 'Shop Seite' },
    children: [
      // HEADER
      {
        id: 'header',
        type: 'Section',
        props: {},
        style: { 
          base: { backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: '0', zIndex: 100 },
          mobile: { position: 'relative' }
        },
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
                props: { maxWidth: '7xl', centered: true },
                style: { base: { display: 'flex', justifyContent: 'center' } },
                actions: [],
                meta: { name: 'Top Bar Content' },
                children: [
                  { id: 'promo-text', type: 'Text', props: { text: 'Kostenloser Versand ab 29€  ·  Express-Lieferung verfügbar' }, style: { base: { color: '#ffffff', fontSize: '12px', textAlign: 'center', letterSpacing: '0.02em' }, mobile: { fontSize: '10px' } }, actions: [], meta: { name: 'Promo Text' }, children: [] },
                ],
              },
            ],
          },
          // Main Header
          {
            id: 'main-header',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '16px 24px' }, mobile: { padding: '12px 16px' } },
            actions: [],
            meta: { name: 'Main Header' },
            children: [
              {
                id: 'header-row',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center', responsiveStack: false },
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
                actions: [],
                meta: { name: 'Header Row' },
                children: [
                  // Mobile Menu Button (left side on mobile)
                  { id: 'mobile-menu-btn', type: 'Button', props: { text: '☰', variant: 'ghost' }, style: { base: { display: 'none' }, mobile: { display: 'flex', fontSize: '24px', padding: '4px 8px', minWidth: 'auto', backgroundColor: 'transparent', border: 'none' } }, actions: [{ event: 'onClick', action: { type: 'toggleMobileSidebar' } }], meta: { name: 'Menu Button' }, children: [] },
                  { id: 'logo', type: 'Heading', props: { level: 1, text: 'NEXUS' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1a1a1a' }, mobile: { fontSize: '22px', flex: '1', textAlign: 'center' } }, actions: [], meta: { name: 'Logo' }, children: [] },
                  {
                    id: 'search-container',
                    type: 'Container',
                    props: { maxWidth: 'full' },
                    style: { base: { display: 'flex', flex: '1', maxWidth: '500px', margin: '0 40px' }, mobile: { display: 'none' } },
                    actions: [],
                    meta: { name: 'Search Container' },
                    children: [
                      { id: 'search-input', type: 'Input', props: { placeholder: 'Produkte, Marken und mehr suchen...' }, style: { base: { width: '100%', border: '2px solid #e5e5e5', borderRadius: '8px', padding: '12px 16px', fontSize: '14px' } }, actions: [], meta: { name: 'Suchfeld' }, children: [] },
                    ],
                  },
                  {
                    id: 'header-actions',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'md', align: 'center', responsiveStack: false },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center' }, mobile: { gap: '16px' } },
                    actions: [],
                    meta: { name: 'Header Actions' },
                    children: [
                      { id: 'login-link', type: 'Link', props: { text: 'Anmelden', href: '/login' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }, mobile: { display: 'none' } }, actions: [], meta: { name: 'Login Link' }, children: [] },
                      { id: 'wishlist-link', type: 'Link', props: { text: '♡', href: '/wishlist' }, style: { base: { color: '#1a1a1a', textDecoration: 'none', fontSize: '20px' }, mobile: { fontSize: '22px' } }, actions: [], meta: { name: 'Wishlist' }, children: [] },
                      // Desktop: Full cart button | Mobile: Cart icon only
                      { id: 'cart-link', type: 'Button', props: { text: 'Warenkorb (0)', variant: 'outline' }, style: { base: { border: '2px solid #1a1a1a', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px' }, mobile: { display: 'none' } }, actions: [], meta: { name: 'Warenkorb Desktop' }, children: [] },
                      { id: 'cart-link-mobile', type: 'Link', props: { text: '🛒', href: '/cart' }, style: { base: { display: 'none' }, mobile: { display: 'flex', fontSize: '22px', color: '#1a1a1a', textDecoration: 'none' } }, actions: [], meta: { name: 'Warenkorb Mobile' }, children: [] },
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
            props: { maxWidth: '7xl', centered: true },
            style: { base: { borderTop: '1px solid #f0f0f0', padding: '0 24px' }, mobile: { display: 'none' } },
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
                  { id: 'nav-sale', type: 'Link', props: { text: 'SALE', href: '#sale' }, style: { base: { color: '#dc2626', textDecoration: 'none', fontSize: '14px', fontWeight: '700' } }, actions: [], meta: { name: 'Nav: Sale' }, children: [] },
                ],
              },
            ],
          },
        ],
      },

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
                style: { base: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }, mobile: { minHeight: '300px' } },
                actions: [],
                meta: { name: 'Hero Banner' },
                children: [
                  {
                    id: 'hero-content',
                    type: 'Container',
                    props: { maxWidth: '3xl', centered: true },
                    style: { base: { textAlign: 'center', padding: '60px 24px' }, mobile: { padding: '32px 16px' } },
                    actions: [],
                    meta: { name: 'Hero Content' },
                    children: [
                      { id: 'hero-badge', type: 'Badge', props: { text: 'TECH WEEK', variant: 'secondary' }, style: { base: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', marginBottom: '16px', fontSize: '11px', padding: '6px 16px', fontWeight: '700', letterSpacing: '0.1em' } }, actions: [], meta: { name: 'Hero Badge' }, children: [] },
                      { id: 'hero-title', type: 'Heading', props: { level: 1, text: 'Bis zu 40% Rabatt auf Elektronik' }, style: { base: { color: '#ffffff', fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }, mobile: { fontSize: '24px', marginBottom: '12px' } }, actions: [], meta: { name: 'Hero Title' }, children: [] },
                      { id: 'hero-subtitle', type: 'Text', props: { text: 'Smartphones, Laptops, Gaming & mehr. Nur noch 3 Tage!' }, style: { base: { color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: '32px' }, mobile: { fontSize: '14px', marginBottom: '20px' } }, actions: [], meta: { name: 'Hero Subtitle' }, children: [] },
                      { id: 'hero-cta', type: 'Button', props: { text: 'Jetzt Deals entdecken', variant: 'primary' }, style: { base: { backgroundColor: '#ffffff', color: '#764ba2', padding: '16px 32px', fontSize: '15px', fontWeight: '600', borderRadius: '8px' }, mobile: { padding: '12px 20px', fontSize: '13px' } }, actions: [], meta: { name: 'Hero CTA' }, children: [] },
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
        style: { base: { backgroundColor: '#ffffff', padding: '60px 0' }, mobile: { padding: '32px 0' } },
        actions: [],
        meta: { name: 'Kategorien' },
        children: [
          {
            id: 'categories-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' } },
            actions: [],
            meta: { name: 'Categories Container' },
            children: [
              { id: 'cat-title', type: 'Heading', props: { level: 2, text: 'Shop nach Kategorie' }, style: { base: { fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '40px' }, mobile: { fontSize: '20px', marginBottom: '24px' } }, actions: [], meta: { name: 'Kategorien Titel' }, children: [] },
              {
                id: 'category-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 2, gap: 'md' } },
                actions: [],
                meta: { name: 'Category Grid' },
                children: [
                  { id: 'cat-1', type: 'Card', props: { title: 'Elektronik', description: 'Smartphones, Tablets & mehr' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Elektronik' }, children: [] },
                  { id: 'cat-2', type: 'Card', props: { title: 'Haus & Garten', description: 'Möbel, Dekoration, Werkzeug' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Haushalt' }, children: [] },
                  { id: 'cat-3', type: 'Card', props: { title: 'Sport & Outdoor', description: 'Fitness, Camping, Fahrräder' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Sport' }, children: [] },
                  { id: 'cat-4', type: 'Card', props: { title: 'Beauty', description: 'Pflege, Düfte, Wellness' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Beauty' }, children: [] },
                  { id: 'cat-5', type: 'Card', props: { title: 'Baby & Kind', description: 'Spielzeug, Kleidung, Zubehör' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Baby' }, children: [] },
                  { id: 'cat-6', type: 'Card', props: { title: 'Tierbedarf', description: 'Futter, Spielzeug, Pflege' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Tiere' }, children: [] },
                  { id: 'cat-7', type: 'Card', props: { title: 'Auto & Motor', description: 'Zubehör, Ersatzteile, Pflege' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Auto' }, children: [] },
                  { id: 'cat-8', type: 'Card', props: { title: 'Bücher & Medien', description: 'Bücher, Filme, Musik' }, style: { base: { textAlign: 'center', padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '12px', cursor: 'pointer' } }, actions: [], meta: { name: 'Cat: Bücher' }, children: [] },
                ],
              },
            ],
          },
        ],
      },

      // FLASH DEALS
      {
        id: 'deals-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#fef2f2', padding: '60px 0' }, mobile: { padding: '32px 0' } },
        actions: [],
        meta: { name: 'Flash Deals' },
        children: [
          {
            id: 'deals-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Deals Container' },
            children: [
              {
                id: 'deals-header',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }, mobile: { flexDirection: 'column', gap: '12px', marginBottom: '20px' } },
                actions: [],
                meta: { name: 'Deals Header' },
                children: [
                  { id: 'deals-title', type: 'Heading', props: { level: 2, text: 'Tagesangebote' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }, mobile: { fontSize: '20px' } }, actions: [], meta: { name: 'Deals Title' }, children: [] },
                  { id: 'deals-timer', type: 'Text', props: { text: 'Endet in 05:32:17' }, style: { base: { backgroundColor: '#1f2937', color: '#ffffff', padding: '10px 20px', fontSize: '13px', fontWeight: '600', borderRadius: '6px', letterSpacing: '0.5px' } }, actions: [], meta: { name: 'Countdown' }, children: [] },
                ],
              },
              {
                id: 'deals-grid',
                type: 'Grid',
                props: { columns: 4, gap: 'md' },
                style: { base: {}, mobile: { gridColumns: 2 } },
                actions: [],
                meta: { name: 'Deals Grid' },
                children: [
                  { id: 'deal-1', type: 'ProductCard', props: { productId: '', productName: 'Wireless Earbuds Pro', productPrice: 82, productComparePrice: 149, productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', productBadge: '-45%', showPrice: true, showAddToCart: true, showBadge: true, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Deal 1' }, children: [] },
                  { id: 'deal-2', type: 'ProductCard', props: { productId: '', productName: 'Smart Watch Ultra', productPrice: 179, productComparePrice: 299, productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', productBadge: '-40%', showPrice: true, showAddToCart: true, showBadge: true, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Deal 2' }, children: [] },
                  { id: 'deal-3', type: 'ProductCard', props: { productId: '', productName: 'Gaming Headset RGB', productPrice: 49, productComparePrice: 89, productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', productBadge: '-45%', showPrice: true, showAddToCart: true, showBadge: true, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Deal 3' }, children: [] },
                  { id: 'deal-4', type: 'ProductCard', props: { productId: '', productName: 'Bluetooth Speaker', productPrice: 39, productComparePrice: 79, productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', productBadge: '-50%', showPrice: true, showAddToCart: true, showBadge: true, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Deal 4' }, children: [] },
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
        style: { base: { backgroundColor: '#ffffff', padding: '60px 0' }, mobile: { padding: '32px 0' } },
        actions: [],
        meta: { name: 'Bestseller' },
        children: [
          {
            id: 'bestseller-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Bestseller Container' },
            children: [
              {
                id: 'bestseller-header',
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }, mobile: { flexDirection: 'column', gap: '12px', marginBottom: '20px' } },
                actions: [],
                meta: { name: 'Bestseller Header' },
                children: [
                  { id: 'best-title', type: 'Heading', props: { level: 2, text: 'Bestseller' }, style: { base: { fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }, mobile: { fontSize: '20px' } }, actions: [], meta: { name: 'Bestseller Title' }, children: [] },
                  { id: 'best-more', type: 'Link', props: { text: 'Alle anzeigen', href: '#' }, style: { base: { color: '#111827', textDecoration: 'none', fontWeight: '500', fontSize: '14px' } }, actions: [], meta: { name: 'Mehr Link' }, children: [] },
                ],
              },
              {
                id: 'bestseller-grid',
                type: 'Grid',
                props: { columns: 5, gap: 'md' },
                style: { base: {}, mobile: { gridColumns: 2 } },
                actions: [],
                meta: { name: 'Bestseller Grid' },
                children: [
                  { id: 'prod-1', type: 'ProductCard', props: { productId: '', productName: 'MacBook Pro 14"', productPrice: 1999, productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', productBadge: 'Beliebt', showPrice: true, showAddToCart: true, showBadge: true, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Produkt 1' }, children: [] },
                  { id: 'prod-2', type: 'ProductCard', props: { productId: '', productName: 'iPhone 15 Pro', productPrice: 1199, productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop', productBadge: '', showPrice: true, showAddToCart: true, showBadge: false, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Produkt 2' }, children: [] },
                  { id: 'prod-3', type: 'ProductCard', props: { productId: '', productName: 'Sony Alpha 7 IV', productPrice: 2499, productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', productBadge: '', showPrice: true, showAddToCart: true, showBadge: false, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Produkt 3' }, children: [] },
                  { id: 'prod-4', type: 'ProductCard', props: { productId: '', productName: 'PlayStation 5', productPrice: 549, productImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop', productBadge: '', showPrice: true, showAddToCart: true, showBadge: false, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Produkt 4' }, children: [] },
                  { id: 'prod-5', type: 'ProductCard', props: { productId: '', productName: 'Dyson V15', productPrice: 699, productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', productBadge: '', showPrice: true, showAddToCart: true, showBadge: false, imageAspect: 'square' }, style: { base: {} }, actions: [], meta: { name: 'Produkt 5' }, children: [] },
                ],
              },
            ],
          },
        ],
      },

      // PROMO BANNERS
      {
        id: 'promo-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#f8f9fa', padding: '60px 0' }, mobile: { padding: '32px 0' } },
        actions: [],
        meta: { name: 'Promo Banner' },
        children: [
          {
            id: 'promo-container',
            type: 'Container',
            props: { maxWidth: '7xl', centered: true },
            style: { base: { padding: '0 24px' }, mobile: { padding: '0 16px' } },
            actions: [],
            meta: { name: 'Promo Container' },
            children: [
              {
                id: 'promo-grid',
                type: 'Grid',
                props: { columns: 2, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 1, gap: 'md' } },
                actions: [],
                meta: { name: 'Promo Grid' },
                children: [
                  {
                    id: 'promo-1',
                    type: 'Container',
                    props: {},
                    style: { base: { background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', borderRadius: '16px', padding: '40px', color: '#ffffff', position: 'relative', overflow: 'hidden' } },
                    actions: [],
                    meta: { name: 'Gaming Zone' },
                    children: [
                      { id: 'pr1-label', type: 'Text', props: { text: 'GAMING' }, style: { base: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' } }, actions: [], meta: { name: 'Label' }, children: [] },
                      { id: 'pr1-title', type: 'Heading', props: { level: 3, text: 'Gaming Zone' }, style: { base: { color: '#ffffff', fontSize: '26px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 'pr1-desc', type: 'Text', props: { text: 'PS5, Xbox, Gaming PCs & Zubehör' }, style: { base: { color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '14px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      { id: 'pr1-btn', type: 'Button', props: { text: 'Entdecken', variant: 'secondary' }, style: { base: { backgroundColor: '#ffffff', color: '#1a1a1a', fontWeight: '600', fontSize: '13px', padding: '10px 20px' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                    ],
                  },
                  {
                    id: 'promo-2',
                    type: 'Container',
                    props: {},
                    style: { base: { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: '16px', padding: '40px', color: '#ffffff', position: 'relative', overflow: 'hidden' } },
                    actions: [],
                    meta: { name: 'Fitness Zone' },
                    children: [
                      { id: 'pr2-label', type: 'Text', props: { text: 'FITNESS' }, style: { base: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' } }, actions: [], meta: { name: 'Label' }, children: [] },
                      { id: 'pr2-title', type: 'Heading', props: { level: 3, text: 'Fitness Essentials' }, style: { base: { color: '#ffffff', fontSize: '26px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 'pr2-desc', type: 'Text', props: { text: 'Alles für dein Home Workout' }, style: { base: { color: 'rgba(255,255,255,0.7)', marginBottom: '24px', fontSize: '14px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                      { id: 'pr2-btn', type: 'Button', props: { text: 'Jetzt shoppen', variant: 'secondary' }, style: { base: { backgroundColor: '#ffffff', color: '#059669', fontWeight: '600', fontSize: '13px', padding: '10px 20px' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // TRUST BADGES
      {
        id: 'trust-section',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#ffffff', padding: '60px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }, mobile: { padding: '32px 0' } },
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
                props: { columns: 5, gap: 'lg' },
                style: { base: {}, mobile: { gridColumns: 2, gap: 'md' } },
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
                      { id: 't1-icon', type: 'Container', props: {}, style: { base: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon Container' }, children: [] },
                      { id: 't1-title', type: 'Text', props: { text: 'Gratis Versand' }, style: { base: { fontWeight: '600', fontSize: '14px', color: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 't1-desc', type: 'Text', props: { text: 'Ab 29€ Bestellwert' }, style: { base: { color: '#6b7280', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
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
                      { id: 't2-icon', type: 'Container', props: {}, style: { base: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon Container' }, children: [] },
                      { id: 't2-title', type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontWeight: '600', fontSize: '14px', color: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 't2-desc', type: 'Text', props: { text: 'Kostenlos & unkompliziert' }, style: { base: { color: '#6b7280', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
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
                      { id: 't3-icon', type: 'Container', props: {}, style: { base: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon Container' }, children: [] },
                      { id: 't3-title', type: 'Text', props: { text: 'Sichere Zahlung' }, style: { base: { fontWeight: '600', fontSize: '14px', color: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 't3-desc', type: 'Text', props: { text: 'SSL-verschlüsselt' }, style: { base: { color: '#6b7280', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
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
                      { id: 't4-icon', type: 'Container', props: {}, style: { base: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon Container' }, children: [] },
                      { id: 't4-title', type: 'Text', props: { text: 'Kauf auf Rechnung' }, style: { base: { fontWeight: '600', fontSize: '14px', color: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 't4-desc', type: 'Text', props: { text: 'Mit Klarna' }, style: { base: { color: '#6b7280', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
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
                      { id: 't5-icon', type: 'Container', props: {}, style: { base: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' } }, actions: [], meta: { name: 'Icon Container' }, children: [] },
                      { id: 't5-title', type: 'Text', props: { text: '24/7 Support' }, style: { base: { fontWeight: '600', fontSize: '14px', color: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                      { id: 't5-desc', type: 'Text', props: { text: 'Wir sind für dich da' }, style: { base: { color: '#6b7280', fontSize: '12px' } }, actions: [], meta: { name: 'Desc' }, children: [] },
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
        style: { base: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 0' }, mobile: { padding: '48px 0' } },
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
              { id: 'nl-label', type: 'Text', props: { text: 'NEWSLETTER' }, style: { base: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' } }, actions: [], meta: { name: 'Label' }, children: [] },
              { id: 'nl-title', type: 'Heading', props: { level: 2, text: '10€ Geschenkt' }, style: { base: { color: '#ffffff', fontSize: '32px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.5px' }, mobile: { fontSize: '24px' } }, actions: [], meta: { name: 'Title' }, children: [] },
              { id: 'nl-desc', type: 'Text', props: { text: 'Melde dich an und erhalte 10€ Rabatt auf deine erste Bestellung ab 50€' }, style: { base: { color: 'rgba(255,255,255,0.85)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }, mobile: { fontSize: '14px', marginBottom: '24px' } }, actions: [], meta: { name: 'Description' }, children: [] },
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
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '12px', maxWidth: '450px', width: '100%' }, mobile: { flexDirection: 'column' } },
                    actions: [],
                    meta: { name: 'Newsletter Form' },
                    children: [
                      { id: 'nl-input', type: 'Input', props: { placeholder: 'Deine E-Mail Adresse' }, style: { base: { flex: '1', padding: '14px 20px', borderRadius: '8px', border: 'none', fontSize: '16px' } }, actions: [], meta: { name: 'Email Input' }, children: [] },
                      { id: 'nl-btn', type: 'Button', props: { text: 'Anmelden', variant: 'primary' }, style: { base: { backgroundColor: '#1a1a1a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', fontWeight: '600', whiteSpace: 'nowrap' }, mobile: { width: '100%' } }, actions: [], meta: { name: 'Submit' }, children: [] },
                    ],
                  },
                ],
              },
              { id: 'nl-privacy', type: 'Text', props: { text: 'Mit der Anmeldung akzeptierst du unsere Datenschutzbestimmungen' }, style: { base: { color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '16px' } }, actions: [], meta: { name: 'Privacy Note' }, children: [] },
            ],
          },
        ],
      },

      // FOOTER
      {
        id: 'footer',
        type: 'Section',
        props: {},
        style: { base: { backgroundColor: '#1a1a1a', padding: '60px 0 30px' }, mobile: { padding: '40px 0 24px' } },
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
                props: { columns: 5, gap: 'lg' },
                style: { base: { marginBottom: '48px' }, mobile: { gridColumns: 2, marginBottom: '32px', gap: 'md' } },
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
                      { id: 'fs-4', type: 'Link', props: { text: 'Sale', href: '#' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none' } }, actions: [], meta: { name: 'Link' }, children: [] },
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
                style: { base: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }, mobile: { flexDirection: 'column', gap: '16px', textAlign: 'center' } },
                actions: [],
                meta: { name: 'Footer Bottom' },
                children: [
                  { id: 'copyright', type: 'Text', props: { text: '© 2026 NEXUS. Alle Rechte vorbehalten.' }, style: { base: { color: 'rgba(255,255,255,0.4)', fontSize: '13px' } }, actions: [], meta: { name: 'Copyright' }, children: [] },
                  {
                    id: 'legal-links',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'lg' },
                    style: { base: { display: 'flex', flexDirection: 'row', gap: '24px' }, mobile: { gap: '16px', flexWrap: 'wrap', justifyContent: 'center' } },
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

async function main() {
  console.log('🛍️ Creating NEXUS Shop Template...');

  // Find demo user for createdById
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo@builderly.dev' }
  });

  // Check if template exists
  const existing = await prisma.template.findFirst({
    where: { slug: 'nexus-shop' }
  });

  if (existing) {
    console.log('📝 Updating existing NEXUS Shop template...');
    await prisma.template.update({
      where: { id: existing.id },
      data: { 
        tree: nexusShopTemplate,
        name: 'NEXUS Shop',
        description: 'Premium Multi-Category E-Commerce Template mit Header, Kategorien, Flash-Deals, Bestseller, Promo-Banner, Trust Badges, Newsletter und Footer',
        category: 'FULL_PAGE',
        style: 'modern',
        websiteType: 'ecommerce',
        tags: ['shop', 'ecommerce', 'nexus', 'multi-category', 'premium'],
        isPro: false,
        isPublished: true,
      }
    });
  } else {
    console.log('✨ Creating new NEXUS Shop template...');
    await prisma.template.create({
      data: {
        name: 'NEXUS Shop',
        slug: 'nexus-shop',
        description: 'Premium Multi-Category E-Commerce Template mit Header, Kategorien, Flash-Deals, Bestseller, Promo-Banner, Trust Badges, Newsletter und Footer',
        thumbnail: 'https://placehold.co/600x400?text=NEXUS+Shop',
        category: 'FULL_PAGE',
        style: 'modern',
        websiteType: 'ecommerce',
        tags: ['shop', 'ecommerce', 'nexus', 'multi-category', 'premium'],
        tree: nexusShopTemplate,
        isPro: false,
        isPublished: true,
        isSystem: false,
        createdById: demoUser?.id,
      }
    });
  }

  console.log('✅ NEXUS Shop Template created/updated!');
  
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

