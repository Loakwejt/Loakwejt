import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// HERO SECTION TEMPLATES
// ============================================================================

const heroTemplates: TemplateDefinition[] = [
  // Hero 1: Centered with CTA
  {
    id: 'hero-centered-cta',
    name: 'Centered Hero with CTA',
    description: 'A clean centered hero section with headline, subtext and call-to-action buttons',
    category: 'hero',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'business', 'agency'],
    tags: ['centered', 'cta', 'buttons', 'clean'],
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
                  type: 'Badge',
                  props: { text: 'New Release', variant: 'secondary' },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Heading',
                  props: { level: 1, text: 'Build Amazing Websites Without Code' },
                  style: { base: { marginBottom: 'sm' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'Create stunning, professional websites in minutes with our intuitive drag-and-drop builder. No coding skills required.' },
                  style: { base: { color: 'muted-foreground', fontSize: 'lg' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'row', gap: 'md', justify: 'center' },
                  style: { base: { marginTop: 'md' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Button',
                      props: { text: 'Get Started Free', variant: 'primary', size: 'lg' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Button',
                      props: { text: 'Watch Demo', variant: 'outline', size: 'lg' },
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
  },

  // Hero 2: Split with Image
  {
    id: 'hero-split-image',
    name: 'Split Hero with Image',
    description: 'Two-column hero with text on left and image on right',
    category: 'hero',
    style: 'modern',
    websiteTypes: ['landing', 'saas', 'business', 'portfolio'],
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
                  props: { direction: 'column', gap: 'md', justify: 'center' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 1, text: 'Transform Your Business with Modern Solutions' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Streamline your workflow, boost productivity, and achieve your goals faster with our cutting-edge platform designed for modern businesses.' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'row', gap: 'sm' },
                      style: { base: { marginTop: 'md' } },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Start Free Trial', variant: 'primary' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Learn More', variant: 'ghost' },
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
                  props: { src: 'https://placehold.co/600x400/e2e8f0/64748b?text=Hero+Image', alt: 'Hero illustration' },
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

  // Hero 3: With Background Gradient
  {
    id: 'hero-gradient-bg',
    name: 'Gradient Background Hero',
    description: 'Bold hero section with gradient background',
    category: 'hero',
    style: 'bold',
    websiteTypes: ['landing', 'saas', 'agency', 'event'],
    tags: ['gradient', 'bold', 'colorful'],
    node: {
      id: generateNodeId(),
      type: 'Section',
      props: {},
      style: { base: { padding: '2xl', backgroundColor: 'primary' } },
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
                  props: { level: 1, text: 'The Future of Web Development is Here' },
                  style: { base: { color: 'primary-foreground' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'Join thousands of developers and designers who are building the next generation of web experiences.' },
                  style: { base: { color: 'primary-foreground', fontSize: 'lg' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Button',
                  props: { text: 'Join the Waitlist', variant: 'secondary', size: 'lg' },
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

  // Hero 4: Video Background Style
  {
    id: 'hero-video-style',
    name: 'Video-Style Hero',
    description: 'Full-width hero designed for video backgrounds',
    category: 'hero',
    style: 'modern',
    websiteTypes: ['landing', 'event', 'agency', 'portfolio'],
    tags: ['video', 'fullwidth', 'dark'],
    node: {
      id: generateNodeId(),
      type: 'Section',
      props: {},
      style: { base: { padding: '3xl', backgroundColor: 'muted' } },
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
                  props: { level: 1, text: 'Create. Inspire. Transform.' },
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Text',
                  props: { text: 'Unleash your creativity and bring your vision to life.' },
                  style: { base: { color: 'muted-foreground', fontSize: 'xl' } },
                  actions: [],
                  children: [],
                },
                {
                  id: generateNodeId(),
                  type: 'Button',
                  props: { text: 'Explore Now', variant: 'primary', size: 'lg' },
                  style: { base: { marginTop: 'md' } },
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

  // Hero 5: Product Showcase
  {
    id: 'hero-product-showcase',
    name: 'Product Showcase Hero',
    description: 'Hero section designed to showcase a product with image',
    category: 'hero',
    style: 'elegant',
    websiteTypes: ['ecommerce', 'saas', 'landing'],
    tags: ['product', 'showcase', 'image'],
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
              props: { direction: 'column', gap: 'xl', align: 'center' },
              style: { base: { textAlign: 'center' } },
              actions: [],
              children: [
                {
                  id: generateNodeId(),
                  type: 'Stack',
                  props: { direction: 'column', gap: 'md', align: 'center' },
                  style: { base: {} },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Heading',
                      props: { level: 1, text: 'Introducing Our Latest Innovation' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Experience the perfect blend of form and function with our award-winning design.' },
                      style: { base: { color: 'muted-foreground' } },
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
                          props: { text: 'Buy Now', variant: 'primary' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'View Details', variant: 'outline' },
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
                  props: { src: 'https://placehold.co/800x500/e2e8f0/64748b?text=Product+Image', alt: 'Product showcase' },
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
];

// Register all hero templates
heroTemplates.forEach(template => templateRegistry.registerSection(template));

export { heroTemplates };
