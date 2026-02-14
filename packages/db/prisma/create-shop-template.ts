import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

const shopTemplate = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: { minHeight: 'screen' },
    style: { 
      base: { 
        bgColor: '#fafafa',
        textColor: '#171717',
      }
    },
    actions: [],
    meta: { name: 'Shop Seite' },
    children: [
      // ========== HEADER ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#ffffff',
            paddingY: 'md',
            paddingX: 'lg',
            borderBottom: '1px solid #e5e5e5',
          }
        },
        actions: [],
        meta: { name: 'Header' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Header Container' },
            children: [
              {
                id: generateId(),
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center', gap: 'lg' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Header Layout' },
                children: [
                  // Logo
                  {
                    id: generateId(),
                    type: 'Heading',
                    props: { level: 4, text: 'STUDIO' },
                    style: { base: { fontWeight: 'bold', letterSpacing: '0.2em', fontSize: 'lg' } },
                    actions: [],
                    meta: { name: 'Logo' },
                    children: [],
                  },
                  // Navigation
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'row', align: 'center', gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Hauptnavigation' },
                    children: [
                      { id: generateId(), type: 'Link', props: { text: 'Neu', href: '#new' }, style: { base: { textColor: '#171717', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Link: Neu' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Kollektion', href: '#collection' }, style: { base: { textColor: '#171717', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Link: Kollektion' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Sale', href: '#sale' }, style: { base: { textColor: '#dc2626', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Link: Sale' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Über uns', href: '#about' }, style: { base: { textColor: '#171717', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Link: Über uns' }, children: [] },
                    ],
                  },
                  // Aktionen
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'row', align: 'center', gap: 'md' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Header Aktionen' },
                    children: [
                      { id: generateId(), type: 'Button', props: { text: '🔍', variant: 'ghost', size: 'sm' }, style: { base: {} }, actions: [], meta: { name: 'Suche Button' }, children: [] },
                      { id: generateId(), type: 'Button', props: { text: '♡', variant: 'ghost', size: 'sm' }, style: { base: {} }, actions: [], meta: { name: 'Wunschliste Button' }, children: [] },
                      { id: generateId(), type: 'Button', props: { text: 'Warenkorb (0)', variant: 'outline', size: 'sm' }, style: { base: { borderColor: '#171717', textColor: '#171717' } }, actions: [], meta: { name: 'Warenkorb Button' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== HERO ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'half' },
        style: { 
          base: { 
            bgColor: '#f5f5f5',
            paddingY: '3xl',
          }
        },
        actions: [],
        meta: { name: 'Hero Banner' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Hero Container' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: { columns: 2, gap: 'xl' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Hero 2-Spalten' },
                children: [
                  // Text
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'lg', justify: 'center' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Hero Text' },
                    children: [
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'Frühjahr 2026' },
                        style: { base: { fontSize: 'sm', textColor: '#737373', letterSpacing: '0.1em', textTransform: 'uppercase' } },
                        actions: [],
                        meta: { name: 'Saison Label' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Heading',
                        props: { level: 1, text: 'Neue Kollektion' },
                        style: { base: { fontSize: '4xl', fontWeight: 'light', lineHeight: 'tight' } },
                        actions: [],
                        meta: { name: 'Hero Überschrift' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Text',
                        props: { text: 'Zeitlose Designs für den modernen Alltag. Handgefertigt mit Liebe zum Detail.' },
                        style: { base: { fontSize: 'lg', textColor: '#525252', lineHeight: 'relaxed' } },
                        actions: [],
                        meta: { name: 'Hero Beschreibung' },
                        children: [],
                      },
                      {
                        id: generateId(),
                        type: 'Stack',
                        props: { direction: 'row', gap: 'md' },
                        style: { base: { marginTop: 'md' } },
                        actions: [],
                        meta: { name: 'Hero Buttons' },
                        children: [
                          {
                            id: generateId(),
                            type: 'Button',
                            props: { text: 'Jetzt entdecken', variant: 'primary', size: 'lg' },
                            style: { base: { bgColor: '#171717', textColor: '#ffffff', paddingX: 'xl' } },
                            actions: [],
                            meta: { name: 'CTA: Jetzt entdecken' },
                            children: [],
                          },
                          {
                            id: generateId(),
                            type: 'Button',
                            props: { text: 'Lookbook ansehen', variant: 'ghost', size: 'lg' },
                            style: { base: { textColor: '#171717' } },
                            actions: [],
                            meta: { name: 'CTA: Lookbook' },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                  // Bild
                  {
                    id: generateId(),
                    type: 'Image',
                    props: { 
                      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', 
                      alt: 'Neue Kollektion',
                      aspectRatio: '4/5',
                    },
                    style: { base: { borderRadius: 'none', objectFit: 'cover' } },
                    actions: [],
                    meta: { name: 'Hero Bild' },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== KATEGORIEN ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#ffffff',
            paddingY: '2xl',
          }
        },
        actions: [],
        meta: { name: 'Kategorien Bereich' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Kategorien Container' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Kategorien Grid' },
                children: [
                  // Kategorie 1
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm', align: 'center' },
                    style: { base: { cursor: 'pointer' } },
                    actions: [],
                    meta: { name: 'Kategorie: Oberteile' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80', alt: 'Oberteile', aspectRatio: '1/1' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Bild: Oberteile' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Oberteile' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Label: Oberteile' }, children: [] },
                    ],
                  },
                  // Kategorie 2
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm', align: 'center' },
                    style: { base: { cursor: 'pointer' } },
                    actions: [],
                    meta: { name: 'Kategorie: Hosen' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', alt: 'Hosen', aspectRatio: '1/1' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Bild: Hosen' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Hosen' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Label: Hosen' }, children: [] },
                    ],
                  },
                  // Kategorie 3
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm', align: 'center' },
                    style: { base: { cursor: 'pointer' } },
                    actions: [],
                    meta: { name: 'Kategorie: Kleider' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', alt: 'Kleider', aspectRatio: '1/1' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Bild: Kleider' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Kleider' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Label: Kleider' }, children: [] },
                    ],
                  },
                  // Kategorie 4
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm', align: 'center' },
                    style: { base: { cursor: 'pointer' } },
                    actions: [],
                    meta: { name: 'Kategorie: Accessoires' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80', alt: 'Accessoires', aspectRatio: '1/1' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Bild: Accessoires' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Accessoires' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Label: Accessoires' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== PRODUKTE ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#fafafa',
            paddingY: '2xl',
          }
        },
        actions: [],
        meta: { name: 'Produkte Bereich' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Produkte Container' },
            children: [
              // Header
              {
                id: generateId(),
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { marginBottom: 'xl' } },
                actions: [],
                meta: { name: 'Produkte Header' },
                children: [
                  { id: generateId(), type: 'Heading', props: { level: 2, text: 'Bestseller' }, style: { base: { fontSize: '2xl', fontWeight: 'light' } }, actions: [], meta: { name: 'Produkte Überschrift' }, children: [] },
                  { id: generateId(), type: 'Link', props: { text: 'Alle ansehen →', href: '#all' }, style: { base: { textColor: '#171717', fontSize: 'sm' } }, actions: [], meta: { name: 'Link: Alle ansehen' }, children: [] },
                ],
              },
              // Produkt Grid
              {
                id: generateId(),
                type: 'Grid',
                props: { columns: 4, gap: 'lg' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Produkt Grid' },
                children: [
                  // Produkt 1
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Produkt: Leinenhemd' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', alt: 'Leinenhemd', aspectRatio: '3/4' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Produktbild' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Leinenhemd Classic' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Produktname' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '89,00 €' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                    ],
                  },
                  // Produkt 2
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Produkt: Wollpullover' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', alt: 'Wollpullover', aspectRatio: '3/4' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Produktbild' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Wollpullover Merino' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Produktname' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '149,00 €' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                    ],
                  },
                  // Produkt 3
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Produkt: Chinohose' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80', alt: 'Chinohose', aspectRatio: '3/4' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Produktbild' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Chinohose Slim' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Produktname' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '79,00 €' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                    ],
                  },
                  // Produkt 4
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Produkt: Seidenbluse' },
                    children: [
                      { id: generateId(), type: 'Image', props: { src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&q=80', alt: 'Seidenbluse', aspectRatio: '3/4' }, style: { base: { borderRadius: 'sm' } }, actions: [], meta: { name: 'Produktbild' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Seidenbluse Elegance' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Produktname' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '129,00 €' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Preis' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== FEATURES ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#171717',
            textColor: '#ffffff',
            paddingY: 'xl',
          }
        },
        actions: [],
        meta: { name: 'Vorteile Banner' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Vorteile Container' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: { columns: 4, gap: 'xl' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Vorteile Grid' },
                children: [
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xs', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    meta: { name: 'Vorteil: Versand' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: '🚚' }, style: { base: { fontSize: 'xl' } }, actions: [], meta: { name: 'Icon Versand' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Kostenloser Versand' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Titel Versand' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Ab 50€ Bestellwert' }, style: { base: { fontSize: 'xs', textColor: '#a3a3a3' } }, actions: [], meta: { name: 'Details Versand' }, children: [] },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xs', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    meta: { name: 'Vorteil: Rückgabe' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: '↩️' }, style: { base: { fontSize: 'xl' } }, actions: [], meta: { name: 'Icon Rückgabe' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '30 Tage Rückgabe' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Titel Rückgabe' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Kostenlos & unkompliziert' }, style: { base: { fontSize: 'xs', textColor: '#a3a3a3' } }, actions: [], meta: { name: 'Details Rückgabe' }, children: [] },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xs', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    meta: { name: 'Vorteil: Qualität' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: '✨' }, style: { base: { fontSize: 'xl' } }, actions: [], meta: { name: 'Icon Qualität' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Premium Qualität' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Titel Qualität' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Handverlesene Materialien' }, style: { base: { fontSize: 'xs', textColor: '#a3a3a3' } }, actions: [], meta: { name: 'Details Qualität' }, children: [] },
                    ],
                  },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xs', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    meta: { name: 'Vorteil: Support' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: '💬' }, style: { base: { fontSize: 'xl' } }, actions: [], meta: { name: 'Icon Support' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Persönliche Beratung' }, style: { base: { fontSize: 'sm', fontWeight: 'medium' } }, actions: [], meta: { name: 'Titel Support' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Mo-Fr 9-18 Uhr' }, style: { base: { fontSize: 'xs', textColor: '#a3a3a3' } }, actions: [], meta: { name: 'Details Support' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== NEWSLETTER ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#f5f5f5',
            paddingY: '2xl',
          }
        },
        actions: [],
        meta: { name: 'Newsletter Bereich' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'md' },
            style: { base: { textAlign: 'center' } },
            actions: [],
            meta: { name: 'Newsletter Container' },
            children: [
              {
                id: generateId(),
                type: 'Stack',
                props: { direction: 'column', gap: 'lg', align: 'center' },
                style: { base: {} },
                actions: [],
                meta: { name: 'Newsletter Inhalt' },
                children: [
                  { id: generateId(), type: 'Heading', props: { level: 2, text: 'Newsletter' }, style: { base: { fontSize: '2xl', fontWeight: 'light' } }, actions: [], meta: { name: 'Newsletter Überschrift' }, children: [] },
                  { id: generateId(), type: 'Text', props: { text: 'Erhalte 10% Rabatt auf deine erste Bestellung und bleib über neue Kollektionen informiert.' }, style: { base: { textColor: '#525252' } }, actions: [], meta: { name: 'Newsletter Text' }, children: [] },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm' },
                    style: { base: { width: '100%', maxWidth: '400px' } },
                    actions: [],
                    meta: { name: 'Newsletter Formular' },
                    children: [
                      { id: generateId(), type: 'Input', props: { placeholder: 'E-Mail Adresse', type: 'email' }, style: { base: { flex: '1', borderColor: '#d4d4d4' } }, actions: [], meta: { name: 'E-Mail Eingabe' }, children: [] },
                      { id: generateId(), type: 'Button', props: { text: 'Anmelden', variant: 'primary' }, style: { base: { bgColor: '#171717', textColor: '#ffffff' } }, actions: [], meta: { name: 'Anmelden Button' }, children: [] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },

      // ========== FOOTER ==========
      {
        id: generateId(),
        type: 'Section',
        props: { minHeight: 'auto' },
        style: { 
          base: { 
            bgColor: '#ffffff',
            paddingY: '2xl',
            paddingX: 'lg',
            borderTop: '1px solid #e5e5e5',
          }
        },
        actions: [],
        meta: { name: 'Footer' },
        children: [
          {
            id: generateId(),
            type: 'Container',
            props: { maxWidth: 'xl' },
            style: { base: {} },
            actions: [],
            meta: { name: 'Footer Container' },
            children: [
              {
                id: generateId(),
                type: 'Grid',
                props: { columns: 4, gap: 'xl' },
                style: { base: { marginBottom: 'xl' } },
                actions: [],
                meta: { name: 'Footer Spalten' },
                children: [
                  // Spalte 1
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'md' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Shop Info' },
                    children: [
                      { id: generateId(), type: 'Heading', props: { level: 4, text: 'STUDIO' }, style: { base: { fontWeight: 'bold', letterSpacing: '0.2em', fontSize: 'sm' } }, actions: [], meta: { name: 'Footer Logo' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: 'Zeitlose Mode für den modernen Menschen. Nachhaltig produziert in Europa.' }, style: { base: { fontSize: 'sm', textColor: '#525252', lineHeight: 'relaxed' } }, actions: [], meta: { name: 'Shop Beschreibung' }, children: [] },
                    ],
                  },
                  // Spalte 2
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Shop Links' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: 'Shop' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], meta: { name: 'Überschrift: Shop' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Neuheiten', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Neuheiten' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Bestseller', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Bestseller' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Sale', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Sale' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Geschenkgutscheine', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Gutscheine' }, children: [] },
                    ],
                  },
                  // Spalte 3
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Hilfe Links' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: 'Hilfe' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], meta: { name: 'Überschrift: Hilfe' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Versand & Lieferung', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Versand' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Rückgabe', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Rückgabe' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Größenberatung', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Größen' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Kontakt', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Kontakt' }, children: [] },
                    ],
                  },
                  // Spalte 4
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Footer: Rechtliches' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: 'Rechtliches' }, style: { base: { fontSize: 'sm', fontWeight: 'semibold', marginBottom: 'xs' } }, actions: [], meta: { name: 'Überschrift: Rechtliches' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Impressum', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Impressum' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Datenschutz', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Datenschutz' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'AGB', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: AGB' }, children: [] },
                      { id: generateId(), type: 'Link', props: { text: 'Widerruf', href: '#' }, style: { base: { fontSize: 'sm', textColor: '#525252' } }, actions: [], meta: { name: 'Link: Widerruf' }, children: [] },
                    ],
                  },
                ],
              },
              // Copyright
              {
                id: generateId(),
                type: 'Stack',
                props: { direction: 'row', justify: 'between', align: 'center' },
                style: { base: { paddingTop: 'lg', borderTop: '1px solid #e5e5e5' } },
                actions: [],
                meta: { name: 'Copyright Zeile' },
                children: [
                  { id: generateId(), type: 'Text', props: { text: '© 2026 STUDIO. Alle Rechte vorbehalten.' }, style: { base: { fontSize: 'xs', textColor: '#737373' } }, actions: [], meta: { name: 'Copyright Text' }, children: [] },
                  {
                    id: generateId(),
                    type: 'Stack',
                    props: { direction: 'row', gap: 'sm' },
                    style: { base: {} },
                    actions: [],
                    meta: { name: 'Zahlungsarten' },
                    children: [
                      { id: generateId(), type: 'Text', props: { text: '💳 Visa' }, style: { base: { fontSize: 'xs', textColor: '#737373' } }, actions: [], meta: { name: 'Visa' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '💳 Mastercard' }, style: { base: { fontSize: 'xs', textColor: '#737373' } }, actions: [], meta: { name: 'Mastercard' }, children: [] },
                      { id: generateId(), type: 'Text', props: { text: '💳 PayPal' }, style: { base: { fontSize: 'xs', textColor: '#737373' } }, actions: [], meta: { name: 'PayPal' }, children: [] },
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
  console.log('🛍️ Creating Shop Template...');

  // Prüfen ob bereits existiert
  const existing = await prisma.template.findFirst({
    where: { name: 'Minimalist Shop' }
  });

  if (existing) {
    console.log('📝 Updating existing template...');
    await prisma.template.update({
      where: { id: existing.id },
      data: { tree: shopTemplate }
    });
  } else {
    console.log('✨ Creating new template...');
    await prisma.template.create({
      data: {
        name: 'Minimalist Shop',
        slug: 'minimalist-shop',
        description: 'Minimalistisches Shop-Layout mit klarem Design',
        category: 'ECOMMERCE',
        tree: shopTemplate,
        isPublished: true,
        isPro: false,
      }
    });
  }

  // Auch die aktuelle Seite aktualisieren
  console.log('\n📄 Updating current page...');
  const page = await prisma.page.findFirst({
    where: { name: 'Home' }
  });

  if (page) {
    await prisma.page.update({
      where: { id: page.id },
      data: { builderTree: shopTemplate }
    });
    console.log('✅ Page updated!');
  }

  console.log('\n✨ Done! Refresh the editor to see the new design.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
