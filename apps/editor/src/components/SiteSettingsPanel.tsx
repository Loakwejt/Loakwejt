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
} from '@builderly/ui';
import {
  Palette,
  Type,
  Globe,
  Code,
  BarChart,
  Share2,
  Settings,
  X,
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

  return (
    <Sheet open={isSiteSettingsOpen} onOpenChange={toggleSiteSettings}>
      <SheetContent side="right" className="w-[500px] sm:max-w-[500px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Website-Einstellungen
          </SheetTitle>
          <SheetDescription>
            Globale Einstellungen für "{siteName}"
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <Tabs defaultValue="theme" className="p-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="theme" className="text-xs">
                <Palette className="h-4 w-4 mr-1" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="seo" className="text-xs">
                <Globe className="h-4 w-4 mr-1" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                <Code className="h-4 w-4 mr-1" />
                Code
              </TabsTrigger>
              <TabsTrigger value="general" className="text-xs">
                <Settings className="h-4 w-4 mr-1" />
                Allgemein
              </TabsTrigger>
            </TabsList>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6 mt-4">
              <ThemeSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6 mt-4">
              <SeoSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* Custom Code Tab */}
            <TabsContent value="code" className="space-y-6 mt-4">
              <CustomCodeSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 mt-4">
              <GeneralSettings settings={siteSettings} onUpdate={updateSiteSettings} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// Theme Settings Component
// ============================================================================

interface SettingsProps {
  settings: SiteSettings;
  onUpdate: (settings: Partial<SiteSettings>) => void;
}

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
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Farben
        </h3>

        <div className="grid grid-cols-2 gap-4">
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
            label="Primär"
            value={colors.primary}
            onChange={(v) => updateColors('primary', v)}
          />
          <ColorInput
            label="Primär Text"
            value={colors.primaryForeground}
            onChange={(v) => updateColors('primaryForeground', v)}
          />
          <ColorInput
            label="Sekundär"
            value={colors.secondary}
            onChange={(v) => updateColors('secondary', v)}
          />
          <ColorInput
            label="Sekundär Text"
            value={colors.secondaryForeground}
            onChange={(v) => updateColors('secondaryForeground', v)}
          />
          <ColorInput
            label="Akzent"
            value={colors.accent}
            onChange={(v) => updateColors('accent', v)}
          />
          <ColorInput
            label="Rahmen"
            value={colors.border}
            onChange={(v) => updateColors('border', v)}
          />
          <ColorInput
            label="Karte"
            value={colors.card}
            onChange={(v) => updateColors('card', v)}
          />
          <ColorInput
            label="Karte Text"
            value={colors.cardForeground}
            onChange={(v) => updateColors('cardForeground', v)}
          />
          <ColorInput
            label="Gedämpft"
            value={colors.muted}
            onChange={(v) => updateColors('muted', v)}
          />
          <ColorInput
            label="Gedämpft Text"
            value={colors.mutedForeground}
            onChange={(v) => updateColors('mutedForeground', v)}
          />
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <ColorInput
            label="Fehler"
            value={colors.destructive}
            onChange={(v) => updateColors('destructive', v)}
          />
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
        </div>
      </div>

      <Separator />

      {/* Typography Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Type className="h-4 w-4" />
          Typografie
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Schriftart</Label>
            <Input
              value={typography.fontFamily}
              onChange={(e) => updateTypography('fontFamily', e.target.value)}
              placeholder="Inter, system-ui, sans-serif"
            />
          </div>
          <div>
            <Label>Überschriften Schriftart</Label>
            <Input
              value={typography.headingFontFamily}
              onChange={(e) => updateTypography('headingFontFamily', e.target.value)}
              placeholder="Inter, system-ui, sans-serif"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Basis-Schriftgröße (px)</Label>
              <Input
                type="number"
                min={12}
                max={24}
                value={typography.baseFontSize}
                onChange={(e) => updateTypography('baseFontSize', parseInt(e.target.value) || 16)}
              />
            </div>
            <div>
              <Label>Zeilenhöhe</Label>
              <Input
                type="number"
                min={1}
                max={3}
                step={0.1}
                value={typography.baseLineHeight}
                onChange={(e) => updateTypography('baseLineHeight', parseFloat(e.target.value) || 1.6)}
              />
            </div>
          </div>
          <div>
            <Label>Google Fonts (kommagetrennt)</Label>
            <Input
              value={typography.googleFonts?.join(', ') || ''}
              onChange={(e) => updateTypography('googleFonts', e.target.value.split(',').map(f => f.trim()).filter(Boolean))}
              placeholder="Inter, Roboto, Open Sans"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Spacing Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Abstände & Ränder</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Container Breite</Label>
            <Input
              value={spacing.containerMaxWidth}
              onChange={(e) => updateSpacing('containerMaxWidth', e.target.value)}
              placeholder="1280px"
            />
          </div>
          <div>
            <Label>Container Padding</Label>
            <Input
              value={spacing.containerPadding}
              onChange={(e) => updateSpacing('containerPadding', e.target.value)}
              placeholder="1rem"
            />
          </div>
          <div>
            <Label>Eckenradius</Label>
            <Input
              value={spacing.borderRadius}
              onChange={(e) => updateSpacing('borderRadius', e.target.value)}
              placeholder="0.5rem"
            />
          </div>
          <div>
            <Label>Basis-Einheit (px)</Label>
            <Input
              type="number"
              min={2}
              max={16}
              value={spacing.baseUnit}
              onChange={(e) => updateSpacing('baseUnit', parseInt(e.target.value) || 4)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// SEO Settings Component
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
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Meta-Tags
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Seitentitel</Label>
            <Input
              value={seo.title}
              onChange={(e) => updateSeo('title', e.target.value)}
              placeholder="Meine Website"
              maxLength={70}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seo.title?.length || 0}/70 Zeichen
            </p>
          </div>

          <div>
            <Label>Beschreibung</Label>
            <Textarea
              value={seo.description}
              onChange={(e) => updateSeo('description', e.target.value)}
              placeholder="Eine kurze Beschreibung Ihrer Website..."
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seo.description?.length || 0}/160 Zeichen
            </p>
          </div>

          <div>
            <Label>Keywords (kommagetrennt)</Label>
            <Input
              value={seo.keywords?.join(', ') || ''}
              onChange={(e) => updateSeo('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
              placeholder="website, builder, design"
            />
          </div>

          <div>
            <Label>Sprache</Label>
            <Input
              value={seo.language}
              onChange={(e) => updateSeo('language', e.target.value)}
              placeholder="de"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Open Graph (Social Media)</h3>

        <div className="space-y-3">
          <div>
            <Label>OG Bild URL</Label>
            <Input
              value={seo.ogImage || ''}
              onChange={(e) => updateSeo('ogImage', e.target.value)}
              placeholder="https://example.com/og-image.jpg"
            />
          </div>
          <div>
            <Label>OG Titel (optional, sonst Seitentitel)</Label>
            <Input
              value={seo.ogTitle || ''}
              onChange={(e) => updateSeo('ogTitle', e.target.value)}
              placeholder="Spezieller Social Media Titel"
            />
          </div>
          <div>
            <Label>OG Beschreibung (optional)</Label>
            <Textarea
              value={seo.ogDescription || ''}
              onChange={(e) => updateSeo('ogDescription', e.target.value)}
              placeholder="Beschreibung für Social Media"
              rows={2}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Suchmaschinen</h3>

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
          <Label>Kanonische URL</Label>
          <Input
            value={seo.canonicalUrl || ''}
            onChange={(e) => updateSeo('canonicalUrl', e.target.value)}
            placeholder="https://example.com/page"
          />
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Custom Code Settings Component
// ============================================================================

function CustomCodeSettings({ settings, onUpdate }: SettingsProps) {
  const { customCode, analytics } = settings;

  const updateCustomCode = (key: string, value: string) => {
    onUpdate({
      customCode: { ...customCode, [key]: value },
    });
  };

  const updateAnalytics = (key: string, value: string) => {
    onUpdate({
      analytics: { ...analytics, [key]: value },
    });
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Analytics
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Google Analytics ID</Label>
            <Input
              value={analytics.googleAnalyticsId || ''}
              onChange={(e) => updateAnalytics('googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <Label>Google Tag Manager ID</Label>
            <Input
              value={analytics.googleTagManagerId || ''}
              onChange={(e) => updateAnalytics('googleTagManagerId', e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
          </div>
          <div>
            <Label>Facebook Pixel ID</Label>
            <Input
              value={analytics.facebookPixelId || ''}
              onChange={(e) => updateAnalytics('facebookPixelId', e.target.value)}
              placeholder="XXXXXXXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Code className="h-4 w-4" />
          Benutzerdefinierter Code
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Custom CSS</Label>
            <Textarea
              value={customCode.customCss}
              onChange={(e) => updateCustomCode('customCss', e.target.value)}
              placeholder=".my-class { color: red; }"
              rows={4}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label>Head Code (vor &lt;/head&gt;)</Label>
            <Textarea
              value={customCode.headCode}
              onChange={(e) => updateCustomCode('headCode', e.target.value)}
              placeholder="<link rel=&quot;preconnect&quot; href=&quot;...&quot;>"
              rows={3}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label>Body Start (nach &lt;body&gt;)</Label>
            <Textarea
              value={customCode.bodyStartCode}
              onChange={(e) => updateCustomCode('bodyStartCode', e.target.value)}
              placeholder="<!-- Noscript tags, etc. -->"
              rows={3}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label>Body End (vor &lt;/body&gt;)</Label>
            <Textarea
              value={customCode.bodyEndCode}
              onChange={(e) => updateCustomCode('bodyEndCode', e.target.value)}
              placeholder="<script>...</script>"
              rows={3}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// General Settings Component
// ============================================================================

function GeneralSettings({ settings, onUpdate }: SettingsProps) {
  const { general, social } = settings;

  const updateGeneral = (key: string, value: string) => {
    onUpdate({
      general: { ...general, [key]: value },
    });
  };

  const updateSocial = (key: string, value: string) => {
    onUpdate({
      social: { ...social, [key]: value },
    });
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Allgemein
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Logo URL</Label>
            <Input
              value={general.logo || ''}
              onChange={(e) => updateGeneral('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <Label>Logo Alt-Text</Label>
            <Input
              value={general.logoAlt}
              onChange={(e) => updateGeneral('logoAlt', e.target.value)}
              placeholder="Firmenname Logo"
            />
          </div>
          <div>
            <Label>Favicon URL</Label>
            <Input
              value={general.favicon || ''}
              onChange={(e) => updateGeneral('favicon', e.target.value)}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Kontakt</h3>

        <div className="space-y-3">
          <div>
            <Label>E-Mail</Label>
            <Input
              type="email"
              value={general.email || ''}
              onChange={(e) => updateGeneral('email', e.target.value)}
              placeholder="info@example.com"
            />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input
              value={general.phone || ''}
              onChange={(e) => updateGeneral('phone', e.target.value)}
              placeholder="+49 123 456789"
            />
          </div>
          <div>
            <Label>Adresse</Label>
            <Textarea
              value={general.address || ''}
              onChange={(e) => updateGeneral('address', e.target.value)}
              placeholder="Musterstraße 1&#10;12345 Musterstadt"
              rows={2}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Social Media Links
        </h3>

        <div className="space-y-3">
          <div>
            <Label>Facebook</Label>
            <Input
              value={social.facebook || ''}
              onChange={(e) => updateSocial('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              value={social.instagram || ''}
              onChange={(e) => updateSocial('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label>Twitter/X</Label>
            <Input
              value={social.twitter || ''}
              onChange={(e) => updateSocial('twitter', e.target.value)}
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={social.linkedin || ''}
              onChange={(e) => updateSocial('linkedin', e.target.value)}
              placeholder="https://linkedin.com/..."
            />
          </div>
          <div>
            <Label>YouTube</Label>
            <Input
              value={social.youtube || ''}
              onChange={(e) => updateSocial('youtube', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <Label>TikTok</Label>
            <Input
              value={social.tiktok || ''}
              onChange={(e) => updateSocial('tiktok', e.target.value)}
              placeholder="https://tiktok.com/..."
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Footer</h3>

        <div>
          <Label>Copyright Text</Label>
          <Input
            value={general.copyrightText}
            onChange={(e) => updateGeneral('copyrightText', e.target.value)}
            placeholder="© 2024 Firmenname. Alle Rechte vorbehalten."
          />
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Color Input Component
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
          className="h-9 w-9 rounded border cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-xs"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
