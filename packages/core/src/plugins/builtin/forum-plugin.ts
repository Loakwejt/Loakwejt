import { z } from 'zod';
import type { PluginDefinition } from '../plugin-registry';
import type { ComponentDefinition } from '../../registry/component-registry';
import type { CollectionDefinition } from '../../schemas/collection';

// ============================================================================
// FORUM PLUGIN COMPONENTS
// ============================================================================

const ForumCategoryListComponent: ComponentDefinition = {
  type: 'ForumCategoryList',
  displayName: 'Forum Categories',
  description: 'Display a list of forum categories',
  icon: 'folder',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {
    showDescription: true,
    showThreadCount: true,
  },
  propsSchema: z.object({
    showDescription: z.boolean().default(true),
    showThreadCount: z.boolean().default(true),
    showPostCount: z.boolean().default(true),
    layout: z.enum(['list', 'grid']).default('list'),
  }),
  dataBindings: [
    {
      name: 'categories',
      description: 'Forum categories',
      type: 'listRecords',
      collection: 'forum-categories',
    },
  ],
  tags: ['forum', 'categories', 'list'],
};

const ThreadListComponent: ComponentDefinition = {
  type: 'ThreadList',
  displayName: 'Thread List',
  description: 'Display a list of forum threads',
  icon: 'message-square',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {
    limit: 20,
    showAuthor: true,
  },
  propsSchema: z.object({
    limit: z.number().min(1).max(100).default(20),
    showAuthor: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showReplyCount: z.boolean().default(true),
    showPinned: z.boolean().default(true),
    categoryId: z.string().optional(),
  }),
  dataBindings: [
    {
      name: 'threads',
      description: 'Forum threads',
      type: 'listRecords',
      collection: 'forum-threads',
    },
  ],
  tags: ['forum', 'threads', 'list', 'topics'],
};

const ThreadCardComponent: ComponentDefinition = {
  type: 'ThreadCard',
  displayName: 'Thread Card',
  description: 'Display a single thread card',
  icon: 'message-square',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {
    showAuthor: true,
    showDate: true,
  },
  propsSchema: z.object({
    showAuthor: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showReplyCount: z.boolean().default(true),
    showLastReply: z.boolean().default(true),
  }),
  dataBindings: [
    {
      name: 'thread',
      description: 'Current thread',
      type: 'currentRecord',
    },
  ],
  tags: ['forum', 'thread', 'card'],
};

const ThreadDetailComponent: ComponentDefinition = {
  type: 'ThreadDetail',
  displayName: 'Thread Detail',
  description: 'Display full thread with posts',
  icon: 'message-square',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    showReplyForm: z.boolean().default(true),
    postsPerPage: z.number().min(5).max(100).default(20),
  }),
  dataBindings: [
    {
      name: 'thread',
      description: 'Current thread',
      type: 'currentRecord',
    },
  ],
  tags: ['forum', 'thread', 'detail', 'posts'],
};

const ForumPostComponent: ComponentDefinition = {
  type: 'ForumPost',
  displayName: 'Forum Post',
  description: 'Display a single forum post',
  icon: 'message-circle',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    showAuthor: z.boolean().default(true),
    showDate: z.boolean().default(true),
    showActions: z.boolean().default(true),
  }),
  dataBindings: [
    {
      name: 'post',
      description: 'Current post',
      type: 'currentRecord',
    },
  ],
  tags: ['forum', 'post', 'reply'],
};

const NewThreadFormComponent: ComponentDefinition = {
  type: 'NewThreadForm',
  displayName: 'New Thread Form',
  description: 'Form to create a new thread',
  icon: 'plus-square',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    categoryId: z.string().optional(),
    redirectAfterSubmit: z.string().optional(),
  }),
  tags: ['forum', 'form', 'thread', 'new'],
};

const ReplyFormComponent: ComponentDefinition = {
  type: 'ReplyForm',
  displayName: 'Reply Form',
  description: 'Form to reply to a thread',
  icon: 'reply',
  category: 'forum',
  canHaveChildren: false,
  defaultProps: {},
  propsSchema: z.object({
    placeholder: z.string().default('Write your reply...'),
    submitText: z.string().default('Post Reply'),
  }),
  tags: ['forum', 'form', 'reply', 'post'],
};

// ============================================================================
// FORUM PLUGIN COLLECTIONS
// ============================================================================

const forumCategoriesCollection: CollectionDefinition = {
  slug: 'forum-categories',
  name: 'Forum Categories',
  description: 'Categories for organizing forum threads',
  schema: [
    { name: 'name', type: 'text', required: true, validation: { min: 1, max: 100 } },
    { name: 'slug', type: 'slug', required: true, unique: true },
    { name: 'description', type: 'text', required: false },
    { name: 'order', type: 'number', required: false, defaultValue: 0 },
    { name: 'icon', type: 'text', required: false },
    { name: 'color', type: 'color', required: false },
  ],
  isSystem: false,
  settings: {
    slugField: 'slug',
    titleField: 'name',
  },
};

const forumThreadsCollection: CollectionDefinition = {
  slug: 'forum-threads',
  name: 'Forum Threads',
  description: 'Discussion threads',
  schema: [
    { name: 'title', type: 'text', required: true, validation: { min: 1, max: 200 } },
    { name: 'slug', type: 'slug', required: true, unique: true },
    { name: 'categoryId', type: 'relation', required: true, relation: {
      collection: 'forum-categories',
      displayField: 'name',
      multiple: false,
    }},
    { name: 'authorEmail', type: 'email', required: true },
    { name: 'isPinned', type: 'boolean', required: false, defaultValue: false },
    { name: 'isLocked', type: 'boolean', required: false, defaultValue: false },
    { name: 'viewCount', type: 'number', required: false, defaultValue: 0 },
    { name: 'replyCount', type: 'number', required: false, defaultValue: 0 },
    { name: 'lastReplyAt', type: 'datetime', required: false },
  ],
  isSystem: false,
  settings: {
    slugField: 'slug',
    titleField: 'title',
    timestamps: true,
  },
};

const forumPostsCollection: CollectionDefinition = {
  slug: 'forum-posts',
  name: 'Forum Posts',
  description: 'Replies to threads',
  schema: [
    { name: 'threadId', type: 'relation', required: true, relation: {
      collection: 'forum-threads',
      displayField: 'title',
      multiple: false,
    }},
    { name: 'authorEmail', type: 'email', required: true },
    { name: 'content', type: 'richtext', required: true },
    { name: 'isFirstPost', type: 'boolean', required: false, defaultValue: false },
  ],
  isSystem: false,
  settings: {
    timestamps: true,
  },
};

// ============================================================================
// FORUM PLUGIN DEFINITION
// ============================================================================

export const forumPlugin: PluginDefinition = {
  id: 'forum',
  name: 'Forum',
  version: '1.0.0',
  description: 'Add community forum functionality with categories, threads, and posts',
  author: 'Builderly',
  
  components: [
    ForumCategoryListComponent,
    ThreadListComponent,
    ThreadCardComponent,
    ThreadDetailComponent,
    ForumPostComponent,
    NewThreadFormComponent,
    ReplyFormComponent,
  ],
  
  collections: [
    forumCategoriesCollection,
    forumThreadsCollection,
    forumPostsCollection,
  ],
  
  templates: [
    {
      id: 'forum-home',
      name: 'Forum Home',
      description: 'Forum homepage with categories',
      category: 'Forum',
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
                  props: { level: 1, text: 'Community Forum' },
                  style: { base: { marginBottom: 'lg' } },
                  actions: [],
                  children: [],
                },
                {
                  id: 'categories',
                  type: 'ForumCategoryList',
                  props: {},
                  style: { base: {} },
                  actions: [],
                  children: [],
                },
              ],
            },
          ],
        },
      },
    },
  ],
  
  onActivate: () => {
    console.log('Forum plugin activated');
  },
  
  onDeactivate: () => {
    console.log('Forum plugin deactivated');
  },
};
