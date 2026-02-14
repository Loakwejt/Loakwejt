import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding template...');
  
  const template = await prisma.template.findFirst({
    where: { name: 'Handwerker Deluxe' }
  });
  
  if (!template) {
    console.log('❌ Template not found');
    return;
  }
  
  console.log('📝 Updating template...');
  
  await prisma.template.update({
    where: { id: template.id },
    data: {
      tree: {
        builderVersion: 1,
        root: {
          id: 'root',
          type: 'Section',
          props: { minHeight: 'auto' },
          style: {
            base: {
              backgroundColor: '#0a0a0f',
              color: '#ffffff',
              padding: 'none',
            },
          },
          actions: [],
          children: [
            // HEADER / NAVIGATION
            {
              id: 'header',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: 'rgba(10, 10, 15, 0.95)',
                  backdropBlur: 'lg',
                  paddingY: 'sm',
                  paddingX: 'lg',
                  position: 'sticky',
                },
              },
              actions: [],
              children: [
                {
                  id: 'header-content',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center', gap: 'lg' },
                  style: { base: { width: '100%' } },
                  actions: [],
                  children: [
                    // Logo
                    {
                      id: 'header-logo',
                      type: 'Stack',
                      props: { direction: 'row', align: 'center', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'logo-icon', type: 'Text', props: { text: '🛠️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                        { id: 'logo-text', type: 'Heading', props: { level: 4, text: 'MeisterWerk' }, style: { base: { color: '#f59e0b', fontWeight: 'bold', fontSize: 'xl' } }, actions: [], children: [] },
                      ],
                    },
                    // Navigation Links
                    {
                      id: 'header-nav',
                      type: 'Stack',
                      props: { direction: 'row', align: 'center', gap: 'lg' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'nav-1', type: 'Link', props: { text: 'Leistungen', href: '#services' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 'sm', fontWeight: 'medium' } }, actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'services-section', behavior: 'smooth' } }], children: [] },
                        { id: 'nav-2', type: 'Link', props: { text: 'Referenzen', href: '#portfolio' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 'sm', fontWeight: 'medium' } }, actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'portfolio-section', behavior: 'smooth' } }], children: [] },
                        { id: 'nav-3', type: 'Link', props: { text: 'Über uns', href: '#about' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 'sm', fontWeight: 'medium' } }, actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'about-section', behavior: 'smooth' } }], children: [] },
                        { id: 'nav-4', type: 'Link', props: { text: 'Kontakt', href: '#cta' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 'sm', fontWeight: 'medium' } }, actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'cta-section', behavior: 'smooth' } }], children: [] },
                      ],
                    },
                    // CTA Button
                    {
                      id: 'header-cta',
                      type: 'Stack',
                      props: { direction: 'row', align: 'center', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'header-phone', type: 'Text', props: { text: '📞 0800 123 4567' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'header-btn', type: 'Button', props: { text: 'Angebot anfordern', variant: 'primary', size: 'sm' }, style: { base: { backgroundColor: '#f59e0b', color: '#0a0a0f', fontWeight: 'semibold', borderRadius: 'lg' } }, actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'cta-section', behavior: 'smooth' } }], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // HERO SECTION
            {
              id: 'hero-section',
              type: 'Section',
              props: { minHeight: 'half', verticalAlign: 'center' },
              style: {
                base: {
                  gradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #2d1b4e 50%, #1a1a2e 75%, #0a0a0f 100%)',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'hero-content',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', justify: 'center', gap: 'md' },
                  style: { base: { width: '100%' } },
                  actions: [],
                  children: [
                    // Badge
                    {
                      id: 'hero-badge-inner',
                      type: 'Badge',
                      props: { text: '⚡ 24/7 Notdienst verfügbar', variant: 'outline' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          borderColor: '#f59e0b',
                          color: '#f59e0b',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                    // Main Headline
                    {
                      id: 'hero-headline',
                      type: 'Heading',
                      props: { level: 1, text: 'Handwerkskunst auf höchstem Niveau' },
                      style: {
                        base: {
                          textAlign: 'center',
                          fontSize: '4xl',
                          fontWeight: 'bold',
                          color: '#ffffff',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                    // Accent line
                    {
                      id: 'hero-accent',
                      type: 'Heading',
                      props: { level: 2, text: 'Meisterbetrieb seit 2003' },
                      style: {
                        base: {
                          textAlign: 'center',
                          color: '#f59e0b',
                          fontSize: 'xl',
                          fontWeight: 'semibold',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                    // Subtitle
                    {
                      id: 'hero-subtitle',
                      type: 'Text',
                      props: { text: 'Von der Reparatur bis zur Komplettsanierung – wir sind Ihre Experten für alle Gewerke. Schnell, zuverlässig und mit einer Qualitätsgarantie.' },
                      style: {
                        base: {
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: 'lg',
                        },
                      },
                      actions: [],
                      children: [],
                    },
                    // CTA Buttons
                    {
                      id: 'hero-cta',
                      type: 'Stack',
                      props: { direction: 'row', justify: 'center', align: 'center', gap: 'md' },
                      style: { base: { width: '100%' } },
                      actions: [],
                      children: [
                        {
                          id: 'hero-btn-primary',
                          type: 'Button',
                          props: { text: 'Kostenloses Angebot', variant: 'primary', size: 'lg' },
                          style: {
                            base: {
                              backgroundColor: '#f59e0b',
                              color: '#0a0a0f',
                              fontWeight: 'bold',
                              borderRadius: 'xl',
                              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.35)',
                            },
                          },
                          actions: [{ event: 'onClick', action: { type: 'scrollTo', targetId: 'cta-section', behavior: 'smooth' } }],
                          children: [],
                        },
                        {
                          id: 'hero-btn-secondary',
                          type: 'Button',
                          props: { text: 'Jetzt anrufen', variant: 'outline', size: 'lg' },
                          style: {
                            base: {
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              borderColor: 'rgba(255, 255, 255, 0.25)',
                              color: '#ffffff',
                              borderRadius: 'xl',
                            },
                          },
                          actions: [{ event: 'onClick', action: { type: 'navigate', to: 'tel:+4980012345678', target: '_self' } }],
                          children: [],
                        },
                      ],
                    },
                    // Trust badges in one horizontal line
                    {
                      id: 'hero-trust',
                      type: 'Stack',
                      props: { direction: 'row', justify: 'center', align: 'center', gap: 'lg' },
                      style: { base: { marginTop: 'md' } },
                      actions: [],
                      children: [
                        { id: 'trust-1', type: 'Text', props: { text: '✓ Meisterbetrieb' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'trust-2', type: 'Text', props: { text: '✓ TÜV geprüft' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'trust-3', type: 'Text', props: { text: '✓ 5-Sterne Bewertungen' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'trust-4', type: 'Text', props: { text: '✓ Faire Festpreise' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // STATS SECTION
            {
              id: 'stats-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0f0f14',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'stats-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: 'stat-1',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'xs' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's1-icon', type: 'Text', props: { text: '⏱️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                        { id: 's1-value', type: 'Heading', props: { level: 2, text: '20+' }, style: { base: { color: '#f59e0b', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
                        { id: 's1-label', type: 'Text', props: { text: 'Jahre Erfahrung' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm', textAlign: 'center' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'stat-2',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'xs' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's2-icon', type: 'Text', props: { text: '👥' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                        { id: 's2-value', type: 'Heading', props: { level: 2, text: '2.500+' }, style: { base: { color: '#f59e0b', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
                        { id: 's2-label', type: 'Text', props: { text: 'Zufriedene Kunden' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm', textAlign: 'center' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'stat-3',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'xs' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's3-icon', type: 'Text', props: { text: '🏆' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                        { id: 's3-value', type: 'Heading', props: { level: 2, text: '15' }, style: { base: { color: '#f59e0b', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
                        { id: 's3-label', type: 'Text', props: { text: 'Fachbereiche' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm', textAlign: 'center' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'stat-4',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'xs' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          borderColor: 'rgba(245, 158, 11, 0.3)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 's4-icon', type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                        { id: 's4-value', type: 'Heading', props: { level: 2, text: '24/7' }, style: { base: { color: '#f59e0b', fontSize: '2xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
                        { id: 's4-label', type: 'Text', props: { text: 'Notdienst' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm', textAlign: 'center' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // SERVICES SECTION
            {
              id: 'services-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0a0a0f',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                // Header
                {
                  id: 'services-header',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'sm' },
                  style: { base: { marginBottom: 'xl' } },
                  actions: [],
                  children: [
                    { id: 'services-badge', type: 'Badge', props: { text: 'LEISTUNGEN', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                    { id: 'services-title', type: 'Heading', props: { level: 2, text: 'Alles aus einer Hand' }, style: { base: { fontSize: '3xl', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }, actions: [], children: [] },
                    { id: 'services-subtitle', type: 'Text', props: { text: 'Von kleinen Reparaturen bis zur kompletten Sanierung' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' } }, actions: [], children: [] },
                  ],
                },
                // Grid
                {
                  id: 'services-grid',
                  type: 'Grid',
                  props: { columns: 3, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: 'service-1',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.03) 100%)',
                          borderColor: 'rgba(245, 158, 11, 0.25)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv1-icon', type: 'Text', props: { text: '🔧' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv1-title', type: 'Heading', props: { level: 3, text: 'Sanitär & Heizung' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv1-desc', type: 'Text', props: { text: 'Badsanierung, Heizungsinstallation, Rohrreinigung und Notdienst' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'service-2',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv2-icon', type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv2-title', type: 'Heading', props: { level: 3, text: 'Elektroarbeiten' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv2-desc', type: 'Text', props: { text: 'Sicherungskästen, Steckdosen, Smart Home' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'service-3',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv3-icon', type: 'Text', props: { text: '🎨' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv3-title', type: 'Heading', props: { level: 3, text: 'Maler & Fassade' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv3-desc', type: 'Text', props: { text: 'Innenraum, Außenfassade, Tapezieren' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'service-4',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv4-icon', type: 'Text', props: { text: '🪵' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv4-title', type: 'Heading', props: { level: 3, text: 'Tischler & Schreiner' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv4-desc', type: 'Text', props: { text: 'Möbel, Türen, Fenster, Trockenbau' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'service-5',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv5-icon', type: 'Text', props: { text: '🏗️' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv5-title', type: 'Heading', props: { level: 3, text: 'Komplettsanierung' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv5-desc', type: 'Text', props: { text: 'Schlüsselfertige Renovierung' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'service-6',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'sv6-icon', type: 'Text', props: { text: '🔩' }, style: { base: { fontSize: '3xl' } }, actions: [], children: [] },
                        { id: 'sv6-title', type: 'Heading', props: { level: 3, text: 'Schlüsseldienst' }, style: { base: { color: '#ffffff', fontSize: 'xl', fontWeight: 'bold' } }, actions: [], children: [] },
                        { id: 'sv6-desc', type: 'Text', props: { text: '24h Türöffnung & Sicherheit' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // PORTFOLIO / REFERENZEN SECTION
            {
              id: 'portfolio-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0f0f14',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                // Header
                {
                  id: 'portfolio-header',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'sm' },
                  style: { base: { marginBottom: 'xl' } },
                  actions: [],
                  children: [
                    { id: 'portfolio-badge', type: 'Badge', props: { text: 'REFERENZEN', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                    { id: 'portfolio-title', type: 'Heading', props: { level: 2, text: 'Unsere aktuellen Projekte' }, style: { base: { fontSize: '3xl', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }, actions: [], children: [] },
                    { id: 'portfolio-subtitle', type: 'Text', props: { text: 'Überzeugen Sie sich selbst von der Qualität unserer Arbeit' }, style: { base: { color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' } }, actions: [], children: [] },
                  ],
                },
                // Portfolio Grid
                {
                  id: 'portfolio-grid',
                  type: 'Grid',
                  props: { columns: 3, gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: 'project-1',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'none' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '2xl',
                          overflow: 'hidden',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'proj1-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop', alt: 'Badsanierung', objectFit: 'cover', height: '200px' }, style: { base: { width: '100%' } }, actions: [], children: [] },
                        {
                          id: 'proj1-info',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          style: { base: { padding: 'md' } },
                          actions: [],
                          children: [
                            { id: 'proj1-cat', type: 'Badge', props: { text: 'Badsanierung', variant: 'outline' }, style: { base: { borderColor: 'rgba(255,255,255,0.2)', color: '#f59e0b', fontSize: 'xs' } }, actions: [], children: [] },
                            { id: 'proj1-title', type: 'Heading', props: { level: 4, text: 'Luxusbad in München' }, style: { base: { color: '#ffffff', fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], children: [] },
                            { id: 'proj1-desc', type: 'Text', props: { text: 'Komplette Neugestaltung inkl. begehbarer Dusche und Fußbodenheizung' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'project-2',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'none' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '2xl',
                          overflow: 'hidden',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'proj2-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop', alt: 'Küche', objectFit: 'cover', height: '200px' }, style: { base: { width: '100%' } }, actions: [], children: [] },
                        {
                          id: 'proj2-info',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          style: { base: { padding: 'md' } },
                          actions: [],
                          children: [
                            { id: 'proj2-cat', type: 'Badge', props: { text: 'Küchenumbau', variant: 'outline' }, style: { base: { borderColor: 'rgba(255,255,255,0.2)', color: '#f59e0b', fontSize: 'xs' } }, actions: [], children: [] },
                            { id: 'proj2-title', type: 'Heading', props: { level: 4, text: 'Moderne Einbauküche' }, style: { base: { color: '#ffffff', fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], children: [] },
                            { id: 'proj2-desc', type: 'Text', props: { text: 'Maßanfertigung mit Elektro- und Sanitärinstallation' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'project-3',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'none' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '2xl',
                          overflow: 'hidden',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 'proj3-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop', alt: 'Wohnzimmer', objectFit: 'cover', height: '200px' }, style: { base: { width: '100%' } }, actions: [], children: [] },
                        {
                          id: 'proj3-info',
                          type: 'Stack',
                          props: { direction: 'column', gap: 'xs' },
                          style: { base: { padding: 'md' } },
                          actions: [],
                          children: [
                            { id: 'proj3-cat', type: 'Badge', props: { text: 'Renovierung', variant: 'outline' }, style: { base: { borderColor: 'rgba(255,255,255,0.2)', color: '#f59e0b', fontSize: 'xs' } }, actions: [], children: [] },
                            { id: 'proj3-title', type: 'Heading', props: { level: 4, text: 'Altbau-Sanierung' }, style: { base: { color: '#ffffff', fontSize: 'lg', fontWeight: 'semibold' } }, actions: [], children: [] },
                            { id: 'proj3-desc', type: 'Text', props: { text: 'Denkmalgerechte Restaurierung mit modernem Komfort' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            // ÜBER UNS SECTION
            {
              id: 'about-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0a0a0f',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'about-grid',
                  type: 'Grid',
                  props: { columns: 2, gap: 'xl' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    // Image Side
                    {
                      id: 'about-image-wrap',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'about-img', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=500&fit=crop', alt: 'Unser Team', objectFit: 'cover' }, style: { base: { width: '100%', height: '400px', borderRadius: '2xl' } }, actions: [], children: [] },
                        {
                          id: 'about-stats',
                          type: 'Stack',
                          props: { direction: 'row', gap: 'md', justify: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: 'about-stat-1',
                              type: 'Stack',
                              props: { direction: 'column', align: 'center', gap: 'none' },
                              style: { base: { backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: 'md', borderRadius: 'xl' } },
                              actions: [],
                              children: [
                                { id: 'as1-val', type: 'Heading', props: { level: 3, text: '50+' }, style: { base: { color: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                { id: 'as1-label', type: 'Text', props: { text: 'Mitarbeiter' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: 'xs' } }, actions: [], children: [] },
                              ],
                            },
                            {
                              id: 'about-stat-2',
                              type: 'Stack',
                              props: { direction: 'column', align: 'center', gap: 'none' },
                              style: { base: { backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: 'md', borderRadius: 'xl' } },
                              actions: [],
                              children: [
                                { id: 'as2-val', type: 'Heading', props: { level: 3, text: '12' }, style: { base: { color: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                { id: 'as2-label', type: 'Text', props: { text: 'Meister' }, style: { base: { color: 'rgba(255,255,255,0.6)', fontSize: 'xs' } }, actions: [], children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    // Text Side
                    {
                      id: 'about-content',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md', justify: 'center' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'about-badge', type: 'Badge', props: { text: 'ÜBER UNS', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                        { id: 'about-title', type: 'Heading', props: { level: 2, text: 'Tradition trifft Innovation' }, style: { base: { fontSize: '3xl', fontWeight: 'bold', color: '#ffffff' } }, actions: [], children: [] },
                        { id: 'about-p1', type: 'Text', props: { text: 'Seit über 20 Jahren sind wir Ihr verlässlicher Partner für alle handwerklichen Arbeiten in München und Umgebung. Als Meisterbetrieb verbinden wir traditionelles Handwerk mit modernsten Techniken.' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.7' } }, actions: [], children: [] },
                        { id: 'about-p2', type: 'Text', props: { text: 'Unser Team besteht aus erfahrenen Fachkräften, die mit Leidenschaft und Präzision arbeiten. Wir legen großen Wert auf Qualität, Pünktlichkeit und transparente Kommunikation.' }, style: { base: { color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.7' } }, actions: [], children: [] },
                        {
                          id: 'about-features',
                          type: 'Grid',
                          props: { columns: 2, gap: 'sm' },
                          style: { base: { marginTop: 'md' } },
                          actions: [],
                          children: [
                            { id: 'af1', type: 'Text', props: { text: '✓ Festpreisgarantie' }, style: { base: { color: '#f59e0b', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], children: [] },
                            { id: 'af2', type: 'Text', props: { text: '✓ Kostenlose Beratung' }, style: { base: { color: '#f59e0b', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], children: [] },
                            { id: 'af3', type: 'Text', props: { text: '✓ 5 Jahre Garantie' }, style: { base: { color: '#f59e0b', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], children: [] },
                            { id: 'af4', type: 'Text', props: { text: '✓ Regionale Partner' }, style: { base: { color: '#f59e0b', fontSize: 'sm', fontWeight: 'medium' } }, actions: [], children: [] },
                          ],
                        },
                        { id: 'about-btn', type: 'Button', props: { text: 'Mehr über uns erfahren', variant: 'outline', size: 'lg' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b', borderRadius: 'xl', marginTop: 'md' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // TESTIMONIALS SECTION
            {
              id: 'testimonials-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0f0f14',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                // Header
                {
                  id: 'testimonials-header',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'sm' },
                  style: { base: { marginBottom: 'xl' } },
                  actions: [],
                  children: [
                    { id: 'testimonials-badge', type: 'Badge', props: { text: 'KUNDENSTIMMEN', variant: 'outline' }, style: { base: { borderColor: '#f59e0b', color: '#f59e0b' } }, actions: [], children: [] },
                    { id: 'testimonials-title', type: 'Heading', props: { level: 2, text: 'Was unsere Kunden sagen' }, style: { base: { fontSize: '3xl', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' } }, actions: [], children: [] },
                  ],
                },
                // Testimonials Grid
                {
                  id: 'testimonials-grid',
                  type: 'Grid',
                  props: { columns: 3, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: 'testimonial-1',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't1-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: 'lg' } }, actions: [], children: [] },
                        { id: 't1-text', type: 'Text', props: { text: '"Absolut professionell! Unser Bad wurde in nur 2 Wochen komplett saniert. Das Ergebnis übertrifft alle Erwartungen."' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' } }, actions: [], children: [] },
                        {
                          id: 't1-author',
                          type: 'Stack',
                          props: { direction: 'row', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't1-avatar', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', alt: 'Michael S.' }, style: { base: { width: '48px', height: '48px', borderRadius: 'full' } }, actions: [], children: [] },
                            {
                              id: 't1-info',
                              type: 'Stack',
                              props: { direction: 'column', gap: 'none' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                { id: 't1-name', type: 'Text', props: { text: 'Michael S.' }, style: { base: { color: '#ffffff', fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                                { id: 't1-loc', type: 'Text', props: { text: 'München-Schwabing' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'xs' } }, actions: [], children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'testimonial-2',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: {
                        base: {
                          gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.03) 100%)',
                          borderColor: 'rgba(245, 158, 11, 0.25)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't2-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: 'lg' } }, actions: [], children: [] },
                        { id: 't2-text', type: 'Text', props: { text: '"Der Notdienst war innerhalb von 30 Minuten da und hat das Problem sofort behoben. Top Service zu fairen Preisen!"' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' } }, actions: [], children: [] },
                        {
                          id: 't2-author',
                          type: 'Stack',
                          props: { direction: 'row', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't2-avatar', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', alt: 'Sarah K.' }, style: { base: { width: '48px', height: '48px', borderRadius: 'full' } }, actions: [], children: [] },
                            {
                              id: 't2-info',
                              type: 'Stack',
                              props: { direction: 'column', gap: 'none' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                { id: 't2-name', type: 'Text', props: { text: 'Sarah K.' }, style: { base: { color: '#ffffff', fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                                { id: 't2-loc', type: 'Text', props: { text: 'München-Bogenhausen' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'xs' } }, actions: [], children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'testimonial-3',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: {
                        base: {
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.08)',
                          borderWidth: '1',
                          borderRadius: '2xl',
                          padding: 'lg',
                        },
                      },
                      actions: [],
                      children: [
                        { id: 't3-stars', type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { fontSize: 'lg' } }, actions: [], children: [] },
                        { id: 't3-text', type: 'Text', props: { text: '"Wir haben unsere komplette Wohnung renovieren lassen. Die Beratung war super und die Umsetzung perfekt."' }, style: { base: { color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' } }, actions: [], children: [] },
                        {
                          id: 't3-author',
                          type: 'Stack',
                          props: { direction: 'row', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            { id: 't3-avatar', type: 'Image', props: { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', alt: 'Thomas M.' }, style: { base: { width: '48px', height: '48px', borderRadius: 'full' } }, actions: [], children: [] },
                            {
                              id: 't3-info',
                              type: 'Stack',
                              props: { direction: 'column', gap: 'none' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                { id: 't3-name', type: 'Text', props: { text: 'Thomas M.' }, style: { base: { color: '#ffffff', fontWeight: 'semibold', fontSize: 'sm' } }, actions: [], children: [] },
                                { id: 't3-loc', type: 'Text', props: { text: 'München-Sendling' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'xs' } }, actions: [], children: [] },
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

            // CTA SECTION
            {
              id: 'cta-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  paddingY: 'xl',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'cta-content',
                  type: 'Stack',
                  props: { direction: 'column', align: 'center', gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    { id: 'cta-title', type: 'Heading', props: { level: 2, text: 'Bereit für Ihr Projekt?' }, style: { base: { color: '#0a0a0f', fontSize: '3xl', fontWeight: 'bold', textAlign: 'center' } }, actions: [], children: [] },
                    { id: 'cta-subtitle', type: 'Text', props: { text: 'Lassen Sie uns jetzt über Ihr Vorhaben sprechen – kostenlos und unverbindlich' }, style: { base: { color: 'rgba(0, 0, 0, 0.7)', textAlign: 'center' } }, actions: [], children: [] },
                    {
                      id: 'cta-buttons',
                      type: 'Stack',
                      props: { direction: 'row', justify: 'center', align: 'center', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'cta-btn-1', type: 'Button', props: { text: 'Anfrage senden', variant: 'primary', size: 'lg' }, style: { base: { backgroundColor: '#0a0a0f', color: '#ffffff', borderRadius: 'xl' } }, actions: [{ event: 'onClick', action: { type: 'navigate', to: 'mailto:info@meisterwerk.de?subject=Anfrage', target: '_self' } }], children: [] },
                        { id: 'cta-btn-2', type: 'Button', props: { text: '0800 123 4567', variant: 'outline', size: 'lg' }, style: { base: { borderColor: '#0a0a0f', color: '#0a0a0f', borderRadius: 'xl' } }, actions: [{ event: 'onClick', action: { type: 'navigate', to: 'tel:+4980012345678', target: '_self' } }], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },

            // EMERGENCY SECTION
            {
              id: 'emergency-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  gradient: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
                  paddingY: 'lg',
                  paddingX: 'lg',
                },
              },
              actions: [],
              children: [
                {
                  id: 'emergency-content',
                  type: 'Stack',
                  props: { direction: 'row', align: 'center', justify: 'center', gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    { id: 'emergency-icon', type: 'Text', props: { text: '🚨' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                    {
                      id: 'emergency-text',
                      type: 'Stack',
                      props: { direction: 'column', align: 'center', gap: 'none' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'emergency-title', type: 'Heading', props: { level: 3, text: '24h Notdienst: 0800 123 4567' }, style: { base: { color: '#ffffff', fontWeight: 'bold', fontSize: 'xl' } }, actions: [], children: [] },
                        { id: 'emergency-subtitle', type: 'Text', props: { text: 'Rohrbruch? Heizungsausfall? Wir sind rund um die Uhr für Sie da!' }, style: { base: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    { id: 'emergency-btn', type: 'Button', props: { text: 'Jetzt anrufen', variant: 'primary' }, style: { base: { backgroundColor: '#ffffff', color: '#dc2626', fontWeight: 'bold', borderRadius: 'xl' } }, actions: [{ event: 'onClick', action: { type: 'navigate', to: 'tel:+4980012345678', target: '_self' } }], children: [] },
                  ],
                },
              ],
            },

            // FOOTER
            {
              id: 'footer-section',
              type: 'Section',
              props: { minHeight: 'auto' },
              style: {
                base: {
                  backgroundColor: '#0a0a0f',
                  paddingY: 'xl',
                  paddingX: 'lg',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '1',
                },
              },
              actions: [],
              children: [
                {
                  id: 'footer-grid',
                  type: 'Grid',
                  props: { columns: 4, gap: 'xl' },
                  style: { base: { marginBottom: 'lg' } },
                  actions: [],
                  children: [
                    {
                      id: 'footer-col-1',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'f1-logo', type: 'Heading', props: { level: 4, text: '🛠️ MeisterWerk' }, style: { base: { color: '#f59e0b' } }, actions: [], children: [] },
                        { id: 'f1-desc', type: 'Text', props: { text: 'Ihr Partner für alle handwerklichen Arbeiten seit über 20 Jahren.' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-2',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'f2-title', type: 'Heading', props: { level: 5, text: 'Leistungen' }, style: { base: { color: '#ffffff', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f2-1', type: 'Link', props: { text: 'Sanitär & Heizung', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f2-2', type: 'Link', props: { text: 'Elektroarbeiten', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f2-3', type: 'Link', props: { text: 'Renovierung', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-3',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'f3-title', type: 'Heading', props: { level: 5, text: 'Unternehmen' }, style: { base: { color: '#ffffff', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f3-1', type: 'Link', props: { text: 'Über uns', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f3-2', type: 'Link', props: { text: 'Karriere', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f3-3', type: 'Link', props: { text: 'Kontakt', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                    {
                      id: 'footer-col-4',
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'f4-title', type: 'Heading', props: { level: 5, text: 'Kontakt' }, style: { base: { color: '#ffffff', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f4-1', type: 'Text', props: { text: '📍 Musterstraße 123' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f4-2', type: 'Text', props: { text: '📞 0800 123 4567' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                        { id: 'f4-3', type: 'Text', props: { text: '✉️ info@meisterwerk.de' }, style: { base: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 'sm' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
                // Copyright
                {
                  id: 'footer-bottom',
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: { borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: '1', paddingTop: 'lg' } },
                  actions: [],
                  children: [
                    { id: 'copyright', type: 'Text', props: { text: '© 2024 MeisterWerk. Alle Rechte vorbehalten.' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'xs' } }, actions: [], children: [] },
                    {
                      id: 'footer-legal',
                      type: 'Stack',
                      props: { direction: 'row', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        { id: 'legal-1', type: 'Link', props: { text: 'Impressum', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'xs' } }, actions: [], children: [] },
                        { id: 'legal-2', type: 'Link', props: { text: 'Datenschutz', href: '#' }, style: { base: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 'xs' } }, actions: [], children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  });
  
  console.log('✅ Template updated!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
