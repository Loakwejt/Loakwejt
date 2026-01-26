import { z } from 'zod';

/**
 * Color value (hex, rgb, rgba, hsl, or CSS variable)
 */
export const ColorValueSchema = z.string().regex(
  /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|var\(--)/
).or(z.literal('transparent')).or(z.literal('inherit'));

/**
 * Theme colors configuration
 */
export const ThemeColorsSchema = z.object({
  // Brand colors
  primary: z.string().default('#7c3aed'),
  primaryForeground: z.string().default('#ffffff'),
  secondary: z.string().default('#f1f5f9'),
  secondaryForeground: z.string().default('#0f172a'),
  accent: z.string().default('#f1f5f9'),
  accentForeground: z.string().default('#0f172a'),
  
  // Semantic colors
  background: z.string().default('#ffffff'),
  foreground: z.string().default('#0f172a'),
  muted: z.string().default('#f1f5f9'),
  mutedForeground: z.string().default('#64748b'),
  
  // UI colors
  card: z.string().default('#ffffff'),
  cardForeground: z.string().default('#0f172a'),
  border: z.string().default('#e2e8f0'),
  input: z.string().default('#e2e8f0'),
  ring: z.string().default('#7c3aed'),
  
  // Status colors
  destructive: z.string().default('#ef4444'),
  destructiveForeground: z.string().default('#ffffff'),
  success: z.string().default('#22c55e'),
  successForeground: z.string().default('#ffffff'),
  warning: z.string().default('#f59e0b'),
  warningForeground: z.string().default('#ffffff'),
});

/**
 * Typography configuration
 */
export const TypographySchema = z.object({
  // Font families
  fontFamily: z.string().default('Inter, system-ui, sans-serif'),
  headingFontFamily: z.string().default('Inter, system-ui, sans-serif'),
  monoFontFamily: z.string().default('JetBrains Mono, monospace'),
  
  // Base font size (in px)
  baseFontSize: z.number().min(12).max(24).default(16),
  
  // Line height
  baseLineHeight: z.number().min(1).max(3).default(1.6),
  headingLineHeight: z.number().min(1).max(2).default(1.2),
  
  // Font weights
  fontWeightNormal: z.number().min(100).max(900).default(400),
  fontWeightMedium: z.number().min(100).max(900).default(500),
  fontWeightBold: z.number().min(100).max(900).default(700),
  
  // Custom Google Fonts to load
  googleFonts: z.array(z.string()).default([]),
});

/**
 * Spacing configuration
 */
export const SpacingSchema = z.object({
  // Base spacing unit (in px)
  baseUnit: z.number().min(2).max(16).default(4),
  
  // Container max widths
  containerMaxWidth: z.string().default('1280px'),
  containerPadding: z.string().default('1rem'),
  
  // Border radius
  borderRadius: z.string().default('0.5rem'),
  borderRadiusSmall: z.string().default('0.25rem'),
  borderRadiusLarge: z.string().default('1rem'),
  borderRadiusFull: z.string().default('9999px'),
});

/**
 * SEO and meta configuration
 */
export const SeoSchema = z.object({
  // Basic meta
  title: z.string().max(70).default(''),
  description: z.string().max(160).default(''),
  keywords: z.array(z.string()).default([]),
  
  // Open Graph
  ogImage: z.string().url().optional().or(z.literal('')),
  ogTitle: z.string().max(70).optional(),
  ogDescription: z.string().max(200).optional(),
  ogType: z.enum(['website', 'article', 'product']).default('website'),
  
  // Twitter Card
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  twitterSite: z.string().optional(),
  twitterCreator: z.string().optional(),
  
  // Robots
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  
  // Canonical URL
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  
  // Language
  language: z.string().default('de'),
  
  // Structured data / JSON-LD
  structuredData: z.record(z.any()).optional(),
});

/**
 * Custom code injection
 */
export const CustomCodeSchema = z.object({
  // Head injection (meta tags, scripts, styles)
  headCode: z.string().max(10000).default(''),
  
  // Body start (after <body>)
  bodyStartCode: z.string().max(10000).default(''),
  
  // Body end (before </body>)
  bodyEndCode: z.string().max(10000).default(''),
  
  // Custom CSS
  customCss: z.string().max(50000).default(''),
});

/**
 * Analytics configuration
 */
export const AnalyticsSchema = z.object({
  // Google Analytics
  googleAnalyticsId: z.string().optional(),
  
  // Google Tag Manager
  googleTagManagerId: z.string().optional(),
  
  // Facebook Pixel
  facebookPixelId: z.string().optional(),
  
  // Custom tracking scripts
  customTrackingScripts: z.string().max(10000).default(''),
});

/**
 * Social links
 */
export const SocialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  discord: z.string().url().optional().or(z.literal('')),
});

/**
 * Complete site settings schema
 */
export const SiteSettingsSchema = z.object({
  // Theme
  theme: z.object({
    colors: ThemeColorsSchema.default({}),
    typography: TypographySchema.default({}),
    spacing: SpacingSchema.default({}),
    darkMode: z.boolean().default(false),
  }).default({}),
  
  // SEO
  seo: SeoSchema.default({}),
  
  // Custom code
  customCode: CustomCodeSchema.default({}),
  
  // Analytics
  analytics: AnalyticsSchema.default({}),
  
  // Social
  social: SocialLinksSchema.default({}),
  
  // General
  general: z.object({
    // Favicon
    favicon: z.string().optional(),
    
    // Logo
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    logoAlt: z.string().default('Logo'),
    
    // Contact info
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    
    // Copyright
    copyrightText: z.string().default(''),
    
    // Timezone
    timezone: z.string().default('Europe/Berlin'),
    
    // Date format
    dateFormat: z.string().default('DD.MM.YYYY'),
  }).default({}),
});

// Type exports
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type SeoSettings = z.infer<typeof SeoSchema>;
export type CustomCode = z.infer<typeof CustomCodeSchema>;
export type Analytics = z.infer<typeof AnalyticsSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

/**
 * Get default site settings
 */
export function getDefaultSiteSettings(): SiteSettings {
  return SiteSettingsSchema.parse({});
}

/**
 * Merge partial settings with defaults
 */
export function mergeSiteSettings(partial: Partial<SiteSettings>): SiteSettings {
  return SiteSettingsSchema.parse(partial);
}

/**
 * Generate CSS variables from theme settings
 */
export function generateCssVariables(settings: SiteSettings): string {
  const { colors, typography, spacing } = settings.theme;
  
  const variables: string[] = [];
  
  // Colors
  Object.entries(colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    variables.push(`--color-${cssKey}: ${value};`);
  });
  
  // Typography
  variables.push(`--font-family: ${typography.fontFamily};`);
  variables.push(`--font-family-heading: ${typography.headingFontFamily};`);
  variables.push(`--font-family-mono: ${typography.monoFontFamily};`);
  variables.push(`--font-size-base: ${typography.baseFontSize}px;`);
  variables.push(`--line-height-base: ${typography.baseLineHeight};`);
  variables.push(`--line-height-heading: ${typography.headingLineHeight};`);
  
  // Spacing
  variables.push(`--spacing-unit: ${spacing.baseUnit}px;`);
  variables.push(`--container-max-width: ${spacing.containerMaxWidth};`);
  variables.push(`--container-padding: ${spacing.containerPadding};`);
  variables.push(`--border-radius: ${spacing.borderRadius};`);
  variables.push(`--border-radius-sm: ${spacing.borderRadiusSmall};`);
  variables.push(`--border-radius-lg: ${spacing.borderRadiusLarge};`);
  variables.push(`--border-radius-full: ${spacing.borderRadiusFull};`);
  
  return `:root {\n  ${variables.join('\n  ')}\n}`;
}
