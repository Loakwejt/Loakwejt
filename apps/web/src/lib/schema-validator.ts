import { z, ZodTypeAny } from 'zod';

/**
 * Collection schema field types
 */
export type FieldType =
  | 'text'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'email'
  | 'url'
  | 'image'
  | 'file'
  | 'relation'
  | 'json';

export interface FieldDefinition {
  type: FieldType;
  label: string;
  required?: boolean;
  description?: string;
  defaultValue?: unknown;
  // Type-specific options
  options?: string[]; // for select/multiselect
  min?: number; // for number
  max?: number; // for number
  minLength?: number; // for text
  maxLength?: number; // for text
  pattern?: string; // regex for text
  relationCollection?: string; // for relation type
}

export interface CollectionSchema {
  fields: Record<string, FieldDefinition>;
}

/**
 * Converts a collection schema to a Zod schema for validation
 */
export function buildZodSchema(collectionSchema: CollectionSchema): z.ZodObject<Record<string, ZodTypeAny>> {
  const shape: Record<string, ZodTypeAny> = {};

  for (const [fieldName, fieldDef] of Object.entries(collectionSchema.fields)) {
    let fieldSchema: ZodTypeAny;

    switch (fieldDef.type) {
      case 'text':
        fieldSchema = z.string();
        if (fieldDef.minLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).min(fieldDef.minLength);
        }
        if (fieldDef.maxLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(fieldDef.maxLength);
        }
        if (fieldDef.pattern) {
          fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(fieldDef.pattern));
        }
        break;

      case 'richtext':
        fieldSchema = z.string();
        break;

      case 'number':
        fieldSchema = z.number();
        if (fieldDef.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(fieldDef.min);
        }
        if (fieldDef.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(fieldDef.max);
        }
        break;

      case 'boolean':
        fieldSchema = z.boolean();
        break;

      case 'date':
        fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
        break;

      case 'datetime':
        fieldSchema = z.string().datetime();
        break;

      case 'select':
        if (fieldDef.options && fieldDef.options.length > 0) {
          fieldSchema = z.enum(fieldDef.options as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;

      case 'multiselect':
        if (fieldDef.options && fieldDef.options.length > 0) {
          fieldSchema = z.array(z.enum(fieldDef.options as [string, ...string[]]));
        } else {
          fieldSchema = z.array(z.string());
        }
        break;

      case 'email':
        fieldSchema = z.string().email();
        break;

      case 'url':
        fieldSchema = z.string().url();
        break;

      case 'image':
      case 'file':
        // Asset reference (URL or asset ID)
        fieldSchema = z.string();
        break;

      case 'relation':
        // Record ID reference
        fieldSchema = z.string();
        break;

      case 'json':
        fieldSchema = z.any();
        break;

      default:
        fieldSchema = z.any();
    }

    // Apply required/optional
    if (!fieldDef.required) {
      fieldSchema = fieldSchema.optional().nullable();
    }

    shape[fieldName] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Validates record data against a collection schema
 */
export function validateRecordData(
  data: Record<string, unknown>,
  collectionSchema: CollectionSchema
): { valid: boolean; errors: z.ZodError | null; data: Record<string, unknown> | null } {
  try {
    const zodSchema = buildZodSchema(collectionSchema);
    const validated = zodSchema.parse(data);
    return { valid: true, errors: null, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error, data: null };
    }
    throw error;
  }
}

/**
 * Get default values for a collection schema
 */
export function getDefaultValues(collectionSchema: CollectionSchema): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const [fieldName, fieldDef] of Object.entries(collectionSchema.fields)) {
    if (fieldDef.defaultValue !== undefined) {
      defaults[fieldName] = fieldDef.defaultValue;
    } else {
      // Set sensible defaults based on type
      switch (fieldDef.type) {
        case 'text':
        case 'richtext':
        case 'email':
        case 'url':
        case 'select':
          defaults[fieldName] = '';
          break;
        case 'number':
          defaults[fieldName] = 0;
          break;
        case 'boolean':
          defaults[fieldName] = false;
          break;
        case 'multiselect':
          defaults[fieldName] = [];
          break;
        case 'date':
        case 'datetime':
        case 'image':
        case 'file':
        case 'relation':
          defaults[fieldName] = null;
          break;
        case 'json':
          defaults[fieldName] = {};
          break;
        default:
          defaults[fieldName] = null;
      }
    }
  }

  return defaults;
}

/**
 * Built-in collection templates
 */
export const COLLECTION_TEMPLATES = {
  blog: {
    name: 'Blog Posts',
    description: 'Standard blog post collection',
    schema: {
      fields: {
        title: { type: 'text', label: 'Title', required: true, maxLength: 200 },
        slug: { type: 'text', label: 'Slug', required: true, maxLength: 100, pattern: '^[a-z0-9-]+$' },
        excerpt: { type: 'text', label: 'Excerpt', maxLength: 300 },
        content: { type: 'richtext', label: 'Content', required: true },
        featuredImage: { type: 'image', label: 'Featured Image' },
        author: { type: 'text', label: 'Author' },
        publishedAt: { type: 'datetime', label: 'Published At' },
        tags: { type: 'multiselect', label: 'Tags', options: ['News', 'Tutorial', 'Update', 'Guide'] },
      },
    },
  },
  products: {
    name: 'Products',
    description: 'E-commerce product collection',
    schema: {
      fields: {
        name: { type: 'text', label: 'Product Name', required: true, maxLength: 200 },
        slug: { type: 'text', label: 'Slug', required: true, maxLength: 100 },
        description: { type: 'richtext', label: 'Description' },
        price: { type: 'number', label: 'Price', required: true, min: 0 },
        salePrice: { type: 'number', label: 'Sale Price', min: 0 },
        sku: { type: 'text', label: 'SKU', maxLength: 50 },
        image: { type: 'image', label: 'Product Image' },
        gallery: { type: 'json', label: 'Image Gallery' },
        category: { type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Home', 'Other'] },
        inStock: { type: 'boolean', label: 'In Stock', defaultValue: true },
      },
    },
  },
  team: {
    name: 'Team Members',
    description: 'Team/staff member profiles',
    schema: {
      fields: {
        name: { type: 'text', label: 'Full Name', required: true, maxLength: 100 },
        role: { type: 'text', label: 'Job Title', required: true, maxLength: 100 },
        bio: { type: 'richtext', label: 'Biography' },
        photo: { type: 'image', label: 'Photo' },
        email: { type: 'email', label: 'Email' },
        linkedin: { type: 'url', label: 'LinkedIn URL' },
        twitter: { type: 'url', label: 'Twitter URL' },
        order: { type: 'number', label: 'Display Order', defaultValue: 0 },
      },
    },
  },
  faq: {
    name: 'FAQs',
    description: 'Frequently asked questions',
    schema: {
      fields: {
        question: { type: 'text', label: 'Question', required: true, maxLength: 300 },
        answer: { type: 'richtext', label: 'Answer', required: true },
        category: { type: 'select', label: 'Category', options: ['General', 'Billing', 'Technical', 'Other'] },
        order: { type: 'number', label: 'Display Order', defaultValue: 0 },
      },
    },
  },
  testimonials: {
    name: 'Testimonials',
    description: 'Customer testimonials and reviews',
    schema: {
      fields: {
        quote: { type: 'richtext', label: 'Quote', required: true },
        author: { type: 'text', label: 'Author Name', required: true, maxLength: 100 },
        title: { type: 'text', label: 'Author Title', maxLength: 100 },
        company: { type: 'text', label: 'Company', maxLength: 100 },
        avatar: { type: 'image', label: 'Avatar' },
        rating: { type: 'number', label: 'Rating', min: 1, max: 5 },
      },
    },
  },
} as const;
