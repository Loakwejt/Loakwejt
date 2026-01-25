import type { ComponentDefinition, ComponentRegistry } from '../registry/component-registry';
import type { ActionDefinition, ActionRegistry } from '../schemas/actions';
import type { CollectionDefinition } from '../schemas/collection';

// ============================================================================
// PLUGIN TYPES
// ============================================================================

export interface PluginTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  tree: unknown; // BuilderTree JSON
}

export interface PluginDashboardWidget {
  id: string;
  name: string;
  description: string;
  position: 'sidebar' | 'main' | 'header';
  // Render function would be defined at runtime
}

export interface PluginServerRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  handler: string; // Handler name - actual implementation is server-side
}

// ============================================================================
// PLUGIN DEFINITION
// ============================================================================

export interface PluginDefinition {
  // Identification
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  
  // What the plugin provides
  components?: ComponentDefinition[];
  actions?: ActionDefinition[];
  collections?: CollectionDefinition[];
  templates?: PluginTemplate[];
  dashboardWidgets?: PluginDashboardWidget[];
  serverRoutes?: PluginServerRoute[];
  
  // Lifecycle hooks
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

// ============================================================================
// PLUGIN REGISTRY
// ============================================================================

export class PluginRegistry {
  private plugins = new Map<string, PluginDefinition>();
  private activePlugins = new Set<string>();
  
  constructor(
    private componentRegistry: ComponentRegistry,
    private actionRegistry: ActionRegistry
  ) {}
  
  // Register a plugin
  register(plugin: PluginDefinition): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin "${plugin.id}" is already registered, overwriting.`);
    }
    this.plugins.set(plugin.id, plugin);
  }
  
  // Unregister a plugin
  unregister(pluginId: string): boolean {
    if (this.activePlugins.has(pluginId)) {
      this.deactivate(pluginId);
    }
    return this.plugins.delete(pluginId);
  }
  
  // Get a plugin
  get(pluginId: string): PluginDefinition | undefined {
    return this.plugins.get(pluginId);
  }
  
  // Get all plugins
  getAll(): PluginDefinition[] {
    return Array.from(this.plugins.values());
  }
  
  // Get active plugins
  getActive(): PluginDefinition[] {
    return this.getAll().filter((p) => this.activePlugins.has(p.id));
  }
  
  // Check if plugin is active
  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }
  
  // Activate a plugin
  activate(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" not found`);
    }
    
    if (this.activePlugins.has(pluginId)) {
      return; // Already active
    }
    
    // Register components
    if (plugin.components) {
      for (const component of plugin.components) {
        this.componentRegistry.register({
          ...component,
          source: pluginId,
        });
      }
    }
    
    // Register actions
    if (plugin.actions) {
      for (const action of plugin.actions) {
        this.actionRegistry.register(action);
      }
    }
    
    // Call activation hook
    plugin.onActivate?.();
    
    this.activePlugins.add(pluginId);
  }
  
  // Deactivate a plugin
  deactivate(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;
    
    if (!this.activePlugins.has(pluginId)) {
      return; // Not active
    }
    
    // Unregister components
    if (plugin.components) {
      for (const component of plugin.components) {
        this.componentRegistry.unregister(component.type);
      }
    }
    
    // Call deactivation hook
    plugin.onDeactivate?.();
    
    this.activePlugins.delete(pluginId);
  }
  
  // Get all templates from active plugins
  getTemplates(): PluginTemplate[] {
    const templates: PluginTemplate[] = [];
    for (const plugin of this.getActive()) {
      if (plugin.templates) {
        templates.push(...plugin.templates);
      }
    }
    return templates;
  }
  
  // Get all collections from active plugins
  getCollections(): CollectionDefinition[] {
    const collections: CollectionDefinition[] = [];
    for (const plugin of this.getActive()) {
      if (plugin.collections) {
        collections.push(...plugin.collections);
      }
    }
    return collections;
  }
  
  // Get dashboard widgets from active plugins
  getDashboardWidgets(): PluginDashboardWidget[] {
    const widgets: PluginDashboardWidget[] = [];
    for (const plugin of this.getActive()) {
      if (plugin.dashboardWidgets) {
        widgets.push(...plugin.dashboardWidgets);
      }
    }
    return widgets;
  }
}
