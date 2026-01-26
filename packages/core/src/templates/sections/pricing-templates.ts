import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// PRICING SECTION TEMPLATES
// ============================================================================

const pricingTemplates: TemplateDefinition[] = [
  // Pricing 1: Three Tier
  {
    id: 'pricing-three-tier',
    name: 'Three-Tier Pricing',
    description: 'Classic three-tier pricing table with highlighted plan',
    category: 'pricing',
    style: 'minimal',
    websiteTypes: ['saas', 'landing', 'business'],
    tags: ['three-tier', 'popular', 'comparison'],
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
                      props: { level: 2, text: 'Simple, Transparent Pricing' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Choose the plan that works best for you. All plans include a 14-day free trial.' },
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
                    // Starter Plan
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Starter', description: 'Perfect for getting started' },
                      style: { base: { padding: 'lg' } },
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
                              type: 'Heading',
                              props: { level: 3, text: '$9/mo' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '• 1 Project\n• 1GB Storage\n• Email Support\n• Basic Analytics' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Get Started', variant: 'outline' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    // Pro Plan (Popular)
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Pro', description: 'Most popular choice' },
                      style: { base: { padding: 'lg', backgroundColor: 'primary' } },
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
                              type: 'Badge',
                              props: { text: 'Popular', variant: 'secondary' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Heading',
                              props: { level: 3, text: '$29/mo' },
                              style: { base: { color: 'primary-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '• 10 Projects\n• 25GB Storage\n• Priority Support\n• Advanced Analytics\n• Custom Domain' },
                              style: { base: { color: 'primary-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Get Started', variant: 'secondary' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    // Enterprise Plan
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Enterprise', description: 'For large organizations' },
                      style: { base: { padding: 'lg' } },
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
                              type: 'Heading',
                              props: { level: 3, text: '$99/mo' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '• Unlimited Projects\n• 100GB Storage\n• 24/7 Phone Support\n• Full Analytics Suite\n• SSO & Security' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Contact Sales', variant: 'outline' },
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
      ],
    },
  },

  // Pricing 2: Simple Two-Tier
  {
    id: 'pricing-two-tier',
    name: 'Two-Tier Pricing',
    description: 'Simple two-plan pricing comparison',
    category: 'pricing',
    style: 'minimal',
    websiteTypes: ['saas', 'landing', 'personal'],
    tags: ['two-tier', 'simple', 'comparison'],
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
          props: { maxWidth: 'lg' },
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
                  props: { level: 2, text: 'Choose Your Plan' },
                  style: { base: { textAlign: 'center' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Grid',
                  props: { columns: 2, gap: 'lg' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Free', description: 'Get started at no cost' },
                      style: { base: { padding: 'xl', backgroundColor: 'background' } },
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
                              type: 'Heading',
                              props: { level: 2, text: '$0' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'Forever free for personal use' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Start Free', variant: 'outline' },
                              style: { base: {} },
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
                      props: { title: 'Pro', description: 'Everything you need' },
                      style: { base: { padding: 'xl', backgroundColor: 'background' } },
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
                              type: 'Heading',
                              props: { level: 2, text: '$19/mo' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'For professionals and teams' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Upgrade to Pro', variant: 'primary' },
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
      ],
    },
  },
];

// Register all pricing templates
pricingTemplates.forEach(template => templateRegistry.registerSection(template));

export { pricingTemplates };
