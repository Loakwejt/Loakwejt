import { describe, it, expect } from 'vitest';
import {
  createNode,
  findNodeById,
  findParentNode,
  cloneNode,
  updateNodeInTree,
  removeNodeFromTree,
  insertNodeAt,
  moveNode,
  flattenTree,
  countNodes,
  isValidBuilderTree,
  validateBuilderTree,
  type BuilderNode,
  type BuilderTree,
  CURRENT_BUILDER_VERSION,
} from '../schemas/node';

function makeTree(): BuilderTree {
  const heading = createNode('Heading', { text: 'Hallo Welt', level: 1 });
  const text = createNode('Text', { text: 'Ein Absatz' });
  const button = createNode('Button', { text: 'Klick mich' });
  const section = createNode('Section', {}, [heading, text, button]);
  const root = createNode('Root', {}, [section]);
  root.id = 'root';
  return { builderVersion: CURRENT_BUILDER_VERSION, root };
}

describe('createNode', () => {
  it('creates a node with unique id', () => {
    const node = createNode('Text', { text: 'Hallo' });
    expect(node.id).toBeTruthy();
    expect(node.type).toBe('Text');
    expect(node.props.text).toBe('Hallo');
    expect(node.children).toEqual([]);
    expect(node.style).toEqual({ base: {} });
    expect(node.actions).toEqual([]);
  });

  it('creates a node with children', () => {
    const child = createNode('Text');
    const parent = createNode('Section', {}, [child]);
    expect(parent.children).toHaveLength(1);
    expect(parent.children[0].id).toBe(child.id);
  });

  it('generates unique ids', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(createNode('Text').id);
    }
    expect(ids.size).toBe(100);
  });
});

describe('findNodeById', () => {
  it('finds the root node', () => {
    const tree = makeTree();
    const found = findNodeById(tree.root, 'root');
    expect(found).toBe(tree.root);
  });

  it('finds a nested child', () => {
    const tree = makeTree();
    const section = tree.root.children[0];
    const heading = section.children[0];
    const found = findNodeById(tree.root, heading.id);
    expect(found).toBe(heading);
    expect(found?.type).toBe('Heading');
  });

  it('returns null for missing id', () => {
    const tree = makeTree();
    expect(findNodeById(tree.root, 'nonexistent')).toBeNull();
  });
});

describe('findParentNode', () => {
  it('finds the parent of a child', () => {
    const tree = makeTree();
    const section = tree.root.children[0];
    const heading = section.children[0];
    const parent = findParentNode(tree.root, heading.id);
    expect(parent).toBe(section);
  });

  it('returns null for root', () => {
    const tree = makeTree();
    expect(findParentNode(tree.root, 'root')).toBeNull();
  });
});

describe('cloneNode', () => {
  it('clones a node with a new id', () => {
    const node = createNode('Button', { text: 'Test' });
    const cloned = cloneNode(node);
    expect(cloned.id).not.toBe(node.id);
    expect(cloned.type).toBe(node.type);
    expect(cloned.props.text).toBe('Test');
  });

  it('deep clones children with new ids', () => {
    const child = createNode('Text', { text: 'inner' });
    const parent = createNode('Section', {}, [child]);
    const cloned = cloneNode(parent, true);
    expect(cloned.children).toHaveLength(1);
    expect(cloned.children[0].id).not.toBe(child.id);
    expect(cloned.children[0].props.text).toBe('inner');
  });

  it('shallow clones without children when deep=false', () => {
    const child = createNode('Text');
    const parent = createNode('Section', {}, [child]);
    const cloned = cloneNode(parent, false);
    expect(cloned.children).toHaveLength(0);
  });
});

describe('updateNodeInTree', () => {
  it('updates a nested node immutably', () => {
    const tree = makeTree();
    const heading = tree.root.children[0].children[0];
    const newRoot = updateNodeInTree(tree.root, heading.id, (n) => ({
      ...n,
      props: { ...n.props, text: 'Neuer Titel' },
    }));
    const updated = findNodeById(newRoot, heading.id);
    expect(updated?.props.text).toBe('Neuer Titel');
    // Original unchanged
    expect(heading.props.text).toBe('Hallo Welt');
  });
});

describe('removeNodeFromTree', () => {
  it('removes a node', () => {
    const tree = makeTree();
    const section = tree.root.children[0];
    const heading = section.children[0];
    const newRoot = removeNodeFromTree(tree.root, heading.id);
    expect(newRoot.children[0].children).toHaveLength(2);
    expect(findNodeById(newRoot, heading.id)).toBeNull();
  });

  it('does not modify original', () => {
    const tree = makeTree();
    const heading = tree.root.children[0].children[0];
    removeNodeFromTree(tree.root, heading.id);
    expect(tree.root.children[0].children).toHaveLength(3);
  });
});

describe('insertNodeAt', () => {
  it('inserts at specific index', () => {
    const tree = makeTree();
    const section = tree.root.children[0];
    const newNode = createNode('Divider');
    const newRoot = insertNodeAt(tree.root, section.id, newNode, 1);
    const updatedSection = newRoot.children[0];
    expect(updatedSection.children).toHaveLength(4);
    expect(updatedSection.children[1].type).toBe('Divider');
  });
});

describe('moveNode', () => {
  it('moves a node to a new parent', () => {
    const tree = makeTree();
    const section = tree.root.children[0];
    const button = section.children[2]; // Button
    const newRoot = moveNode(tree.root, button.id, 'root', 0);
    // Button is now a direct child of root, at index 0
    expect(newRoot.children[0].type).toBe('Button');
    // Section has 2 children now
    expect(newRoot.children[1].children).toHaveLength(2);
  });
});

describe('flattenTree', () => {
  it('returns all nodes in order', () => {
    const tree = makeTree();
    const nodes = flattenTree(tree.root);
    // root → section → heading, text, button = 5
    expect(nodes).toHaveLength(5);
    expect(nodes[0].id).toBe('root');
    expect(nodes[1].type).toBe('Section');
    expect(nodes[2].type).toBe('Heading');
    expect(nodes[3].type).toBe('Text');
    expect(nodes[4].type).toBe('Button');
  });
});

describe('countNodes', () => {
  it('counts all nodes', () => {
    const tree = makeTree();
    expect(countNodes(tree.root)).toBe(5);
  });

  it('counts single node', () => {
    const node = createNode('Text');
    expect(countNodes(node)).toBe(1);
  });
});

describe('validation', () => {
  it('validates a correct tree', () => {
    const tree = makeTree();
    expect(isValidBuilderTree(tree)).toBe(true);
  });

  it('rejects invalid tree (missing root)', () => {
    expect(isValidBuilderTree({ builderVersion: 1 })).toBe(false);
  });

  it('rejects node with empty id', () => {
    const tree = makeTree();
    tree.root.children[0].id = '';
    expect(isValidBuilderTree(tree)).toBe(false);
  });

  it('parses valid tree with validateBuilderTree', () => {
    const tree = makeTree();
    const parsed = validateBuilderTree(tree);
    expect(parsed.builderVersion).toBe(CURRENT_BUILDER_VERSION);
    expect(parsed.root.id).toBe('root');
  });
});
