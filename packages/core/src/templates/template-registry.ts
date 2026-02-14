import type { BuilderNode, BuilderTree } from '../schemas/node';

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export type TemplateCategory = 
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'contact'
  | 'team'
  | 'faq'
  | 'footer'
  | 'header'
  | 'gallery'
  | 'stats'
  | 'blog'
  | 'ecommerce'
  | 'content'
  | 'full-page';

export type TemplateStyle = 
  | 'minimal'
  | 'modern'
  | 'classic'
  | 'bold'
  | 'elegant'
  | 'playful'
  | 'corporate'
  | 'creative';

export type WebsiteType =
  | 'all'
  | 'landing'
  | 'blog'
  | 'ecommerce'
  | 'portfolio'
  | 'business'
  | 'saas'
  | 'restaurant'
  | 'event'
  | 'personal'
  | 'agency';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  style: TemplateStyle;
  websiteTypes: WebsiteType[];
  tags: string[];
  thumbnail?: string;
  isPro?: boolean;
  // The actual template content
  node: BuilderNode;
}

export interface FullPageTemplate {
  id: string;
  name: string;
  description: string;
  websiteType: WebsiteType;
  style: TemplateStyle;
  tags: string[];
  thumbnail?: string;
  isPro?: boolean;
  // Full page tree
  tree: BuilderTree;
}

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

class TemplateRegistryClass {
  private sectionTemplates: Map<string, TemplateDefinition> = new Map();
  private pageTemplates: Map<string, FullPageTemplate> = new Map();

  // Register a section template
  registerSection(template: TemplateDefinition): void {
    this.sectionTemplates.set(template.id, template);
  }

  // Register a full page template
  registerPage(template: FullPageTemplate): void {
    this.pageTemplates.set(template.id, template);
  }

  // Get a section template by ID
  getSection(id: string): TemplateDefinition | undefined {
    return this.sectionTemplates.get(id);
  }

  // Get a page template by ID
  getPage(id: string): FullPageTemplate | undefined {
    return this.pageTemplates.get(id);
  }

  // Get all section templates
  getAllSections(): TemplateDefinition[] {
    return Array.from(this.sectionTemplates.values());
  }

  // Get all page templates
  getAllPages(): FullPageTemplate[] {
    return Array.from(this.pageTemplates.values());
  }

  // Get sections by category
  getSectionsByCategory(category: TemplateCategory): TemplateDefinition[] {
    return this.getAllSections().filter(t => t.category === category);
  }

  // Get sections by website type
  getSectionsByWebsiteType(type: WebsiteType): TemplateDefinition[] {
    return this.getAllSections().filter(t => t.websiteTypes.includes(type));
  }

  // Get pages by website type
  getPagesByWebsiteType(type: WebsiteType): FullPageTemplate[] {
    return this.getAllPages().filter(t => t.websiteType === type);
  }

  // Get sections grouped by category
  getSectionsGroupedByCategory(): Map<TemplateCategory, TemplateDefinition[]> {
    const grouped = new Map<TemplateCategory, TemplateDefinition[]>();
    
    for (const template of this.getAllSections()) {
      const existing = grouped.get(template.category) || [];
      existing.push(template);
      grouped.set(template.category, existing);
    }
    
    return grouped;
  }

  // Search templates
  searchSections(query: string): TemplateDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllSections().filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get category metadata
  getCategoryInfo(category: TemplateCategory): { name: string; icon: string } {
    const info: Record<TemplateCategory, { name: string; icon: string }> = {
      'hero': { name: 'Hero Sections', icon: '🦸' },
      'features': { name: 'Features', icon: '✨' },
      'pricing': { name: 'Pricing', icon: '💰' },
      'testimonials': { name: 'Testimonials', icon: '💬' },
      'cta': { name: 'Call to Action', icon: '📢' },
      'contact': { name: 'Contact', icon: '📧' },
      'team': { name: 'Team', icon: '👥' },
      'faq': { name: 'FAQ', icon: '❓' },
      'footer': { name: 'Footer', icon: '📋' },
      'header': { name: 'Header/Navigation', icon: '🧭' },
      'gallery': { name: 'Gallery', icon: '🖼️' },
      'stats': { name: 'Statistics', icon: '📊' },
      'blog': { name: 'Blog', icon: '📝' },
      'ecommerce': { name: 'E-Commerce', icon: '🛒' },
      'content': { name: 'Content', icon: '📄' },
      'full-page': { name: 'Full Pages', icon: '📑' },
    };
    return info[category];
  }

  // Get all categories with templates
  getAvailableCategories(): TemplateCategory[] {
    const categories = new Set<TemplateCategory>();
    for (const template of this.getAllSections()) {
      categories.add(template.category);
    }
    return Array.from(categories);
  }
}

export const templateRegistry = new TemplateRegistryClass();
