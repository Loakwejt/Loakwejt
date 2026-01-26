import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// FEATURE SECTION TEMPLATES
// ============================================================================

const featureTemplates: TemplateDefinition[] = [
  // Features 1: Grid with Icons
  {
    id: 'features-grid-icons',
    name: 'Feature Grid with Icons',
    description: 'Three-column grid showcasing features with icons',
    category: 'features',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'business', 'agency'],
    tags: ['grid', 'icons', 'three-column'],
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
                      props: { level: 2, text: 'Everything You Need' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Our platform provides all the tools you need to succeed.' },
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
                      props: { title: 'Lightning Fast', description: 'Optimized performance that keeps your users engaged.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Secure by Default', description: 'Enterprise-grade security to protect your data.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Easy Integration', description: 'Connect with your favorite tools in minutes.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: '24/7 Support', description: 'Our team is always here to help you succeed.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Analytics', description: 'Deep insights to make data-driven decisions.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Customizable', description: 'Tailor the platform to fit your unique needs.' },
                      style: { base: { padding: 'lg' } },
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

  // Features 2: Alternating Layout
  {
    id: 'features-alternating',
    name: 'Alternating Feature Rows',
    description: 'Features displayed in alternating left-right layout',
    category: 'features',
    style: 'modern',
    websiteTypes: ['landing', 'saas', 'business'],
    tags: ['alternating', 'images', 'detailed'],
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
          props: { maxWidth: 'xl' },
          style: { base: {} },
          actions: [],
          children: [
            {
              id: generateNodeId(),
              type: 'Stack',
              props: { direction: 'column', gap: '2xl' },
              style: { base: {} },
              actions: [],
              children: [
                // Feature Row 1
                {
                  id: generateNodeId(),
                  type: 'Grid',
                  props: { columns: 2, gap: 'xl' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md', justify: 'center' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Badge',
                          props: { text: 'Feature', variant: 'outline' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 3, text: 'Powerful Analytics Dashboard' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Get real-time insights into your business performance with our intuitive dashboard. Track key metrics, visualize trends, and make informed decisions.' },
                          style: { base: { color: 'muted-foreground' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Learn More', variant: 'outline' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Image',
                      props: { src: 'https://placehold.co/500x350/e2e8f0/64748b?text=Feature+1', alt: 'Analytics Dashboard' },
                      style: { base: { borderRadius: 'lg' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                // Feature Row 2 (reversed)
                {
                  id: generateNodeId(),
                  type: 'Grid',
                  props: { columns: 2, gap: 'xl' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Image',
                      props: { src: 'https://placehold.co/500x350/e2e8f0/64748b?text=Feature+2', alt: 'Collaboration Tools' },
                      style: { base: { borderRadius: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md', justify: 'center' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Badge',
                          props: { text: 'Collaboration', variant: 'outline' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 3, text: 'Seamless Team Collaboration' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Work together effortlessly with built-in collaboration tools. Share projects, leave comments, and keep everyone on the same page.' },
                          style: { base: { color: 'muted-foreground' } },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Learn More', variant: 'outline' },
                          style: { base: {} },
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

  // Features 3: Simple List
  {
    id: 'features-simple-list',
    name: 'Simple Feature List',
    description: 'Clean vertical list of features',
    category: 'features',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'personal'],
    tags: ['list', 'simple', 'clean'],
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
          props: { maxWidth: 'md' },
          style: { base: {} },
          actions: [],
          children: [
            {
              id: generateNodeId(),
              type: 'Stack',
              props: { direction: 'column', gap: 'lg' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: generateNodeId(),
                  type: 'Heading',
                  props: { level: 2, text: 'Why Choose Us' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'md' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Alert',
                      props: { title: '✓ No Credit Card Required', description: 'Start your free trial without any payment information.' },
                      style: { base: { backgroundColor: 'background' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Alert',
                      props: { title: '✓ Cancel Anytime', description: 'No long-term contracts. Cancel whenever you want.' },
                      style: { base: { backgroundColor: 'background' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Alert',
                      props: { title: '✓ 24/7 Customer Support', description: 'Our team is always ready to help you succeed.' },
                      style: { base: { backgroundColor: 'background' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Alert',
                      props: { title: '✓ 99.9% Uptime Guarantee', description: 'Reliable service you can count on.' },
                      style: { base: { backgroundColor: 'background' } },
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

// Register all feature templates
featureTemplates.forEach(template => templateRegistry.registerSection(template));

export { featureTemplates };
