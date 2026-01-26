import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// STATS SECTION TEMPLATES
// ============================================================================

const statsTemplates: TemplateDefinition[] = [
  // Stats 1: Simple Row
  {
    id: 'stats-simple-row',
    name: 'Stats Row',
    description: 'Horizontal row of key statistics',
    category: 'stats',
    style: 'minimal',
    websiteTypes: ['landing', 'business', 'saas', 'agency'],
    tags: ['numbers', 'metrics', 'horizontal'],
    node: {
      id: generateNodeId(),
      type: 'Section',
      props: {},
      style: { base: { padding: 'xl', backgroundColor: 'primary' } },
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
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: '10K+' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Active Users' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'xs', align: 'center' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: '50M+' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Pages Created' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'xs', align: 'center' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: '99.9%' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Uptime' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'xs', align: 'center' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: '24/7' },
                      style: { base: { color: 'primary-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Support' },
                      style: { base: { color: 'primary-foreground' } },
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

  // Stats 2: Cards
  {
    id: 'stats-cards',
    name: 'Stats Cards',
    description: 'Statistics displayed in card format',
    category: 'stats',
    style: 'modern',
    websiteTypes: ['landing', 'business', 'saas'],
    tags: ['cards', 'metrics', 'highlighted'],
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
                  type: 'Heading',
                  props: { level: 2, text: 'Trusted by Industry Leaders' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [],
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
                      style: { base: { padding: 'xl', backgroundColor: 'background', textAlign: 'center' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Heading',
                              props: { level: 1, text: '500+' },
                              style: { base: { color: 'primary' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'Enterprise Clients' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '', description: '' },
                      style: { base: { padding: 'xl', backgroundColor: 'background', textAlign: 'center' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Heading',
                              props: { level: 1, text: '$2B+' },
                              style: { base: { color: 'primary' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'Revenue Generated' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '', description: '' },
                      style: { base: { padding: 'xl', backgroundColor: 'background', textAlign: 'center' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Stack',
                          props: { direction: 'column', gap: 'sm', align: 'center' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Heading',
                              props: { level: 1, text: '150+' },
                              style: { base: { color: 'primary' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'Countries Served' },
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
          ],
        },
      ],
    },
  },
];

// Register all stats templates
statsTemplates.forEach(template => templateRegistry.registerSection(template));

export { statsTemplates };
