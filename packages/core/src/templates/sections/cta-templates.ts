import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// CTA (CALL TO ACTION) SECTION TEMPLATES
// ============================================================================

const ctaTemplates: TemplateDefinition[] = [
  // CTA 1: Centered Simple
  {
    id: 'cta-centered-simple',
    name: 'Simple Centered CTA',
    description: 'Clean centered call-to-action with headline and button',
    category: 'cta',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'business', 'agency'],
    tags: ['centered', 'simple', 'button'],
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
                  type: 'Heading',
                  props: { level: 2, text: 'Ready to Get Started?' },
                  style: { base: { color: 'primary-foreground' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'Join thousands of satisfied customers and transform your business today.' },
                  style: { base: { color: 'primary-foreground' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Button',
                  props: { text: 'Start Your Free Trial', variant: 'secondary', size: 'lg' },
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
  },

  // CTA 2: With Email Signup
  {
    id: 'cta-email-signup',
    name: 'Email Signup CTA',
    description: 'Call-to-action with email input for newsletter signup',
    category: 'cta',
    style: 'modern',
    websiteTypes: ['landing', 'blog', 'business', 'saas'],
    tags: ['email', 'newsletter', 'signup'],
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
              props: { direction: 'column', gap: 'lg', align: 'center' },
              style: { base: { textAlign: 'center' } },
              actions: [],
              children: [
                {
                  id: generateNodeId(),
                  type: 'Heading',
                  props: { level: 2, text: 'Stay in the Loop' },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'Subscribe to our newsletter for the latest updates, tips, and exclusive offers.' },
                  style: { base: { color: 'muted-foreground' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'row', gap: 'sm', justify: 'center' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Input',
                      props: { placeholder: 'Enter your email', type: 'email' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Button',
                      props: { text: 'Subscribe', variant: 'primary' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'No spam, unsubscribe anytime.' },
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
  },

  // CTA 3: Split with Image
  {
    id: 'cta-split-image',
    name: 'Split CTA with Image',
    description: 'Two-column CTA with image on one side',
    category: 'cta',
    style: 'modern',
    websiteTypes: ['landing', 'business', 'agency'],
    tags: ['split', 'image', 'two-column'],
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
              type: 'Grid',
              props: { columns: 2, gap: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'lg', justify: 'center' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 2, text: 'Take Your Business to the Next Level' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Our platform provides everything you need to scale your business efficiently. Start your journey today.' },
                      style: { base: { color: 'muted-foreground' } },
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
                          props: { text: 'Get Started', variant: 'primary' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Schedule Demo', variant: 'outline' },
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
                  type: 'Image',
                  props: { src: 'https://placehold.co/500x400/e2e8f0/64748b?text=CTA+Image', alt: 'Call to action illustration' },
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
  },

  // CTA 4: Banner Style
  {
    id: 'cta-banner',
    name: 'Banner CTA',
    description: 'Horizontal banner style call-to-action',
    category: 'cta',
    style: 'bold',
    websiteTypes: ['landing', 'ecommerce', 'business'],
    tags: ['banner', 'horizontal', 'promotional'],
    node: {
      id: generateNodeId(),
      type: 'Section',
      props: {},
      style: { base: { padding: 'lg', backgroundColor: 'secondary' } },
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
                  type: 'Stack',
                  props: { direction: 'column', gap: 'xs' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 4, text: 'Limited Time Offer!' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Get 50% off your first year. Use code WELCOME50 at checkout.' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Button',
                  props: { text: 'Claim Offer', variant: 'primary' },
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
  },
];

// Register all CTA templates
ctaTemplates.forEach(template => templateRegistry.registerSection(template));

export { ctaTemplates };
