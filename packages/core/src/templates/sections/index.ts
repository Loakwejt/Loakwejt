import type { BuilderNode } from '../../schemas/node';

// ============================================================================
// Reusable Section Templates (fallback / default sections)
// ============================================================================

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'cta' | 'contact' | 'team' | 'faq' | 'footer' | 'header' | 'gallery' | 'stats' | 'testimonials';
  thumbnail?: string;
  tree: BuilderNode;
}

// --------------------------------------------------------------------------
// HERO
// --------------------------------------------------------------------------

export const heroSimple: SectionTemplate = {
  id: 'hero-simple',
  name: 'Hero – Einfach',
  description: 'Überschrift, Untertitel und CTA-Button',
  category: 'hero',
  tree: {
    id: 'hero-s',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'lg', minHeight: '60vh' } },
    actions: [],
    children: [
      { id: 'hero-s-h', type: 'Heading', props: { level: 1, text: 'Willkommen auf deiner Website' }, style: { base: { fontSize: '4xl', fontWeight: 'bold' } }, actions: [], children: [] },
      { id: 'hero-s-p', type: 'Text', props: { text: 'Erstelle beeindruckende Seiten in Minuten — kein Code nötig.' }, style: { base: { fontSize: 'lg', maxWidth: '2xl' } }, actions: [], children: [] },
      { id: 'hero-s-b', type: 'Button', props: { text: 'Jetzt starten', variant: 'primary' }, style: { base: {} }, actions: [], children: [] },
    ],
  },
};

export const heroWithImage: SectionTemplate = {
  id: 'hero-image',
  name: 'Hero – Mit Bild',
  description: 'Zweispaltiges Layout mit Text links, Bild rechts',
  category: 'hero',
  tree: {
    id: 'hero-i',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', display: 'flex', gap: 'xl', alignItems: 'center' } },
    actions: [],
    children: [
      {
        id: 'hero-i-l', type: 'Container', props: {}, style: { base: { flex: '1', display: 'flex', flexDirection: 'column', gap: 'md' } }, actions: [], children: [
          { id: 'hero-i-h', type: 'Heading', props: { level: 1, text: 'Dein Produkt. Deine Story.' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
          { id: 'hero-i-p', type: 'Text', props: { text: 'Beschreibe hier, was dein Produkt auszeichnet und warum Kunden es lieben werden.' }, style: { base: {} }, actions: [], children: [] },
          { id: 'hero-i-b', type: 'Button', props: { text: 'Mehr erfahren', variant: 'primary' }, style: { base: {} }, actions: [], children: [] },
        ],
      },
      {
        id: 'hero-i-r', type: 'Image', props: { src: '/placeholder.svg', alt: 'Hero Image' }, style: { base: { flex: '1', borderRadius: 'lg' } }, actions: [], children: [],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// FEATURES
// --------------------------------------------------------------------------

export const featuresThreeColumns: SectionTemplate = {
  id: 'features-3col',
  name: 'Features – 3 Spalten',
  description: 'Drei Feature-Karten nebeneinander',
  category: 'features',
  tree: {
    id: 'feat-3',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center' } },
    actions: [],
    children: [
      { id: 'feat-3-h', type: 'Heading', props: { level: 2, text: 'Unsere Features' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
      {
        id: 'feat-3-g', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'lg' } }, actions: [], children: [
          { id: 'feat-3-1', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', textAlign: 'center' } }, actions: [], children: [
            { id: 'feat-3-1h', type: 'Heading', props: { level: 3, text: 'Feature 1' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'feat-3-1p', type: 'Text', props: { text: 'Beschreibung des ersten Features.' }, style: { base: {} }, actions: [], children: [] },
          ]},
          { id: 'feat-3-2', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', textAlign: 'center' } }, actions: [], children: [
            { id: 'feat-3-2h', type: 'Heading', props: { level: 3, text: 'Feature 2' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'feat-3-2p', type: 'Text', props: { text: 'Beschreibung des zweiten Features.' }, style: { base: {} }, actions: [], children: [] },
          ]},
          { id: 'feat-3-3', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', textAlign: 'center' } }, actions: [], children: [
            { id: 'feat-3-3h', type: 'Heading', props: { level: 3, text: 'Feature 3' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'feat-3-3p', type: 'Text', props: { text: 'Beschreibung des dritten Features.' }, style: { base: {} }, actions: [], children: [] },
          ]},
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// PRICING
// --------------------------------------------------------------------------

export const pricingThreeTiers: SectionTemplate = {
  id: 'pricing-3tier',
  name: 'Pricing – 3 Stufen',
  description: 'Drei Preispläne nebeneinander',
  category: 'pricing',
  tree: {
    id: 'price-3',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center' } },
    actions: [],
    children: [
      { id: 'price-3-h', type: 'Heading', props: { level: 2, text: 'Preise' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
      {
        id: 'price-3-g', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'lg' } }, actions: [], children: [
          { id: 'price-3-1', type: 'Container', props: {}, style: { base: { padding: 'xl', borderRadius: 'lg', border: '1px solid #e5e7eb' } }, actions: [], children: [
            { id: 'price-3-1h', type: 'Heading', props: { level: 3, text: 'Starter' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-1p', type: 'Text', props: { text: '€9/Monat' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', marginY: 'md' } }, actions: [], children: [] },
            { id: 'price-3-1d', type: 'Text', props: { text: 'Perfekt für den Einstieg' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-1b', type: 'Button', props: { text: 'Auswählen', variant: 'outline' }, style: { base: { marginTop: 'lg' } }, actions: [], children: [] },
          ]},
          { id: 'price-3-2', type: 'Container', props: {}, style: { base: { padding: 'xl', borderRadius: 'lg', border: '2px solid currentColor' } }, actions: [], children: [
            { id: 'price-3-2h', type: 'Heading', props: { level: 3, text: 'Pro' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-2p', type: 'Text', props: { text: '€29/Monat' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', marginY: 'md' } }, actions: [], children: [] },
            { id: 'price-3-2d', type: 'Text', props: { text: 'Für wachsende Unternehmen' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-2b', type: 'Button', props: { text: 'Auswählen', variant: 'primary' }, style: { base: { marginTop: 'lg' } }, actions: [], children: [] },
          ]},
          { id: 'price-3-3', type: 'Container', props: {}, style: { base: { padding: 'xl', borderRadius: 'lg', border: '1px solid #e5e7eb' } }, actions: [], children: [
            { id: 'price-3-3h', type: 'Heading', props: { level: 3, text: 'Enterprise' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-3p', type: 'Text', props: { text: '€99/Monat' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', marginY: 'md' } }, actions: [], children: [] },
            { id: 'price-3-3d', type: 'Text', props: { text: 'Für große Teams' }, style: { base: {} }, actions: [], children: [] },
            { id: 'price-3-3b', type: 'Button', props: { text: 'Kontakt', variant: 'outline' }, style: { base: { marginTop: 'lg' } }, actions: [], children: [] },
          ]},
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// CTA
// --------------------------------------------------------------------------

export const ctaBanner: SectionTemplate = {
  id: 'cta-banner',
  name: 'CTA – Banner',
  description: 'Auffälliger Call-to-Action mit Hintergrundfarbe',
  category: 'cta',
  tree: {
    id: 'cta-b',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'md' } },
    actions: [],
    children: [
      { id: 'cta-b-h', type: 'Heading', props: { level: 2, text: 'Bereit loszulegen?' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
      { id: 'cta-b-p', type: 'Text', props: { text: 'Registriere dich noch heute und erstelle deine erste Website in Minuten.' }, style: { base: { maxWidth: 'xl' } }, actions: [], children: [] },
      { id: 'cta-b-b', type: 'Button', props: { text: 'Kostenlos starten', variant: 'primary' }, style: { base: {} }, actions: [], children: [] },
    ],
  },
};

// --------------------------------------------------------------------------
// CONTACT
// --------------------------------------------------------------------------

export const contactForm: SectionTemplate = {
  id: 'contact-form',
  name: 'Kontakt – Formular',
  description: 'Einfaches Kontaktformular',
  category: 'contact',
  tree: {
    id: 'contact-f',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', maxWidth: 'lg' } },
    actions: [],
    children: [
      { id: 'contact-f-h', type: 'Heading', props: { level: 2, text: 'Kontakt' }, style: { base: { marginBottom: 'lg', fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
      { id: 'contact-f-form', type: 'Form', props: { submitLabel: 'Absenden' }, style: { base: { display: 'flex', flexDirection: 'column', gap: 'md' } }, actions: [], children: [
        { id: 'contact-f-n', type: 'FormField', props: { label: 'Name', name: 'name', type: 'text', required: true }, style: { base: {} }, actions: [], children: [] },
        { id: 'contact-f-e', type: 'FormField', props: { label: 'E-Mail', name: 'email', type: 'email', required: true }, style: { base: {} }, actions: [], children: [] },
        { id: 'contact-f-m', type: 'FormField', props: { label: 'Nachricht', name: 'message', type: 'textarea', required: true }, style: { base: {} }, actions: [], children: [] },
      ]},
    ],
  },
};

// --------------------------------------------------------------------------
// FAQ
// --------------------------------------------------------------------------

export const faqSection: SectionTemplate = {
  id: 'faq-simple',
  name: 'FAQ – Einfach',
  description: 'Häufig gestellte Fragen als Accordion',
  category: 'faq',
  tree: {
    id: 'faq-s',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', maxWidth: 'lg' } },
    actions: [],
    children: [
      { id: 'faq-s-h', type: 'Heading', props: { level: 2, text: 'Häufig gestellte Fragen' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
      {
        id: 'faq-s-list', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'md' } }, actions: [], children: [
          { id: 'faq-s-1', type: 'Container', props: {}, style: { base: { padding: 'md', borderRadius: 'md', border: '1px solid #e5e7eb' } }, actions: [], children: [
            { id: 'faq-s-1q', type: 'Heading', props: { level: 3, text: 'Wie fange ich an?' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'faq-s-1a', type: 'Text', props: { text: 'Registriere dich kostenlos und erstelle dein erstes Projekt in wenigen Minuten.' }, style: { base: {} }, actions: [], children: [] },
          ]},
          { id: 'faq-s-2', type: 'Container', props: {}, style: { base: { padding: 'md', borderRadius: 'md', border: '1px solid #e5e7eb' } }, actions: [], children: [
            { id: 'faq-s-2q', type: 'Heading', props: { level: 3, text: 'Kann ich meine Domain verwenden?' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'faq-s-2a', type: 'Text', props: { text: 'Ja! Du kannst deine eigene Domain jederzeit verbinden.' }, style: { base: {} }, actions: [], children: [] },
          ]},
          { id: 'faq-s-3', type: 'Container', props: {}, style: { base: { padding: 'md', borderRadius: 'md', border: '1px solid #e5e7eb' } }, actions: [], children: [
            { id: 'faq-s-3q', type: 'Heading', props: { level: 3, text: 'Gibt es eine kostenlose Version?' }, style: { base: { marginBottom: 'sm' } }, actions: [], children: [] },
            { id: 'faq-s-3a', type: 'Text', props: { text: 'Ja, der Free-Plan enthält alle grundlegenden Funktionen.' }, style: { base: {} }, actions: [], children: [] },
          ]},
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// TESTIMONIALS
// --------------------------------------------------------------------------

export const testimonials: SectionTemplate = {
  id: 'testimonials-3',
  name: 'Testimonials – 3 Karten',
  description: 'Drei Kundenstimmen nebeneinander',
  category: 'testimonials',
  tree: {
    id: 'test-3',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center' } },
    actions: [],
    children: [
      { id: 'test-3-h', type: 'Heading', props: { level: 2, text: 'Was unsere Kunden sagen' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold' } }, actions: [], children: [] },
      {
        id: 'test-3-g', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'lg' } }, actions: [], children: [
          { id: 'test-3-1', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', textAlign: 'left' } }, actions: [], children: [
            { id: 'test-3-1t', type: 'Text', props: { text: '"Builderly hat unsere Webpräsenz komplett transformiert. Einfach genial!"' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
            { id: 'test-3-1n', type: 'Text', props: { text: '— Maria S., Designerin' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'test-3-2', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', textAlign: 'left' } }, actions: [], children: [
            { id: 'test-3-2t', type: 'Text', props: { text: '"Schnelle Einrichtung, toller Support und unfassbar flexibel."' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
            { id: 'test-3-2n', type: 'Text', props: { text: '— Thomas K., Startup-Gründer' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'test-3-3', type: 'Container', props: {}, style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', textAlign: 'left' } }, actions: [], children: [
            { id: 'test-3-3t', type: 'Text', props: { text: '"Endlich ein Builder, der wirklich funktioniert. Keine Kompromisse."' }, style: { base: { marginBottom: 'md' } }, actions: [], children: [] },
            { id: 'test-3-3n', type: 'Text', props: { text: '— Lisa M., Marketing Lead' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
          ]},
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// STATS
// --------------------------------------------------------------------------

export const statsRow: SectionTemplate = {
  id: 'stats-row',
  name: 'Statistiken – Zeile',
  description: 'Vier Kennzahlen in einer Reihe',
  category: 'stats',
  tree: {
    id: 'stats-r',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl' } },
    actions: [],
    children: [
      {
        id: 'stats-r-g', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'lg', textAlign: 'center' } }, actions: [], children: [
          { id: 'stats-r-1', type: 'Container', props: {}, style: { base: {} }, actions: [], children: [
            { id: 'stats-r-1n', type: 'Heading', props: { level: 2, text: '10.000+' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
            { id: 'stats-r-1l', type: 'Text', props: { text: 'Zufriedene Kunden' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'stats-r-2', type: 'Container', props: {}, style: { base: {} }, actions: [], children: [
            { id: 'stats-r-2n', type: 'Heading', props: { level: 2, text: '50.000+' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
            { id: 'stats-r-2l', type: 'Text', props: { text: 'Erstellte Websites' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'stats-r-3', type: 'Container', props: {}, style: { base: {} }, actions: [], children: [
            { id: 'stats-r-3n', type: 'Heading', props: { level: 2, text: '99.9%' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
            { id: 'stats-r-3l', type: 'Text', props: { text: 'Uptime' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'stats-r-4', type: 'Container', props: {}, style: { base: {} }, actions: [], children: [
            { id: 'stats-r-4n', type: 'Heading', props: { level: 2, text: '24/7' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' } }, actions: [], children: [] },
            { id: 'stats-r-4l', type: 'Text', props: { text: 'Support' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// FOOTER
// --------------------------------------------------------------------------

export const footerMultiColumn: SectionTemplate = {
  id: 'footer-multi',
  name: 'Footer – Mehrspaltig',
  description: 'Footer mit Logo, Links und Copyright',
  category: 'footer',
  tree: {
    id: 'foot-m',
    type: 'Section',
    props: {},
    style: { base: { padding: 'xl' } },
    actions: [],
    children: [
      {
        id: 'foot-m-g', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'xl' } }, actions: [], children: [
          { id: 'foot-m-1', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } }, actions: [], children: [
            { id: 'foot-m-1l', type: 'Heading', props: { level: 3, text: 'Builderly' }, style: { base: { fontWeight: 'bold' } }, actions: [], children: [] },
            { id: 'foot-m-1d', type: 'Text', props: { text: 'Der einfachste Weg, professionelle Websites zu erstellen.' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'foot-m-2', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } }, actions: [], children: [
            { id: 'foot-m-2h', type: 'Heading', props: { level: 4, text: 'Produkt' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
            { id: 'foot-m-2a', type: 'Link', props: { text: 'Features', href: '/features' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            { id: 'foot-m-2b', type: 'Link', props: { text: 'Preise', href: '/pricing' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            { id: 'foot-m-2c', type: 'Link', props: { text: 'Templates', href: '/templates' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
          { id: 'foot-m-3', type: 'Container', props: {}, style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } }, actions: [], children: [
            { id: 'foot-m-3h', type: 'Heading', props: { level: 4, text: 'Rechtliches' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
            { id: 'foot-m-3a', type: 'Link', props: { text: 'Impressum', href: '/impressum' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            { id: 'foot-m-3b', type: 'Link', props: { text: 'Datenschutz', href: '/datenschutz' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            { id: 'foot-m-3c', type: 'Link', props: { text: 'AGB', href: '/agb' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          ]},
        ],
      },
      { id: 'foot-m-c', type: 'Text', props: { text: '© 2025 Builderly. Alle Rechte vorbehalten.' }, style: { base: { marginTop: 'xl', textAlign: 'center', fontSize: 'sm' } }, actions: [], children: [] },
    ],
  },
};

// --------------------------------------------------------------------------
// GALLERY
// --------------------------------------------------------------------------

export const galleryGrid: SectionTemplate = {
  id: 'gallery-grid',
  name: 'Galerie – Raster',
  description: 'Bildergalerie im Raster-Layout',
  category: 'gallery',
  tree: {
    id: 'gal-g',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl' } },
    actions: [],
    children: [
      { id: 'gal-g-h', type: 'Heading', props: { level: 2, text: 'Galerie' }, style: { base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
      {
        id: 'gal-g-grid', type: 'Container', props: {}, style: { base: { display: 'grid', gap: 'md' } }, actions: [], children: [
          { id: 'gal-g-1', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 1' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
          { id: 'gal-g-2', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 2' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
          { id: 'gal-g-3', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 3' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
          { id: 'gal-g-4', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 4' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
          { id: 'gal-g-5', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 5' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
          { id: 'gal-g-6', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bild 6' }, style: { base: { borderRadius: 'lg' } }, actions: [], children: [] },
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// ALL TEMPLATES
// --------------------------------------------------------------------------

export const sectionTemplates: SectionTemplate[] = [
  heroSimple,
  heroWithImage,
  featuresThreeColumns,
  pricingThreeTiers,
  ctaBanner,
  contactForm,
  faqSection,
  testimonials,
  statsRow,
  footerMultiColumn,
  galleryGrid,
];
