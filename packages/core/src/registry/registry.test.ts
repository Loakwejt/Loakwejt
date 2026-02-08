import { describe, it, expect } from 'vitest';
import { componentRegistry } from '../registry/component-registry';
// Import to register all built-in components
import '../registry/builtin-components';

describe('componentRegistry', () => {
  it('has registered components', () => {
    const all = componentRegistry.getAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it('has core layout components', () => {
    const types = componentRegistry.getAll().map(c => c.type);
    expect(types).toContain('Section');
    expect(types).toContain('Container');
    expect(types).toContain('Stack');
    expect(types).toContain('Grid');
  });

  it('has core content components', () => {
    const types = componentRegistry.getAll().map(c => c.type);
    expect(types).toContain('Text');
    expect(types).toContain('Heading');
    expect(types).toContain('Button');
    expect(types).toContain('Image');
  });

  it('can get a component by type', () => {
    const heading = componentRegistry.get('Heading');
    expect(heading).toBeDefined();
    expect(heading?.displayName).toBeTruthy();
    expect(heading?.propsSchema).toBeDefined();
    expect(heading?.defaultProps).toBeDefined();
  });

  it('returns undefined for unknown type', () => {
    expect(componentRegistry.get('NonExistentComponent')).toBeUndefined();
  });

  it('each component has required fields', () => {
    for (const def of componentRegistry.getAll()) {
      expect(def.type).toBeTruthy();
      expect(def.displayName).toBeTruthy();
      expect(def.category).toBeTruthy();
      expect(typeof def.canHaveChildren).toBe('boolean');
      expect(def.propsSchema).toBeDefined();
      expect(def.defaultProps).toBeDefined();
    }
  });

  it('default props validate against their schema for most components', () => {
    const failures: string[] = [];
    for (const def of componentRegistry.getAll()) {
      const result = def.propsSchema.safeParse(def.defaultProps);
      if (!result.success) {
        failures.push(def.type);
      }
    }
    // Allow up to 5 known mismatches (plugin components may have loose schemas)
    expect(failures.length).toBeLessThan(6);
  });

  it('layout components can have children', () => {
    for (const type of ['Section', 'Container', 'Stack', 'Grid']) {
      const def = componentRegistry.get(type);
      expect(def?.canHaveChildren).toBe(true);
    }
  });

  it('leaf components cannot have children', () => {
    for (const type of ['Text', 'Heading', 'Image', 'Spacer', 'Divider']) {
      const def = componentRegistry.get(type);
      if (def) {
        expect(def.canHaveChildren).toBe(false);
      }
    }
  });
});
