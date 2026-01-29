import { useState } from 'react';
import { useEditorStore } from '../store/editor-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Label,
  Textarea,
  Switch,
  Button,
  Separator,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Badge,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@builderly/ui';
import {
  Palette,
  Type,
  Globe,
  Code,
  BarChart,
  Share2,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Layout,
  Footprints,
  PanelLeftClose,
  Image,
  Sparkles,
  MousePointer2,
  Zap,
  Cookie,
  Gauge,
  Accessibility,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Video,
  Waves,
  Circle,
  Square,
  Triangle,
  Loader2,
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  Shield,
  PlayCircle,
} from 'lucide-react';
import type { SiteSettings } from '@builderly/core';

export function SiteSettingsPanel() {
  const {
    isSiteSettingsOpen,
    toggleSiteSettings,
    siteName,
    siteSettings,
    updateSiteSettings,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState('theme');

  return (
    <Sheet open={isSiteSettingsOpen} onOpenChange={toggleSiteSettings}>
      <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0">
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Website-Einstellungen
            <Badge variant="secondary" className="ml-2 text-xs">PRO</Badge>
          </SheetTitle>
          <SheetDescription>
            Globale Einstellungen für "{siteName}"
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            {/* Main Tab Navigation */}
            <div className="sticky top-0 bg-background z-10 pb-4">
              <TabsList className="grid w-full grid-cols-5 h-auto gap-1">
                <TabsTrigger value="theme" className="flex flex-col py-2 text-xs gap-1">
                  <Palette className="h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex flex-col py-2 text-xs gap-1">
                  <Layout className="h-4 w-4" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="effects" className="flex flex-col py-2 text-xs gap-1">
                  <Sparkles className="h-4 w-4" />
                  Effekte
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex flex-col py-2 text-xs gap-1">
                  <Globe className="h-4 w-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex flex-col py-2 text-xs gap-1">
                  <Code className="h-4 w-4" />
                  Erweitert
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ================================================================
                THEME TAB
            ================================================================ */}
            <TabsContent value="theme" className="space-y-6 mt-0">
              <ThemeSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* ================================================================
                LAYOUT TAB (Header, Footer, Sidebar)
            ================================================================ */}
            <TabsContent value="layout" className="space-y-6 mt-0">
              <LayoutSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* ================================================================
                EFFECTS TAB (Background, Animations, Cursor)
            ================================================================ */}
            <TabsContent value="effects" className="space-y-6 mt-0">
              <EffectsSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* ================================================================
                SEO TAB
            ================================================================ */}
            <TabsContent value="seo" className="space-y-6 mt-0">
              <SeoSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* ================================================================
                ADVANCED TAB (Code, Analytics, Cookie, Performance, A11y)
            ================================================================ */}
            <TabsContent value="advanced" className="space-y-6 mt-0">
              <AdvancedSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// SETTINGS PROPS INTERFACE
// ============================================================================

interface SettingsProps {
  settings: SiteSettings;
  onUpdate: (settings: Partial<SiteSettings>) => void;
}

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

function CollapsibleSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  badge,
}: { 
  title: string; 
  icon?: React.ComponentType<{ className?: string }>; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors rounded-t-lg">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <span className="font-medium text-sm">{title}</span>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 border-t">
        <div className="pt-4 space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================================================
// THEME SETTINGS
// ============================================================================

function ThemeSettings({ settings, onUpdate }: SettingsProps) {
  const { colors, typography, spacing } = settings.theme;

  const updateColors = (key: string, value: string) => {
    onUpdate({
      theme: {
        ...settings.theme,
        colors: { ...colors, [key]: value },
      },
    });
  };

  const updateTypography = (key: string, value: string | number | string[]) => {
    onUpdate({
      theme: {
        ...settings.theme,
        typography: { ...typography, [key]: value },
      },
    });
  };

  const updateSpacing = (key: string, value: string | number) => {
    onUpdate({
      theme: {
        ...settings.theme,
        spacing: { ...spacing, [key]: value },
      },
    });
  };

  return (
    <>
      {/* Colors Section */}
      <CollapsibleSection title="Farben" icon={Palette}>
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground mb-2">
            Definiere das Farbschema deiner Website
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Primär"
              value={colors.primary}
              onChange={(v) => updateColors('primary', v)}
            />
            <ColorInput
              label="Sekundär"
              value={colors.secondary}
              onChange={(v) => updateColors('secondary', v)}
            />
            <ColorInput
              label="Akzent"
              value={colors.accent}
              onChange={(v) => updateColors('accent', v)}
            />
            <ColorInput
              label="Hintergrund"
              value={colors.background}
              onChange={(v) => updateColors('background', v)}
            />
            <ColorInput
              label="Text"
              value={colors.foreground}
              onChange={(v) => updateColors('foreground', v)}
            />
            <ColorInput
              label="Rahmen"
              value={colors.border}
              onChange={(v) => updateColors('border', v)}
            />
          </div>

          <Separator />

          <div className="text-xs font-medium mb-2">Status-Farben</div>
          <div className="grid grid-cols-3 gap-3">
            <ColorInput
              label="Erfolg"
              value={colors.success}
              onChange={(v) => updateColors('success', v)}
            />
            <ColorInput
              label="Warnung"
              value={colors.warning}
              onChange={(v) => updateColors('warning', v)}
            />
            <ColorInput
              label="Fehler"
              value={colors.destructive}
              onChange={(v) => updateColors('destructive', v)}
            />
          </div>

          <Separator />

          <div className="text-xs font-medium mb-2">UI-Farben</div>
          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Karte"
              value={colors.card}
              onChange={(v) => updateColors('card', v)}
            />
            <ColorInput
              label="Gedämpft"
              value={colors.muted}
              onChange={(v) => updateColors('muted', v)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Typography Section */}
      <CollapsibleSection title="Typografie" icon={Type}>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Schriftart</Label>
            <Input
              value={typography.fontFamily}
              onChange={(e) => updateTypography('fontFamily', e.target.value)}
              placeholder="Inter, system-ui, sans-serif"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Überschriften Schriftart</Label>
            <Input
              value={typography.headingFontFamily}
              onChange={(e) => updateTypography('headingFontFamily', e.target.value)}
              placeholder="Inter, system-ui, sans-serif"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Basis-Schriftgröße (px)</Label>
              <Input
                type="number"
                min={12}
                max={24}
                value={typography.baseFontSize}
                onChange={(e) => updateTypography('baseFontSize', parseInt(e.target.value) || 16)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Zeilenhöhe</Label>
              <Input
                type="number"
                min={1}
                max={3}
                step={0.1}
                value={typography.baseLineHeight}
                onChange={(e) => updateTypography('baseLineHeight', parseFloat(e.target.value) || 1.6)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Google Fonts (kommagetrennt)</Label>
            <Input
              value={typography.googleFonts?.join(', ') || ''}
              onChange={(e) => updateTypography('googleFonts', e.target.value.split(',').map((f: string) => f.trim()).filter(Boolean))}
              placeholder="Inter, Roboto, Open Sans"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Werden automatisch von Google Fonts geladen
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Spacing Section */}
      <CollapsibleSection title="Abstände & Ränder" icon={Square} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Container Breite</Label>
            <Input
              value={spacing.containerMaxWidth}
              onChange={(e) => updateSpacing('containerMaxWidth', e.target.value)}
              placeholder="1280px"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Container Padding</Label>
            <Input
              value={spacing.containerPadding}
              onChange={(e) => updateSpacing('containerPadding', e.target.value)}
              placeholder="1rem"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Eckenradius</Label>
            <Input
              value={spacing.borderRadius}
              onChange={(e) => updateSpacing('borderRadius', e.target.value)}
              placeholder="0.5rem"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Basis-Einheit (px)</Label>
            <Input
              type="number"
              min={2}
              max={16}
              value={spacing.baseUnit}
              onChange={(e) => updateSpacing('baseUnit', parseInt(e.target.value) || 4)}
              className="mt-1"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* General Settings */}
      <CollapsibleSection title="Allgemein" icon={Settings}>
        <GeneralSettings settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>
    </>
  );
}

// ============================================================================
// LAYOUT SETTINGS (Header, Footer, Sidebar)
// ============================================================================

function LayoutSettings({ settings, onUpdate }: SettingsProps) {
  return (
    <>
      {/* Header Settings */}
      <CollapsibleSection title="Header" icon={Menu} badge="NEU">
        <HeaderSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      {/* Footer Settings */}
      <CollapsibleSection title="Footer" icon={Footprints} badge="NEU">
        <FooterSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      {/* Sidebar Settings */}
      <CollapsibleSection title="Sidebars" icon={PanelLeftClose} defaultOpen={false}>
        <SidebarSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>
    </>
  );
}

function HeaderSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const header = settings.header;

  const updateHeader = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, [key]: value },
    });
  };

  const updateHeaderStyle = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, style: { ...header.style, [key]: value } },
    });
  };

  const updateHeaderLogo = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, logo: { ...header.logo, [key]: value } },
    });
  };

  const updateHeaderNavigation = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, navigation: { ...header.navigation, [key]: value } },
    });
  };

  const updateHeaderCta = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, cta: { ...header.cta, [key]: value } },
    });
  };

  const updateHeaderTopbar = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, topbar: { ...header.topbar, [key]: value } },
    });
  };

  const updateHeaderMobile = (key: string, value: unknown) => {
    onUpdate({
      header: { ...header, mobile: { ...header.mobile, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      {/* Enable Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label>Header aktivieren</Label>
          <p className="text-xs text-muted-foreground">Zeige Header auf allen Seiten</p>
        </div>
        <Switch
          checked={header.enabled}
          onCheckedChange={(checked) => updateHeader('enabled', checked)}
        />
      </div>

      {header.enabled && (
        <>
          <Separator />

          {/* Header Type */}
          <div>
            <Label className="text-xs">Header-Typ</Label>
            <Select value={header.type} onValueChange={(v) => updateHeader('type', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Klassisch</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="centered">Zentriert</SelectItem>
                <SelectItem value="mega">Mega-Header</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Position</Label>
              <Select value={header.position} onValueChange={(v) => updateHeader('position', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Statisch</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                  <SelectItem value="fixed">Fixiert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Höhe</Label>
              <Input
                value={header.height}
                onChange={(e) => updateHeader('height', e.target.value)}
                placeholder="80px"
                className="mt-1"
              />
            </div>
          </div>

          {/* Header Style */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium">Styling</div>
            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Hintergrund"
                value={header.style.backgroundColor}
                onChange={(v) => updateHeaderStyle('backgroundColor', v)}
              />
              <ColorInput
                label="Text"
                value={header.style.textColor}
                onChange={(v) => updateHeaderStyle('textColor', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Hintergrund-Blur</Label>
              <Switch
                checked={header.style.backdropBlur}
                onCheckedChange={(checked) => updateHeaderStyle('backdropBlur', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Beim Scrollen schrumpfen</Label>
              <Switch
                checked={header.shrinkOnScroll}
                onCheckedChange={(checked) => updateHeader('shrinkOnScroll', checked)}
              />
            </div>
          </div>

          {/* Logo Settings */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium">Logo</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Position</Label>
                <Select value={header.logo.position} onValueChange={(v) => updateHeaderLogo('position', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Links</SelectItem>
                    <SelectItem value="center">Zentriert</SelectItem>
                    <SelectItem value="right">Rechts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Max. Höhe</Label>
                <Input
                  value={header.logo.maxHeight}
                  onChange={(e) => updateHeaderLogo('maxHeight', e.target.value)}
                  placeholder="50px"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Logo-Text (wenn kein Bild)</Label>
              <Input
                value={header.logo.text}
                onChange={(e) => updateHeaderLogo('text', e.target.value)}
                placeholder="Firmenname"
                className="mt-1"
              />
            </div>
          </div>

          {/* Navigation Settings */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium">Navigation</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Position</Label>
                <Select value={header.navigation.position} onValueChange={(v) => updateHeaderNavigation('position', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Links</SelectItem>
                    <SelectItem value="center">Zentriert</SelectItem>
                    <SelectItem value="right">Rechts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Stil</Label>
                <Select value={header.navigation.style} onValueChange={(v) => updateHeaderNavigation('style', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="underline">Unterstrichen</SelectItem>
                    <SelectItem value="pills">Pills</SelectItem>
                    <SelectItem value="bordered">Mit Rahmen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Call-to-Action Button</div>
              <Switch
                checked={header.cta.enabled}
                onCheckedChange={(checked) => updateHeaderCta('enabled', checked)}
              />
            </div>
            {header.cta.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Text</Label>
                  <Input
                    value={header.cta.text}
                    onChange={(e) => updateHeaderCta('text', e.target.value)}
                    placeholder="Kontakt"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={header.cta.url}
                    onChange={(e) => updateHeaderCta('url', e.target.value)}
                    placeholder="#kontakt"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Topbar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Topbar (über Header)</div>
              <Switch
                checked={header.topbar.enabled}
                onCheckedChange={(checked) => updateHeaderTopbar('enabled', checked)}
              />
            </div>
            {header.topbar.enabled && (
              <>
                <div>
                  <Label className="text-xs">Text</Label>
                  <Input
                    value={header.topbar.text}
                    onChange={(e) => updateHeaderTopbar('text', e.target.value)}
                    placeholder="🎉 Sonderangebot: 20% Rabatt!"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ColorInput
                    label="Hintergrund"
                    value={header.topbar.backgroundColor}
                    onChange={(v) => updateHeaderTopbar('backgroundColor', v)}
                  />
                  <ColorInput
                    label="Text"
                    value={header.topbar.textColor}
                    onChange={(v) => updateHeaderTopbar('textColor', v)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium">Mobile Menü</div>
            <div>
              <Label className="text-xs">Stil</Label>
              <Select value={header.mobile.style} onValueChange={(v) => updateHeaderMobile('style', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slide-left">Slide von links</SelectItem>
                  <SelectItem value="slide-right">Slide von rechts</SelectItem>
                  <SelectItem value="slide-down">Slide von oben</SelectItem>
                  <SelectItem value="fullscreen">Vollbild</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FooterSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const footer = settings.footer;

  const updateFooter = (key: string, value: unknown) => {
    onUpdate({
      footer: { ...footer, [key]: value },
    });
  };

  const updateFooterStyle = (key: string, value: unknown) => {
    onUpdate({
      footer: { ...footer, style: { ...footer.style, [key]: value } },
    });
  };

  const updateFooterSections = (key: string, value: unknown) => {
    onUpdate({
      footer: { ...footer, sections: { ...footer.sections, [key]: value } },
    });
  };

  const updateFooterBottomBar = (key: string, value: unknown) => {
    onUpdate({
      footer: { ...footer, bottomBar: { ...footer.bottomBar, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      {/* Enable Footer */}
      <div className="flex items-center justify-between">
        <div>
          <Label>Footer aktivieren</Label>
          <p className="text-xs text-muted-foreground">Zeige Footer auf allen Seiten</p>
        </div>
        <Switch
          checked={footer.enabled}
          onCheckedChange={(checked) => updateFooter('enabled', checked)}
        />
      </div>

      {footer.enabled && (
        <>
          <Separator />

          {/* Footer Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Footer-Typ</Label>
              <Select value={footer.type} onValueChange={(v) => updateFooter('type', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Einfach</SelectItem>
                  <SelectItem value="multi-column">Mehrspalt</SelectItem>
                  <SelectItem value="mega">Mega-Footer</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="centered">Zentriert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Spalten</Label>
              <Select value={String(footer.columns)} onValueChange={(v) => updateFooter('columns', parseInt(v))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} Spalte{n > 1 ? 'n' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Styling */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium">Styling</div>
            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Hintergrund"
                value={footer.style.backgroundColor}
                onChange={(v) => updateFooterStyle('backgroundColor', v)}
              />
              <ColorInput
                label="Text"
                value={footer.style.textColor}
                onChange={(v) => updateFooterStyle('textColor', v)}
              />
              <ColorInput
                label="Links"
                value={footer.style.linkColor}
                onChange={(v) => updateFooterStyle('linkColor', v)}
              />
              <ColorInput
                label="Link Hover"
                value={footer.style.linkHoverColor}
                onChange={(v) => updateFooterStyle('linkHoverColor', v)}
              />
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Newsletter-Formular
              </div>
              <Switch
                checked={footer.sections.newsletter.enabled}
                onCheckedChange={(checked) => updateFooterSections('newsletter', { ...footer.sections.newsletter, enabled: checked })}
              />
            </div>
            {footer.sections.newsletter.enabled && (
              <div className="space-y-2">
                <Input
                  value={footer.sections.newsletter.title}
                  onChange={(e) => updateFooterSections('newsletter', { ...footer.sections.newsletter, title: e.target.value })}
                  placeholder="Newsletter"
                />
                <Input
                  value={footer.sections.newsletter.text}
                  onChange={(e) => updateFooterSections('newsletter', { ...footer.sections.newsletter, text: e.target.value })}
                  placeholder="Beschreibung..."
                />
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Bottom Bar</div>
              <Switch
                checked={footer.bottomBar.enabled}
                onCheckedChange={(checked) => updateFooterBottomBar('enabled', checked)}
              />
            </div>
            {footer.bottomBar.enabled && (
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Copyright Text</Label>
                  <Input
                    value={footer.bottomBar.copyrightText}
                    onChange={(e) => updateFooterBottomBar('copyrightText', e.target.value)}
                    placeholder="© {year} Firmenname"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Verwende {'{year}'} für das aktuelle Jahr
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Back-to-Top Button</Label>
                  <Switch
                    checked={footer.bottomBar.showBackToTop}
                    onCheckedChange={(checked) => updateFooterBottomBar('showBackToTop', checked)}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SidebarSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const sidebar = settings.sidebar;

  const updateLeftSidebar = (key: string, value: unknown) => {
    onUpdate({
      sidebar: { ...sidebar, leftSidebar: { ...sidebar.leftSidebar, [key]: value } },
    });
  };

  const updateRightSidebar = (key: string, value: unknown) => {
    onUpdate({
      sidebar: { ...sidebar, rightSidebar: { ...sidebar.rightSidebar, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      {/* Left Sidebar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium">Linke Sidebar</div>
          <Switch
            checked={sidebar.leftSidebar.enabled}
            onCheckedChange={(checked) => updateLeftSidebar('enabled', checked)}
          />
        </div>
        {sidebar.leftSidebar.enabled && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Breite</Label>
              <Input
                value={sidebar.leftSidebar.width}
                onChange={(e) => updateLeftSidebar('width', e.target.value)}
                placeholder="280px"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Position</Label>
              <Select value={sidebar.leftSidebar.position} onValueChange={(v) => updateLeftSidebar('position', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixiert</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                  <SelectItem value="static">Statisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Right Sidebar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium">Rechte Sidebar</div>
          <Switch
            checked={sidebar.rightSidebar.enabled}
            onCheckedChange={(checked) => updateRightSidebar('enabled', checked)}
          />
        </div>
        {sidebar.rightSidebar.enabled && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Breite</Label>
              <Input
                value={sidebar.rightSidebar.width}
                onChange={(e) => updateRightSidebar('width', e.target.value)}
                placeholder="320px"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Position</Label>
              <Select value={sidebar.rightSidebar.position} onValueChange={(v) => updateRightSidebar('position', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixiert</SelectItem>
                  <SelectItem value="sticky">Sticky</SelectItem>
                  <SelectItem value="static">Statisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EFFECTS SETTINGS (Background, Animations)
// ============================================================================

function EffectsSettings({ settings, onUpdate }: SettingsProps) {
  return (
    <>
      {/* Page Background */}
      <CollapsibleSection title="Seiten-Hintergrund" icon={Image} badge="NEU">
        <BackgroundSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      {/* Animations */}
      <CollapsibleSection title="Animationen" icon={Zap} badge="NEU">
        <AnimationSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      {/* Scroll Effects */}
      <CollapsibleSection title="Scroll-Effekte" icon={MousePointer2} defaultOpen={false}>
        <ScrollEffectsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      {/* Cursor Effects */}
      <CollapsibleSection title="Cursor-Effekte" icon={MousePointer2} defaultOpen={false}>
        <CursorEffectsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>
    </>
  );
}

function BackgroundSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const bg = settings.backgroundEffects.pageBackground;

  const updateBackground = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        pageBackground: { ...bg, [key]: value },
      },
    });
  };

  const updateGradient = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        pageBackground: { ...bg, gradient: { ...bg.gradient, [key]: value } },
      },
    });
  };

  const updateImage = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        pageBackground: { ...bg, image: { ...bg.image, [key]: value } },
      },
    });
  };

  const updatePattern = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        pageBackground: { ...bg, pattern: { ...bg.pattern, [key]: value } },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Hintergrund-Typ</Label>
        <Select value={bg.type} onValueChange={(v) => updateBackground('type', v)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Farbe</SelectItem>
            <SelectItem value="gradient">Farbverlauf</SelectItem>
            <SelectItem value="image">Bild</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pattern">Muster</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bg.type === 'color' && (
        <ColorInput
          label="Hintergrundfarbe"
          value={bg.color}
          onChange={(v) => updateBackground('color', v)}
        />
      )}

      {bg.type === 'gradient' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Typ</Label>
              <Select value={bg.gradient.type} onValueChange={(v) => updateGradient('type', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                  <SelectItem value="conic">Konisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Winkel (°)</Label>
              <Input
                type="number"
                min={0}
                max={360}
                value={bg.gradient.angle}
                onChange={(e) => updateGradient('angle', parseInt(e.target.value) || 180)}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Gradient Colors Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Verlaufs-Farben</Label>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-xs"
                onClick={() => {
                  const colors = [...(bg.gradient.colors || [])];
                  colors.push({ color: '#888888', position: 50 });
                  updateGradient('colors', colors);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                Farbe
              </Button>
            </div>
            
            {/* Gradient Preview */}
            <div 
              className="h-8 rounded border"
              style={{
                background: bg.gradient.type === 'linear'
                  ? `linear-gradient(${bg.gradient.angle}deg, ${(bg.gradient.colors || []).map(c => `${c.color} ${c.position}%`).join(', ')})`
                  : bg.gradient.type === 'radial'
                  ? `radial-gradient(circle, ${(bg.gradient.colors || []).map(c => `${c.color} ${c.position}%`).join(', ')})`
                  : `conic-gradient(from ${bg.gradient.angle}deg, ${(bg.gradient.colors || []).map(c => `${c.color} ${c.position}%`).join(', ')})`
              }}
            />
            
            {/* Color Stops */}
            <div className="space-y-2">
              {(bg.gradient.colors || []).map((colorStop, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <input
                    type="color"
                    value={colorStop.color}
                    onChange={(e) => {
                      const colors = [...(bg.gradient.colors || [])];
                      colors[index] = { ...colorStop, color: e.target.value };
                      updateGradient('colors', colors);
                    }}
                    className="h-6 w-6 rounded border cursor-pointer flex-shrink-0"
                  />
                  <Input
                    value={colorStop.color}
                    onChange={(e) => {
                      const colors = [...(bg.gradient.colors || [])];
                      colors[index] = { ...colorStop, color: e.target.value };
                      updateGradient('colors', colors);
                    }}
                    className="flex-1 font-mono text-xs h-7"
                    placeholder="#000000"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={colorStop.position}
                    onChange={(e) => {
                      const colors = [...(bg.gradient.colors || [])];
                      colors[index] = { ...colorStop, position: parseInt(e.target.value) || 0 };
                      updateGradient('colors', colors);
                    }}
                    className="w-16 text-xs h-7"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {(bg.gradient.colors || []).length > 2 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => {
                        const colors = [...(bg.gradient.colors || [])].filter((_, i) => i !== index);
                        updateGradient('colors', colors);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {bg.type === 'image' && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Bild URL</Label>
            <Input
              value={bg.image.url}
              onChange={(e) => updateImage('url', e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Größe</Label>
              <Select value={bg.image.size} onValueChange={(v) => updateImage('size', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="repeat">Wiederholen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Fixiert</Label>
              <Select value={bg.image.attachment} onValueChange={(v) => updateImage('attachment', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scroll">Scrollt mit</SelectItem>
                  <SelectItem value="fixed">Fixiert (Parallax)</SelectItem>
                  <SelectItem value="local">Lokal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Overlay</Label>
            <Switch
              checked={bg.image.overlay.enabled}
              onCheckedChange={(checked) => updateImage('overlay', { ...bg.image.overlay, enabled: checked })}
            />
          </div>
          {bg.image.overlay.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <ColorInput
                label="Overlay Farbe"
                value={bg.image.overlay.color}
                onChange={(v) => updateImage('overlay', { ...bg.image.overlay, color: v })}
              />
              <div>
                <Label className="text-xs">Deckkraft (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={bg.image.overlay.opacity}
                  onChange={(e) => updateImage('overlay', { ...bg.image.overlay, opacity: parseInt(e.target.value) || 50 })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {bg.type === 'pattern' && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Muster-Typ</Label>
            <Select value={bg.pattern.type} onValueChange={(v) => updatePattern('type', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dots">Punkte</SelectItem>
                <SelectItem value="grid">Raster</SelectItem>
                <SelectItem value="lines">Linien</SelectItem>
                <SelectItem value="waves">Wellen</SelectItem>
                <SelectItem value="noise">Rauschen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Farbe"
              value={bg.pattern.color}
              onChange={(v) => updatePattern('color', v)}
            />
            <div>
              <Label className="text-xs">Deckkraft (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={bg.pattern.opacity}
                onChange={(e) => updatePattern('opacity', parseInt(e.target.value) || 30)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnimationSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const anim = settings.animations;

  const updateAnimations = (key: string, value: unknown) => {
    onUpdate({
      animations: { ...anim, [key]: value },
    });
  };

  const updateScrollAnimations = (key: string, value: unknown) => {
    onUpdate({
      animations: { ...anim, scrollAnimations: { ...anim.scrollAnimations, [key]: value } },
    });
  };

  const updateHoverEffects = (key: string, value: unknown) => {
    onUpdate({
      animations: { ...anim, hoverEffects: { ...anim.hoverEffects, [key]: value } },
    });
  };

  const updateLoading = (key: string, value: unknown) => {
    onUpdate({
      animations: { ...anim, loading: { ...anim.loading, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      {/* Global Enable */}
      <div className="flex items-center justify-between">
        <div>
          <Label>Animationen aktivieren</Label>
          <p className="text-xs text-muted-foreground">Globaler Schalter für alle Animationen</p>
        </div>
        <Switch
          checked={anim.enabled}
          onCheckedChange={(checked) => updateAnimations('enabled', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Reduzierte Bewegung respektieren</Label>
          <p className="text-xs text-muted-foreground">Für Barrierefreiheit</p>
        </div>
        <Switch
          checked={anim.reducedMotion}
          onCheckedChange={(checked) => updateAnimations('reducedMotion', checked)}
        />
      </div>

      {anim.enabled && (
        <>
          <Separator />

          {/* Scroll Animations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Scroll-Animationen (On-Scroll Reveal)</div>
              <Switch
                checked={anim.scrollAnimations.enabled}
                onCheckedChange={(checked) => updateScrollAnimations('enabled', checked)}
              />
            </div>
            {anim.scrollAnimations.enabled && (
              <>
                <div>
                  <Label className="text-xs">Standard-Animation</Label>
                  <Select value={anim.scrollAnimations.defaultAnimation} onValueChange={(v) => updateScrollAnimations('defaultAnimation', v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade-up">Fade Up</SelectItem>
                      <SelectItem value="fade-down">Fade Down</SelectItem>
                      <SelectItem value="fade-left">Fade Left</SelectItem>
                      <SelectItem value="fade-right">Fade Right</SelectItem>
                      <SelectItem value="zoom-in">Zoom In</SelectItem>
                      <SelectItem value="zoom-out">Zoom Out</SelectItem>
                      <SelectItem value="flip">Flip</SelectItem>
                      <SelectItem value="none">Keine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Dauer (ms)</Label>
                    <Input
                      type="number"
                      min={100}
                      max={2000}
                      step={100}
                      value={anim.scrollAnimations.duration}
                      onChange={(e) => updateScrollAnimations('duration', parseInt(e.target.value) || 600)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Stagger (ms)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={500}
                      step={50}
                      value={anim.scrollAnimations.stagger}
                      onChange={(e) => updateScrollAnimations('stagger', parseInt(e.target.value) || 100)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Nur einmal animieren</Label>
                  <Switch
                    checked={anim.scrollAnimations.once}
                    onCheckedChange={(checked) => updateScrollAnimations('once', checked)}
                  />
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Hover Effects */}
          <div className="space-y-3">
            <div className="text-xs font-medium">Hover-Effekte (Standard)</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Buttons</Label>
                <Select value={anim.hoverEffects.buttons} onValueChange={(v) => updateHoverEffects('buttons', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
                    <SelectItem value="lift">Anheben</SelectItem>
                    <SelectItem value="glow">Leuchten</SelectItem>
                    <SelectItem value="pulse">Pulsieren</SelectItem>
                    <SelectItem value="scale">Vergrößern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Karten</Label>
                <Select value={anim.hoverEffects.cards} onValueChange={(v) => updateHoverEffects('cards', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
                    <SelectItem value="lift">Anheben</SelectItem>
                    <SelectItem value="glow">Leuchten</SelectItem>
                    <SelectItem value="border">Rahmen</SelectItem>
                    <SelectItem value="scale">Vergrößern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Bilder</Label>
                <Select value={anim.hoverEffects.images} onValueChange={(v) => updateHoverEffects('images', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="brighten">Aufhellen</SelectItem>
                    <SelectItem value="blur">Unschärfe</SelectItem>
                    <SelectItem value="grayscale">Graustufen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Links</Label>
                <Select value={anim.hoverEffects.links} onValueChange={(v) => updateHoverEffects('links', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
                    <SelectItem value="underline">Unterstreichen</SelectItem>
                    <SelectItem value="highlight">Hervorheben</SelectItem>
                    <SelectItem value="color">Farbwechsel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loading */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium">Seiten-Ladeanimation</div>
              <Switch
                checked={anim.loading.pageLoader.enabled}
                onCheckedChange={(checked) => updateLoading('pageLoader', { ...anim.loading.pageLoader, enabled: checked })}
              />
            </div>
            {anim.loading.pageLoader.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Typ</Label>
                  <Select value={anim.loading.pageLoader.type} onValueChange={(v) => updateLoading('pageLoader', { ...anim.loading.pageLoader, type: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spinner">Spinner</SelectItem>
                      <SelectItem value="bar">Ladebalken</SelectItem>
                      <SelectItem value="dots">Punkte</SelectItem>
                      <SelectItem value="pulse">Pulsieren</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ColorInput
                  label="Farbe"
                  value={anim.loading.pageLoader.color}
                  onChange={(v) => updateLoading('pageLoader', { ...anim.loading.pageLoader, color: v })}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ScrollEffectsComponent({ settings, onUpdate }: SettingsProps) {
  const scroll = settings.backgroundEffects.scroll;

  const updateScroll = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        scroll: { ...scroll, [key]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Smooth Scrolling</Label>
          <p className="text-xs text-muted-foreground">Sanftes Scrollen aktivieren</p>
        </div>
        <Switch
          checked={scroll.smoothScroll}
          onCheckedChange={(checked) => updateScroll('smoothScroll', checked)}
        />
      </div>

      <div>
        <Label className="text-xs">Scrollbar-Stil</Label>
        <Select value={scroll.scrollbarStyle} onValueChange={(v) => updateScroll('scrollbarStyle', v)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Standard</SelectItem>
            <SelectItem value="thin">Dünn</SelectItem>
            <SelectItem value="hidden">Versteckt</SelectItem>
            <SelectItem value="custom">Benutzerdefiniert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {scroll.scrollbarStyle === 'custom' && (
        <ColorInput
          label="Scrollbar-Farbe"
          value={scroll.scrollbarColor}
          onChange={(v) => updateScroll('scrollbarColor', v)}
        />
      )}

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label>Scroll-Fortschrittsanzeige</Label>
          <p className="text-xs text-muted-foreground">Zeigt Lesefortschritt oben an</p>
        </div>
        <Switch
          checked={scroll.scrollIndicator.enabled}
          onCheckedChange={(checked) => updateScroll('scrollIndicator', { ...scroll.scrollIndicator, enabled: checked })}
        />
      </div>
      {scroll.scrollIndicator.enabled && (
        <ColorInput
          label="Farbe"
          value={scroll.scrollIndicator.color}
          onChange={(v) => updateScroll('scrollIndicator', { ...scroll.scrollIndicator, color: v })}
        />
      )}
    </div>
  );
}

function CursorEffectsComponent({ settings, onUpdate }: SettingsProps) {
  const cursor = settings.backgroundEffects.cursor;

  const updateCursor = (key: string, value: unknown) => {
    onUpdate({
      backgroundEffects: {
        ...settings.backgroundEffects,
        cursor: { ...cursor, [key]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Benutzerdefinierter Cursor</Label>
          <p className="text-xs text-muted-foreground">Individueller Mauszeiger</p>
        </div>
        <Switch
          checked={cursor.custom}
          onCheckedChange={(checked) => updateCursor('custom', checked)}
        />
      </div>

      {cursor.custom && (
        <>
          <div>
            <Label className="text-xs">Cursor-Stil</Label>
            <Select value={cursor.style} onValueChange={(v) => updateCursor('style', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dot">Punkt</SelectItem>
                <SelectItem value="ring">Ring</SelectItem>
                <SelectItem value="glow">Leuchtend</SelectItem>
                <SelectItem value="trail">Mit Spur</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Farbe"
              value={cursor.color}
              onChange={(v) => updateCursor('color', v)}
            />
            <div>
              <Label className="text-xs">Größe (px)</Label>
              <Input
                type="number"
                min={10}
                max={100}
                value={cursor.size}
                onChange={(e) => updateCursor('size', parseInt(e.target.value) || 20)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Mix-Blend-Mode</Label>
            <Switch
              checked={cursor.mixBlendMode}
              onCheckedChange={(checked) => updateCursor('mixBlendMode', checked)}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// SEO SETTINGS
// ============================================================================

function SeoSettings({ settings, onUpdate }: SettingsProps) {
  const { seo } = settings;

  const updateSeo = (key: string, value: unknown) => {
    onUpdate({
      seo: { ...seo, [key]: value },
    });
  };

  return (
    <>
      <CollapsibleSection title="Meta-Tags" icon={Globe}>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Seitentitel</Label>
            <Input
              value={seo.title}
              onChange={(e) => updateSeo('title', e.target.value)}
              placeholder="Meine Website"
              maxLength={70}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seo.title?.length || 0}/70 Zeichen
            </p>
          </div>

          <div>
            <Label className="text-xs">Beschreibung</Label>
            <Textarea
              value={seo.description}
              onChange={(e) => updateSeo('description', e.target.value)}
              placeholder="Eine kurze Beschreibung Ihrer Website..."
              maxLength={160}
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seo.description?.length || 0}/160 Zeichen
            </p>
          </div>

          <div>
            <Label className="text-xs">Keywords (kommagetrennt)</Label>
            <Input
              value={seo.keywords?.join(', ') || ''}
              onChange={(e) => updateSeo('keywords', e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean))}
              placeholder="website, builder, design"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Sprache</Label>
            <Select value={seo.language} onValueChange={(v) => updateSeo('language', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Open Graph (Social Media)" icon={Share2} defaultOpen={false}>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">OG Bild URL</Label>
            <Input
              value={seo.ogImage || ''}
              onChange={(e) => updateSeo('ogImage', e.target.value)}
              placeholder="https://example.com/og-image.jpg"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Empfohlen: 1200x630 Pixel
            </p>
          </div>
          <div>
            <Label className="text-xs">OG Titel</Label>
            <Input
              value={seo.ogTitle || ''}
              onChange={(e) => updateSeo('ogTitle', e.target.value)}
              placeholder="Spezieller Social Media Titel"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">OG Beschreibung</Label>
            <Textarea
              value={seo.ogDescription || ''}
              onChange={(e) => updateSeo('ogDescription', e.target.value)}
              placeholder="Beschreibung für Social Media"
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Suchmaschinen" icon={Eye} defaultOpen={false}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Indexierung erlauben</Label>
              <p className="text-xs text-muted-foreground">
                Suchmaschinen können diese Seite indexieren
              </p>
            </div>
            <Switch
              checked={seo.robotsIndex}
              onCheckedChange={(checked) => updateSeo('robotsIndex', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Links folgen</Label>
              <p className="text-xs text-muted-foreground">
                Suchmaschinen folgen Links auf dieser Seite
              </p>
            </div>
            <Switch
              checked={seo.robotsFollow}
              onCheckedChange={(checked) => updateSeo('robotsFollow', checked)}
            />
          </div>

          <div>
            <Label className="text-xs">Kanonische URL</Label>
            <Input
              value={seo.canonicalUrl || ''}
              onChange={(e) => updateSeo('canonicalUrl', e.target.value)}
              placeholder="https://example.com/page"
              className="mt-1"
            />
          </div>
        </div>
      </CollapsibleSection>
    </>
  );
}

// ============================================================================
// ADVANCED SETTINGS (Code, Analytics, Cookie, Performance, A11y)
// ============================================================================

function AdvancedSettings({ settings, onUpdate }: SettingsProps) {
  return (
    <>
      <CollapsibleSection title="Analytics & Tracking" icon={BarChart}>
        <AnalyticsSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      <CollapsibleSection title="Benutzerdefinierter Code" icon={Code} defaultOpen={false}>
        <CustomCodeSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      <CollapsibleSection title="Cookie-Consent & GDPR" icon={Cookie} badge="NEU">
        <CookieConsentSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      <CollapsibleSection title="Performance" icon={Gauge} defaultOpen={false}>
        <PerformanceSettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      <CollapsibleSection title="Barrierefreiheit" icon={Accessibility} defaultOpen={false}>
        <AccessibilitySettingsComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>

      <CollapsibleSection title="Social Media Links" icon={Share2} defaultOpen={false}>
        <SocialLinksComponent settings={settings} onUpdate={onUpdate} />
      </CollapsibleSection>
    </>
  );
}

function AnalyticsSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const { analytics } = settings;

  const updateAnalytics = (key: string, value: string) => {
    onUpdate({
      analytics: { ...analytics, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Google Analytics ID</Label>
        <Input
          value={analytics.googleAnalyticsId || ''}
          onChange={(e) => updateAnalytics('googleAnalyticsId', e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs">Google Tag Manager ID</Label>
        <Input
          value={analytics.googleTagManagerId || ''}
          onChange={(e) => updateAnalytics('googleTagManagerId', e.target.value)}
          placeholder="GTM-XXXXXXX"
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs">Facebook Pixel ID</Label>
        <Input
          value={analytics.facebookPixelId || ''}
          onChange={(e) => updateAnalytics('facebookPixelId', e.target.value)}
          placeholder="XXXXXXXXXXXXXXX"
          className="mt-1"
        />
      </div>
    </div>
  );
}

function CustomCodeSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const { customCode } = settings;

  const updateCustomCode = (key: string, value: string) => {
    onUpdate({
      customCode: { ...customCode, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Custom CSS</Label>
        <Textarea
          value={customCode.customCss}
          onChange={(e) => updateCustomCode('customCss', e.target.value)}
          placeholder=".my-class { color: red; }"
          rows={4}
          className="mt-1 font-mono text-xs"
        />
      </div>

      <div>
        <Label className="text-xs">Head Code (vor &lt;/head&gt;)</Label>
        <Textarea
          value={customCode.headCode}
          onChange={(e) => updateCustomCode('headCode', e.target.value)}
          placeholder="<link rel=&quot;preconnect&quot; href=&quot;...&quot;>"
          rows={3}
          className="mt-1 font-mono text-xs"
        />
      </div>

      <div>
        <Label className="text-xs">Body Start (nach &lt;body&gt;)</Label>
        <Textarea
          value={customCode.bodyStartCode}
          onChange={(e) => updateCustomCode('bodyStartCode', e.target.value)}
          placeholder="<!-- Noscript tags, etc. -->"
          rows={3}
          className="mt-1 font-mono text-xs"
        />
      </div>

      <div>
        <Label className="text-xs">Body End (vor &lt;/body&gt;)</Label>
        <Textarea
          value={customCode.bodyEndCode}
          onChange={(e) => updateCustomCode('bodyEndCode', e.target.value)}
          placeholder="<script>...</script>"
          rows={3}
          className="mt-1 font-mono text-xs"
        />
      </div>
    </div>
  );
}

function CookieConsentSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const cookie = settings.cookieConsent;

  const updateCookie = (key: string, value: unknown) => {
    onUpdate({
      cookieConsent: { ...cookie, [key]: value },
    });
  };

  const updateBanner = (key: string, value: unknown) => {
    onUpdate({
      cookieConsent: { ...cookie, banner: { ...cookie.banner, [key]: value } },
    });
  };

  const updateLinks = (key: string, value: unknown) => {
    onUpdate({
      cookieConsent: { ...cookie, links: { ...cookie.links, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Cookie-Consent aktivieren</Label>
          <p className="text-xs text-muted-foreground">Zeige Cookie-Banner beim ersten Besuch</p>
        </div>
        <Switch
          checked={cookie.enabled}
          onCheckedChange={(checked) => updateCookie('enabled', checked)}
        />
      </div>

      {cookie.enabled && (
        <>
          <Separator />

          <div>
            <Label className="text-xs">Modus</Label>
            <Select value={cookie.mode} onValueChange={(v) => updateCookie('mode', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt-in">Opt-In (GDPR-konform)</SelectItem>
                <SelectItem value="opt-out">Opt-Out</SelectItem>
                <SelectItem value="notice-only">Nur Hinweis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Position</Label>
              <Select value={cookie.banner.position} onValueChange={(v) => updateBanner('position', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom">Unten</SelectItem>
                  <SelectItem value="top">Oben</SelectItem>
                  <SelectItem value="bottom-left">Unten Links</SelectItem>
                  <SelectItem value="bottom-right">Unten Rechts</SelectItem>
                  <SelectItem value="center">Mitte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Layout</Label>
              <Select value={cookie.banner.layout} onValueChange={(v) => updateBanner('layout', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Balken</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Titel</Label>
            <Input
              value={cookie.banner.title}
              onChange={(e) => updateBanner('title', e.target.value)}
              placeholder="Cookie-Einstellungen"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Nachricht</Label>
            <Textarea
              value={cookie.banner.message}
              onChange={(e) => updateBanner('message', e.target.value)}
              placeholder="Wir verwenden Cookies..."
              rows={2}
              className="mt-1"
            />
          </div>

          <Separator />

          <div className="text-xs font-medium">Rechtliche Links</div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-xs">Datenschutz URL</Label>
              <Input
                value={cookie.links.privacyPolicy}
                onChange={(e) => updateLinks('privacyPolicy', e.target.value)}
                placeholder="/datenschutz"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Impressum URL</Label>
              <Input
                value={cookie.links.impressum}
                onChange={(e) => updateLinks('impressum', e.target.value)}
                placeholder="/impressum"
                className="mt-1"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PerformanceSettingsComponent({ settings, onUpdate }: SettingsProps) {
  const perf = settings.performance;

  const updateImages = (key: string, value: unknown) => {
    onUpdate({
      performance: { ...perf, images: { ...perf.images, [key]: value } },
    });
  };

  const updatePreloading = (key: string, value: unknown) => {
    onUpdate({
      performance: { ...perf, preloading: { ...perf.preloading, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium">Bilder</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Lazy Loading</Label>
            <p className="text-xs text-muted-foreground">Bilder erst beim Scrollen laden</p>
          </div>
          <Switch
            checked={perf.images.lazyLoading}
            onCheckedChange={(checked) => updateImages('lazyLoading', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Fade-In Animation</Label>
            <p className="text-xs text-muted-foreground">Sanftes Einblenden beim Laden</p>
          </div>
          <Switch
            checked={perf.images.fadeInOnLoad}
            onCheckedChange={(checked) => updateImages('fadeInOnLoad', checked)}
          />
        </div>
        <div>
          <Label className="text-xs">Platzhalter</Label>
          <Select value={perf.images.placeholder} onValueChange={(v) => updateImages('placeholder', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blur">Unscharf</SelectItem>
              <SelectItem value="color">Farbe</SelectItem>
              <SelectItem value="skeleton">Skeleton</SelectItem>
              <SelectItem value="none">Keiner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="text-xs font-medium">Preloading</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label>Link-Prefetch</Label>
            <p className="text-xs text-muted-foreground">Hover-Links vorladen</p>
          </div>
          <Switch
            checked={perf.preloading.preloadLinks}
            onCheckedChange={(checked) => updatePreloading('preloadLinks', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Seiten-Prefetch</Label>
            <p className="text-xs text-muted-foreground">Nächste Seiten vorladen</p>
          </div>
          <Switch
            checked={perf.preloading.prefetchPages}
            onCheckedChange={(checked) => updatePreloading('prefetchPages', checked)}
          />
        </div>
      </div>
    </div>
  );
}

function AccessibilitySettingsComponent({ settings, onUpdate }: SettingsProps) {
  const a11y = settings.accessibility;

  const updateFocus = (key: string, value: unknown) => {
    onUpdate({
      accessibility: { ...a11y, focusStyles: { ...a11y.focusStyles, [key]: value } },
    });
  };

  const updateSkipLinks = (key: string, value: unknown) => {
    onUpdate({
      accessibility: { ...a11y, skipLinks: { ...a11y.skipLinks, [key]: value } },
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium">Focus-Stile</div>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Stil</Label>
          <Select value={a11y.focusStyles.style} onValueChange={(v) => updateFocus('style', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Standard</SelectItem>
              <SelectItem value="outline">Umriss</SelectItem>
              <SelectItem value="ring">Ring</SelectItem>
              <SelectItem value="underline">Unterstrichen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ColorInput
          label="Focus-Farbe"
          value={a11y.focusStyles.color}
          onChange={(v) => updateFocus('color', v)}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <Label>Skip-Links</Label>
          <p className="text-xs text-muted-foreground">Sprung-Links für Tastaturnutzer</p>
        </div>
        <Switch
          checked={a11y.skipLinks.enabled}
          onCheckedChange={(checked) => updateSkipLinks('enabled', checked)}
        />
      </div>
      {a11y.skipLinks.enabled && (
        <div>
          <Label className="text-xs">Text</Label>
          <Input
            value={a11y.skipLinks.text}
            onChange={(e) => updateSkipLinks('text', e.target.value)}
            placeholder="Zum Hauptinhalt springen"
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}

function SocialLinksComponent({ settings, onUpdate }: SettingsProps) {
  const { social } = settings;

  const updateSocial = (key: string, value: string) => {
    onUpdate({
      social: { ...social, [key]: value },
    });
  };

  return (
    <div className="space-y-3">
      {[
        { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
        { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/...' },
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
        { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/...' },
        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
        { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/...' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <Label className="text-xs">{label}</Label>
          <Input
            value={(social as Record<string, string>)[key] || ''}
            onChange={(e) => updateSocial(key, e.target.value)}
            placeholder={placeholder}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
}

function GeneralSettings({ settings, onUpdate }: SettingsProps) {
  const { general } = settings;

  const updateGeneral = (key: string, value: string) => {
    onUpdate({
      general: { ...general, [key]: value },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Logo URL</Label>
        <Input
          value={general.logo || ''}
          onChange={(e) => updateGeneral('logo', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs">Logo Alt-Text</Label>
        <Input
          value={general.logoAlt}
          onChange={(e) => updateGeneral('logoAlt', e.target.value)}
          placeholder="Firmenname Logo"
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs">Favicon URL</Label>
        <Input
          value={general.favicon || ''}
          onChange={(e) => updateGeneral('favicon', e.target.value)}
          placeholder="https://example.com/favicon.ico"
          className="mt-1"
        />
      </div>

      <Separator />

      <div className="text-xs font-medium flex items-center gap-2">
        <Phone className="h-3 w-3" />
        Kontakt
      </div>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">E-Mail</Label>
          <Input
            type="email"
            value={general.email || ''}
            onChange={(e) => updateGeneral('email', e.target.value)}
            placeholder="info@example.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Telefon</Label>
          <Input
            value={general.phone || ''}
            onChange={(e) => updateGeneral('phone', e.target.value)}
            placeholder="+49 123 456789"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Adresse</Label>
          <Textarea
            value={general.address || ''}
            onChange={(e) => updateGeneral('address', e.target.value)}
            placeholder="Musterstraße 1&#10;12345 Musterstadt"
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COLOR INPUT COMPONENT
// ============================================================================

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded border cursor-pointer flex-shrink-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-xs h-8"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
