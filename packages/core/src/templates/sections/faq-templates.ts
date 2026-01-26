import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// FAQ SECTION TEMPLATES
// ============================================================================

const faqTemplates: TemplateDefinition[] = [
  // FAQ 1: Simple List
  {
    id: 'faq-simple-list',
    name: 'Simple FAQ List',
    description: 'Clean FAQ section with questions and answers',
    category: 'faq',
    style: 'minimal',
    websiteTypes: ['landing', 'saas', 'business', 'ecommerce'],
    tags: ['list', 'simple', 'questions'],
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
                      props: { level: 2, text: 'Frequently Asked Questions' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Find answers to common questions about our product.' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
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
                      type: 'Card',
                      props: { title: 'How do I get started?', description: 'Simply sign up for a free account and you can start using our platform immediately. No credit card required.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Can I cancel my subscription anytime?', description: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Is there a free trial?', description: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'What payment methods do you accept?', description: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal.' },
                      style: { base: { padding: 'lg' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Card',
                      props: { title: 'Do you offer customer support?', description: 'Yes, our support team is available 24/7 via email and live chat. Premium plans include phone support.' },
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

  // FAQ 2: Two Column
  {
    id: 'faq-two-column',
    name: 'Two Column FAQ',
    description: 'FAQ section with questions in two columns',
    category: 'faq',
    style: 'modern',
    websiteTypes: ['landing', 'saas', 'business'],
    tags: ['two-column', 'grid', 'compact'],
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
                  props: { level: 2, text: 'Common Questions' },
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
                      type: 'Stack',
                      props: { direction: 'column', gap: 'sm' },
                      style: { base: {} },
                      actions: [],
                      children: [
                        {
                          id: generateNodeId(),
                          type: 'Heading',
                          props: { level: 5, text: 'What makes your product different?' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Our focus on user experience and powerful features sets us apart from the competition.' },
                          style: { base: { color: 'muted-foreground' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
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
                          props: { level: 5, text: 'Is my data secure?' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Yes, we use industry-standard encryption and security practices to protect your data.' },
                          style: { base: { color: 'muted-foreground' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
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
                          props: { level: 5, text: 'Can I upgrade my plan later?' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Absolutely! You can upgrade or downgrade your plan at any time from your dashboard.' },
                          style: { base: { color: 'muted-foreground' } },
                          actions: [],
                          children: [],
                        },
                      ],
                    },
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
                          props: { level: 5, text: 'Do you offer refunds?' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Text',
                          props: { text: 'Yes, we offer a 30-day money-back guarantee if you are not satisfied with our product.' },
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
  },
];

// Register all FAQ templates
faqTemplates.forEach(template => templateRegistry.registerSection(template));

export { faqTemplates };
