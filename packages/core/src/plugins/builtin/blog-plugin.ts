import { z } from 'zod';
import type { PluginDefinition } from '../plugin-registry';
import type { ComponentDefinition } from '../../registry/component-registry';
import type { CollectionDefinition } from '../../schemas/collection';

// ============================================================================
// BLOG PLUGIN COMPONENTS
// ============================================================================

const PostListComponent: ComponentDefinition = {
  type: 'PostList',
  displayName: 'Blog Post List',
  description: 'Display a list of blog posts',
  icon: 'book-open',
  category: 'blog',
  canHaveChildren: true,
  defaultProps: {
    limit: 10,
    showExcerpt: true,
    showDate: true,
    showAuthor: false,
  },
  propsSchema: z.object({
    limit: z.number().min(1).max(50).default(10),
    showExcerpt: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showAuthor: z.boolean().default(false),
    showImage: z.boolean().default(true),
    layout: z.enum(['list', 'grid', 'cards']).default('list'),
    columns: z.number().min(1).max(4).default(3),
  }),
  dataBindings: [
    {
      name: 'posts',
      description: 'Blog posts from the posts collection',
      type: 'listRecords',
      collection: 'posts',
    },
  ],
  tags: ['blog', 'posts', 'list', 'articles'],
};

const PostCardComponent: ComponentDefinition = {
  type: 'PostCard',
  displayName: 'Blog Post Card',
  description: 'Display a single blog post card',
  icon: 'file-text',
  category: 'blog',
  canHaveChildren: false,
  defaultProps: {
    showExcerpt: true,
    showDate: true,
  },
  propsSchema: z.object({
    showExcerpt: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showAuthor: z.boolean().default(false),
    showImage: z.boolean().default(true),
    imagePosition: z.enum(['top', 'left', 'right']).default('top'),
  }),
  dataBindings: [
    {
      name: 'post',
      description: 'Current post record',
      type: 'currentRecord',
    },
  ],
  tags: ['blog', 'post', 'card', 'article'],
};

const PostContentComponent: ComponentDefinition = {
  type: 'PostContent',
  displayName: 'Blog Post Content',
  description: 'Display full blog post content',
  icon: 'file-text',
  category: 'blog',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    showTitle: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showAuthor: z.boolean().default(true),
    showImage: z.boolean().default(true),
  }),
  dataBindings: [
    {
      name: 'post',
      description: 'Current post record',
      type: 'currentRecord',
    },
  ],
  tags: ['blog', 'post', 'content', 'article'],
};

const PostMetaComponent: ComponentDefinition = {
  type: 'PostMeta',
  displayName: 'Post Meta Info',
  description: 'Display post metadata (date, author, category)',
  icon: 'info',
  category: 'blog',
  canHaveChildren: false,
  defaultProps: {
    showDate: true,
    showAuthor: true,
    showCategory: false,
  },
  propsSchema: z.object({
    showDate: z.boolean().default(true),
    showAuthor: z.boolean().default(true),
    showCategory: z.boolean().default(false),
    showReadTime: z.boolean().default(false),
  }),
  dataBindings: [
    {
      name: 'post',
      description: 'Current post record',
      type: 'currentRecord',
    },
  ],
  tags: ['blog', 'post', 'meta', 'info'],
};

// ============================================================================
// BLOG PLUGIN COLLECTIONS
// ============================================================================

const postsCollection: CollectionDefinition = {
  slug: 'posts',
  name: 'Blog Posts',
  description: 'Blog posts for your website',
  schema: [
    { name: 'title', type: 'text', required: true, validation: { min: 1, max: 200 } },
    { name: 'slug', type: 'slug', required: true, unique: true },
    { name: 'excerpt', type: 'text', required: false, validation: { max: 500 } },
    { name: 'content', type: 'richtext', required: false },
    { name: 'featuredImage', type: 'image', required: false },
    { name: 'publishedAt', type: 'datetime', required: false },
    { name: 'category', type: 'select', required: false, validation: { 
      options: ['General', 'News', 'Tutorial', 'Announcement'] 
    }},
    { name: 'tags', type: 'multiselect', required: false, validation: {
      options: ['featured', 'popular', 'new']
    }},
  ],
  isSystem: false,
  settings: {
    slugField: 'slug',
    titleField: 'title',
    timestamps: true,
  },
};

const categoriesCollection: CollectionDefinition = {
  slug: 'blog-categories',
  name: 'Blog Categories',
  description: 'Categories for blog posts',
  schema: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'slug', required: true, unique: true },
    { name: 'description', type: 'text', required: false },
    { name: 'color', type: 'color', required: false },
  ],
  isSystem: false,
  settings: {
    slugField: 'slug',
    titleField: 'name',
  },
};

// ============================================================================
// BLOG PLUGIN TEMPLATES
// ============================================================================

const blogPageTemplate = {
  id: 'blog-page',
  name: 'Blog Page',
  description: 'A blog listing page with featured posts',
  category: 'Blog',
  tree: {
    builderVersion: 1,
    root: {
      id: 'root',
      type: 'Section',
      props: {},
      style: { base: { padding: 'lg' } },
      actions: [],
      children: [
        {
          id: 'container',
          type: 'Container',
          props: { maxWidth: 'lg' },
          style: { base: {} },
          actions: [],
          children: [
            {
              id: 'heading',
              type: 'Heading',
              props: { level: 1, text: 'Blog' },
              style: { base: { marginBottom: 'lg' } },
              actions: [],
              children: [],
            },
            {
              id: 'post-list',
              type: 'PostList',
              props: { limit: 10, layout: 'grid', columns: 3 },
              style: { base: {} },
              actions: [],
              children: [],
            },
          ],
        },
      ],
    },
  },
};

// ============================================================================
// BLOG PLUGIN DEFINITION
// ============================================================================

export const blogPlugin: PluginDefinition = {
  id: 'blog',
  name: 'Blog',
  version: '1.0.0',
  description: 'Add blog functionality with posts, categories, and blog components',
  author: 'Builderly',
  
  components: [
    PostListComponent,
    PostCardComponent,
    PostContentComponent,
    PostMetaComponent,
  ],
  
  collections: [
    postsCollection,
    categoriesCollection,
  ],
  
  templates: [
    blogPageTemplate,
  ],
  
  onActivate: () => {
    console.log('Blog plugin activated');
  },
  
  onDeactivate: () => {
    console.log('Blog plugin deactivated');
  },
};
