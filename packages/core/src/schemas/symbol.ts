import { z } from 'zod';
import { BuilderNodeSchema } from './node';

// ============================================================================
// GLOBAL SYMBOL - Reusable component definition
// ============================================================================

/**
 * A Symbol is a reusable component that can be placed multiple times
 * across different pages. Changes to the master symbol update all instances.
 */
export const SymbolDefinitionSchema = z.object({
  // Unique identifier
  id: z.string().min(1),
  
  // Display name
  name: z.string().min(1),
  
  // Optional description
  description: z.string().optional(),
  
  // Category for organization
  category: z.string().optional(),
  
  // The component tree (stored without ID to generate unique IDs on instantiation)
  tree: BuilderNodeSchema,
  
  // Thumbnail/preview image URL
  thumbnailUrl: z.string().optional(),
  
  // Timestamps
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type SymbolDefinition = z.infer<typeof SymbolDefinitionSchema>;

// ============================================================================
// SYMBOL INSTANCE - A placed instance of a symbol on a page
// ============================================================================

/**
 * When a symbol is placed on a page, it becomes a SymbolInstance.
 * The instance references the master symbol and can have overrides.
 */
export const SymbolInstancePropsSchema = z.object({
  // Reference to the master symbol
  symbolId: z.string().min(1),
  
  // Optional prop overrides (for future extensibility)
  overrides: z.record(z.unknown()).optional(),
  
  // Whether this instance is detached from the master
  isDetached: z.boolean().optional(),
});

export type SymbolInstanceProps = z.infer<typeof SymbolInstancePropsSchema>;

// ============================================================================
// SYMBOL CATEGORIES - For organization
// ============================================================================

export const DEFAULT_SYMBOL_CATEGORIES = [
  { id: 'headers', name: 'Header', icon: '📑' },
  { id: 'footers', name: 'Footer', icon: '📝' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' },
  { id: 'cards', name: 'Karten', icon: '🃏' },
  { id: 'forms', name: 'Formulare', icon: '📋' },
  { id: 'sections', name: 'Sektionen', icon: '📐' },
  { id: 'cta', name: 'Call to Action', icon: '📢' },
  { id: 'testimonials', name: 'Testimonials', icon: '💬' },
  { id: 'features', name: 'Features', icon: '✨' },
  { id: 'other', name: 'Sonstiges', icon: '📦' },
] as const;

export type SymbolCategory = typeof DEFAULT_SYMBOL_CATEGORIES[number]['id'];
