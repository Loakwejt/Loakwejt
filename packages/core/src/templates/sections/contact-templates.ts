import { templateRegistry, type TemplateDefinition } from '../template-registry';
import { generateNodeId } from '../../schemas/node';

// ============================================================================
// CONTACT SECTION TEMPLATES
// ============================================================================

const contactTemplates: TemplateDefinition[] = [
  // Contact 1: Simple Form
  {
    id: 'contact-simple-form',
    name: 'Simple Contact Form',
    description: 'Basic contact form with name, email, and message',
    category: 'contact',
    style: 'minimal',
    websiteTypes: ['landing', 'business', 'agency', 'portfolio'],
    tags: ['form', 'simple', 'email'],
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
                      props: { level: 2, text: 'Get in Touch' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'Have a question or want to work together? We\'d love to hear from you.' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                  ],
                },
                {
                  id: generateNodeId(),
                  type: 'Form',
                  props: {},
                  style: { base: {} },
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
                          type: 'Grid',
                          props: { columns: 2, gap: 'md' },
                          style: { base: {} },
                          actions: [],
                          children: [
                            {
                              id: generateNodeId(),
                              type: 'Input',
                              props: { label: 'First Name', placeholder: 'John', name: 'firstName' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Input',
                              props: { label: 'Last Name', placeholder: 'Doe', name: 'lastName' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                          ],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Input',
                          props: { label: 'Email', placeholder: 'john@example.com', type: 'email', name: 'email' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Input',
                          props: { label: 'Subject', placeholder: 'How can we help?', name: 'subject' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Textarea',
                          props: { label: 'Message', placeholder: 'Tell us more about your project...', name: 'message' },
                          style: { base: {} },
                          actions: [],
                          children: [],
                        },
                        {
                          id: generateNodeId(),
                          type: 'Button',
                          props: { text: 'Send Message', variant: 'primary' },
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

  // Contact 2: Split with Info
  {
    id: 'contact-split-info',
    name: 'Contact with Info',
    description: 'Contact form with company information on the side',
    category: 'contact',
    style: 'modern',
    websiteTypes: ['business', 'agency', 'landing'],
    tags: ['split', 'info', 'address'],
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
              type: 'Grid',
              props: { columns: 2, gap: 'xl' },
              style: { base: {} },
              actions: [],
              children: [
                // Contact Info
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
                      props: { level: 2, text: 'Contact Us' },
                      style: { base: {} },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Text',
                      props: { text: 'We\'re here to help and answer any questions you might have. We look forward to hearing from you.' },
                      style: { base: { color: 'muted-foreground' } },
                      actions: [],
                      children: [],
                    },
                    {
                      id: generateNodeId(),
                      type: 'Stack',
                      props: { direction: 'column', gap: 'md' },
                      style: { base: { marginTop: 'md' } },
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
                              type: 'Text',
                              props: { text: '📧 Email' },
                              style: { base: { fontWeight: 'semibold' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: 'hello@company.com' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                          ],
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
                              props: { text: '📞 Phone' },
                              style: { base: { fontWeight: 'semibold' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '+1 (555) 123-4567' },
                              style: { base: { color: 'muted-foreground' } },
                              actions: [],
                              children: [],
                            },
                          ],
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
                              props: { text: '📍 Address' },
                              style: { base: { fontWeight: 'semibold' } },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Text',
                              props: { text: '123 Business Street\nSuite 100\nNew York, NY 10001' },
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
                // Contact Form
                {
                  id: generateNodeId(),
                  type: 'Card',
                  props: { title: '', description: '' },
                  style: { base: { padding: 'xl', backgroundColor: 'background' } },
                  actions: [],
                  children: [
                    {
                      id: generateNodeId(),
                      type: 'Form',
                      props: {},
                      style: { base: {} },
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
                              type: 'Input',
                              props: { label: 'Name', placeholder: 'Your name', name: 'name' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Input',
                              props: { label: 'Email', placeholder: 'your@email.com', type: 'email', name: 'email' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Textarea',
                              props: { label: 'Message', placeholder: 'How can we help?', name: 'message' },
                              style: { base: {} },
                              actions: [],
                              children: [],
                            },
                            {
                              id: generateNodeId(),
                              type: 'Button',
                              props: { text: 'Send Message', variant: 'primary' },
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

// Register all contact templates
contactTemplates.forEach(template => templateRegistry.registerSection(template));

export { contactTemplates };
