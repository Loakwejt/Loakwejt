import { templateRegistry, type FullPageTemplate } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// HANDWERKER / CRAFTSMAN PAGE TEMPLATES
// ============================================================================

const craftsmanPageTemplates: FullPageTemplate[] = [
  // Handwerker Landing Page - Complete
  {
    id: 'craftsman-complete',
    name: 'Handwerker Komplett',
    description: 'Vollständige Webseite für Handwerksbetriebe mit Hero, Leistungen, Über uns, Referenzen und Kontakt',
    websiteType: 'business',
    style: 'modern',
    tags: ['handwerker', 'craftsman', 'service', 'local', 'business', 'german'],
    tree: {
      builderVersion: 1,
      root: {
        id: 'root',
        type: 'Section',
        props: {},
        style: { base: {} },
        actions: [],
        children: [
          // ============================================================================
          // HERO SECTION - Dark with gradient
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: { minHeight: 'half' },
            style: { base: { paddingY: '2xl', bgColor: '#1a1a2e' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: { paddingY: 'xl' } },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Grid',
                    props: { columns: 2, gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      // Left: Text Content
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'lg', justify: 'center' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Badge',
                            props: { text: '⭐ Meisterbetrieb seit 1985', variant: 'secondary' },
                            style: { base: { bgColor: '#f59e0b', textColor: '#1a1a2e' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Heading',
                            props: { level: 1, text: 'Ihr zuverlässiger Partner für Qualitätsarbeit' },
                            style: { base: { textColor: '#ffffff' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Text',
                            props: { text: 'Wir sind Ihr Experte für professionelle Handwerksleistungen in der Region. Von der Beratung bis zur Fertigstellung – bei uns sind Sie in besten Händen.' },
                            style: { base: { textColor: '#94a3b8', fontSize: 'lg' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Stack',
                            props: { direction: 'row', gap: 'md' },
                            style: { base: {} },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Button',
                                props: { text: 'Kostenlose Beratung', variant: 'primary', size: 'lg' },
                                style: { base: { bgColor: '#f59e0b', textColor: '#1a1a2e' } },
                                actions: [],
                                children: [],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Button',
                                props: { text: 'Unsere Leistungen', variant: 'outline', size: 'lg' },
                                style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                                actions: [],
                                children: [],
                              },
                            ],
                          },
                          // Trust Badges
                          {
                            id: generateNodeId(),
                            type: 'Stack',
                            props: { direction: 'row', gap: 'lg' },
                            style: { base: { marginTop: 'md' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'xs', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#22c55e', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Kostenloser Kostenvoranschlag' }, style: { base: { fontSize: 'sm', textColor: '#cbd5e1' } }, actions: [], children: [] },
                                ],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'xs', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#22c55e', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Termingarantie' }, style: { base: { fontSize: 'sm', textColor: '#cbd5e1' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      // Right: Image
                      {
                        id: generateNodeId(),
                        type: 'Image',
                        props: { 
                          src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=500&fit=crop', 
                          alt: 'Handwerker bei der Arbeit' 
                        },
                        style: { base: { borderRadius: 'lg' } },
                        actions: [],
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ============================================================================
          // STATS / TRUST SECTION - Orange/Amber accent
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: 'xl', bgColor: '#f59e0b' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Grid',
                    props: { columns: 4, gap: 'lg' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '38+' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Jahre Erfahrung' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '2.500+' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Zufriedene Kunden' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '15' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Fachkräfte im Team' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '100%' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Qualitätsgarantie' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ============================================================================
          // LEISTUNGEN / SERVICES SECTION - Light gray background
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: '2xl', bgColor: '#f8fafc' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      // Section Header
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'md', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Badge',
                            props: { text: 'Unsere Leistungen', variant: 'outline' },
                            style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Heading',
                            props: { level: 2, text: 'Professionelle Handwerksleistungen' },
                            style: { base: { textColor: '#1a1a2e' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Text',
                            props: { text: 'Von der Planung bis zur Umsetzung – wir bieten Ihnen das komplette Leistungsspektrum aus einer Hand.' },
                            style: { base: { textColor: '#64748b', fontSize: 'lg' } },
                            actions: [],
                            children: [],
                          },
                        ],
                      },
                      // Services Grid
                      {
                        id: generateNodeId(),
                        type: 'Grid',
                        props: { columns: 3, gap: 'lg' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          // Service 1
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '🔧' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Sanitär & Installation' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Komplette Badsanierung, Heizungsinstallation und Wartung aller sanitären Anlagen.' }, style: { base: { textColor: '#64748b' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Service 2
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '⚡' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Elektroinstallation' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Elektroplanung, Neuinstallation, Smart Home Lösungen und E-Check.' }, style: { base: { textColor: '#64748b' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Service 3
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '🏠' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Renovierung & Umbau' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Komplettrenovierungen, Dachausbau, Trockenbau und Malerarbeiten.' }, style: { base: { textColor: '#64748b' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Service 4
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '🌡️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Heizung & Klima' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Heizungsmodernisierung, Wärmepumpen, Klimaanlagen und Wartung.' }, style: { base: { textColor: '#64748b' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Service 5
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '🪟' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Fenster & Türen' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Einbau und Austausch von Fenstern, Haustüren und Innentüren.' }, style: { base: { textColor: '#64748b' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Service 6 - Highlighted
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#1a1a2e', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '🚨' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: 'Notdienst 24/7' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Schnelle Hilfe bei Rohrbruch, Heizungsausfall und anderen Notfällen.' }, style: { base: { textColor: '#cbd5e1' } }, actions: [], children: [] },
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
            ],
          },

          // ============================================================================
          // ÜBER UNS / ABOUT SECTION - Dark background
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: '2xl', bgColor: '#1a1a2e' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Grid',
                    props: { columns: 2, gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      // Left: Image
                      {
                        id: generateNodeId(),
                        type: 'Image',
                        props: { 
                          src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=500&fit=crop', 
                          alt: 'Unser Team' 
                        },
                        style: { base: { borderRadius: 'lg' } },
                        actions: [],
                        children: [],
                      },
                      // Right: Content
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'lg', justify: 'center' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Badge',
                            props: { text: 'Über uns', variant: 'outline' },
                            style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Heading',
                            props: { level: 2, text: 'Tradition trifft Innovation' },
                            style: { base: { textColor: '#ffffff' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Text',
                            props: { text: 'Seit 1985 sind wir Ihr verlässlicher Partner für alle Handwerksarbeiten in der Region. Als Meisterbetrieb verbinden wir traditionelles Handwerk mit modernster Technik.' },
                            style: { base: { textColor: '#94a3b8' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Text',
                            props: { text: 'Unser Team aus 15 qualifizierten Fachkräften steht für Qualität, Zuverlässigkeit und faire Preise.' },
                            style: { base: { textColor: '#94a3b8' } },
                            actions: [],
                            children: [],
                          },
                          // Checkmarks
                          {
                            id: generateNodeId(),
                            type: 'Grid',
                            props: { columns: 2, gap: 'sm' },
                            style: { base: { marginTop: 'md' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'sm', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Meisterbetrieb' }, style: { base: { textColor: '#cbd5e1' } }, actions: [], children: [] },
                                ],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'sm', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Handwerkskammer' }, style: { base: { textColor: '#cbd5e1' } }, actions: [], children: [] },
                                ],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'sm', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Fortbildungen' }, style: { base: { textColor: '#cbd5e1' } }, actions: [], children: [] },
                                ],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'row', gap: 'sm', align: 'center' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✓' }, style: { base: { textColor: '#f59e0b', fontWeight: 'bold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Umweltbewusst' }, style: { base: { textColor: '#cbd5e1' } }, actions: [], children: [] },
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
            ],
          },

          // ============================================================================
          // REFERENZEN / TESTIMONIALS SECTION
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: '2xl', bgColor: '#f8fafc' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      // Section Header
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'md', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Badge',
                            props: { text: 'Kundenstimmen', variant: 'outline' },
                            style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Heading',
                            props: { level: 2, text: 'Das sagen unsere Kunden' },
                            style: { base: { textColor: '#1a1a2e' } },
                            actions: [],
                            children: [],
                          },
                        ],
                      },
                      // Testimonials Grid
                      {
                        id: generateNodeId(),
                        type: 'Grid',
                        props: { columns: 3, gap: 'lg' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          // Testimonial 1
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '"Hervorragende Arbeit bei unserer Badsanierung! Das Team war pünktlich, sauber und hat alles perfekt umgesetzt."' }, style: { base: { textColor: '#475569' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '— Familie Müller, München' }, style: { base: { fontWeight: 'semibold', textColor: '#1a1a2e' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Testimonial 2
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '"Schnelle Hilfe beim Heizungsausfall mitten im Winter. Der Notdienst war innerhalb einer Stunde da!"' }, style: { base: { textColor: '#475569' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '— Thomas S., Starnberg' }, style: { base: { fontWeight: 'semibold', textColor: '#1a1a2e' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Testimonial 3
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#ffffff', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'md' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '⭐⭐⭐⭐⭐' }, style: { base: { textColor: '#f59e0b' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '"Kompetente Beratung und faire Preise. Unsere Elektroinstallation wurde professionell erneuert."' }, style: { base: { textColor: '#475569' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '— Andrea B., Freising' }, style: { base: { fontWeight: 'semibold', textColor: '#1a1a2e' } }, actions: [], children: [] },
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
            ],
          },

          // ============================================================================
          // CTA SECTION
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: '2xl', bgColor: '#0f172a' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'lg' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'lg', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    children: [
                      {
                        id: generateNodeId(),
                        type: 'Heading',
                        props: { level: 2, text: 'Bereit für Ihr Projekt?' },
                        style: { base: { textColor: '#ffffff' } },
                        actions: [],
                        children: [],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Text',
                        props: { text: 'Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot.' },
                        style: { base: { textColor: '#94a3b8', fontSize: 'lg' } },
                        actions: [],
                        children: [],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'row', gap: 'md', justify: 'center' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Button',
                            props: { text: '📞 Jetzt anrufen', variant: 'primary', size: 'lg' },
                            style: { base: { bgColor: '#f59e0b', textColor: '#0f172a' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Button',
                            props: { text: '✉️ Nachricht senden', variant: 'outline', size: 'lg' },
                            style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                            actions: [],
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ============================================================================
          // KONTAKT SECTION
          // ============================================================================
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { paddingY: '2xl', bgColor: '#ffffff' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'xl' },
                style: { base: {} },
                actions: [],
                children: [
                  {
                    id: generateNodeId(),
                    type: 'Stack',
                    props: { direction: 'column', gap: 'xl' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      // Section Header
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'md', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Badge',
                            props: { text: 'Kontakt', variant: 'outline' },
                            style: { base: { borderColor: '#f59e0b', textColor: '#f59e0b' } },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Heading',
                            props: { level: 2, text: 'Nehmen Sie Kontakt auf' },
                            style: { base: { textColor: '#1a1a2e' } },
                            actions: [],
                            children: [],
                          },
                        ],
                      },
                      // Contact Grid
                      {
                        id: generateNodeId(),
                        type: 'Grid',
                        props: { columns: 3, gap: 'lg' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          // Phone
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#f8fafc', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'sm', align: 'center' },
                                style: { base: { textAlign: 'center' } },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '📞' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 4, text: 'Telefon' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '089 / 123 456 789' }, style: { base: { textColor: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Mo-Fr: 7:00 - 18:00' }, style: { base: { textColor: '#64748b', fontSize: 'sm' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Email
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#f8fafc', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'sm', align: 'center' },
                                style: { base: { textAlign: 'center' } },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '✉️' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 4, text: 'E-Mail' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'info@meister.de' }, style: { base: { textColor: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Antwort in 24h' }, style: { base: { textColor: '#64748b', fontSize: 'sm' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                          // Address
                          {
                            id: generateNodeId(),
                            type: 'Card',
                            props: {},
                            style: { base: { padding: 'lg', bgColor: '#f8fafc', borderRadius: 'lg' } },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'sm', align: 'center' },
                                style: { base: { textAlign: 'center' } },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Text', props: { text: '📍' }, style: { base: { fontSize: '2xl' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Heading', props: { level: 4, text: 'Adresse' }, style: { base: { textColor: '#1a1a2e' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Handwerkerstr. 1' }, style: { base: { textColor: '#f59e0b', fontWeight: 'semibold' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: '80331 München' }, style: { base: { textColor: '#64748b', fontSize: 'sm' } }, actions: [], children: [] },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                      // Emergency Box
                      {
                        id: generateNodeId(),
                        type: 'Card',
                        props: {},
                        style: { base: { padding: 'lg', bgColor: '#dc2626', borderRadius: 'lg' } },
                        actions: [],
                        children: [
                          {
                            id: generateNodeId(),
                            type: 'Stack',
                            props: { direction: 'row', gap: 'lg', align: 'center', justify: 'between' },
                            style: { base: {} },
                            actions: [],
                            children: [
                              {
                                id: generateNodeId(),
                                type: 'Stack',
                                props: { direction: 'column', gap: 'xs' },
                                style: { base: {} },
                                actions: [],
                                children: [
                                  { id: generateNodeId(), type: 'Heading', props: { level: 3, text: '🚨 Notdienst 24/7' }, style: { base: { textColor: '#ffffff' } }, actions: [], children: [] },
                                  { id: generateNodeId(), type: 'Text', props: { text: 'Bei dringenden Notfällen erreichen Sie uns rund um die Uhr!' }, style: { base: { textColor: '#fecaca' } }, actions: [], children: [] },
                                ],
                              },
                              {
                                id: generateNodeId(),
                                type: 'Button',
                                props: { text: '📞 0800 / 123 456', variant: 'secondary', size: 'lg' },
                                style: { base: { bgColor: '#ffffff', textColor: '#dc2626' } },
                                actions: [],
                                children: [],
                              },
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
        ],
      },
    },
  },
];

// Register all craftsman page templates
craftsmanPageTemplates.forEach(template => {
  templateRegistry.registerPage(template);
});

export { craftsmanPageTemplates };
