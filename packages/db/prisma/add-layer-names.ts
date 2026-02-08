import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping von node.id -> beschreibender Name
const nodeNameMap: Record<string, string> = {
  // Header
  'root': 'Seiten-Wurzel',
  'header': 'Header / Navigation',
  'header-content': 'Header Inhalt',
  'header-logo': 'Logo Gruppe',
  'logo-icon': 'Logo Icon',
  'logo-text': 'Firmenname',
  'header-nav': 'Navigation Links',
  'nav-1': 'Link: Leistungen',
  'nav-2': 'Link: Referenzen',
  'nav-3': 'Link: Über uns',
  'nav-4': 'Link: Kontakt',
  'header-cta': 'Header CTA Bereich',
  'header-phone': 'Telefonnummer',
  'header-btn': 'Angebot Button',

  // Hero Section
  'hero-section': 'Hero Bereich',
  'hero-content': 'Hero Inhalt',
  'hero-left': 'Hero Text Seite',
  'hero-badge': 'Meisterbetrieb Badge',
  'hero-title': 'Hauptüberschrift',
  'hero-subtitle': 'Hero Beschreibung',
  'hero-buttons': 'Hero Buttons',
  'hero-cta-1': 'Primärer CTA Button',
  'hero-cta-2': 'Sekundärer CTA Button',
  'hero-trust': 'Vertrauens-Indikatoren',
  'hero-right': 'Hero Bild Seite',
  'hero-image-wrapper': 'Bild Container',
  'hero-image': 'Hero Bild',

  // Services Section
  'services-section': 'Leistungen Bereich',
  'services-content': 'Leistungen Inhalt',
  'services-header': 'Leistungen Header',
  'services-badge': 'Leistungen Badge',
  'services-title': 'Leistungen Überschrift',
  'services-subtitle': 'Leistungen Beschreibung',
  'services-grid': 'Leistungen Grid',
  'service-card-1': 'Leistung: Renovierung',
  'service-card-2': 'Leistung: Neubau',
  'service-card-3': 'Leistung: Sanierung',
  'service-card-4': 'Leistung: Reparatur',
  'service-card-5': 'Leistung: Beratung',
  'service-card-6': 'Leistung: Notdienst',

  // Portfolio Section
  'portfolio-section': 'Referenzen Bereich',
  'portfolio-content': 'Referenzen Inhalt',
  'portfolio-header': 'Referenzen Header',
  'portfolio-badge': 'Referenzen Badge',
  'portfolio-title': 'Referenzen Überschrift',
  'portfolio-subtitle': 'Referenzen Beschreibung',
  'portfolio-grid': 'Referenzen Grid',
  'portfolio-item-1': 'Projekt: Villa Sonnenberg',
  'portfolio-item-2': 'Projekt: Altbau-Sanierung',
  'portfolio-item-3': 'Projekt: Bürogebäude',

  // About Section
  'about-section': 'Über uns Bereich',
  'about-content': 'Über uns Inhalt',
  'about-left': 'Über uns Bilder',
  'about-image': 'Team Bild',
  'about-right': 'Über uns Text',
  'about-badge': 'Über uns Badge',
  'about-title': 'Über uns Überschrift',
  'about-text': 'Über uns Beschreibung',
  'about-stats': 'Statistiken',

  // Testimonials Section
  'testimonials-section': 'Kundenstimmen Bereich',
  'testimonials-content': 'Kundenstimmen Inhalt',
  'testimonials-header': 'Kundenstimmen Header',
  'testimonials-title': 'Kundenstimmen Überschrift',
  'testimonials-grid': 'Kundenstimmen Grid',
  'testimonial-1': 'Bewertung: Familie Müller',
  'testimonial-2': 'Bewertung: Hr. Schmidt',
  'testimonial-3': 'Bewertung: Fr. Weber',

  // CTA Section
  'cta-section': 'Kontakt Bereich',
  'cta-content': 'Kontakt Inhalt',
  'cta-left': 'Kontakt Text',
  'cta-title': 'Kontakt Überschrift',
  'cta-text': 'Kontakt Beschreibung',
  'cta-features': 'Kontakt Vorteile',
  'cta-right': 'Kontaktformular',
  'contact-form': 'Formular',
  'form-name': 'Eingabe: Name',
  'form-email': 'Eingabe: E-Mail',
  'form-phone': 'Eingabe: Telefon',
  'form-message': 'Eingabe: Nachricht',
  'form-submit': 'Absenden Button',

  // Footer
  'footer-section': 'Footer Bereich',
  'footer-content': 'Footer Inhalt',
  'footer-main': 'Footer Hauptbereich',
  'footer-col-1': 'Footer: Firmeninfo',
  'footer-col-2': 'Footer: Leistungen',
  'footer-col-3': 'Footer: Rechtliches',
  'footer-col-4': 'Footer: Kontakt',
  'footer-bottom': 'Footer Copyright',
};

// Rekursive Funktion um Namen hinzuzufügen - IMMER generieren basierend auf Inhalt
function addNamesToTree(node: any, depth: number = 0, index: number = 0): any {
  if (!node) return node;

  // IMMER einen beschreibenden Namen generieren basierend auf props/type
  let generatedName = node.type;
  
  // Spezifische Namen basierend auf Inhalt
  if (node.type === 'Link' && node.props?.text) {
    generatedName = `Link: ${node.props.text}`;
  } else if (node.type === 'Button' && node.props?.text) {
    generatedName = `${node.props.text}`;
  } else if (node.type === 'Heading' && node.props?.text) {
    const shortText = node.props.text.substring(0, 40);
    generatedName = `${shortText}${node.props.text.length > 40 ? '...' : ''}`;
  } else if (node.type === 'Text' && node.props?.text) {
    const shortText = node.props.text.substring(0, 35);
    generatedName = `${shortText}${node.props.text.length > 35 ? '...' : ''}`;
  } else if (node.type === 'Image') {
    generatedName = node.props?.alt || 'Bild';
  } else if (node.type === 'Input') {
    generatedName = node.props?.label || node.props?.placeholder || 'Eingabefeld';
  } else if (node.type === 'Textarea') {
    generatedName = node.props?.label || node.props?.placeholder || 'Textbereich';
  } else if (node.type === 'Form') {
    generatedName = 'Kontaktformular';
  } else if (node.type === 'Section') {
    // Versuche den Zweck der Section zu erkennen
    if (depth === 0) {
      generatedName = 'Seite';
    } else if (depth === 1) {
      // Erste Ebene Sections - basierend auf Position
      const sectionNames = ['Header', 'Hero', 'Statistiken', 'Leistungen', 'Referenzen', 'Über uns', 'Kundenstimmen', 'Kontakt', 'Footer'];
      generatedName = sectionNames[index] || `Bereich ${index + 1}`;
    } else {
      generatedName = 'Bereich';
    }
  } else if (node.type === 'Container') {
    generatedName = 'Container';
  } else if (node.type === 'Stack') {
    const childCount = node.children?.length || 0;
    if (node.props?.direction === 'row') {
      generatedName = `Zeile (${childCount} Elemente)`;
    } else {
      generatedName = `Spalte (${childCount} Elemente)`;
    }
  } else if (node.type === 'Grid') {
    generatedName = `Raster ${node.props?.columns || 2}x`;
  } else if (node.type === 'Card') {
    generatedName = 'Karte';
  } else if (node.type === 'Badge' && node.props?.text) {
    generatedName = node.props.text;
  } else if (node.type === 'Counter' && node.props?.prefix) {
    generatedName = `Zähler: ${node.props.prefix}`;
  } else if (node.type === 'Counter' && node.props?.suffix) {
    generatedName = `Zähler: ${node.props.suffix}`;
  } else if (node.type === 'Icon' && node.props?.name) {
    generatedName = `Icon: ${node.props.name}`;
  } else if (node.type === 'Divider') {
    generatedName = 'Trennlinie';
  } else if (node.type === 'Spacer') {
    generatedName = 'Abstand';
  } else if (node.type === 'Avatar') {
    generatedName = node.props?.name || 'Avatar';
  } else if (node.type === 'Rating') {
    generatedName = 'Bewertung';
  } else if (node.type === 'Quote' && node.props?.text) {
    const shortText = node.props.text.substring(0, 30);
    generatedName = `"${shortText}..."`;
  } else if (node.type === 'FeatureCard' && node.props?.title) {
    generatedName = node.props.title;
  } else if (node.type === 'PricingCard' && node.props?.title) {
    generatedName = `Preis: ${node.props.title}`;
  } else if (node.type === 'TestimonialCard' && node.props?.author) {
    generatedName = `Bewertung von ${node.props.author}`;
  } else if (node.type === 'Navbar') {
    generatedName = 'Navigation';
  } else if (node.type === 'Footer') {
    generatedName = 'Footer';
  }
  
  // Meta setzen
  node.meta = { ...node.meta, name: generatedName };

  // Rekursiv für Kinder mit Index
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map((child: any, childIndex: number) => 
      addNamesToTree(child, depth + 1, childIndex)
    );
  }

  return node;
}

async function main() {
  console.log('🔍 Finding all pages with builderTree...');

  // Alle Pages mit builderTree finden
  const pages = await prisma.page.findMany({
    where: {
      builderTree: { not: null }
    },
    select: {
      id: true,
      name: true,
      builderTree: true,
      site: {
        select: { name: true }
      }
    }
  });

  console.log(`📝 Found ${pages.length} pages to update`);

  for (const page of pages) {
    console.log(`\n➡️  Updating: ${page.site?.name} / ${page.name}`);
    
    try {
      const tree = page.builderTree as any;
      if (!tree?.root) {
        console.log('   ⚠️  No root in tree, skipping');
        continue;
      }

      // Namen hinzufügen
      const updatedTree = {
        ...tree,
        root: addNamesToTree(tree.root)
      };

      // In DB speichern
      await prisma.page.update({
        where: { id: page.id },
        data: { builderTree: updatedTree }
      });

      console.log('   ✅ Updated successfully');
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }

  // Auch Templates aktualisieren
  console.log('\n🔍 Finding all templates...');
  const templates = await prisma.template.findMany({
    where: {
      tree: { not: null }
    },
    select: {
      id: true,
      name: true,
      tree: true,
    }
  });

  console.log(`📝 Found ${templates.length} templates to update`);

  for (const template of templates) {
    console.log(`\n➡️  Updating template: ${template.name}`);
    
    try {
      const tree = template.tree as any;
      if (!tree?.root) {
        console.log('   ⚠️  No root in tree, skipping');
        continue;
      }

      // Namen hinzufügen
      const updatedTree = {
        ...tree,
        root: addNamesToTree(tree.root)
      };

      // In DB speichern
      await prisma.template.update({
        where: { id: template.id },
        data: { tree: updatedTree }
      });

      console.log('   ✅ Updated successfully');
    } catch (error) {
      console.error(`   ❌ Error:`, error);
    }
  }

  console.log('\n✨ Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
