import { useEditorStore } from '../store/editor-store';
import { componentRegistry, findNodeById } from '@builderly/core';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Separator,
} from '@builderly/ui';
import { Trash2, Copy } from 'lucide-react';

export function Inspector() {
  const {
    tree,
    selectedNodeId,
    updateNodeProps,
    updateNodeStyle,
    deleteNode,
    duplicateNode,
  } = useEditorStore();

  if (!selectedNodeId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const node = findNodeById(tree.root, selectedNodeId);
  if (!node) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Component not found</p>
      </div>
    );
  }

  const definition = componentRegistry.get(node.type);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{definition?.displayName || node.type}</h2>
          <p className="text-xs text-muted-foreground">{node.id}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateNode(selectedNodeId)}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {selectedNodeId !== 'root' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNode(selectedNodeId)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="props" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="space-y-4 mt-4">
          <PropsEditor
            node={node}
            definition={definition}
            onUpdate={(props) => updateNodeProps(selectedNodeId, props)}
          />
        </TabsContent>

        <TabsContent value="style" className="space-y-4 mt-4">
          <StyleEditor
            style={node.style}
            onUpdate={(style) => updateNodeStyle(selectedNodeId, style)}
          />
        </TabsContent>

        <TabsContent value="actions" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Actions let you define what happens when users interact with this component.
            <p className="mt-2">Coming soon: Click actions, form submissions, and more.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Props editor based on component type
function PropsEditor({
  node,
  definition,
  onUpdate,
}: {
  node: { type: string; props: Record<string, unknown> };
  definition: ReturnType<typeof componentRegistry.get>;
  onUpdate: (props: Record<string, unknown>) => void;
}) {
  const props = node.props;

  // Generic props based on component type
  switch (node.type) {
    case 'Text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter text..."
            />
          </div>
        </div>
      );

    case 'Heading':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Heading Text</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter heading..."
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={String(props.level || 2)}
              onValueChange={(v) => onUpdate({ level: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((l) => (
                  <SelectItem key={l} value={String(l)}>
                    H{l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Button':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Variant</Label>
            <Select
              value={(props.variant as string) || 'primary'}
              onValueChange={(v) => onUpdate({ variant: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Image':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={(props.src as string) || ''}
              onChange={(e) => onUpdate({ src: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={(props.alt as string) || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Image description..."
            />
          </div>
        </div>
      );

    case 'Container':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Max Width</Label>
            <Select
              value={(props.maxWidth as string) || 'lg'}
              onValueChange={(v) => onUpdate({ maxWidth: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Stack':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Direction</Label>
            <Select
              value={(props.direction as string) || 'column'}
              onValueChange={(v) => onUpdate({ direction: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="column">Vertical</SelectItem>
                <SelectItem value="row">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gap</Label>
            <Select
              value={(props.gap as string) || 'md'}
              onValueChange={(v) => onUpdate({ gap: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Grid':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Columns</Label>
            <Select
              value={String(props.columns || 3)}
              onValueChange={(v) => onUpdate({ columns: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Column{n !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gap</Label>
            <Select
              value={(props.gap as string) || 'md'}
              onValueChange={(v) => onUpdate({ gap: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Card':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(props.title as string) || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={(props.description as string) || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
            />
          </div>
        </div>
      );

    case 'Input':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input
              value={(props.name as string) || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={(props.label as string) || ''}
              onChange={(e) => onUpdate({ label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={(props.placeholder as string) || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
            />
          </div>
        </div>
      );

    case 'Link':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Link Text</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={(props.href as string) || ''}
              onChange={(e) => onUpdate({ href: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          No editable properties for this component.
        </div>
      );
  }
}

// Style editor
function StyleEditor({
  style,
  onUpdate,
}: {
  style: { base: Record<string, unknown> };
  onUpdate: (style: { base: Record<string, unknown> }) => void;
}) {
  const base = style.base || {};

  const updateBase = (key: string, value: unknown) => {
    onUpdate({
      ...style,
      base: { ...base, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      {/* Spacing */}
      <div>
        <h4 className="text-sm font-medium mb-2">Spacing</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Padding</Label>
            <Select
              value={(base.padding as string) || ''}
              onValueChange={(v) => updateBase('padding', v || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Margin</Label>
            <Select
              value={(base.margin as string) || ''}
              onValueChange={(v) => updateBase('margin', v || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Text */}
      <div>
        <h4 className="text-sm font-medium mb-2">Text</h4>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-xs">Alignment</Label>
            <Select
              value={(base.textAlign as string) || ''}
              onValueChange={(v) => updateBase('textAlign', v || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-sm font-medium mb-2">Colors</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Background</Label>
            <Select
              value={(base.backgroundColor as string) || ''}
              onValueChange={(v) => updateBase('backgroundColor', v || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="background">Background</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Text Color</Label>
            <Select
              value={(base.color as string) || ''}
              onValueChange={(v) => updateBase('color', v || undefined)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                <SelectItem value="foreground">Foreground</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="muted-foreground">Muted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Border */}
      <div>
        <h4 className="text-sm font-medium mb-2">Border</h4>
        <div className="space-y-1">
          <Label className="text-xs">Radius</Label>
          <Select
            value={(base.borderRadius as string) || ''}
            onValueChange={(v) => updateBase('borderRadius', v || undefined)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
              <SelectItem value="full">Full</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
