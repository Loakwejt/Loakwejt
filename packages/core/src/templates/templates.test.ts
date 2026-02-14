import { describe, it, expect } from 'vitest';
import { sectionTemplates, type SectionTemplate } from '../templates/sections';

describe('sectionTemplates', () => {
  it('has templates defined', () => {
    expect(sectionTemplates.length).toBeGreaterThan(0);
  });

  it('each template has required fields', () => {
    for (const tmpl of sectionTemplates) {
      expect(tmpl.id).toBeTruthy();
      expect(tmpl.name).toBeTruthy();
      expect(tmpl.description).toBeTruthy();
      expect(tmpl.category).toBeTruthy();
      expect(tmpl.tree).toBeDefined();
      expect(tmpl.tree.id).toBeTruthy();
      expect(tmpl.tree.type).toBeTruthy();
    }
  });

  it('templates have unique ids', () => {
    const ids = sectionTemplates.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('template trees have Section as root type', () => {
    for (const tmpl of sectionTemplates) {
      expect(tmpl.tree.type).toBe('Section');
    }
  });

  it('all required categories are covered', () => {
    const categories = new Set(sectionTemplates.map(t => t.category));
    expect(categories.has('hero')).toBe(true);
    expect(categories.has('features')).toBe(true);
    expect(categories.has('pricing')).toBe(true);
    expect(categories.has('cta')).toBe(true);
    expect(categories.has('contact')).toBe(true);
    expect(categories.has('faq')).toBe(true);
  });
});
