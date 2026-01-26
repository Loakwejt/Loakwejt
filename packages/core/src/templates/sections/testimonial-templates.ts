import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// TESTIMONIAL SECTION TEMPLATES
// ============================================================================

const testimonialTemplates: TemplateDefinition[] = [
  // Testimonials 1: Card Grid
  {
    id: 'testimonials-grid',
    name: 'Testimonial Grid',
    description: 'Customer testimonials in a three-column grid',
    category: 'testimonials',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'business', 'agency'],
    tags: ['grid', 'cards', 'reviews'],
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
                  type: 'Stack',
                  props: { direction: 'column', gap: 'sm', align: 'center' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: 'What Our Customers Say' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Trusted by thousands of businesses worldwide' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Grid',
                  props: { columns: 3, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '', description: '' },
                      style: { base: { padding: 'lg', backgroundColor: 'background' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'md' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '"This product has completely transformed how we work. The team collaboration features are incredible."' },
                              style: { base: {} },
                              actions: [],
                              children: [],
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
                              props: { direction: 'column', gap: 'xs' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'Sarah Johnson' },
                                  style: { base: { fontWeight: 'semibold' } },
                                  actions: [],
                                  children: [],
                                },
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'CEO, TechStart Inc.' },
                                  style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
                                  actions: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '', description: '' },
                      style: { base: { padding: 'lg', backgroundColor: 'background' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'md' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '"The best investment we made this year. Our productivity increased by 40% in just two months."' },
                              style: { base: {} },
                              actions: [],
                              children: [],
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
                              props: { direction: 'column', gap: 'xs' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'Michael Chen' },
                                  style: { base: { fontWeight: 'semibold' } },
                                  actions: [],
                                  children: [],
                                },
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'CTO, DataFlow' },
                                  style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
                                  actions: [],
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '', description: '' },
                      style: { base: { padding: 'lg', backgroundColor: 'background' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'md' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '"Outstanding support team and a product that just works. Highly recommend to anyone looking to scale."' },
                              style: { base: {} },
                              actions: [],
                              children: [],
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
                              props: { direction: 'column', gap: 'xs' },
                              style: { base: {} },
                              actions: [],
                              children: [
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'Emily Rodriguez' },
                                  style: { base: { fontWeight: 'semibold' } },
                                  actions: [],
                                  children: [],
                                },
                                {
                                  id: generateNodeId(),
                                  type: 'Text',
                                  props: { text: 'Founder, GrowthLabs' },
                                  style: { base: { color: 'muted-foreground', fontSize: 'sm' } },
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
      ],
    },
  },

  // Testimonials 2: Large Quote
  {
    id: 'testimonial-large-quote',
    name: 'Large Quote Testimonial',
    description: 'Single prominent testimonial with large quote',
    category: 'testimonials',
    style: 'elegant',
    websiteTypes: ['landing', 'business', 'agency', 'portfolio'],
    tags: ['quote', 'single', 'featured'],
    node: {
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
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: '"' },
                  style: { base: { fontSize: '3xl', color: 'primary' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Heading',
                  props: { level: 3, text: 'This platform has revolutionized the way we approach our business. The results speak for themselves - 200% growth in just 6 months.' },
                  style: { base: { fontWeight: 'normal' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'xs', align: 'center' },
                  style: { base: { marginTop: 'md' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'David Thompson' },
                      style: { base: { fontWeight: 'semibold' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'VP of Operations, Enterprise Corp' },
                      style: { base: { color: 'muted-foreground' } },
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
];

// Register all testimonial templates
testimonialTemplates.forEach(template => templateRegistry.registerSection(template));

export { testimonialTemplates };
