import { z } from 'zod';
import type { BuilderNode } from '../schemas/node';
import type { DataBinding } from '../schemas/collection';

// ============================================================================
// COMPONENT DEFINITION TYPES
// ============================================================================

export interface ComponentCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export const DEFAULT_CATEGORIES: ComponentCategory[] = [
  { id: 'layout', name: 'Layout', icon: 'layout', order: 0 },
  { id: 'content', name: 'Content', icon: 'type', order: 1 },
  { id: 'ui', name: 'UI Elements', icon: 'square', order: 2 },
  { id: 'forms', name: 'Forms', icon: 'form-input', order: 3 },
  { id: 'navigation', name: 'Navigation', icon: 'navigation', order: 4 },
  { id: 'data', name: 'Data', icon: 'database', order: 5 },
  { id: 'gates', name: 'Gates', icon: 'shield', order: 6 },
  { id: 'media', name: 'Media', icon: 'image', order: 7 },
  { id: 'auth', name: 'Benutzer & Auth', icon: 'user-check', order: 8 },
  { id: 'commerce', name: 'Commerce', icon: 'shopping-cart', order: 9 },
  { id: 'blog', name: 'Blog', icon: 'book-open', order: 10 },
  { id: 'forum', name: 'Forum', icon: 'message-square', order: 11 },
];

// ============================================================================
// COMPONENT DEFINITION
// ============================================================================

export interface ComponentDefinition<TProps extends Record<string, unknown> = Record<string, unknown>> {
  // Identification
  type: string;
  displayName: string;
  description?: string;
  icon: string;
  category: string;
  
  // Hierarchy rules
  canHaveChildren: boolean;
  allowedChildrenTypes?: string[]; // If undefined, allows all types
  allowedParentTypes?: string[]; // If undefined, allows all parents
  
  // Default values
  defaultProps: TProps;
  
  // Schema validation (Zod)
  propsSchema: z.ZodType<TProps>;
  
  // Data binding capabilities
  dataBindings?: {
    name: string;
    description: string;
    type: DataBinding['type'];
    collection?: string; // For list/currentRecord bindings
  }[];
  
  // Tags for search/filtering
  tags?: string[];
  
  // Is this a built-in component or from a plugin?
  source?: 'builtin' | string; // string = plugin id
  
  // Hidden from palette (used internally)
  hidden?: boolean;
}

// ============================================================================
// COMPONENT REGISTRY CLASS
// ============================================================================

export class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private categories = new Map<string, ComponentCategory>();
  
  constructor() {
    // Register default categories
    for (const category of DEFAULT_CATEGORIES) {
      this.categories.set(category.id, category);
    }
  }
  
  // Register a component
  register<TProps extends Record<string, unknown>>(
    definition: ComponentDefinition<TProps>
  ): void {
    if (this.components.has(definition.type)) {
      console.warn(`Component "${definition.type}" is already registered, overwriting.`);
    }
    this.components.set(definition.type, definition as ComponentDefinition);
  }
  
  // Unregister a component
  unregister(type: string): boolean {
    return this.components.delete(type);
  }
  
  // Get a component definition
  get(type: string): ComponentDefinition | undefined {
    return this.components.get(type);
  }
  
  // Check if a component type exists
  has(type: string): boolean {
    return this.components.has(type);
  }
  
  // Get all component definitions
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }
  
  // Get components by category
  getByCategory(categoryId: string): ComponentDefinition[] {
    return this.getAll().filter((c) => c.category === categoryId && !c.hidden);
  }
  
  // Get visible components for palette
  getVisibleComponents(): ComponentDefinition[] {
    return this.getAll().filter((c) => !c.hidden);
  }
  
  // Get components grouped by category
  getGroupedByCategory(): Map<ComponentCategory, ComponentDefinition[]> {
    const grouped = new Map<ComponentCategory, ComponentDefinition[]>();
    
    for (const [, category] of this.categories) {
      const components = this.getByCategory(category.id);
      if (components.length > 0) {
        grouped.set(category, components);
      }
    }
    
    return grouped;
  }
  
  // Register a category
  registerCategory(category: ComponentCategory): void {
    this.categories.set(category.id, category);
  }
  
  // Get all categories
  getCategories(): ComponentCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }
  
  // Validate component props
  validateProps(type: string, props: unknown): Record<string, unknown> {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Unknown component type: ${type}`);
    }
    return definition.propsSchema.parse(props);
  }
  
  // Check if props are valid
  isValidProps(type: string, props: unknown): boolean {
    const definition = this.get(type);
    if (!definition) return false;
    return definition.propsSchema.safeParse(props).success;
  }
  
  // Check if a child can be added to a parent
  canAddChild(parentType: string, childType: string): boolean {
    const parent = this.get(parentType);
    const child = this.get(childType);
    
    if (!parent || !child) return false;
    if (!parent.canHaveChildren) return false;
    
    // Check parent's allowed children
    if (parent.allowedChildrenTypes && !parent.allowedChildrenTypes.includes(childType)) {
      return false;
    }
    
    // Check child's allowed parents
    if (child.allowedParentTypes && !child.allowedParentTypes.includes(parentType)) {
      return false;
    }
    
    return true;
  }
  
  // Get valid children types for a parent
  getValidChildrenTypes(parentType: string): string[] {
    const parent = this.get(parentType);
    if (!parent || !parent.canHaveChildren) return [];
    
    if (parent.allowedChildrenTypes) {
      return parent.allowedChildrenTypes.filter((type) => this.has(type));
    }
    
    // Return all types that can have this parent
    return this.getAll()
      .filter((c) => {
        if (!c.allowedParentTypes) return true;
        return c.allowedParentTypes.includes(parentType);
      })
      .map((c) => c.type);
  }
  
  // Create a new node from a component type
  createNode(type: string, overrides?: Partial<BuilderNode>): BuilderNode {
    const definition = this.get(type);
    if (!definition) {
      throw new Error(`Unknown component type: ${type}`);
    }
    
    return {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      props: { ...definition.defaultProps },
      style: { base: {} },
      actions: [],
      children: [],
      ...overrides,
    };
  }
  
  // Search components by name or tags
  search(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getVisibleComponents().filter((c) => {
      if (c.displayName.toLowerCase().includes(lowerQuery)) return true;
      if (c.description?.toLowerCase().includes(lowerQuery)) return true;
      if (c.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }
}

// Global registry instance
export const componentRegistry = new ComponentRegistry();
