import type { BuilderTree } from '../../schemas/node';

export const demoPageTemplate: BuilderTree = {
  builderVersion: 1,
  root: {
    id: 'root',
    type: 'Section',
    props: {},
    style: {
      base: {
        padding: 'lg',
        backgroundColor: 'background',
      },
      mobile: {
        padding: 'md',
      },
    },
    actions: [],
    meta: { name: 'Demo Page' },
    children: [
      {
        id: 'container-1',
        type: 'Container',
        props: { maxWidth: '7xl', centered: true },
        style: { base: { padding: 'lg' }, mobile: { padding: 'md' } },
        actions: [],
        meta: { name: 'Hero Container' },
        children: [
          {
            id: 'heading-1',
            type: 'Heading',
            props: { text: 'Welcome to Builderly', level: 1 },
            style: {
              base: { textAlign: 'center', marginBottom: 'md', fontSize: '4xl' },
              mobile: { fontSize: '2xl', marginBottom: 'sm' },
            },
            actions: [],
            meta: { name: 'Hero Title' },
            children: [],
          },
          {
            id: 'text-1',
            type: 'Text',
            props: {
              text: 'This is a demo page built with the Builderly website builder platform. You can edit this page in the visual editor.',
            },
            style: {
              base: { color: 'muted-foreground', textAlign: 'center', fontSize: 'lg' },
              mobile: { fontSize: 'sm' },
            },
            actions: [],
            meta: { name: 'Hero Description' },
            children: [],
          },
          {
            id: 'stack-1',
            type: 'Stack',
            props: { gap: 'md', justify: 'center', direction: 'row' },
            style: {
              base: { marginTop: 'lg' },
              mobile: { flexDirection: 'column', marginTop: 'md', gap: 'sm' },
            },
            actions: [],
            meta: { name: 'CTA Buttons' },
            children: [
              {
                id: 'button-1',
                type: 'Button',
                props: { text: 'Get Started', variant: 'primary' },
                style: { base: {}, mobile: { width: '100%' } },
                actions: [
                  {
                    event: 'onClick',
                    action: { type: 'navigate', to: '/dashboard' },
                  },
                ],
                meta: { name: 'Primary CTA' },
                children: [],
              },
              {
                id: 'button-2',
                type: 'Button',
                props: { text: 'Learn More', variant: 'outline' },
                style: { base: {}, mobile: { width: '100%' } },
                actions: [
                  {
                    event: 'onClick',
                    action: { type: 'navigate', to: '#features' },
                  },
                ],
                meta: { name: 'Secondary CTA' },
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'divider-1',
        type: 'Divider',
        props: {},
        style: { base: { marginY: 'xl' }, mobile: { marginY: 'lg' } },
        actions: [],
        meta: { name: 'Divider' },
        children: [],
      },
      {
        id: 'container-2',
        type: 'Container',
        props: { maxWidth: '7xl', centered: true },
        style: { base: { padding: 'lg' }, mobile: { padding: 'md' } },
        actions: [],
        meta: { name: 'Features Container' },
        children: [
          {
            id: 'heading-2',
            type: 'Heading',
            props: { text: 'Features', level: 2 },
            style: {
              base: { textAlign: 'center', marginBottom: 'lg', fontSize: '3xl' },
              mobile: { fontSize: 'xl', marginBottom: 'md' },
            },
            actions: [],
            meta: { name: 'Features Heading' },
            children: [],
          },
          {
            id: 'grid-1',
            type: 'Grid',
            props: { gap: 'md', columns: 3 },
            style: {
              base: {},
              mobile: { gridColumns: 1, gap: 'md' },
            },
            actions: [],
            meta: { name: 'Features Grid' },
            children: [
              {
                id: 'card-1',
                type: 'Card',
                props: {
                  title: 'Visual Editor',
                  description: 'Drag and drop components to build your pages',
                },
                style: { base: {} },
                actions: [],
                meta: { name: 'Feature 1' },
                children: [],
              },
              {
                id: 'card-2',
                type: 'Card',
                props: {
                  title: 'CMS',
                  description: 'Manage your content with collections and records',
                },
                style: { base: {} },
                actions: [],
                meta: { name: 'Feature 2' },
                children: [],
              },
              {
                id: 'card-3',
                type: 'Card',
                props: {
                  title: 'E-Commerce',
                  description: 'Sell products with built-in shop functionality',
                },
                style: { base: {} },
                actions: [],
                meta: { name: 'Feature 3' },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
};
