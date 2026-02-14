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
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-2">
            <span className="text-muted-foreground text-lg">◇</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Wähle eine Komponente<br/>um Eigenschaften zu bearbeiten</p>
        </div>
      </div>
    );
  }

  const node = findNodeById(tree.root, selectedNodeId);
  if (!node) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Komponente nicht gefunden</p>
      </div>
    );
  }

  const definition = componentRegistry.get(node.type);

  return (
    <div className="flex flex-col h-full">
      {/* Header - Photoshop style panel header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(220,10%,12%)] border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">
            {definition?.displayName || node.type}
          </span>
          <span className="text-[9px] text-muted-foreground truncate max-w-[80px]">{node.id}</span>
        </div>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => duplicateNode(selectedNodeId)}
            title="Duplizieren"
            className="h-6 w-6 rounded-[3px]"
          >
            <Copy className="h-3 w-3" />
          </Button>
          {selectedNodeId !== 'root' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNode(selectedNodeId)}
              title="Löschen"
              className="h-6 w-6 rounded-[3px] text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs - Compact Photoshop style */}
      <Tabs defaultValue="props" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="h-8 rounded-none border-b border-border bg-[hsl(220,10%,15%)] p-0 justify-start gap-0">
          <TabsTrigger value="props" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3">
            Eigenschaften
          </TabsTrigger>
          <TabsTrigger value="style" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3">
            Stil
          </TabsTrigger>
          <TabsTrigger value="animate" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Animation
          </TabsTrigger>
          <TabsTrigger value="actions" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[11px] px-3">
            Aktionen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="props" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          <PropsEditor
            node={node}
            definition={definition}
            onUpdate={(props) => updateNodeProps(selectedNodeId, props)}
          />
        </TabsContent>

        <TabsContent value="style" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          <StyleEditor
            style={node.style}
            nodeType={node.type}
            onUpdate={(style) => updateNodeStyle(selectedNodeId, style)}
          />
        </TabsContent>

        <TabsContent value="animate" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          <AnimationEditor
            animation={node.animation}
            onUpdate={(animation) => updateNodeAnimation(selectedNodeId, animation)}
          />
        </TabsContent>

        <TabsContent value="actions" className="flex-1 overflow-auto m-0 p-3 space-y-3">
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
          <CollapsibleSection title="Layout">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Volle Breite</Label>
                <Switch
                  checked={(props.fullWidth as boolean) ?? true}
                  onCheckedChange={(v) => onUpdate({ fullWidth: v })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min. Höhe</Label>
                <Select
                  value={(props.minHeight as string) || 'auto'}
                  onValueChange={(v) => onUpdate({ minHeight: v })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatisch</SelectItem>
                    <SelectItem value="screen">Vollbild</SelectItem>
                    <SelectItem value="half">Halber Bildschirm</SelectItem>
                    <SelectItem value="third">Drittel Bildschirm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Vertikale Ausrichtung</Label>
                <Select
                  value={(props.verticalAlign as string) || 'start'}
                  onValueChange={(v) => onUpdate({ verticalAlign: v })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Oben</SelectItem>
                    <SelectItem value="center">Mitte</SelectItem>
                    <SelectItem value="end">Unten</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Hintergrundbild">
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
                {typeof props.backgroundImage === 'string' && props.backgroundImage && (
                  <div className="relative w-full h-16 bg-muted rounded-md overflow-hidden mt-2">
                    <img
                      src={props.backgroundImage}
                      alt="Background Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Größe</Label>
                <Select
                  value={(props.backgroundSize as string) || 'cover'}
                  onValueChange={(v) => onUpdate({ backgroundSize: v })}
                >
                  <SelectTrigger className="h-7 text-xs">
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
                  <SelectTrigger className="h-7 text-xs">
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
                <Label className="text-xs">Overlay-Farbe</Label>
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
                <Label className="text-xs">Overlay-Deckkraft: {typeof props.backgroundOverlayOpacity === 'number' ? props.backgroundOverlayOpacity : 50}%</Label>
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
            <Label className="text-xs">Max. Breite</Label>
            <Select
              value={(props.maxWidth as string) || 'lg'}
              onValueChange={(v) => onUpdate({ maxWidth: v })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Sehr Klein (320px)</SelectItem>
                <SelectItem value="sm">Klein (640px)</SelectItem>
                <SelectItem value="md">Mittel (768px)</SelectItem>
                <SelectItem value="lg">Groß (1024px)</SelectItem>
                <SelectItem value="xl">Sehr Groß (1280px)</SelectItem>
                <SelectItem value="2xl">2XL (1536px)</SelectItem>
                <SelectItem value="3xl">3XL (1920px)</SelectItem>
                <SelectItem value="full">Volle Breite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Zentriert</Label>
            <Switch
              checked={(props.centered as boolean) ?? true}
              onCheckedChange={(v) => onUpdate({ centered: v })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Min. Höhe</Label>
            <Select
              value={(props.minHeight as string) || 'auto'}
              onValueChange={(v) => onUpdate({ minHeight: v })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatisch</SelectItem>
                <SelectItem value="full">Voll</SelectItem>
                <SelectItem value="screen">Bildschirmhöhe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Stack':
      return (
        <div className="space-y-4">
          <p className="text-[11px] text-muted-foreground">
            Layout-Einstellungen im Style Tab
          </p>
        </div>
      );

    case 'Grid':
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Spalten (Desktop)</Label>
            <Select
              value={String(props.columns || 3)}
              onValueChange={(v) => onUpdate({ columns: parseInt(v) })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Spalte{n !== 1 ? 'n' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Spalten (Tablet)</Label>
            <Select
              value={String(props.columnsTablet || 2)}
              onValueChange={(v) => onUpdate({ columnsTablet: parseInt(v) })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Spalte{n !== 1 ? 'n' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Spalten (Mobil)</Label>
            <Select
              value={String(props.columnsMobile || 1)}
              onValueChange={(v) => onUpdate({ columnsMobile: parseInt(v) })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} Spalte{n !== 1 ? 'n' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'Text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Textinhalt</Label>
            <Textarea
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Text eingeben..."
              rows={4}
            />
          </div>
        </div>
      );

    case 'Heading':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Überschriftentext</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Überschrift eingeben..."
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select
              value={String(props.level || 2)}
              onValueChange={(v) => onUpdate({ level: parseInt(v) })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((l) => (
                  <SelectItem key={l} value={String(l)}>
                    H{l} - {['Sehr Groß', 'Groß', 'Mittel', 'Klein', 'Sehr Klein', 'Winzig'][l - 1]}
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
            <Label>Button-Text</Label>
            <Input
              value={(props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Variante</Label>
            <Select
              value={(props.variant as string) || 'primary'}
              onValueChange={(v) => onUpdate({ variant: v })}
            >
              <SelectTrigger className="h-7 text-xs">
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
            <Label>Größe</Label>
            <Select
              value={(props.size as string) || 'md'}
              onValueChange={(v) => onUpdate({ size: v })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Klein</SelectItem>
                <SelectItem value="md">Mittel</SelectItem>
                <SelectItem value="lg">Groß</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Volle Breite</Label>
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
            {typeof props.src === 'string' && props.src && (
              <div className="relative w-full h-24 bg-muted rounded-md overflow-hidden">
                <img
                  src={props.src}
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
            <Label>Objektanpassung</Label>
            <Select
              value={(props.objectFit as string) || 'cover'}
              onValueChange={(v) => onUpdate({ objectFit: v })}
            >
              <SelectTrigger className="h-7 text-xs">
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
            {typeof props.image === 'string' && props.image && (
              <div className="relative w-full h-20 bg-muted rounded-md overflow-hidden">
                <img
                  src={props.image}
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
            <Label>Link-Text</Label>
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
            <Label>Ziel</Label>
            <Select
              value={(props.target as string) || '_self'}
              onValueChange={(v) => onUpdate({ target: v })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Gleiches Fenster</SelectItem>
                <SelectItem value="_blank">Neues Fenster</SelectItem>
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
            <Label>Feldname</Label>
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
            <Label>Platzhalter</Label>
            <Input
              value={(props.placeholder as string) || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pflichtfeld</Label>
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
            <Label>Größe</Label>
            <Select
              value={(props.size as string) || 'md'}
              onValueChange={(v) => onUpdate({ size: v })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Sehr Klein (8px)</SelectItem>
                <SelectItem value="sm">Klein (16px)</SelectItem>
                <SelectItem value="md">Mittel (32px)</SelectItem>
                <SelectItem value="lg">Groß (48px)</SelectItem>
                <SelectItem value="xl">Sehr Groß (64px)</SelectItem>
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
          Keine bearbeitbaren Eigenschaften für diese Komponente.
        </div>
      );
  }
}

// ============================================================================
// STYLE EDITOR - COMPREHENSIVE
// ============================================================================

function StyleEditor({
  style,
  nodeType,
  onUpdate,
}: {
  style: BuilderStyle;
  nodeType: string;
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

  // Helper to check if a section has any changes
  const hasSizeChanges = !!(base.width || base.height || base.minWidth || base.minHeight || base.maxWidth || base.maxHeight);
  const hasLayoutChanges = !!(base.display || base.flexDirection || base.justifyContent || base.alignItems || base.flexWrap || base.gap || base.position || base.zIndex);
  const hasSpacingChanges = !!(base.padding || base.paddingTop || base.paddingBottom || base.paddingLeft || base.paddingRight || base.margin || base.marginTop || base.marginBottom || base.marginLeft || base.marginRight);
  const hasBackgroundChanges = !!(base.bgColor || base.backgroundColor || base.backgroundImage || base.gradient);
  const hasTypographyChanges = !!(base.textColor || base.color || base.textAlign || base.fontSize || base.fontWeight || base.lineHeight || base.letterSpacing);
  const hasBorderChanges = !!(base.borderWidth || base.borderColor || base.borderStyle || base.borderRadius);
  const hasEffectsChanges = !!(base.shadow || base.opacity || base.backdropBlur || base.transform);

  return (
    <div className="space-y-2">
      {/* Size */}
      <CollapsibleSection title="Größe" hasChanges={hasSizeChanges}>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Breite</Label>
            <Select value={getValue(base.width)} onValueChange={(v) => updateBase('width', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Auto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Auto</SelectItem>
                <SelectItem value="100%">100%</SelectItem>
                <SelectItem value="50%">50%</SelectItem>
                <SelectItem value="fit-content">Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Höhe</Label>
            <Select value={getValue(base.height)} onValueChange={(v) => updateBase('height', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Auto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Auto</SelectItem>
                <SelectItem value="100%">100%</SelectItem>
                <SelectItem value="100vh">Fullscreen</SelectItem>
                <SelectItem value="50vh">50vh</SelectItem>
                <SelectItem value="fit-content">Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Min-Breite</Label>
            <Input value={(base.minWidth as string) || ''} onChange={(e) => updateBase('minWidth', e.target.value)} placeholder="0" className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Min-Höhe</Label>
            <Input value={(base.minHeight as string) || ''} onChange={(e) => updateBase('minHeight', e.target.value)} placeholder="0" className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Max-Breite</Label>
            <Input value={(base.maxWidth as string) || ''} onChange={(e) => updateBase('maxWidth', e.target.value)} placeholder="none" className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Max-Höhe</Label>
            <Input value={(base.maxHeight as string) || ''} onChange={(e) => updateBase('maxHeight', e.target.value)} placeholder="none" className="h-7 text-xs" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Layout */}
      <CollapsibleSection title="Layout" hasChanges={hasLayoutChanges}>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Display</Label>
            <Select value={getValue(base.display)} onValueChange={(v) => updateBase('display', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Default" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
                <SelectItem value="none">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(base.display === 'flex' || base.display === 'inline-flex') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Richtung</Label>
                  <Select value={getValue(base.flexDirection)} onValueChange={(v) => updateBase('flexDirection', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Row" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="row">Horizontal</SelectItem>
                      <SelectItem value="column">Vertikal</SelectItem>
                      <SelectItem value="row-reverse">H-Reverse</SelectItem>
                      <SelectItem value="column-reverse">V-Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Gap</Label>
                  <Select value={getValue(base.gap)} onValueChange={(v) => updateBase('gap', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="0" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">0</SelectItem>
                      <SelectItem value="0.5rem">8px</SelectItem>
                      <SelectItem value="1rem">16px</SelectItem>
                      <SelectItem value="1.5rem">24px</SelectItem>
                      <SelectItem value="2rem">32px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Horizontal</Label>
                  <Select value={getValue(base.justifyContent)} onValueChange={(v) => updateBase('justifyContent', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Start" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex-start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="flex-end">End</SelectItem>
                      <SelectItem value="space-between">Between</SelectItem>
                      <SelectItem value="space-around">Around</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Vertikal</Label>
                  <Select value={getValue(base.alignItems)} onValueChange={(v) => updateBase('alignItems', v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Stretch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex-start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="flex-end">End</SelectItem>
                      <SelectItem value="stretch">Stretch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Wrap</Label>
                <Select value={getValue(base.flexWrap)} onValueChange={(v) => updateBase('flexWrap', v)}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="No Wrap" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">No Wrap</SelectItem>
                    <SelectItem value="wrap">Wrap</SelectItem>
                    <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Position</Label>
              <Select value={getValue(base.position)} onValueChange={(v) => updateBase('position', v)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Static" /></SelectTrigger>
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
              <Label className="text-[10px] text-muted-foreground">Z-Index</Label>
              <Input type="number" value={(base.zIndex as number) || ''} onChange={(e) => updateBase('zIndex', parseInt(e.target.value) || undefined)} placeholder="auto" className="h-7 text-xs" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacing */}
      <CollapsibleSection title="Abstände" hasChanges={hasSpacingChanges}>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Padding</Label>
            <div className="grid grid-cols-4 gap-1">
              <Input value={(base.paddingTop as string) || ''} onChange={(e) => updateBase('paddingTop', e.target.value)} placeholder="↑" className="h-7 text-xs text-center" title="Top" />
              <Input value={(base.paddingRight as string) || ''} onChange={(e) => updateBase('paddingRight', e.target.value)} placeholder="→" className="h-7 text-xs text-center" title="Right" />
              <Input value={(base.paddingBottom as string) || ''} onChange={(e) => updateBase('paddingBottom', e.target.value)} placeholder="↓" className="h-7 text-xs text-center" title="Bottom" />
              <Input value={(base.paddingLeft as string) || ''} onChange={(e) => updateBase('paddingLeft', e.target.value)} placeholder="←" className="h-7 text-xs text-center" title="Left" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Margin</Label>
            <div className="grid grid-cols-4 gap-1">
              <Input value={(base.marginTop as string) || ''} onChange={(e) => updateBase('marginTop', e.target.value)} placeholder="↑" className="h-7 text-xs text-center" title="Top" />
              <Input value={(base.marginRight as string) || ''} onChange={(e) => updateBase('marginRight', e.target.value)} placeholder="→" className="h-7 text-xs text-center" title="Right" />
              <Input value={(base.marginBottom as string) || ''} onChange={(e) => updateBase('marginBottom', e.target.value)} placeholder="↓" className="h-7 text-xs text-center" title="Bottom" />
              <Input value={(base.marginLeft as string) || ''} onChange={(e) => updateBase('marginLeft', e.target.value)} placeholder="←" className="h-7 text-xs text-center" title="Left" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Hintergrund" hasChanges={hasBackgroundChanges}>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Farbe</Label>
            <div className="flex gap-1">
              <input type="color" value={(base.bgColor as string) || '#ffffff'} onChange={(e) => updateBase('bgColor', e.target.value)} className="h-7 w-10 rounded border cursor-pointer" />
              <Input value={(base.bgColor as string) || ''} onChange={(e) => updateBase('bgColor', e.target.value)} placeholder="transparent" className="h-7 text-xs flex-1" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Theme-Farbe</Label>
            <Select value={getValue(base.backgroundColor)} onValueChange={(v) => updateBase('backgroundColor', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="background">Background</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Gradient</Label>
            <Input value={(base.gradient as string) || ''} onChange={(e) => updateBase('gradient', e.target.value)} placeholder="linear-gradient(...)" className="h-7 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Bild URL</Label>
            <div className="flex gap-1">
              <Input value={(base.backgroundImage as string) || ''} onChange={(e) => updateBase('backgroundImage', e.target.value)} placeholder="https://..." className="h-7 text-xs flex-1" />
              {workspaceId && (
                <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => setBgAssetPickerOpen(true)}>
                  <FolderOpen className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection title="Text" hasChanges={hasTypographyChanges}>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Textfarbe</Label>
            <div className="flex gap-1">
              <input type="color" value={(base.textColor as string) || '#000000'} onChange={(e) => updateBase('textColor', e.target.value)} className="h-7 w-10 rounded border cursor-pointer" />
              <Input value={(base.textColor as string) || ''} onChange={(e) => updateBase('textColor', e.target.value)} placeholder="inherit" className="h-7 text-xs flex-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Größe</Label>
              <Select value={getValue(base.fontSize)} onValueChange={(v) => updateBase('fontSize', v)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Default" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Default</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="sm">SM</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                  <SelectItem value="3xl">3XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Gewicht</Label>
              <Select value={getValue(base.fontWeight)} onValueChange={(v) => updateBase('fontWeight', v)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Default" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">Default</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Ausrichtung</Label>
            <Select value={getValue(base.textAlign)} onValueChange={(v) => updateBase('textAlign', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Default" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Default</SelectItem>
                <SelectItem value="left">Links</SelectItem>
                <SelectItem value="center">Zentriert</SelectItem>
                <SelectItem value="right">Rechts</SelectItem>
                <SelectItem value="justify">Blocksatz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Border */}
      <CollapsibleSection title="Rahmen" hasChanges={hasBorderChanges}>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Breite</Label>
              <Select value={getValue(base.borderWidth)} onValueChange={(v) => updateBase('borderWidth', v)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="1">1px</SelectItem>
                  <SelectItem value="2">2px</SelectItem>
                  <SelectItem value="4">4px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">Stil</Label>
              <Select value={getValue(base.borderStyle)} onValueChange={(v) => updateBase('borderStyle', v)}>
                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Solid" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Farbe</Label>
            <div className="flex gap-1">
              <input type="color" value={(base.borderColor as string) || '#e2e8f0'} onChange={(e) => updateBase('borderColor', e.target.value)} className="h-7 w-10 rounded border cursor-pointer" />
              <Input value={(base.borderColor as string) || ''} onChange={(e) => updateBase('borderColor', e.target.value)} placeholder="#e2e8f0" className="h-7 text-xs flex-1" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Radius</Label>
            <Select value={getValue(base.borderRadius)} onValueChange={(v) => updateBase('borderRadius', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Effects */}
      <CollapsibleSection title="Effekte" hasChanges={hasEffectsChanges}>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Schatten</Label>
            <Select value={getValue(base.shadow)} onValueChange={(v) => updateBase('shadow', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="2xl">2XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Deckkraft</Label>
            <div className="flex items-center gap-2">
              <Slider value={[base.opacity !== undefined ? base.opacity : 100]} onValueChange={([v]) => updateBase('opacity', v === 100 ? undefined : v)} min={0} max={100} step={5} className="flex-1" />
              <span className="text-[10px] text-muted-foreground w-8 text-right">{base.opacity ?? 100}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Blur</Label>
            <Select value={getValue(base.backdropBlur)} onValueChange={(v) => updateBase('backdropBlur', v)}>
              <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">None</SelectItem>
                <SelectItem value="sm">SM</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="lg">LG</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Asset Picker for Background */}
      {workspaceId && siteId && (
        <AssetPicker
          open={bgAssetPickerOpen}
          onOpenChange={setBgAssetPickerOpen}
          workspaceId={workspaceId}
          siteId={siteId}
          onSelect={handleBgAssetSelect}
        />
      )}
    </div>
  );
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
      <CollapsibleSection title="Schnellauswahl" defaultOpen>
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
        <CollapsibleSection title="Benutzerdefiniert">
          <div className="space-y-4">
            {/* Animation Type */}
            <div className="space-y-2">
              <Label className="text-xs">Animation</Label>
              <Select
                value={currentAnimation.type}
                onValueChange={(val) => handleChange('type', val as AnimationType)}
              >
                <SelectTrigger className="h-7 text-xs">
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
                <SelectTrigger className="h-7 text-xs">
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
                <SelectTrigger className="h-7 text-xs">
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

const ACTION_TYPES = [
  { value: 'navigate', label: 'Zu URL navigieren' },
  { value: 'navigatePage', label: 'Zu Seite navigieren' },
  { value: 'scrollTo', label: 'Zum Element scrollen' },
  { value: 'openModal', label: 'Modal öffnen' },
  { value: 'closeModal', label: 'Modal schließen' },
  { value: 'setState', label: 'Status setzen' },
  { value: 'toggleState', label: 'Status umschalten' },
] as const;

type ActionType = typeof ACTION_TYPES[number]['value'];

const EVENT_TYPES = [
  { value: 'click', label: 'Klick' },
  { value: 'mouseenter', label: 'Maus rein' },
  { value: 'mouseleave', label: 'Maus raus' },
  { value: 'focus', label: 'Fokus' },
  { value: 'blur', label: 'Fokus verloren' },
] as const;

type EventType = typeof EVENT_TYPES[number]['value'];

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
        Definiere, was passiert, wenn Benutzer mit dieser Komponente interagieren.
      </div>

      {actions.map((actionBinding, index) => (
        <div key={index} className="p-3 border rounded-lg space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Aktion {index + 1}</span>
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
            <Label className="text-xs">Auslösendes Ereignis</Label>
            <Select
              value={actionBinding.event}
              onValueChange={(v) => updateEvent(index, v as EventType)}
            >
              <SelectTrigger className="h-7 text-xs">
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
            <Label className="text-xs">Aktionstyp</Label>
            <Select
              value={actionBinding.action.type}
              onValueChange={(v) => updateActionType(index, v as ActionType)}
            >
              <SelectTrigger className="h-7 text-xs">
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
                <Label className="text-xs">In neuem Tab öffnen</Label>
              </div>
            </div>
          )}

          {actionBinding.action.type === 'navigatePage' && (
            <div className="space-y-1">
              <Label className="text-xs">Seiten-Slug</Label>
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
              <Label className="text-xs">Element-ID</Label>
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
              <Label className="text-xs">Modal-ID</Label>
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
                <Label className="text-xs">Status-Schlüssel</Label>
                <Input
                  value={'key' in actionBinding.action ? actionBinding.action.key : ''}
                  onChange={(e) => updateActionField(index, 'key', e.target.value)}
                  placeholder="myVariable"
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Wert</Label>
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
              <Label className="text-xs">Status-Schlüssel</Label>
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
        Aktion hinzufügen
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
  hasChanges = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasChanges?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger 
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-[11px] font-medium rounded transition-colors',
          hasChanges 
            ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30' 
            : 'bg-[hsl(220,10%,18%)] hover:bg-[hsl(220,10%,22%)] text-muted-foreground border border-transparent'
        )}
      >
        <span>{title}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
}
