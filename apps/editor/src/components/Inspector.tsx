import { useState } from 'react';
import { useEditorStore } from '../store/editor-store';
import { componentRegistry, findNodeById } from '@builderly/core';
import type { BuilderStyle, BuilderActionBinding } from '@builderly/core';
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
  Switch,
  Slider,
  Textarea,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@builderly/ui';
import { Trash2, Copy, ChevronDown, Plus, X, Image } from 'lucide-react';

export function Inspector() {
  const {
    tree,
    selectedNodeId,
    updateNodeProps,
    updateNodeStyle,
    updateNodeActions,
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
          <ActionsEditor
            actions={node.actions}
            onUpdate={(actions) => updateNodeActions(selectedNodeId, actions)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// PROPS EDITOR
// ============================================================================

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

  switch (node.type) {
    case 'Section':
      return (
        <div className="space-y-4">
          <CollapsibleSection title="Layout" defaultOpen>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Full Width</Label>
                <Switch
                  checked={(props.fullWidth as boolean) ?? true}
                  onCheckedChange={(v) => onUpdate({ fullWidth: v })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Height</Label>
                <Select
                  value={(props.minHeight as string) || 'auto'}
                  onValueChange={(v) => onUpdate({ minHeight: v })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="screen">Full Screen</SelectItem>
                    <SelectItem value="half">Half Screen</SelectItem>
                    <SelectItem value="third">Third Screen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vertical Align</Label>
                <Select
                  value={(props.verticalAlign as string) || 'start'}
                  onValueChange={(v) => onUpdate({ verticalAlign: v })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="end">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Background Image">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={(props.backgroundImage as string) || ''}
                  onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Size</Label>
                <Select
                  value={(props.backgroundSize as string) || 'cover'}
                  onValueChange={(v) => onUpdate({ backgroundSize: v })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Position</Label>
                <Select
                  value={(props.backgroundPosition as string) || 'center'}
                  onValueChange={(v) => onUpdate({ backgroundPosition: v })}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Overlay Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(props.backgroundOverlay as string) || '#000000'}
                    onChange={(e) => onUpdate({ backgroundOverlay: e.target.value })}
                    className="h-8 w-8 rounded border cursor-pointer"
                  />
                  <Input
                    value={(props.backgroundOverlay as string) || ''}
                    onChange={(e) => onUpdate({ backgroundOverlay: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Overlay Opacity: {typeof props.backgroundOverlayOpacity === 'number' ? props.backgroundOverlayOpacity : 50}%</Label>
                <Slider
                  value={[(props.backgroundOverlayOpacity as number) || 50]}
                  onValueChange={([v]) => onUpdate({ backgroundOverlayOpacity: v })}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </CollapsibleSection>
        </div>
      );

    case 'Container':
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Max Width</Label>
            <Select
              value={(props.maxWidth as string) || 'lg'}
              onValueChange={(v) => onUpdate({ maxWidth: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small (320px)</SelectItem>
                <SelectItem value="sm">Small (640px)</SelectItem>
                <SelectItem value="md">Medium (768px)</SelectItem>
                <SelectItem value="lg">Large (1024px)</SelectItem>
                <SelectItem value="xl">Extra Large (1280px)</SelectItem>
                <SelectItem value="2xl">2XL (1536px)</SelectItem>
                <SelectItem value="3xl">3XL (1920px)</SelectItem>
                <SelectItem value="full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Centered</Label>
            <Switch
              checked={(props.centered as boolean) ?? true}
              onCheckedChange={(v) => onUpdate({ centered: v })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Min Height</Label>
            <Select
              value={(props.minHeight as string) || 'auto'}
              onValueChange={(v) => onUpdate({ minHeight: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="screen">Screen Height</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Stack':
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Direction</Label>
            <Select
              value={(props.direction as string) || 'column'}
              onValueChange={(v) => onUpdate({ direction: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="column">Vertical (Column)</SelectItem>
                <SelectItem value="row">Horizontal (Row)</SelectItem>
                <SelectItem value="column-reverse">Vertical Reverse</SelectItem>
                <SelectItem value="row-reverse">Horizontal Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Gap</Label>
            <Select
              value={(props.gap as string) || 'md'}
              onValueChange={(v) => onUpdate({ gap: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="3xl">3XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Align Items</Label>
            <Select
              value={(props.align as string) || 'stretch'}
              onValueChange={(v) => onUpdate({ align: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Justify Content</Label>
            <Select
              value={(props.justify as string) || 'start'}
              onValueChange={(v) => onUpdate({ justify: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="between">Space Between</SelectItem>
                <SelectItem value="around">Space Around</SelectItem>
                <SelectItem value="evenly">Space Evenly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Wrap</Label>
            <Switch
              checked={(props.wrap as boolean) || false}
              onCheckedChange={(v) => onUpdate({ wrap: v })}
            />
          </div>
        </div>
      );

    case 'Grid':
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Columns (Desktop)</Label>
            <Select
              value={String(props.columns || 3)}
              onValueChange={(v) => onUpdate({ columns: parseInt(v) })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Column{n !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Columns (Tablet)</Label>
            <Select
              value={String(props.columnsTablet || 2)}
              onValueChange={(v) => onUpdate({ columnsTablet: parseInt(v) })}
            >
              <SelectTrigger className="h-8">
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
          <div className="space-y-1">
            <Label className="text-xs">Columns (Mobile)</Label>
            <Select
              value={String(props.columnsMobile || 1)}
              onValueChange={(v) => onUpdate({ columnsMobile: parseInt(v) })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Column{n !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Gap</Label>
            <Select
              value={(props.gap as string) || 'md'}
              onValueChange={(v) => onUpdate({ gap: v })}
            >
              <SelectTrigger className="h-8">
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
          <div className="space-y-1">
            <Label className="text-xs">Align Items</Label>
            <Select
              value={(props.alignItems as string) || 'stretch'}
              onValueChange={(v) => onUpdate({ alignItems: v })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Textarea
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter text..."
              rows={4}
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
                    H{l} - {['Extra Large', 'Large', 'Medium', 'Small', 'Extra Small', 'Tiny'][l - 1]}
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
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Size</Label>
            <Select
              value={(props.size as string) || 'md'}
              onValueChange={(v) => onUpdate({ size: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Full Width</Label>
            <Switch
              checked={(props.fullWidth as boolean) || false}
              onCheckedChange={(v) => onUpdate({ fullWidth: v })}
            />
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
          <div className="space-y-2">
            <Label>Object Fit</Label>
            <Select
              value={(props.objectFit as string) || 'cover'}
              onValueChange={(v) => onUpdate({ objectFit: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                value={(props.width as string) || ''}
                onChange={(e) => onUpdate({ width: e.target.value })}
                placeholder="auto"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                value={(props.height as string) || ''}
                onChange={(e) => onUpdate({ height: e.target.value })}
                placeholder="auto"
              />
            </div>
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
            <Textarea
              value={(props.description as string) || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={(props.image as string) || ''}
              onChange={(e) => onUpdate({ image: e.target.value })}
              placeholder="https://..."
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
          <div className="space-y-2">
            <Label>Target</Label>
            <Select
              value={(props.target as string) || '_self'}
              onValueChange={(v) => onUpdate({ target: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same Window</SelectItem>
                <SelectItem value="_blank">New Window</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Input':
    case 'Textarea':
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
          <div className="flex items-center justify-between">
            <Label>Required</Label>
            <Switch
              checked={(props.required as boolean) || false}
              onCheckedChange={(v) => onUpdate({ required: v })}
            />
          </div>
        </div>
      );

    case 'Spacer':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Size</Label>
            <Select
              value={(props.size as string) || 'md'}
              onValueChange={(v) => onUpdate({ size: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small (8px)</SelectItem>
                <SelectItem value="sm">Small (16px)</SelectItem>
                <SelectItem value="md">Medium (32px)</SelectItem>
                <SelectItem value="lg">Large (48px)</SelectItem>
                <SelectItem value="xl">Extra Large (64px)</SelectItem>
                <SelectItem value="2xl">2XL (96px)</SelectItem>
                <SelectItem value="3xl">3XL (128px)</SelectItem>
              </SelectContent>
            </Select>
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

// ============================================================================
// STYLE EDITOR - COMPREHENSIVE
// ============================================================================

function StyleEditor({
  style,
  onUpdate,
}: {
  style: BuilderStyle;
  onUpdate: (style: BuilderStyle) => void;
}) {
  const base = style.base || {};

  const updateBase = (key: string, value: unknown) => {
    const finalValue = value === '_none' || value === '' ? undefined : value;
    onUpdate({
      ...style,
      base: { ...base, [key]: finalValue },
    });
  };

  const getValue = (val: unknown): string => {
    if (val === undefined || val === null || val === '') return '_none';
    return String(val);
  };

  return (
    <div className="space-y-4">
      {/* Size & Dimensions */}
      <CollapsibleSection title="Size & Dimensions" defaultOpen>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                value={(base.width as string) || ''}
                onChange={(e) => updateBase('width', e.target.value)}
                placeholder="auto"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                value={(base.height as string) || ''}
                onChange={(e) => updateBase('height', e.target.value)}
                placeholder="auto"
                className="h-8"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Min Width</Label>
              <Input
                value={(base.minWidth as string) || ''}
                onChange={(e) => updateBase('minWidth', e.target.value)}
                placeholder="0"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Min Height</Label>
              <Input
                value={(base.minHeight as string) || ''}
                onChange={(e) => updateBase('minHeight', e.target.value)}
                placeholder="0"
                className="h-8"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Max Width</Label>
              <Input
                value={(base.maxWidth as string) || ''}
                onChange={(e) => updateBase('maxWidth', e.target.value)}
                placeholder="none"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max Height</Label>
              <Input
                value={(base.maxHeight as string) || ''}
                onChange={(e) => updateBase('maxHeight', e.target.value)}
                placeholder="none"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacing */}
      <CollapsibleSection title="Spacing" defaultOpen>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Padding (All Sides)</Label>
            <Select
              value={getValue(base.padding)}
              onValueChange={(v) => updateBase('padding', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="xs">XS (4px)</SelectItem>
                <SelectItem value="sm">SM (8px)</SelectItem>
                <SelectItem value="md">MD (16px)</SelectItem>
                <SelectItem value="lg">LG (24px)</SelectItem>
                <SelectItem value="xl">XL (32px)</SelectItem>
                <SelectItem value="2xl">2XL (48px)</SelectItem>
                <SelectItem value="3xl">3XL (64px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Padding X</Label>
              <Select
                value={getValue(base.paddingX)}
                onValueChange={(v) => updateBase('paddingX', v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Padding Y</Label>
              <Select
                value={getValue(base.paddingY)}
                onValueChange={(v) => updateBase('paddingY', v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <Label className="text-xs">Margin (All Sides)</Label>
            <Select
              value={getValue(base.margin)}
              onValueChange={(v) => updateBase('margin', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="xs">XS (4px)</SelectItem>
                <SelectItem value="sm">SM (8px)</SelectItem>
                <SelectItem value="md">MD (16px)</SelectItem>
                <SelectItem value="lg">LG (24px)</SelectItem>
                <SelectItem value="xl">XL (32px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Margin X</Label>
              <Select
                value={getValue(base.marginX)}
                onValueChange={(v) => updateBase('marginX', v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Margin Y</Label>
              <Select
                value={getValue(base.marginY)}
                onValueChange={(v) => updateBase('marginY', v)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="md">MD</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Background">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(base.bgColor as string) || '#ffffff'}
                onChange={(e) => updateBase('bgColor', e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer flex-shrink-0"
              />
              <Input
                value={(base.bgColor as string) || ''}
                onChange={(e) => updateBase('bgColor', e.target.value)}
                placeholder="transparent"
                className="flex-1 h-8"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Or use Theme Color</Label>
            <Select
              value={getValue(base.backgroundColor)}
              onValueChange={(v) => updateBase('backgroundColor', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None (Custom)</SelectItem>
                <SelectItem value="background">Background</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Background Image URL</Label>
            <Input
              value={(base.backgroundImage as string) || ''}
              onChange={(e) => updateBase('backgroundImage', e.target.value)}
              placeholder="https://..."
              className="h-8"
            />
          </div>
          {base.backgroundImage && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Background Size</Label>
                <Select
                  value={getValue(base.backgroundSize)}
                  onValueChange={(v) => updateBase('backgroundSize', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Background Position</Label>
                <Select
                  value={getValue(base.backgroundPosition)}
                  onValueChange={(v) => updateBase('backgroundPosition', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Typography">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(base.textColor as string) || '#000000'}
                onChange={(e) => updateBase('textColor', e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer flex-shrink-0"
              />
              <Input
                value={(base.textColor as string) || ''}
                onChange={(e) => updateBase('textColor', e.target.value)}
                placeholder="inherit"
                className="flex-1 h-8"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Or use Theme Color</Label>
            <Select
              value={getValue(base.color)}
              onValueChange={(v) => updateBase('color', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None (Custom)</SelectItem>
                <SelectItem value="foreground">Foreground</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="primary-foreground">Primary Foreground</SelectItem>
                <SelectItem value="secondary-foreground">Secondary Foreground</SelectItem>
                <SelectItem value="muted-foreground">Muted</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Text Alignment</Label>
            <Select
              value={getValue(base.textAlign)}
              onValueChange={(v) => updateBase('textAlign', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Font Size</Label>
            <Select
              value={getValue(base.fontSize)}
              onValueChange={(v) => updateBase('fontSize', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="3xl">3XL</SelectItem>
                <SelectItem value="4xl">4XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Font Weight</Label>
            <Select
              value={getValue(base.fontWeight)}
              onValueChange={(v) => updateBase('fontWeight', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="thin">Thin</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="extrabold">Extra Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Border */}
      <CollapsibleSection title="Border">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Border Width</Label>
            <Select
              value={getValue(base.borderWidth)}
              onValueChange={(v) => updateBase('borderWidth', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="1">1px</SelectItem>
                <SelectItem value="2">2px</SelectItem>
                <SelectItem value="4">4px</SelectItem>
                <SelectItem value="8">8px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Border Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(base.borderColor as string) || '#e2e8f0'}
                onChange={(e) => updateBase('borderColor', e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer flex-shrink-0"
              />
              <Input
                value={(base.borderColor as string) || ''}
                onChange={(e) => updateBase('borderColor', e.target.value)}
                placeholder="#e2e8f0"
                className="flex-1 h-8"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Border Style</Label>
            <Select
              value={getValue(base.borderStyle)}
              onValueChange={(v) => updateBase('borderStyle', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Solid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Border Radius</Label>
            <Select
              value={getValue(base.borderRadius)}
              onValueChange={(v) => updateBase('borderRadius', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="full">Full (Pill)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Shadow & Effects */}
      <CollapsibleSection title="Shadow & Effects">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Box Shadow</Label>
            <Select
              value={getValue(base.shadow)}
              onValueChange={(v) => updateBase('shadow', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
                <SelectItem value="inner">Inner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Opacity (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={(base.opacity as number) || ''}
              onChange={(e) => updateBase('opacity', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="100"
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Overflow</Label>
            <Select
              value={getValue(base.overflow)}
              onValueChange={(v) => updateBase('overflow', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Visible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="scroll">Scroll</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Position & Display */}
      <CollapsibleSection title="Position & Display">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Display</Label>
            <Select
              value={getValue(base.display)}
              onValueChange={(v) => updateBase('display', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Position</Label>
            <Select
              value={getValue(base.position)}
              onValueChange={(v) => updateBase('position', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Static" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Static</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
                <SelectItem value="absolute">Absolute</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="sticky">Sticky</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Z-Index</Label>
            <Input
              type="number"
              value={(base.zIndex as number) || ''}
              onChange={(e) => updateBase('zIndex', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="auto"
              className="h-8"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============================================================================
// ACTIONS EDITOR
// ============================================================================

const ACTION_TYPES = [
  { value: 'navigate', label: 'Navigate to URL' },
  { value: 'navigatePage', label: 'Navigate to Page' },
  { value: 'scrollTo', label: 'Scroll to Element' },
  { value: 'openModal', label: 'Open Modal' },
  { value: 'closeModal', label: 'Close Modal' },
  { value: 'setState', label: 'Set State' },
  { value: 'toggleState', label: 'Toggle State' },
] as const;

type ActionType = typeof ACTION_TYPES[number]['value'];

const EVENT_TYPES = [
  { value: 'click', label: 'Click' },
  { value: 'mouseenter', label: 'Mouse Enter' },
  { value: 'mouseleave', label: 'Mouse Leave' },
  { value: 'focus', label: 'Focus' },
  { value: 'blur', label: 'Blur' },
] as const;

type EventType = typeof EVENT_TYPES[number]['value'];

// Helper to create default action based on type
function createDefaultAction(type: ActionType): BuilderActionBinding['action'] {
  switch (type) {
    case 'navigate':
      return { type: 'navigate', to: '#' };
    case 'navigatePage':
      return { type: 'navigatePage', pageSlug: '' };
    case 'scrollTo':
      return { type: 'scrollTo', targetId: '' };
    case 'openModal':
      return { type: 'openModal', modalId: '' };
    case 'closeModal':
      return { type: 'closeModal' };
    case 'setState':
      return { type: 'setState', key: '', value: '' };
    case 'toggleState':
      return { type: 'toggleState', key: '' };
    default:
      return { type: 'navigate', to: '#' };
  }
}

function ActionsEditor({
  actions,
  onUpdate,
}: {
  actions: BuilderActionBinding[];
  onUpdate: (actions: BuilderActionBinding[]) => void;
}) {
  const addAction = () => {
    const newBinding: BuilderActionBinding = {
      event: 'click',
      action: { type: 'navigate', to: '#' },
    };
    onUpdate([...actions, newBinding]);
  };

  const removeAction = (index: number) => {
    const newActions = [...actions];
    newActions.splice(index, 1);
    onUpdate(newActions);
  };

  const updateEvent = (index: number, event: EventType) => {
    const existing = actions[index];
    if (!existing) return;
    const newActions = [...actions];
    newActions[index] = { ...existing, event };
    onUpdate(newActions);
  };

  const updateActionType = (index: number, type: ActionType) => {
    const existing = actions[index];
    if (!existing) return;
    const newActions = [...actions];
    newActions[index] = {
      ...existing,
      action: createDefaultAction(type),
    };
    onUpdate(newActions);
  };

  const updateActionField = (index: number, field: string, value: unknown) => {
    const existing = actions[index];
    if (!existing) return;
    const newActions = [...actions];
    newActions[index] = {
      ...existing,
      action: { ...existing.action, [field]: value } as BuilderActionBinding['action'],
    };
    onUpdate(newActions);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Define what happens when users interact with this component.
      </div>

      {actions.map((actionBinding, index) => (
        <div key={index} className="p-3 border rounded-lg space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Action {index + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={() => removeAction(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Trigger Event</Label>
            <Select
              value={actionBinding.event}
              onValueChange={(v) => updateEvent(index, v as EventType)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Action Type</Label>
            <Select
              value={actionBinding.action.type}
              onValueChange={(v) => updateActionType(index, v as ActionType)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action-specific fields */}
          {actionBinding.action.type === 'navigate' && (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">URL</Label>
                <Input
                  value={'to' in actionBinding.action ? actionBinding.action.to : ''}
                  onChange={(e) => updateActionField(index, 'to', e.target.value)}
                  placeholder="https://..."
                  className="h-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={'target' in actionBinding.action && actionBinding.action.target === '_blank'}
                  onCheckedChange={(v) => updateActionField(index, 'target', v ? '_blank' : '_self')}
                />
                <Label className="text-xs">Open in new tab</Label>
              </div>
            </div>
          )}

          {actionBinding.action.type === 'navigatePage' && (
            <div className="space-y-1">
              <Label className="text-xs">Page Slug</Label>
              <Input
                value={'pageSlug' in actionBinding.action ? actionBinding.action.pageSlug : ''}
                onChange={(e) => updateActionField(index, 'pageSlug', e.target.value)}
                placeholder="about-us"
                className="h-8"
              />
            </div>
          )}

          {actionBinding.action.type === 'scrollTo' && (
            <div className="space-y-1">
              <Label className="text-xs">Element ID</Label>
              <Input
                value={'targetId' in actionBinding.action ? actionBinding.action.targetId : ''}
                onChange={(e) => updateActionField(index, 'targetId', e.target.value)}
                placeholder="section-id"
                className="h-8"
              />
            </div>
          )}

          {actionBinding.action.type === 'openModal' && (
            <div className="space-y-1">
              <Label className="text-xs">Modal ID</Label>
              <Input
                value={'modalId' in actionBinding.action ? actionBinding.action.modalId : ''}
                onChange={(e) => updateActionField(index, 'modalId', e.target.value)}
                placeholder="contact-modal"
                className="h-8"
              />
            </div>
          )}

          {actionBinding.action.type === 'setState' && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">State Key</Label>
                <Input
                  value={'key' in actionBinding.action ? actionBinding.action.key : ''}
                  onChange={(e) => updateActionField(index, 'key', e.target.value)}
                  placeholder="myVariable"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Value</Label>
                <Input
                  value={'value' in actionBinding.action ? String(actionBinding.action.value || '') : ''}
                  onChange={(e) => updateActionField(index, 'value', e.target.value)}
                  placeholder="value"
                  className="h-8"
                />
              </div>
            </>
          )}

          {actionBinding.action.type === 'toggleState' && (
            <div className="space-y-1">
              <Label className="text-xs">State Key</Label>
              <Input
                value={'key' in actionBinding.action ? actionBinding.action.key : ''}
                onChange={(e) => updateActionField(index, 'key', e.target.value)}
                placeholder="isOpen"
                className="h-8"
              />
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addAction} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Action
      </Button>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        {title}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
