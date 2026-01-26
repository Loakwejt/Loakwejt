import { templateRegistry, type FullPageTemplate } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// LANDING PAGE TEMPLATES
// ============================================================================

const landingPageTemplates: FullPageTemplate[] = [
  // Landing Page 1: SaaS Startup
  {
    id: 'landing-saas-startup',
    name: 'SaaS Startup Landing',
    description: 'Modern landing page for SaaS products with hero, features, pricing, and CTA',
    websiteType: 'saas',
    style: 'modern',
    tags: ['startup', 'saas', 'software', 'tech'],
    tree: {
      builderVersion: 1,
      root: {
        id: 'root',
        type: 'Section',
        props: {},
        style: { base: {} },
        actions: [],
        children: [
          // Hero Section
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: '2xl', backgroundColor: 'background' } },
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
                    props: { direction: 'column', gap: 'xl', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    children: [
                      {
                        id: generateNodeId(),
                        type: 'Badge',
                        props: { text: '🚀 Now in Public Beta', variant: 'secondary' },
                        style: { base: {} },
                        actions: [],
                        children: [],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Heading',
                        props: { level: 1, text: 'The Modern Platform for Building Amazing Products' },
                        style: { base: {} },
                        actions: [],
                        children: [],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Text',
                        props: { text: 'Streamline your workflow, collaborate with your team, and ship faster than ever. Join thousands of teams already using our platform.' },
                        style: { base: { color: 'muted-foreground', fontSize: 'lg' } },
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
                            props: { text: 'Start Free Trial', variant: 'primary', size: 'lg' },
                            style: { base: {} },
                            actions: [],
                            children: [],
                          },
                          {
                            id: generateNodeId(),
                            type: 'Button',
                            props: { text: 'Book a Demo', variant: 'outline', size: 'lg' },
                            style: { base: {} },
                            actions: [],
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Image',
                        props: { src: 'https://placehold.co/1000x600/e2e8f0/64748b?text=Product+Screenshot', alt: 'Product screenshot' },
                        style: { base: { borderRadius: 'lg', marginTop: 'lg' } },
                        actions: [],
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Stats Section
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'xl', backgroundColor: 'muted' } },
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
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '10,000+' }, style: { base: {} }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Active Teams' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '1M+' }, style: { base: {} }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Projects Completed' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '99.9%' }, style: { base: {} }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Uptime SLA' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'xs', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: '4.9/5' }, style: { base: {} }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Customer Rating' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Features Section
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'xl', backgroundColor: 'background' } },
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
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'column', gap: 'sm', align: 'center' },
                        style: { base: { textAlign: 'center' } },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Heading', props: { level: 2, text: 'Powerful Features' }, style: { base: {} }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Text', props: { text: 'Everything you need to build, launch, and grow your product.' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                        ],
                      },
                      {
                        id: generateNodeId(),
                        type: 'Grid',
                        props: { columns: 3, gap: 'lg' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Card', props: { title: '⚡ Lightning Fast', description: 'Optimized for speed with global CDN and edge caching.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: '🔒 Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: '🔗 Easy Integrations', description: 'Connect with 100+ tools you already use.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: '📊 Advanced Analytics', description: 'Deep insights into user behavior and performance.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: '🤝 Team Collaboration', description: 'Real-time collaboration with unlimited members.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: '🎨 Customizable', description: 'Fully brandable with custom domains and styling.' }, style: { base: { padding: 'lg' } }, actions: [], children: [] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // CTA Section
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'xl', backgroundColor: 'primary' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'md' },
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
                      { id: generateNodeId(), type: 'Heading', props: { level: 2, text: 'Ready to Get Started?' }, style: { base: { color: 'primary-foreground' } }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Text', props: { text: 'Join thousands of teams building better products with our platform.' }, style: { base: { color: 'primary-foreground' } }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Button', props: { text: 'Start Your Free Trial', variant: 'secondary', size: 'lg' }, style: { base: {} }, actions: [], children: [] },
                    ],
                  },
                ],
              },
            ],
          },
          // Footer
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'lg', backgroundColor: 'muted' } },
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
                    props: { direction: 'row', justify: 'between', align: 'center' },
                    style: { base: {} },
                    actions: [],
                    children: [
                      { id: generateNodeId(), type: 'Text', props: { text: '© 2024 Company. All rights reserved.' }, style: { base: { color: 'muted-foreground', fontSize: 'sm' } }, actions: [], children: [] },
                      {
                        id: generateNodeId(),
                        type: 'Stack',
                        props: { direction: 'row', gap: 'md' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Link', props: { text: 'Privacy', href: '/privacy' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Link', props: { text: 'Terms', href: '/terms' }, style: { base: { fontSize: 'sm' } }, actions: [], children: [] },
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

  // Landing Page 2: Agency/Portfolio
  {
    id: 'landing-agency',
    name: 'Agency Landing Page',
    description: 'Professional landing page for agencies and creative studios',
    websiteType: 'agency',
    style: 'elegant',
    tags: ['agency', 'creative', 'studio', 'design'],
    tree: {
      builderVersion: 1,
      root: {
        id: 'root',
        type: 'Section',
        props: {},
        style: { base: {} },
        actions: [],
        children: [
          // Hero
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: '2xl', backgroundColor: 'background' } },
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
                    props: { direction: 'column', gap: 'xl', align: 'center' },
                    style: { base: { textAlign: 'center' } },
                    actions: [],
                    children: [
                      { id: generateNodeId(), type: 'Text', props: { text: 'CREATIVE STUDIO' }, style: { base: { color: 'muted-foreground', fontSize: 'sm' } }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Heading', props: { level: 1, text: 'We Create Digital Experiences That Matter' }, style: { base: {} }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Text', props: { text: 'Award-winning design studio crafting beautiful brands, websites, and digital products for ambitious companies.' }, style: { base: { color: 'muted-foreground', fontSize: 'lg' } }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Button', props: { text: 'View Our Work', variant: 'primary', size: 'lg' }, style: { base: {} }, actions: [], children: [] },
                    ],
                  },
                ],
              },
            ],
          },
          // Services
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'xl', backgroundColor: 'muted' } },
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
                      { id: generateNodeId(), type: 'Heading', props: { level: 2, text: 'Our Services' }, style: { base: { textAlign: 'center' } }, actions: [], children: [] },
                      {
                        id: generateNodeId(),
                        type: 'Grid',
                        props: { columns: 3, gap: 'lg' },
                        style: { base: {} },
                        actions: [],
                        children: [
                          { id: generateNodeId(), type: 'Card', props: { title: 'Brand Identity', description: 'Strategic brand development that tells your unique story.' }, style: { base: { padding: 'xl', backgroundColor: 'background' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: 'Web Design', description: 'Beautiful, responsive websites that convert visitors.' }, style: { base: { padding: 'xl', backgroundColor: 'background' } }, actions: [], children: [] },
                          { id: generateNodeId(), type: 'Card', props: { title: 'Digital Marketing', description: 'Data-driven campaigns that drive real results.' }, style: { base: { padding: 'xl', backgroundColor: 'background' } }, actions: [], children: [] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // CTA
          {
            id: generateNodeId(),
            type: 'Section',
            props: {},
            style: { base: { padding: 'xl', backgroundColor: 'background' } },
            actions: [],
            children: [
              {
                id: generateNodeId(),
                type: 'Container',
                props: { maxWidth: 'md' },
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
                      { id: generateNodeId(), type: 'Heading', props: { level: 2, text: "Let's Work Together" }, style: { base: {} }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Text', props: { text: 'Ready to start your next project? Get in touch and let\'s create something amazing.' }, style: { base: { color: 'muted-foreground' } }, actions: [], children: [] },
                      { id: generateNodeId(), type: 'Button', props: { text: 'Contact Us', variant: 'primary', size: 'lg' }, style: { base: {} }, actions: [], children: [] },
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

// Register all landing page templates
landingPageTemplates.forEach(template => templateRegistry.registerPage(template));

export { landingPageTemplates };
