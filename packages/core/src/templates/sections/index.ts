import type { BuilderNode } from '../../schemas/node';
import { templateRegistry, type TemplateDefinition } from '../template-registry';

// ============================================================================
// Reusable Section Templates (fallback / default sections)
// ============================================================================

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'cta' | 'contact' | 'team' | 'faq' | 'footer' | 'header' | 'gallery' | 'stats' | 'testimonials' | 'ecommerce';
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
// E-COMMERCE / SHOP SECTIONS
// --------------------------------------------------------------------------

export const shopHero: SectionTemplate = {
  id: 'shop-hero',
  name: 'Shop – Hero Banner',
  description: 'Moderner Shop-Hero mit Bild, Headline und CTA – mobiloptimiert',
  category: 'ecommerce',
  tree: {
    id: 'shop-hero',
    type: 'Section',
    props: {},
    style: {
      base: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 'xl',
        padding: '2xl',
        minHeight: '50vh',
      },
      mobile: {
        flexDirection: 'column',
        padding: 'lg',
        minHeight: 'auto',
        gap: 'lg',
        textAlign: 'center',
      },
    },
    actions: [],
    children: [
      {
        id: 'shop-hero-txt',
        type: 'Container',
        props: {},
        style: {
          base: { flex: '1', display: 'flex', flexDirection: 'column', gap: 'md' },
          mobile: { alignItems: 'center' },
        },
        actions: [],
        children: [
          {
            id: 'shop-hero-badge',
            type: 'Badge',
            props: { text: 'Neu im Shop', variant: 'secondary' },
            style: { base: {} },
            actions: [],
            children: [],
          },
          {
            id: 'shop-hero-h',
            type: 'Heading',
            props: { level: 1, text: 'Entdecke unsere neuesten Produkte' },
            style: {
              base: { fontSize: '4xl', fontWeight: 'bold', lineHeight: 'tight' },
              mobile: { fontSize: '2xl' },
            },
            actions: [],
            children: [],
          },
          {
            id: 'shop-hero-p',
            type: 'Text',
            props: { text: 'Hochwertige Produkte, fair produziert und schnell geliefert. Finde jetzt dein neues Lieblingsstück.' },
            style: {
              base: { fontSize: 'lg', maxWidth: 'xl' },
              mobile: { fontSize: 'base' },
            },
            actions: [],
            children: [],
          },
          {
            id: 'shop-hero-btns',
            type: 'Container',
            props: {},
            style: {
              base: { display: 'flex', gap: 'sm', flexDirection: 'row' },
              mobile: { flexDirection: 'column', width: '100%' },
            },
            actions: [],
            children: [
              {
                id: 'shop-hero-cta',
                type: 'Button',
                props: { text: 'Jetzt shoppen', variant: 'primary' },
                style: { base: {} },
                actions: [{ event: 'onClick', action: { type: 'navigate', to: '/produkte' } }],
                children: [],
              },
              {
                id: 'shop-hero-cta2',
                type: 'Button',
                props: { text: 'Alle Kategorien', variant: 'outline' },
                style: { base: {} },
                actions: [{ event: 'onClick', action: { type: 'navigate', to: '/kategorien' } }],
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'shop-hero-img',
        type: 'Image',
        props: { src: '/placeholder.svg', alt: 'Shop Banner' },
        style: {
          base: { flex: '1', borderRadius: 'xl', maxWidth: '2xl' },
          mobile: { width: '100%', maxWidth: 'full' },
        },
        actions: [],
        children: [],
      },
    ],
  },
};

export const shopFeaturedProducts: SectionTemplate = {
  id: 'shop-featured-products',
  name: 'Shop – Beliebte Produkte',
  description: 'Produktraster mit 4 Produktkarten, responsive auf 2/1 Spalte(n)',
  category: 'ecommerce',
  tree: {
    id: 'shop-feat',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl' }, mobile: { padding: 'lg' } },
    actions: [],
    children: [
      {
        id: 'shop-feat-header',
        type: 'Container',
        props: {},
        style: {
          base: { display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'xl' },
          mobile: { flexDirection: 'column', gap: 'sm', textAlign: 'center' },
        },
        actions: [],
        children: [
          {
            id: 'shop-feat-h',
            type: 'Heading',
            props: { level: 2, text: 'Beliebte Produkte' },
            style: { base: { fontSize: '2xl', fontWeight: 'bold' } },
            actions: [],
            children: [],
          },
          {
            id: 'shop-feat-link',
            type: 'Link',
            props: { text: 'Alle Produkte →', href: '/products' },
            style: { base: { fontSize: 'sm' } },
            actions: [],
            children: [],
          },
        ],
      },
      {
        id: 'shop-feat-grid',
        type: 'ProductList',
        props: { layout: 'grid', columns: 4, limit: 4, sortBy: 'createdAt', sortOrder: 'desc', categoryFilter: '' },
        style: { base: {} },
        actions: [],
        children: [
          {
            id: 'shop-feat-card1',
            type: 'ProductCard',
            props: { showPrice: true, showAddToCart: true, showDescription: false, showBadge: true, imageAspect: 'square', productName: 'Premium Hoodie', productPrice: 49.99, productImage: '', productDescription: '', productBadge: 'Bestseller', productSlug: '' },
            style: { base: {} },
            actions: [],
            children: [],
          },
          {
            id: 'shop-feat-card2',
            type: 'ProductCard',
            props: { showPrice: true, showAddToCart: true, showDescription: false, showBadge: true, imageAspect: 'square', productName: 'Classic T-Shirt', productPrice: 24.99, productImage: '', productDescription: '', productBadge: '', productSlug: '' },
            style: { base: {} },
            actions: [],
            children: [],
          },
          {
            id: 'shop-feat-card3',
            type: 'ProductCard',
            props: { showPrice: true, showAddToCart: true, showDescription: false, showBadge: true, imageAspect: 'square', productName: 'Sports Sneaker', productPrice: 89.99, productImage: '', productDescription: '', productBadge: 'Neu', productSlug: '' },
            style: { base: {} },
            actions: [],
            children: [],
          },
          {
            id: 'shop-feat-card4',
            type: 'ProductCard',
            props: { showPrice: true, showAddToCart: true, showDescription: false, showBadge: true, imageAspect: 'square', productName: 'Canvas Rucksack', productPrice: 59.99, productImage: '', productDescription: '', productBadge: '', productSlug: '' },
            style: { base: {} },
            actions: [],
            children: [],
          },
        ],
      },
    ],
  },
};

export const shopCategories: SectionTemplate = {
  id: 'shop-categories',
  name: 'Shop – Kategorien',
  description: 'Kategorie-Karten mit Bildern, 3-spaltig → 1-spaltig auf Mobile',
  category: 'ecommerce',
  tree: {
    id: 'shop-cat',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl', textAlign: 'center' }, mobile: { padding: 'lg' } },
    actions: [],
    children: [
      {
        id: 'shop-cat-h',
        type: 'Heading',
        props: { level: 2, text: 'Shop nach Kategorie' },
        style: {
          base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold' },
          mobile: { fontSize: 'xl', marginBottom: 'lg' },
        },
        actions: [],
        children: [],
      },
      {
        id: 'shop-cat-grid',
        type: 'Container',
        props: {},
        style: {
          base: { display: 'grid', gridColumns: 3, gap: 'lg' },
          mobile: { gridColumns: 1 },
          tablet: { gridColumns: 2 },
        },
        actions: [],
        children: [
          {
            id: 'shop-cat-1',
            type: 'Container',
            props: {},
            style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } },
            actions: [],
            children: [
              { id: 'shop-cat-1-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Bekleidung' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
              {
                id: 'shop-cat-1-overlay',
                type: 'Container',
                props: {},
                style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } },
                actions: [],
                children: [
                  { id: 'shop-cat-1-t', type: 'Heading', props: { level: 3, text: 'Bekleidung' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  { id: 'shop-cat-1-n', type: 'Text', props: { text: '42 Produkte' }, style: { base: { textColor: '#e5e7eb', fontSize: 'sm' } }, actions: [], children: [] },
                ],
              },
            ],
          },
          {
            id: 'shop-cat-2',
            type: 'Container',
            props: {},
            style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } },
            actions: [],
            children: [
              { id: 'shop-cat-2-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Accessoires' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
              {
                id: 'shop-cat-2-overlay',
                type: 'Container',
                props: {},
                style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } },
                actions: [],
                children: [
                  { id: 'shop-cat-2-t', type: 'Heading', props: { level: 3, text: 'Accessoires' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  { id: 'shop-cat-2-n', type: 'Text', props: { text: '28 Produkte' }, style: { base: { textColor: '#e5e7eb', fontSize: 'sm' } }, actions: [], children: [] },
                ],
              },
            ],
          },
          {
            id: 'shop-cat-3',
            type: 'Container',
            props: {},
            style: { base: { borderRadius: 'lg', overflow: 'hidden', position: 'relative', cursor: 'pointer' } },
            actions: [],
            children: [
              { id: 'shop-cat-3-img', type: 'Image', props: { src: '/placeholder.svg', alt: 'Schuhe' }, style: { base: { aspectRatio: '4/3', objectFit: 'cover' } }, actions: [], children: [] },
              {
                id: 'shop-cat-3-overlay',
                type: 'Container',
                props: {},
                style: { base: { position: 'absolute', bottom: '0', left: '0', right: '0', padding: 'lg', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' } },
                actions: [],
                children: [
                  { id: 'shop-cat-3-t', type: 'Heading', props: { level: 3, text: 'Schuhe' }, style: { base: { textColor: '#ffffff', fontWeight: 'bold' } }, actions: [], children: [] },
                  { id: 'shop-cat-3-n', type: 'Text', props: { text: '19 Produkte' }, style: { base: { textColor: '#e5e7eb', fontSize: 'sm' } }, actions: [], children: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const shopSaleBanner: SectionTemplate = {
  id: 'shop-sale-banner',
  name: 'Shop – Sale Banner',
  description: 'Auffälliger Sale/Angebots-Banner mit Countdown-Feeling',
  category: 'ecommerce',
  tree: {
    id: 'shop-sale',
    type: 'Section',
    props: {},
    style: {
      base: {
        padding: '2xl',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'md',
        backgroundColor: 'primary',
        color: 'primary-foreground',
        borderRadius: 'xl',
        marginX: 'lg',
      },
      mobile: { padding: 'lg', marginX: 'sm', borderRadius: 'lg' },
    },
    actions: [],
    children: [
      {
        id: 'shop-sale-tag',
        type: 'Badge',
        props: { text: 'Limitiert', variant: 'secondary' },
        style: { base: {} },
        actions: [],
        children: [],
      },
      {
        id: 'shop-sale-h',
        type: 'Heading',
        props: { level: 2, text: 'Bis zu 50% Rabatt' },
        style: {
          base: { fontSize: '3xl', fontWeight: 'bold' },
          mobile: { fontSize: '2xl' },
        },
        actions: [],
        children: [],
      },
      {
        id: 'shop-sale-p',
        type: 'Text',
        props: { text: 'Nur dieses Wochenende – spare bei ausgewählten Produkten. Solange der Vorrat reicht.' },
        style: {
          base: { maxWidth: 'lg', fontSize: 'lg' },
          mobile: { fontSize: 'base' },
        },
        actions: [],
        children: [],
      },
      {
        id: 'shop-sale-btn',
        type: 'Button',
        props: { text: 'Sale entdecken', variant: 'secondary' },
        style: { base: { marginTop: 'sm' } },
        actions: [{ event: 'onClick', action: { type: 'navigate', to: '/sale' } }],
        children: [],
      },
    ],
  },
};

export const shopTestimonials: SectionTemplate = {
  id: 'shop-testimonials',
  name: 'Shop – Kundenbewertungen',
  description: 'Bewertungskarten mit Sternen – responsive Grid',
  category: 'ecommerce',
  tree: {
    id: 'shop-test',
    type: 'Section',
    props: {},
    style: { base: { padding: '2xl' }, mobile: { padding: 'lg' } },
    actions: [],
    children: [
      {
        id: 'shop-test-h',
        type: 'Heading',
        props: { level: 2, text: 'Das sagen unsere Kunden' },
        style: {
          base: { marginBottom: 'xl', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' },
          mobile: { fontSize: 'xl', marginBottom: 'lg' },
        },
        actions: [],
        children: [],
      },
      {
        id: 'shop-test-grid',
        type: 'Container',
        props: {},
        style: {
          base: { display: 'grid', gridColumns: 3, gap: 'lg' },
          mobile: { gridColumns: 1 },
          tablet: { gridColumns: 2 },
        },
        actions: [],
        children: [
          {
            id: 'shop-test-1',
            type: 'Container',
            props: {},
            style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } },
            actions: [],
            children: [
              { id: 'shop-test-1-stars', type: 'Text', props: { text: '★★★★★' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
              { id: 'shop-test-1-txt', type: 'Text', props: { text: '"Super Qualität und schnelle Lieferung! Bin begeistert vom Hoodie, sitzt perfekt."' }, style: { base: {} }, actions: [], children: [] },
              { id: 'shop-test-1-name', type: 'Text', props: { text: '— Anna M. · Verifizierter Kauf' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-test-2',
            type: 'Container',
            props: {},
            style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } },
            actions: [],
            children: [
              { id: 'shop-test-2-stars', type: 'Text', props: { text: '★★★★★' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
              { id: 'shop-test-2-txt', type: 'Text', props: { text: '"Toller Shop, faire Preise. Die Sneaker sind bequem und sehen super aus."' }, style: { base: {} }, actions: [], children: [] },
              { id: 'shop-test-2-name', type: 'Text', props: { text: '— Markus K. · Verifizierter Kauf' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-test-3',
            type: 'Container',
            props: {},
            style: { base: { padding: 'lg', borderRadius: 'lg', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 'sm' } },
            actions: [],
            children: [
              { id: 'shop-test-3-stars', type: 'Text', props: { text: '★★★★☆' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
              { id: 'shop-test-3-txt', type: 'Text', props: { text: '"Rucksack ist super verarbeitet. Versand hat 2 Tage gedauert – top!"' }, style: { base: {} }, actions: [], children: [] },
              { id: 'shop-test-3-name', type: 'Text', props: { text: '— Julia S. · Verifizierter Kauf' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
        ],
      },
    ],
  },
};

export const shopNewsletter: SectionTemplate = {
  id: 'shop-newsletter',
  name: 'Shop – Newsletter',
  description: 'Newsletter-Anmeldung mit E-Mail-Feld und Rabatt-Hinweis',
  category: 'ecommerce',
  tree: {
    id: 'shop-nl',
    type: 'Section',
    props: {},
    style: {
      base: { padding: '2xl', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'md', backgroundColor: 'muted', borderRadius: 'xl', marginX: 'lg' },
      mobile: { padding: 'lg', marginX: 'sm', borderRadius: 'lg' },
    },
    actions: [],
    children: [
      {
        id: 'shop-nl-h',
        type: 'Heading',
        props: { level: 2, text: '10% Rabatt auf deine erste Bestellung' },
        style: {
          base: { fontSize: '2xl', fontWeight: 'bold' },
          mobile: { fontSize: 'xl' },
        },
        actions: [],
        children: [],
      },
      {
        id: 'shop-nl-p',
        type: 'Text',
        props: { text: 'Melde dich für unseren Newsletter an und erhalte exklusive Angebote, neue Produkte und Inspiration direkt in dein Postfach.' },
        style: { base: { maxWidth: 'lg' }, mobile: { fontSize: 'sm' } },
        actions: [],
        children: [],
      },
      {
        id: 'shop-nl-form',
        type: 'Form',
        props: { submitLabel: 'Anmelden' },
        style: {
          base: { display: 'flex', flexDirection: 'row', gap: 'sm', maxWidth: 'md', width: '100%' },
          mobile: { flexDirection: 'column' },
        },
        actions: [],
        children: [
          {
            id: 'shop-nl-email',
            type: 'FormField',
            props: { label: '', name: 'email', type: 'email', required: true, placeholder: 'Deine E-Mail-Adresse' },
            style: { base: { flex: '1' } },
            actions: [],
            children: [],
          },
        ],
      },
      {
        id: 'shop-nl-note',
        type: 'Text',
        props: { text: 'Kein Spam, jederzeit abmelden. Datenschutz respektiert.' },
        style: { base: { fontSize: 'xs' } },
        actions: [],
        children: [],
      },
    ],
  },
};

export const shopTrustBadges: SectionTemplate = {
  id: 'shop-trust-badges',
  name: 'Shop – Vertrauens-Badges',
  description: 'Icons für Versand, Sicherheit, Rückgabe — immer sichtbar',
  category: 'ecommerce',
  tree: {
    id: 'shop-trust',
    type: 'Section',
    props: {},
    style: { base: { padding: 'xl' }, mobile: { padding: 'md' } },
    actions: [],
    children: [
      {
        id: 'shop-trust-grid',
        type: 'Container',
        props: {},
        style: {
          base: { display: 'grid', gridColumns: 4, gap: 'lg', textAlign: 'center' },
          mobile: { gridColumns: 2, gap: 'md' },
        },
        actions: [],
        children: [
          {
            id: 'shop-trust-1',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs', padding: 'md' } },
            actions: [],
            children: [
              { id: 'shop-trust-1-icon', type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
              { id: 'shop-trust-1-h', type: 'Text', props: { text: 'Kostenloser Versand' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-trust-1-d', type: 'Text', props: { text: 'Ab 50 € Bestellwert' }, style: { base: { fontSize: 'xs' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-trust-2',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs', padding: 'md' } },
            actions: [],
            children: [
              { id: 'shop-trust-2-icon', type: 'Text', props: { text: '🔒' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
              { id: 'shop-trust-2-h', type: 'Text', props: { text: 'Sichere Bezahlung' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-trust-2-d', type: 'Text', props: { text: 'SSL-verschlüsselt' }, style: { base: { fontSize: 'xs' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-trust-3',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs', padding: 'md' } },
            actions: [],
            children: [
              { id: 'shop-trust-3-icon', type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
              { id: 'shop-trust-3-h', type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-trust-3-d', type: 'Text', props: { text: 'Kostenlos & unkompliziert' }, style: { base: { fontSize: 'xs' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-trust-4',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'xs', padding: 'md' } },
            actions: [],
            children: [
              { id: 'shop-trust-4-icon', type: 'Text', props: { text: '💬' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
              { id: 'shop-trust-4-h', type: 'Text', props: { text: 'Kundenservice' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-trust-4-d', type: 'Text', props: { text: 'Mo–Fr 9–18 Uhr' }, style: { base: { fontSize: 'xs' } }, actions: [], children: [] },
            ],
          },
        ],
      },
    ],
  },
};

export const shopFooter: SectionTemplate = {
  id: 'shop-footer',
  name: 'Shop – Footer',
  description: 'Shop-Footer mit Links, Zahlungsarten und Social Media – mobiloptimiert',
  category: 'ecommerce',
  tree: {
    id: 'shop-foot',
    type: 'Section',
    props: {},
    style: {
      base: { padding: 'xl', backgroundColor: 'muted' },
      mobile: { padding: 'lg' },
    },
    actions: [],
    children: [
      {
        id: 'shop-foot-grid',
        type: 'Container',
        props: {},
        style: {
          base: { display: 'grid', gridColumns: 4, gap: 'xl' },
          mobile: { gridColumns: 1, gap: 'lg' },
          tablet: { gridColumns: 2 },
        },
        actions: [],
        children: [
          {
            id: 'shop-foot-brand',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', gap: 'sm' } },
            actions: [],
            children: [
              { id: 'shop-foot-logo', type: 'Heading', props: { level: 3, text: 'Mein Shop' }, style: { base: { fontWeight: 'bold', fontSize: 'lg' } }, actions: [], children: [] },
              { id: 'shop-foot-desc', type: 'Text', props: { text: 'Hochwertige Produkte, fair und nachhaltig. Seit 2024.' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              {
                id: 'shop-foot-social',
                type: 'SocialLinks',
                props: { platform: 'mixed', links: [ { platform: 'instagram', url: '#' }, { platform: 'facebook', url: '#' }, { platform: 'tiktok', url: '#' } ] },
                style: { base: { marginTop: 'sm' } },
                actions: [],
                children: [],
              },
            ],
          },
          {
            id: 'shop-foot-links1',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } },
            actions: [],
            children: [
              { id: 'shop-foot-l1h', type: 'Heading', props: { level: 4, text: 'Shop' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
              { id: 'shop-foot-l1a', type: 'Link', props: { text: 'Alle Produkte', href: '/products' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l1b', type: 'Link', props: { text: 'Neuheiten', href: '/new' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l1c', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l1d', type: 'Link', props: { text: 'Geschenkgutscheine', href: '/gift-cards' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-foot-links2',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } },
            actions: [],
            children: [
              { id: 'shop-foot-l2h', type: 'Heading', props: { level: 4, text: 'Hilfe' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
              { id: 'shop-foot-l2a', type: 'Link', props: { text: 'Versand & Lieferung', href: '/shipping' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l2b', type: 'Link', props: { text: 'Rückgabe & Umtausch', href: '/returns' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l2c', type: 'Link', props: { text: 'FAQ', href: '/faq' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l2d', type: 'Link', props: { text: 'Kontakt', href: '/contact' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
          {
            id: 'shop-foot-links3',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', flexDirection: 'column', gap: 'xs' } },
            actions: [],
            children: [
              { id: 'shop-foot-l3h', type: 'Heading', props: { level: 4, text: 'Rechtliches' }, style: { base: { fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], children: [] },
              { id: 'shop-foot-l3a', type: 'Link', props: { text: 'Impressum', href: '/impressum' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l3b', type: 'Link', props: { text: 'Datenschutz', href: '/datenschutz' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l3c', type: 'Link', props: { text: 'AGB', href: '/agb' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
              { id: 'shop-foot-l3d', type: 'Link', props: { text: 'Widerruf', href: '/widerruf' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
            ],
          },
        ],
      },
      {
        id: 'shop-foot-bottom',
        type: 'Container',
        props: {},
        style: {
          base: { marginTop: 'xl', paddingTop: 'lg', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'between', alignItems: 'center' },
          mobile: { flexDirection: 'column', gap: 'sm', textAlign: 'center' },
        },
        actions: [],
        children: [
          { id: 'shop-foot-copy', type: 'Text', props: { text: '© 2026 Mein Shop. Alle Rechte vorbehalten.' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
          { id: 'shop-foot-pay', type: 'Text', props: { text: '💳 Visa · Mastercard · PayPal · Klarna · Apple Pay' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// E-COMMERCE / SHOP SECTIONS (ADDITIONAL)
// --------------------------------------------------------------------------

export const shopFlashDeals: SectionTemplate = {
  id: 'shop-flash-deals',
  name: 'Shop – Flash Deals',
  description: 'Zeitlimitierte Tagesangebote mit Rabatt-Badges und Countdown-Feeling',
  category: 'ecommerce',
  tree: {
    id: 'shop-flash',
    type: 'Section',
    props: {},
    style: {
      base: { paddingY: '4xl', bgColor: '#fef2f2' },
      mobile: { paddingY: '2xl' },
    },
    actions: [],
    meta: { name: 'Flash Deals' },
    children: [
      {
        id: 'shop-flash-container',
        type: 'Container',
        props: { maxWidth: 'xl', centered: true },
        style: { base: { paddingX: 'lg' }, mobile: { paddingX: 'md' } },
        actions: [],
        meta: { name: 'Container' },
        children: [
          {
            id: 'shop-flash-header',
            type: 'Stack',
            props: { direction: 'row', justify: 'between', align: 'center' },
            style: {
              base: { display: 'flex', flexDirection: 'row', justifyContent: 'between', alignItems: 'center', marginBottom: '2xl' },
              mobile: { flexDirection: 'column', gap: 'md', marginBottom: 'lg' },
            },
            actions: [],
            meta: { name: 'Header' },
            children: [
              { id: 'shop-flash-title', type: 'Heading', props: { level: 2, text: 'Tagesangebote' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' }, mobile: { fontSize: 'lg' } }, actions: [], meta: { name: 'Title' }, children: [] },
              { id: 'shop-flash-timer', type: 'Text', props: { text: 'Endet in 05:32:17' }, style: { base: { bgColor: '#1f2937', textColor: '#ffffff', padding: 'sm', fontSize: 'sm', fontWeight: 'semibold', borderRadius: 'md' } }, actions: [], meta: { name: 'Timer' }, children: [] },
            ],
          },
          {
            id: 'shop-flash-grid',
            type: 'Grid',
            props: { columns: 4, gap: 'md' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Deals Grid' },
            children: [
              {
                id: 'shop-flash-deal1',
                type: 'Card',
                props: {},
                style: { base: { bgColor: '#ffffff', borderRadius: 'lg', padding: 'lg', position: 'relative', border: '1px solid #e5e7eb' } },
                actions: [],
                meta: { name: 'Deal Card' },
                children: [
                  { id: 'flash-d1-badge', type: 'Text', props: { text: '-45%' }, style: { base: { position: 'absolute', top: '12px', left: '12px', bgColor: '#ef4444', textColor: '#ffffff', padding: 'xs', fontSize: 'xs', fontWeight: 'bold', borderRadius: 'sm' } }, actions: [], meta: { name: 'Badge' }, children: [] },
                  { id: 'flash-d1-img', type: 'Image', props: { src: 'https://placehold.co/400x400?text=Deal', alt: 'Deal' }, style: { base: { width: '100%', height: '160px', objectFit: 'cover', marginBottom: 'md', borderRadius: 'md' } }, actions: [], meta: { name: 'Image' }, children: [] },
                  { id: 'flash-d1-title', type: 'Text', props: { text: 'Premium Produkt' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold', marginBottom: 'sm', textColor: '#111827' } }, actions: [], meta: { name: 'Title' }, children: [] },
                  {
                    id: 'flash-d1-price',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm', align: 'center' },
                    style: { base: { display: 'flex', gap: 'sm', alignItems: 'center' } },
                    actions: [],
                    meta: { name: 'Price' },
                    children: [
                      { id: 'flash-d1-old', type: 'Text', props: { text: '149 €' }, style: { base: { fontSize: 'sm', textColor: '#9ca3af', textDecoration: 'line-through' } }, actions: [], meta: { name: 'Old Price' }, children: [] },
                      { id: 'flash-d1-new', type: 'Text', props: { text: '82 €' }, style: { base: { fontSize: 'base', textColor: '#ef4444', fontWeight: 'bold' } }, actions: [], meta: { name: 'Sale Price' }, children: [] },
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

export const shopPromoGrid: SectionTemplate = {
  id: 'shop-promo-grid',
  name: 'Shop – Promo Banner Grid',
  description: 'Zwei nebeneinanderliegende Promo-Banner für Kategorien oder Aktionen',
  category: 'ecommerce',
  tree: {
    id: 'shop-promo',
    type: 'Section',
    props: {},
    style: {
      base: { paddingY: '4xl', bgColor: '#f8f9fa' },
      mobile: { paddingY: '2xl' },
    },
    actions: [],
    meta: { name: 'Promo Grid' },
    children: [
      {
        id: 'shop-promo-container',
        type: 'Container',
        props: { maxWidth: 'xl', centered: true },
        style: { base: { paddingX: 'lg' }, mobile: { paddingX: 'md' } },
        actions: [],
        meta: { name: 'Container' },
        children: [
          {
            id: 'shop-promo-grid',
            type: 'Grid',
            props: { columns: 2, gap: 'lg' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Grid' },
            children: [
              {
                id: 'shop-promo-1',
                type: 'Container',
                props: {},
                style: { base: { background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', borderRadius: 'xl', padding: '2xl', textColor: '#ffffff' }, mobile: { padding: 'lg' } },
                actions: [],
                meta: { name: 'Promo 1' },
                children: [
                  { id: 'promo1-label', type: 'Text', props: { text: 'GAMING' }, style: { base: { fontSize: 'xs', fontWeight: 'bold', letterSpacing: 'wider', textColor: 'rgba(255,255,255,0.5)', marginBottom: 'sm' } }, actions: [], meta: { name: 'Label' }, children: [] },
                  { id: 'promo1-title', type: 'Heading', props: { level: 3, text: 'Gaming Zone' }, style: { base: { textColor: '#ffffff', fontSize: '2xl', fontWeight: 'bold', marginBottom: 'sm' }, mobile: { fontSize: 'lg' } }, actions: [], meta: { name: 'Title' }, children: [] },
                  { id: 'promo1-desc', type: 'Text', props: { text: 'Konsolen, PCs & Zubehör' }, style: { base: { textColor: 'rgba(255,255,255,0.7)', marginBottom: 'lg', fontSize: 'sm' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                  { id: 'promo1-btn', type: 'Button', props: { text: 'Entdecken', variant: 'secondary' }, style: { base: { bgColor: '#ffffff', textColor: '#1a1a1a', fontWeight: 'semibold' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                ],
              },
              {
                id: 'shop-promo-2',
                type: 'Container',
                props: {},
                style: { base: { background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: 'xl', padding: '2xl', textColor: '#ffffff' }, mobile: { padding: 'lg' } },
                actions: [],
                meta: { name: 'Promo 2' },
                children: [
                  { id: 'promo2-label', type: 'Text', props: { text: 'FITNESS' }, style: { base: { fontSize: 'xs', fontWeight: 'bold', letterSpacing: 'wider', textColor: 'rgba(255,255,255,0.5)', marginBottom: 'sm' } }, actions: [], meta: { name: 'Label' }, children: [] },
                  { id: 'promo2-title', type: 'Heading', props: { level: 3, text: 'Fitness Essentials' }, style: { base: { textColor: '#ffffff', fontSize: '2xl', fontWeight: 'bold', marginBottom: 'sm' }, mobile: { fontSize: 'lg' } }, actions: [], meta: { name: 'Title' }, children: [] },
                  { id: 'promo2-desc', type: 'Text', props: { text: 'Alles für dein Home Workout' }, style: { base: { textColor: 'rgba(255,255,255,0.7)', marginBottom: 'lg', fontSize: 'sm' } }, actions: [], meta: { name: 'Desc' }, children: [] },
                  { id: 'promo2-btn', type: 'Button', props: { text: 'Jetzt shoppen', variant: 'secondary' }, style: { base: { bgColor: '#ffffff', textColor: '#059669', fontWeight: 'semibold' } }, actions: [], meta: { name: 'CTA' }, children: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const shopProductDetail: SectionTemplate = {
  id: 'shop-product-detail',
  name: 'Shop – Produktdetail',
  description: 'Vollständige Produktansicht mit Bild, Details, Preis und Warenkorb-Button',
  category: 'ecommerce',
  tree: {
    id: 'shop-detail',
    type: 'Section',
    props: {},
    style: {
      base: { paddingY: '4xl' },
      mobile: { paddingY: 'lg' },
    },
    actions: [],
    meta: { name: 'Product Detail' },
    children: [
      {
        id: 'shop-detail-container',
        type: 'Container',
        props: { maxWidth: 'xl', centered: true },
        style: { base: { paddingX: 'lg' }, mobile: { paddingX: 'md' } },
        actions: [],
        meta: { name: 'Container' },
        children: [
          {
            id: 'shop-detail-grid',
            type: 'Grid',
            props: { columns: 2, gap: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Layout' },
            children: [
              {
                id: 'shop-detail-gallery',
                type: 'Container',
                props: {},
                style: { base: {} },
                actions: [],
                meta: { name: 'Gallery' },
                children: [
                  { id: 'detail-main-img', type: 'Image', props: { src: 'https://placehold.co/600x600?text=Produkt', alt: 'Produkt' }, style: { base: { width: '100%', borderRadius: 'xl', marginBottom: 'md' } }, actions: [], meta: { name: 'Main Image' }, children: [] },
                  {
                    id: 'detail-thumbs',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm' },
                    style: { base: { display: 'flex', gap: 'md' } },
                    actions: [],
                    meta: { name: 'Thumbnails' },
                    children: [
                      { id: 'detail-thumb1', type: 'Image', props: { src: 'https://placehold.co/100x100?text=1', alt: 'Thumb' }, style: { base: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'lg', border: '2px solid #e5e7eb', cursor: 'pointer' } }, actions: [], meta: { name: 'Thumb' }, children: [] },
                      { id: 'detail-thumb2', type: 'Image', props: { src: 'https://placehold.co/100x100?text=2', alt: 'Thumb' }, style: { base: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'lg', border: '2px solid #e5e7eb', cursor: 'pointer' } }, actions: [], meta: { name: 'Thumb' }, children: [] },
                      { id: 'detail-thumb3', type: 'Image', props: { src: 'https://placehold.co/100x100?text=3', alt: 'Thumb' }, style: { base: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'lg', border: '2px solid #e5e7eb', cursor: 'pointer' } }, actions: [], meta: { name: 'Thumb' }, children: [] },
                    ],
                  },
                ],
              },
              {
                id: 'shop-detail-info',
                type: 'Stack',
                props: { direction: 'column', gap: 'md' },
                style: { base: { display: 'flex', flexDirection: 'column', gap: 'md' } },
                actions: [],
                meta: { name: 'Info' },
                children: [
                  { id: 'detail-badge', type: 'Badge', props: { text: 'Bestseller', variant: 'secondary' }, style: { base: {} }, actions: [], meta: { name: 'Badge' }, children: [] },
                  { id: 'detail-title', type: 'Heading', props: { level: 1, text: 'Premium Produktname' }, style: { base: { fontSize: '3xl', fontWeight: 'bold' }, mobile: { fontSize: 'xl' } }, actions: [], meta: { name: 'Title' }, children: [] },
                  { id: 'detail-rating', type: 'Text', props: { text: '★★★★★ 4.9 (127 Bewertungen)' }, style: { base: { textColor: '#f59e0b', fontSize: 'sm' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                  { id: 'detail-price', type: 'Text', props: { text: '89,99 €' }, style: { base: { fontSize: '2xl', fontWeight: 'bold', textColor: '#111827' } }, actions: [], meta: { name: 'Price' }, children: [] },
                  { id: 'detail-desc', type: 'Text', props: { text: 'Hochwertige Verarbeitung aus premium Materialien. Perfekt für den täglichen Gebrauch. Schnelle Lieferung und kostenloser Versand ab 50€.' }, style: { base: { textColor: '#6b7280', lineHeight: 'relaxed' } }, actions: [], meta: { name: 'Description' }, children: [] },
                  { id: 'detail-cta', type: 'Button', props: { text: 'In den Warenkorb', variant: 'primary' }, style: { base: { width: '100%', padding: 'md', fontSize: 'base', fontWeight: 'semibold' } }, actions: [{ event: 'onClick', action: { type: 'addToCart', productId: '', quantity: 1 } }], meta: { name: 'Add to Cart' }, children: [] },
                  {
                    id: 'detail-trust',
                    type: 'Stack',
                    props: { direction: 'row', gap: 'lg' },
                    style: { base: { display: 'flex', gap: 'lg', marginTop: 'md', paddingTop: 'md', borderTop: '1px solid #e5e7eb' }, mobile: { flexDirection: 'column', gap: 'md' } },
                    actions: [],
                    meta: { name: 'Trust Info' },
                    children: [
                      { id: 'detail-trust1', type: 'Text', props: { text: '🚚 Kostenloser Versand' }, style: { base: { fontSize: 'sm', textColor: '#6b7280' } }, actions: [], meta: { name: 'Trust' }, children: [] },
                      { id: 'detail-trust2', type: 'Text', props: { text: '↩️ 30 Tage Rückgabe' }, style: { base: { fontSize: 'sm', textColor: '#6b7280' } }, actions: [], meta: { name: 'Trust' }, children: [] },
                      { id: 'detail-trust3', type: 'Text', props: { text: '🔒 Sichere Zahlung' }, style: { base: { fontSize: 'sm', textColor: '#6b7280' } }, actions: [], meta: { name: 'Trust' }, children: [] },
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

export const shopCategoryBanner: SectionTemplate = {
  id: 'shop-category-banner',
  name: 'Shop – Kategorie Banner',
  description: 'Großer Hero-Banner für Kategorie-Seiten mit Titel und Filteroptionen',
  category: 'ecommerce',
  tree: {
    id: 'shop-catbanner',
    type: 'Section',
    props: {},
    style: {
      base: { paddingY: '4xl', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textAlign: 'center' },
      mobile: { paddingY: 'xl' },
    },
    actions: [],
    meta: { name: 'Category Banner' },
    children: [
      {
        id: 'catbanner-container',
        type: 'Container',
        props: { maxWidth: 'lg', centered: true },
        style: { base: { paddingX: 'lg' }, mobile: { paddingX: 'md' } },
        actions: [],
        meta: { name: 'Container' },
        children: [
          { id: 'catbanner-title', type: 'Heading', props: { level: 1, text: 'Elektronik' }, style: { base: { textColor: '#ffffff', fontSize: '4xl', fontWeight: 'bold', marginBottom: 'md' }, mobile: { fontSize: '3xl' } }, actions: [], meta: { name: 'Title' }, children: [] },
          { id: 'catbanner-desc', type: 'Text', props: { text: 'Entdecke die neuesten Smartphones, Laptops, Gaming-Produkte und mehr' }, style: { base: { textColor: 'rgba(255,255,255,0.9)', fontSize: 'lg', marginBottom: 'xl' }, mobile: { fontSize: 'sm', marginBottom: 'lg' } }, actions: [], meta: { name: 'Description' }, children: [] },
          { id: 'catbanner-count', type: 'Text', props: { text: '247 Produkte' }, style: { base: { textColor: 'rgba(255,255,255,0.7)', fontSize: 'sm' } }, actions: [], meta: { name: 'Count' }, children: [] },
        ],
      },
    ],
  },
};

export const shopBestseller: SectionTemplate = {
  id: 'shop-bestseller',
  name: 'Shop – Bestseller Grid',
  description: '5-spaltiges Produkt-Grid mit Bestsellern, automatisch responsive',
  category: 'ecommerce',
  tree: {
    id: 'shop-best',
    type: 'Section',
    props: {},
    style: {
      base: { paddingY: '4xl', bgColor: '#ffffff' },
      mobile: { paddingY: 'xl' },
    },
    actions: [],
    meta: { name: 'Bestseller' },
    children: [
      {
        id: 'shop-best-container',
        type: 'Container',
        props: { maxWidth: 'xl', centered: true },
        style: { base: { paddingX: 'lg' }, mobile: { paddingX: 'md' } },
        actions: [],
        meta: { name: 'Container' },
        children: [
          {
            id: 'shop-best-header',
            type: 'Stack',
            props: { direction: 'row', justify: 'between', align: 'center' },
            style: {
              base: { display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 'xl' },
              mobile: { flexDirection: 'column', gap: 'md', marginBottom: 'lg' },
            },
            actions: [],
            meta: { name: 'Header' },
            children: [
              { id: 'shop-best-title', type: 'Heading', props: { level: 2, text: 'Bestseller' }, style: { base: { fontSize: '2xl', fontWeight: 'bold' }, mobile: { fontSize: 'lg' } }, actions: [], meta: { name: 'Title' }, children: [] },
              { id: 'shop-best-link', type: 'Link', props: { text: 'Alle anzeigen →', href: '#' }, style: { base: { textColor: '#111827', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Link' }, children: [] },
            ],
          },
          {
            id: 'shop-best-grid',
            type: 'Grid',
            props: { columns: 5, gap: 'md' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Grid' },
            children: [
              {
                id: 'best-prod1',
                type: 'Container',
                props: {},
                style: { base: { bgColor: '#f9fafb', borderRadius: 'lg', padding: 'md', border: '1px solid #e5e7eb' } },
                actions: [],
                meta: { name: 'Product' },
                children: [
                  { id: 'best-p1-img', type: 'Image', props: { src: 'https://placehold.co/300x300?text=Produkt', alt: 'Product' }, style: { base: { width: '100%', height: '140px', objectFit: 'cover', marginBottom: 'md', borderRadius: 'md' } }, actions: [], meta: { name: 'Image' }, children: [] },
                  { id: 'best-p1-name', type: 'Text', props: { text: 'Produktname' }, style: { base: { fontWeight: 'semibold', fontSize: 'sm', marginBottom: 'xs' } }, actions: [], meta: { name: 'Name' }, children: [] },
                  { id: 'best-p1-rating', type: 'Text', props: { text: '4.9 (847)' }, style: { base: { fontSize: 'xs', textColor: '#6b7280', marginBottom: 'sm' } }, actions: [], meta: { name: 'Rating' }, children: [] },
                  { id: 'best-p1-price', type: 'Text', props: { text: '199 €' }, style: { base: { fontWeight: 'bold', fontSize: 'base' } }, actions: [], meta: { name: 'Price' }, children: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// --------------------------------------------------------------------------
// SHOP HEADER
// --------------------------------------------------------------------------

export const shopHeader: SectionTemplate = {
  id: 'shop-header',
  name: 'Shop – Header Navigation',
  description: 'Sticky Header mit Logo, Navigation, Warenkorb und Login – mobiloptimiert',
  category: 'ecommerce',
  tree: {
    id: 'shop-header',
    type: 'Section',
    props: {},
    style: {
      base: {
        padding: 'md',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '0',
        backgroundColor: 'background',
      },
      mobile: { padding: 'sm' },
    },
    actions: [],
    meta: { name: 'Shop Header' },
    children: [
      {
        id: 'shop-header-container',
        type: 'Container',
        props: { maxWidth: '7xl', centered: true },
        style: {
          base: { display: 'flex', justifyContent: 'between', alignItems: 'center' },
        },
        actions: [],
        meta: { name: 'Header Container' },
        children: [
          {
            id: 'shop-header-logo',
            type: 'Heading',
            props: { level: 3, text: 'Mein Shop' },
            style: { base: { fontWeight: 'bold', fontSize: 'xl' } },
            actions: [],
            meta: { name: 'Logo' },
            children: [],
          },
          {
            id: 'shop-header-nav',
            type: 'Container',
            props: {},
            style: {
              base: { display: 'flex', gap: 'lg', alignItems: 'center' },
              mobile: { display: 'none' },
            },
            actions: [],
            meta: { name: 'Navigation' },
            children: [
              { id: 'nav-home', type: 'Link', props: { text: 'Home', href: '/' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Home Link' }, children: [] },
              { id: 'nav-products', type: 'Link', props: { text: 'Produkte', href: '/produkte' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Products Link' }, children: [] },
              { id: 'nav-categories', type: 'Link', props: { text: 'Kategorien', href: '/kategorien' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Categories Link' }, children: [] },
              { id: 'nav-sale', type: 'Link', props: { text: 'Sale', href: '/sale' }, style: { base: { fontSize: 'sm' } }, actions: [], meta: { name: 'Sale Link' }, children: [] },
            ],
          },
          {
            id: 'shop-header-actions',
            type: 'Container',
            props: {},
            style: { base: { display: 'flex', gap: 'sm', alignItems: 'center' } },
            actions: [],
            meta: { name: 'Actions' },
            children: [
              {
                id: 'shop-header-cart',
                type: 'Button',
                props: { text: '🛒 Warenkorb', variant: 'ghost' },
                style: { base: {}, mobile: { padding: 'xs' } },
                actions: [{ event: 'onClick', action: { type: 'navigate', to: '/warenkorb' } }],
                meta: { name: 'Cart Button' },
                children: [],
              },
              {
                id: 'shop-header-login',
                type: 'Button',
                props: { text: 'Anmelden', variant: 'outline' },
                style: { base: {}, mobile: { display: 'none' } },
                actions: [{ event: 'onClick', action: { type: 'navigate', to: '/login' } }],
                meta: { name: 'Login Button' },
                children: [],
              },
            ],
          },
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
  // E-Commerce / Shop
  shopHeader,
  shopHero,
  shopFeaturedProducts,
  shopCategories,
  shopSaleBanner,
  shopTestimonials,
  shopNewsletter,
  shopTrustBadges,
  shopFooter,
  // Additional Shop Sections
  shopFlashDeals,
  shopPromoGrid,
  shopProductDetail,
  shopCategoryBanner,
  shopBestseller,
];

// --------------------------------------------------------------------------
// AUTO-REGISTER in templateRegistry
// --------------------------------------------------------------------------

for (const tmpl of sectionTemplates) {
  const category = tmpl.category as TemplateDefinition['category'];
  const websiteTypes: TemplateDefinition['websiteTypes'] = category === 'ecommerce'
    ? ['ecommerce']
    : ['landing', 'business', 'saas'];

  templateRegistry.registerSection({
    id: tmpl.id,
    name: tmpl.name,
    description: tmpl.description,
    category,
    style: 'modern',
    websiteTypes,
    tags: [tmpl.category, tmpl.name.toLowerCase()],
    node: tmpl.tree,
  });
}
