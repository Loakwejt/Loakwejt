import { z } from 'zod';

// ============================================================================
// COLLECTION FIELD TYPES
// ============================================================================

export const CollectionFieldType = z.enum([
  'text',
  'richtext',
  'number',
  'boolean',
  'datetime',
  'date',
  'email',
  'url',
  'slug',
  'image',
  'file',
  'select',
  'multiselect',
  'relation',
  'json',
  'color',
]);

export type CollectionFieldType = z.infer<typeof CollectionFieldType>;

// ============================================================================
// COLLECTION FIELD SCHEMA
// ============================================================================

export const CollectionFieldSchema = z.object({
  name: z.string().min(1).max(64).regex(/^[a-zA-Z][a-zA-Z0-9_]*$/),
  type: CollectionFieldType,
  displayName: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  defaultValue: z.unknown().optional(),
  
  // Validation rules
  validation: z.object({
    min: z.number().optional(), // For text length or number value
    max: z.number().optional(),
    pattern: z.string().optional(), // Regex pattern for text
    options: z.array(z.string()).optional(), // For select/multiselect
  }).optional(),
  
  // Relation config
  relation: z.object({
    collection: z.string(),
    displayField: z.string().default('id'),
    multiple: z.boolean().default(false),
  }).optional(),
});

export type CollectionField = z.infer<typeof CollectionFieldSchema>;

// ============================================================================
// COLLECTION SCHEMA
// ============================================================================

export const CollectionSchemaDefinition = z.array(CollectionFieldSchema);

export type CollectionSchemaDefinition = z.infer<typeof CollectionSchemaDefinition>;

// ============================================================================
// COLLECTION DEFINITION
// ============================================================================

export const CollectionDefinitionSchema = z.object({
  slug: z.string().min(1).max(64).regex(/^[a-z][a-z0-9-]*$/),
  name: z.string().min(1).max(128),
  description: z.string().optional(),
  schema: CollectionSchemaDefinition,
  isSystem: z.boolean().default(false),
  
  // Settings
  settings: z.object({
    slugField: z.string().optional(), // Field to use for record slugs
    titleField: z.string().optional(), // Field to use as record title
    timestamps: z.boolean().default(true),
    softDelete: z.boolean().default(false),
  }).optional(),
});

export type CollectionDefinition = z.infer<typeof CollectionDefinitionSchema>;

// ============================================================================
// RECORD DATA VALIDATION
// ============================================================================

export function validateRecordData(
  data: unknown,
  schema: CollectionSchemaDefinition
): Record<string, unknown> {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Record data must be an object');
  }

  const record = data as Record<string, unknown>;
  const validated: Record<string, unknown> = {};

  for (const field of schema) {
    const value = record[field.name];

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      throw new Error(`Field "${field.name}" is required`);
    }

    // Skip undefined optional fields
    if (value === undefined) {
      if (field.defaultValue !== undefined) {
        validated[field.name] = field.defaultValue;
      }
      continue;
    }

    // Type validation
    validated[field.name] = validateFieldValue(value, field);
  }

  return validated;
}

function validateFieldValue(value: unknown, field: CollectionField): unknown {
  switch (field.type) {
    case 'text':
    case 'richtext':
    case 'slug':
    case 'color':
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a string`);
      }
      if (field.validation?.min && value.length < field.validation.min) {
        throw new Error(`Field "${field.name}" must be at least ${field.validation.min} characters`);
      }
      if (field.validation?.max && value.length > field.validation.max) {
        throw new Error(`Field "${field.name}" must be at most ${field.validation.max} characters`);
      }
      if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
        throw new Error(`Field "${field.name}" does not match required pattern`);
      }
      return value;

    case 'email':
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a string`);
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error(`Field "${field.name}" must be a valid email`);
      }
      return value;

    case 'url':
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a string`);
      }
      try {
        new URL(value);
      } catch {
        throw new Error(`Field "${field.name}" must be a valid URL`);
      }
      return value;

    case 'number':
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (typeof num !== 'number' || isNaN(num)) {
        throw new Error(`Field "${field.name}" must be a number`);
      }
      if (field.validation?.min !== undefined && num < field.validation.min) {
        throw new Error(`Field "${field.name}" must be at least ${field.validation.min}`);
      }
      if (field.validation?.max !== undefined && num > field.validation.max) {
        throw new Error(`Field "${field.name}" must be at most ${field.validation.max}`);
      }
      return num;

    case 'boolean':
      if (typeof value === 'string') {
        return value === 'true' || value === '1';
      }
      return Boolean(value);

    case 'datetime':
    case 'date':
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error(`Field "${field.name}" must be a valid date`);
        }
        return date.toISOString();
      }
      throw new Error(`Field "${field.name}" must be a valid date`);

    case 'select':
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a string`);
      }
      if (field.validation?.options && !field.validation.options.includes(value)) {
        throw new Error(`Field "${field.name}" must be one of: ${field.validation.options.join(', ')}`);
      }
      return value;

    case 'multiselect':
      if (!Array.isArray(value)) {
        throw new Error(`Field "${field.name}" must be an array`);
      }
      if (field.validation?.options) {
        for (const v of value) {
          if (!field.validation.options.includes(v as string)) {
            throw new Error(`Field "${field.name}" contains invalid value`);
          }
        }
      }
      return value;

    case 'image':
    case 'file':
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a URL string`);
      }
      return value;

    case 'relation':
      // Relations store IDs
      if (field.relation?.multiple) {
        if (!Array.isArray(value)) {
          throw new Error(`Field "${field.name}" must be an array of IDs`);
        }
        return value;
      }
      if (typeof value !== 'string') {
        throw new Error(`Field "${field.name}" must be a record ID`);
      }
      return value;

    case 'json':
      // Accept any JSON-serializable value
      return value;

    default:
      return value;
  }
}

// ============================================================================
// DATA BINDING TYPES
// ============================================================================

export const DataBindingSchema = z.object({
  type: z.enum(['currentRecord', 'listRecords', 'formField', 'urlParam', 'state', 'user']),
  collection: z.string().optional(),
  field: z.string().optional(),
  param: z.string().optional(),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith']),
    value: z.unknown(),
  })).optional(),
  sort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
  limit: z.number().optional(),
});

export type DataBinding = z.infer<typeof DataBindingSchema>;
