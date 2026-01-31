import { useState } from 'react';
import { useEditorStore } from '../store/editor-store';
import { componentRegistry, findNodeById } from '@builderly/core';
import type { BuilderStyle, BuilderActionBinding, BuilderAnimation } from '@builderly/core';
import { ANIMATION_PRESETS, defaultAnimation } from '@builderly/core';
import type { AnimationType, AnimationTrigger, AnimationEasing } from '@builderly/core';
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
  cn,
} from '@builderly/ui';
import { Trash2, Copy, ChevronDown, Plus, X, Image, FolderOpen, Sparkles } from 'lucide-react';
import { AssetPicker } from './AssetPicker';

export function Inspector() {
  const {
    tree,
    selectedNodeId,
    updateNodeProps,
    updateNodeStyle,
    updateNodeActions,
    updateNodeAnimation,
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="animate" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">Animate</span>
          </TabsTrigger>
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

        <TabsContent value="animate" className="space-y-4 mt-4">
          <AnimationEditor
            animation={node.animation}
            onUpdate={(animation) => updateNodeAnimation(selectedNodeId, animation)}
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
  const { workspaceId, siteId } = useEditorStore();
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<string | null>(null);

  const openAssetPicker = (target: string) => {
    setAssetPickerTarget(target);
    setAssetPickerOpen(true);
  };

  const handleAssetSelect = (asset: { url: string; alt?: string }) => {
    if (assetPickerTarget === 'src') {
      onUpdate({ src: asset.url, alt: asset.alt || props.alt || '' });
    } else if (assetPickerTarget === 'image') {
      onUpdate({ image: asset.url });
    } else if (assetPickerTarget === 'backgroundImage') {
      onUpdate({ backgroundImage: asset.url });
    }
    setAssetPickerOpen(false);
    setAssetPickerTarget(null);
  };

  switch (node.type) {
    case 'Section':
      return (
        <div className="space-y-4">
          <CollapsibleSection title="Layout" icon="📏" color="text-blue-400" defaultOpen>
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

          <CollapsibleSection title="Background Image" icon="🖼️" color="text-purple-400">
            {/* Asset Picker for Section Background */}
            {workspaceId && (
              <AssetPicker
                open={assetPickerOpen && assetPickerTarget === 'backgroundImage'}
                onOpenChange={setAssetPickerOpen}
                onSelect={handleAssetSelect}
                workspaceId={workspaceId}
                siteId={siteId || undefined}
                accept="image"
              />
            )}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Hintergrundbild</Label>
                <div className="flex gap-2">
                  <Input
                    value={(props.backgroundImage as string) || ''}
                    onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openAssetPicker('backgroundImage')}
                    title="Aus Mediathek wählen"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
                {/* Background Preview */}
                {props.backgroundImage && (
                  <div className="relative w-full h-16 bg-muted rounded-md overflow-hidden mt-2">
                    <img
                      src={props.backgroundImage as string}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
          {/* Asset Picker Dialog */}
          {workspaceId && (
            <AssetPicker
              open={assetPickerOpen}
              onOpenChange={setAssetPickerOpen}
              onSelect={handleAssetSelect}
              workspaceId={workspaceId}
              siteId={siteId || undefined}
              accept="image"
            />
          )}
          
          <div className="space-y-2">
            <Label>Bild</Label>
            <div className="flex gap-2">
              <Input
                value={(props.src as string) || ''}
                onChange={(e) => onUpdate({ src: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => openAssetPicker('src')}
                title="Aus Mediathek wählen"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            {/* Image Preview */}
            {props.src && (
              <div className="relative w-full h-24 bg-muted rounded-md overflow-hidden">
                <img
                  src={props.src as string}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={(props.alt as string) || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              placeholder="Bildbeschreibung für Barrierefreiheit..."
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
              <Label className="text-xs">Breite</Label>
              <Input
                value={(props.width as string) || ''}
                onChange={(e) => onUpdate({ width: e.target.value })}
                placeholder="auto"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Höhe</Label>
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
          {/* Asset Picker for Card Image */}
          {workspaceId && (
            <AssetPicker
              open={assetPickerOpen && assetPickerTarget === 'image'}
              onOpenChange={setAssetPickerOpen}
              onSelect={handleAssetSelect}
              workspaceId={workspaceId}
              siteId={siteId || undefined}
              accept="image"
            />
          )}
          <div className="space-y-2">
            <Label>Titel</Label>
            <Input
              value={(props.title as string) || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Beschreibung</Label>
            <Textarea
              value={(props.description as string) || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Bild</Label>
            <div className="flex gap-2">
              <Input
                value={(props.image as string) || ''}
                onChange={(e) => onUpdate({ image: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => openAssetPicker('image')}
                title="Aus Mediathek wählen"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            {props.image && (
              <div className="relative w-full h-20 bg-muted rounded-md overflow-hidden">
                <img
                  src={props.image as string}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
  const { workspaceId, siteId } = useEditorStore();
  const [bgAssetPickerOpen, setBgAssetPickerOpen] = useState(false);

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

  const handleBgAssetSelect = (asset: { url: string }) => {
    updateBase('backgroundImage', asset.url);
    setBgAssetPickerOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Size & Dimensions */}
      <CollapsibleSection title="Size & Dimensions" icon="📐" color="text-blue-400" defaultOpen>
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

      {/* Layout & Position */}
      <CollapsibleSection title="Layout & Position" icon="📍" color="text-green-400" defaultOpen>
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
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Align Self (in Flex/Grid parent)</Label>
            <Select
              value={getValue(base.alignSelf)}
              onValueChange={(v) => updateBase('alignSelf', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Auto</SelectItem>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Justify Self (in Grid parent)</Label>
            <Select
              value={getValue(base.justifySelf)}
              onValueChange={(v) => updateBase('justifySelf', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Auto</SelectItem>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Flex Grow</Label>
            <Select
              value={getValue(base.flexGrow)}
              onValueChange={(v) => updateBase('flexGrow', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">0 (Don't grow)</SelectItem>
                <SelectItem value="1">1 (Grow)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Flex Shrink</Label>
            <Select
              value={getValue(base.flexShrink)}
              onValueChange={(v) => updateBase('flexShrink', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 (Don't shrink)</SelectItem>
                <SelectItem value="_none">1 (Shrink)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacing - Visual Box Model */}
      <CollapsibleSection title="Spacing" icon="↔️" color="text-orange-400" defaultOpen>
        <div className="space-y-4">
          {/* Visual Box Model */}
          <div className="relative bg-orange-500/20 border-2 border-dashed border-orange-400 rounded p-1">
            {/* Margin label */}
            <div className="absolute -top-2.5 left-2 bg-background px-1 text-[10px] text-orange-400 font-medium">MARGIN</div>
            
            {/* Margin Top */}
            <div className="flex justify-center mb-1">
              <SpacingInput
                value={base.marginTop as string}
                onChange={(v) => updateBase('marginTop', v)}
                placeholder="0"
                className="bg-orange-500/30 border-orange-400"
              />
            </div>
            
            <div className="flex items-center gap-1">
              {/* Margin Left */}
              <SpacingInput
                value={base.marginLeft as string}
                onChange={(v) => updateBase('marginLeft', v)}
                placeholder="0"
                className="bg-orange-500/30 border-orange-400"
              />
              
              {/* Padding Box */}
              <div className="flex-1 relative bg-green-500/20 border-2 border-dashed border-green-400 rounded p-1">
                {/* Padding label */}
                <div className="absolute -top-2.5 left-2 bg-background px-1 text-[10px] text-green-400 font-medium">PADDING</div>
                
                {/* Padding Top */}
                <div className="flex justify-center mb-1">
                  <SpacingInput
                    value={base.paddingTop as string}
                    onChange={(v) => updateBase('paddingTop', v)}
                    placeholder="0"
                    className="bg-green-500/30 border-green-400"
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Padding Left */}
                  <SpacingInput
                    value={base.paddingLeft as string}
                    onChange={(v) => updateBase('paddingLeft', v)}
                    placeholder="0"
                    className="bg-green-500/30 border-green-400"
                  />
                  
                  {/* Content Box */}
                  <div className="flex-1 bg-blue-500/30 border border-blue-400 rounded h-8 flex items-center justify-center">
                    <span className="text-[10px] text-blue-300">Content</span>
                  </div>
                  
                  {/* Padding Right */}
                  <SpacingInput
                    value={base.paddingRight as string}
                    onChange={(v) => updateBase('paddingRight', v)}
                    placeholder="0"
                    className="bg-green-500/30 border-green-400"
                  />
                </div>
                
                {/* Padding Bottom */}
                <div className="flex justify-center mt-1">
                  <SpacingInput
                    value={base.paddingBottom as string}
                    onChange={(v) => updateBase('paddingBottom', v)}
                    placeholder="0"
                    className="bg-green-500/30 border-green-400"
                  />
                </div>
              </div>
              
              {/* Margin Right */}
              <SpacingInput
                value={base.marginRight as string}
                onChange={(v) => updateBase('marginRight', v)}
                placeholder="0"
                className="bg-orange-500/30 border-orange-400"
              />
            </div>
            
            {/* Margin Bottom */}
            <div className="flex justify-center mt-1">
              <SpacingInput
                value={base.marginBottom as string}
                onChange={(v) => updateBase('marginBottom', v)}
                placeholder="0"
                className="bg-orange-500/30 border-orange-400"
              />
            </div>
          </div>
          
          {/* Quick Presets */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Padding</Label>
            <div className="flex gap-1 flex-wrap">
              {['none', 'xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
                <Button
                  key={size}
                  variant={base.padding === size || (size === 'none' && !base.padding) ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    updateBase('padding', size === 'none' ? undefined : size);
                    updateBase('paddingTop', undefined);
                    updateBase('paddingBottom', undefined);
                    updateBase('paddingLeft', undefined);
                    updateBase('paddingRight', undefined);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Margin</Label>
            <div className="flex gap-1 flex-wrap">
              {['none', 'auto', 'xs', 'sm', 'md', 'lg'].map((size) => (
                <Button
                  key={size}
                  variant={base.margin === size || (size === 'none' && !base.margin) ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    updateBase('margin', size === 'none' ? undefined : size);
                    updateBase('marginTop', undefined);
                    updateBase('marginBottom', undefined);
                    updateBase('marginLeft', undefined);
                    updateBase('marginRight', undefined);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Background" icon="🎨" color="text-purple-400">
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
            <Label className="text-xs">Hintergrundbild</Label>
            {/* Asset Picker for Style Background */}
            {workspaceId && (
              <AssetPicker
                open={bgAssetPickerOpen}
                onOpenChange={setBgAssetPickerOpen}
                onSelect={handleBgAssetSelect}
                workspaceId={workspaceId}
                siteId={siteId || undefined}
                accept="image"
              />
            )}
            <div className="flex gap-2">
              <Input
                value={(base.backgroundImage as string) || ''}
                onChange={(e) => updateBase('backgroundImage', e.target.value)}
                placeholder="https://..."
                className="h-8 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setBgAssetPickerOpen(true)}
                title="Aus Mediathek wählen"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            {base.backgroundImage && (
              <div className="relative w-full h-16 bg-muted rounded-md overflow-hidden mt-2">
                <img
                  src={base.backgroundImage as string}
                  alt="Background Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
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
      <CollapsibleSection title="Typography" icon="✏️" color="text-pink-400">
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
      <CollapsibleSection title="Border" icon="🔲" color="text-cyan-400">
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
      <CollapsibleSection title="Shadow & Effects" icon="💫" color="text-yellow-400">
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
            <Label className="text-xs">Custom Box Shadow</Label>
            <Input
              value={(base.boxShadow as string) || ''}
              onChange={(e) => updateBase('boxShadow', e.target.value)}
              placeholder="0 10px 40px rgba(0,0,0,0.3)"
              className="h-8"
            />
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

      {/* Advanced Effects */}
      <CollapsibleSection title="Advanced Effects" icon="✨" color="text-indigo-400">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Gradient Background</Label>
            <Input
              value={(base.gradient as string) || ''}
              onChange={(e) => updateBase('gradient', e.target.value)}
              placeholder="linear-gradient(135deg, #ff6b6b, #4ecdc4)"
              className="h-8"
            />
            <p className="text-[10px] text-muted-foreground">CSS gradient value (linear-gradient, radial-gradient)</p>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Backdrop Blur (Glassmorphism)</Label>
            <Select
              value={getValue(base.backdropBlur)}
              onValueChange={(v) => updateBase('backdropBlur', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">Small (4px)</SelectItem>
                <SelectItem value="md">Medium (8px)</SelectItem>
                <SelectItem value="lg">Large (12px)</SelectItem>
                <SelectItem value="xl">XL (16px)</SelectItem>
                <SelectItem value="2xl">2XL (24px)</SelectItem>
                <SelectItem value="3xl">3XL (40px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Element Blur</Label>
            <Select
              value={getValue(base.blur)}
              onValueChange={(v) => updateBase('blur', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">Small (4px)</SelectItem>
                <SelectItem value="md">Medium (8px)</SelectItem>
                <SelectItem value="lg">Large (12px)</SelectItem>
                <SelectItem value="xl">XL (16px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Transform</Label>
            <Input
              value={(base.transform as string) || ''}
              onChange={(e) => updateBase('transform', e.target.value)}
              placeholder="translateY(-10px) scale(1.05)"
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Transition</Label>
            <Select
              value={getValue(base.transition)}
              onValueChange={(v) => updateBase('transition', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="all">All (smooth)</SelectItem>
                <SelectItem value="colors">Colors</SelectItem>
                <SelectItem value="transform">Transform</SelectItem>
                <SelectItem value="opacity">Opacity</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Aspect Ratio</Label>
            <Input
              value={(base.aspectRatio as string) || ''}
              onChange={(e) => updateBase('aspectRatio', e.target.value)}
              placeholder="16/9 or 1/1"
              className="h-8"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Hover & Interactions */}
      <CollapsibleSection title="Hover & Interactions" icon="🖱️" color="text-rose-400">
        <div className="space-y-3">
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-md mb-3">
            <p className="text-[10px] text-rose-300">
              Diese Styles werden angewendet, wenn der Nutzer über das Element hovert.
            </p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Background
            </Label>
            <Input
              value={(base.hoverBackgroundColor as string) || ''}
              onChange={(e) => updateBase('hoverBackgroundColor', e.target.value)}
              placeholder="#ff6b6b or rgba(...)"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Text Color
            </Label>
            <Input
              value={(base.hoverTextColor as string) || ''}
              onChange={(e) => updateBase('hoverTextColor', e.target.value)}
              placeholder="#ffffff"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Border Color
            </Label>
            <Input
              value={(base.hoverBorderColor as string) || ''}
              onChange={(e) => updateBase('hoverBorderColor', e.target.value)}
              placeholder="#ffffff"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Scale
            </Label>
            <Select
              value={getValue(base.hoverScale)}
              onValueChange={(v) => updateBase('hoverScale', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="95">Shrink (95%)</SelectItem>
                <SelectItem value="100">Normal (100%)</SelectItem>
                <SelectItem value="102">Slight (102%)</SelectItem>
                <SelectItem value="105">Medium (105%)</SelectItem>
                <SelectItem value="110">Large (110%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Shadow
            </Label>
            <Select
              value={getValue(base.hoverShadow)}
              onValueChange={(v) => updateBase('hoverShadow', v)}
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
                <SelectItem value="glow">Glow Effect</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Hover Opacity (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={(base.hoverOpacity as number) || ''}
              onChange={(e) => updateBase('hoverOpacity', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="100"
              className="h-8"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Transition Duration
            </Label>
            <Select
              value={getValue(base.transitionDuration)}
              onValueChange={(v) => updateBase('transitionDuration', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default (150ms)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default (150ms)</SelectItem>
                <SelectItem value="75">Fast (75ms)</SelectItem>
                <SelectItem value="150">Normal (150ms)</SelectItem>
                <SelectItem value="300">Slow (300ms)</SelectItem>
                <SelectItem value="500">Very Slow (500ms)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Cursor
            </Label>
            <Select
              value={getValue(base.cursor)}
              onValueChange={(v) => updateBase('cursor', v)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="pointer">Pointer (Hand)</SelectItem>
                <SelectItem value="move">Move</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="not-allowed">Not Allowed</SelectItem>
                <SelectItem value="grab">Grab</SelectItem>
                <SelectItem value="zoom-in">Zoom In</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Position & Display */}
      <CollapsibleSection title="Position & Display" icon="📋" color="text-teal-400">
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

      {/* Applied Styles - Shows all currently set values */}
      <CollapsibleSection title="Applied Styles" icon="✅" color="text-emerald-400">
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground mb-2">
            Currently applied style properties:
          </p>
          {Object.entries(base).filter(([_, v]) => v !== undefined && v !== '' && v !== null).length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No custom styles applied</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(base)
                .filter(([_, v]) => v !== undefined && v !== '' && v !== null)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-muted/50 rounded px-2 py-1 group"
                  >
                    <span className="text-xs font-mono">{key}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[100px]" title={String(value)}>
                        {String(value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100"
                        onClick={() => updateBase(key, undefined)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
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

// ============================================================================
// ANIMATION EDITOR
// ============================================================================

function AnimationEditor({
  animation,
  onUpdate,
}: {
  animation?: BuilderAnimation;
  onUpdate: (animation: BuilderAnimation | undefined) => void;
}) {
  const currentAnimation = animation || defaultAnimation;
  const isEnabled = animation?.type !== 'none' && animation?.type !== undefined;

  const handlePresetSelect = (presetId: string) => {
    const preset = ANIMATION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onUpdate({
        ...defaultAnimation,
        ...preset.animation,
      });
    }
  };

  const handleChange = (field: keyof BuilderAnimation, value: unknown) => {
    onUpdate({
      ...currentAnimation,
      [field]: value,
    });
  };

  const handleDisable = () => {
    onUpdate(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <CollapsibleSection
        title="Schnellauswahl"
        icon={<Sparkles className="h-4 w-4" />}
        color="text-purple-400"
        defaultOpen
      >
        <div className="grid grid-cols-2 gap-2">
          {ANIMATION_PRESETS.slice(0, 6).map((preset) => (
            <Button
              key={preset.id}
              variant={currentAnimation.type === preset.animation.type && 
                       currentAnimation.trigger === (preset.animation.trigger || 'onScroll') 
                       ? 'default' : 'outline'}
              size="sm"
              className="justify-start text-xs h-auto py-2"
              onClick={() => handlePresetSelect(preset.id)}
            >
              <div className="text-left">
                <div className="font-medium">{preset.name}</div>
                <div className="text-muted-foreground text-[10px]">{preset.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        {ANIMATION_PRESETS.length > 6 && (
          <Collapsible className="mt-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-xs">
                <ChevronDown className="h-3 w-3 mr-1" />
                Mehr anzeigen
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ANIMATION_PRESETS.slice(6).map((preset) => (
                  <Button
                    key={preset.id}
                    variant={currentAnimation.type === preset.animation.type && 
                             currentAnimation.trigger === (preset.animation.trigger || 'onScroll') 
                             ? 'default' : 'outline'}
                    size="sm"
                    className="justify-start text-xs h-auto py-2"
                    onClick={() => handlePresetSelect(preset.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-muted-foreground text-[10px]">{preset.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CollapsibleSection>

      {/* Custom Settings */}
      {isEnabled && (
        <CollapsibleSection
          title="Benutzerdefiniert"
          icon="⚙️"
          color="text-blue-400"
          defaultOpen={false}
        >
          <div className="space-y-4">
            {/* Animation Type */}
            <div className="space-y-2">
              <Label className="text-xs">Animation</Label>
              <Select
                value={currentAnimation.type}
                onValueChange={(val) => handleChange('type', val as AnimationType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Keine</SelectItem>
                  <SelectItem value="fadeIn">Einblenden</SelectItem>
                  <SelectItem value="fadeInUp">Einblenden (von unten)</SelectItem>
                  <SelectItem value="fadeInDown">Einblenden (von oben)</SelectItem>
                  <SelectItem value="fadeInLeft">Einblenden (von links)</SelectItem>
                  <SelectItem value="fadeInRight">Einblenden (von rechts)</SelectItem>
                  <SelectItem value="slideInUp">Hochschieben</SelectItem>
                  <SelectItem value="slideInDown">Runterschieben</SelectItem>
                  <SelectItem value="slideInLeft">Von links schieben</SelectItem>
                  <SelectItem value="slideInRight">Von rechts schieben</SelectItem>
                  <SelectItem value="scaleIn">Vergrößern</SelectItem>
                  <SelectItem value="scaleInUp">Vergrößern (von unten)</SelectItem>
                  <SelectItem value="pulse">Pulsieren</SelectItem>
                  <SelectItem value="bounce">Springen</SelectItem>
                  <SelectItem value="shake">Schütteln</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trigger */}
            <div className="space-y-2">
              <Label className="text-xs">Auslöser</Label>
              <Select
                value={currentAnimation.trigger}
                onValueChange={(val) => handleChange('trigger', val as AnimationTrigger)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onScroll">Beim Scrollen (sichtbar)</SelectItem>
                  <SelectItem value="onLoad">Beim Laden</SelectItem>
                  <SelectItem value="onHover">Bei Hover</SelectItem>
                  <SelectItem value="onClick">Bei Klick</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Dauer</Label>
                <span className="text-xs text-muted-foreground">{currentAnimation.duration}ms</span>
              </div>
              <Slider
                value={[currentAnimation.duration]}
                min={100}
                max={2000}
                step={50}
                onValueChange={([val]) => handleChange('duration', val)}
              />
            </div>

            {/* Delay */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Verzögerung</Label>
                <span className="text-xs text-muted-foreground">{currentAnimation.delay}ms</span>
              </div>
              <Slider
                value={[currentAnimation.delay]}
                min={0}
                max={2000}
                step={50}
                onValueChange={([val]) => handleChange('delay', val)}
              />
            </div>

            {/* Easing */}
            <div className="space-y-2">
              <Label className="text-xs">Easing</Label>
              <Select
                value={currentAnimation.easing}
                onValueChange={(val) => handleChange('easing', val as AnimationEasing)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="ease">Ease</SelectItem>
                  <SelectItem value="ease-in">Ease In</SelectItem>
                  <SelectItem value="ease-out">Ease Out</SelectItem>
                  <SelectItem value="ease-in-out">Ease In-Out</SelectItem>
                  <SelectItem value="ease-in-back">Ease In (Back)</SelectItem>
                  <SelectItem value="ease-out-back">Ease Out (Back)</SelectItem>
                  <SelectItem value="ease-in-out-back">Ease In-Out (Back)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scroll offset (only for scroll trigger) */}
            {currentAnimation.trigger === 'onScroll' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Scroll-Offset</Label>
                  <span className="text-xs text-muted-foreground">{currentAnimation.scrollOffset}%</span>
                </div>
                <Slider
                  value={[currentAnimation.scrollOffset ?? 20]}
                  min={0}
                  max={50}
                  step={5}
                  onValueChange={([val]) => handleChange('scrollOffset', val)}
                />
                <p className="text-[10px] text-muted-foreground">
                  Wie weit das Element im Viewport sein muss, bevor die Animation startet.
                </p>
              </div>
            )}

            {/* Repeat option for scroll */}
            {currentAnimation.trigger === 'onScroll' && (
              <div className="flex items-center justify-between">
                <Label className="text-xs">Wiederholen beim Zurückscrollen</Label>
                <Switch
                  checked={currentAnimation.repeat ?? false}
                  onCheckedChange={(checked) => handleChange('repeat', checked)}
                />
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Remove Animation Button */}
      {isEnabled && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
          onClick={handleDisable}
        >
          <X className="h-3 w-3 mr-1" />
          Animation entfernen
        </Button>
      )}

      {/* Preview hint */}
      {isEnabled && (
        <p className="text-[10px] text-muted-foreground text-center">
          💡 Tipp: Wechseln Sie in den Vorschaumodus, um die Animation zu testen.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// ACTIONS EDITOR
// ============================================================================

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

// Visual spacing input for box model
function SpacingInput({
  value,
  onChange,
  placeholder = '0',
  className = '',
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
}) {
  const spacingOptions = ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'auto'];
  const [isOpen, setIsOpen] = useState(false);
  
  const displayValue = value || '-';
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-10 h-6 text-[10px] font-medium rounded border flex items-center justify-center hover:opacity-80 transition-opacity',
          className
        )}
      >
        {displayValue}
      </button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 bg-popover border rounded-md shadow-lg p-1 min-w-[60px]">
            {spacingOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt === '0' ? undefined : opt);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-2 py-1 text-xs rounded hover:bg-accent text-left',
                  (value === opt || (!value && opt === '0')) && 'bg-accent'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon,
  color,
  bgColor,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Map color names to soft background colors
  const bgColorMap: Record<string, string> = {
    'text-blue-400': 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
    'text-green-400': 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
    'text-orange-400': 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
    'text-purple-400': 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
    'text-pink-400': 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20',
    'text-cyan-400': 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20',
    'text-yellow-400': 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20',
    'text-indigo-400': 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
    'text-teal-400': 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20',
    'text-emerald-400': 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
    'text-rose-400': 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20',
  };

  const sectionBg = bgColor || (color ? bgColorMap[color] : 'bg-muted/30 hover:bg-muted/50 border-border/50');

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-2">
      <CollapsibleTrigger className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 group ${sectionBg}`}>
        <div className="flex items-center gap-2">
          {icon && (
            <span className={`text-sm ${color || 'text-muted-foreground'} group-hover:scale-110 transition-transform`}>
              {icon}
            </span>
          )}
          <span>{title}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pb-1 px-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}
