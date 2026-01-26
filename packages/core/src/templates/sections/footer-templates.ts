import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// FOOTER SECTION TEMPLATES
// ============================================================================

const footerTemplates: TemplateDefinition[] = [
  // Footer 1: Simple
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    description: 'Minimal footer with copyright and social links',
    category: 'footer',
    style: 'minimal',
    websiteTypes: ['landing', 'personal', 'portfolio', 'blog'],
    tags: ['simple', 'minimal', 'copyright'],
    node: {
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
              props: { direction: 'row', gap: 'lg', justify: 'between', align: 'center' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: '© 2024 Company Name. All rights reserved.' },
                  style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
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
                      type: 'Link',
                      props: { text: 'Privacy', href: '/privacy' },
                      style: { base: { fontSize: 'sm' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Link',
                      props: { text: 'Terms', href: '/terms' },
                      style: { base: { fontSize: 'sm' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Link',
                      props: { text: 'Contact', href: '/contact' },
                      style: { base: { fontSize: 'sm' } },
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
  },

  // Footer 2: Multi-Column
  {
    id: 'footer-multi-column',
    name: 'Multi-Column Footer',
    description: 'Full footer with multiple link columns',
    category: 'footer',
    style: 'modern',
    websiteTypes: ['landing', 'business', 'saas', 'ecommerce'],
    tags: ['columns', 'links', 'comprehensive'],
    node: {
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
                {
                  id: generateNodeId(),
                  type: 'Grid',
                  props: { columns: 4, gap: 'xl' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    // Company Info
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 4, text: 'Company' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Building the future of web development, one template at a time.' },
                          style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
                    // Product Links
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 5, text: 'Product' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Features', href: '/features' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Pricing', href: '/pricing' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Templates', href: '/templates' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Integrations', href: '/integrations' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
                    // Resources
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 5, text: 'Resources' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Documentation', href: '/docs' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Blog', href: '/blog' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Support', href: '/support' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'API', href: '/api' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
                    // Legal
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 5, text: 'Legal' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Privacy Policy', href: '/privacy' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Terms of Service', href: '/terms' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'Cookie Policy', href: '/cookies' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Divider',
                  props: {},
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'row', justify: 'between', align: 'center' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: '© 2024 Company Name. All rights reserved.' },
                      style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
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
                          type: 'Link',
                          props: { text: 'Twitter', href: '#' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'LinkedIn', href: '#' },
                          style: { base: { fontSize: 'sm' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Link',
                          props: { text: 'GitHub', href: '#' },
                          style: { base: { fontSize: 'sm' } },
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
  },
];

// Register all footer templates
footerTemplates.forEach(template => templateRegistry.registerSection(template));

export { footerTemplates };
