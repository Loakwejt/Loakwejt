import { z } from 'zod';

/**
 * Color value (hex, rgb, rgba, hsl, or CSS variable)
 */
export const ColorValueSchema = z.string().regex(
  /^(#[0-9A-Fa-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|var\(--)/
).or(z.literal('transparent')).or(z.literal('inherit'));

// ============================================================================
// HEADER SETTINGS
// ============================================================================

export const HeaderSettingsSchema = z.object({
  // Enable/disable header
  enabled: z.boolean().default(true),
  
  // Header type
  type: z.enum(['classic', 'modern', 'transparent', 'minimal', 'centered', 'mega']).default('classic'),
  
  // Layout
  layout: z.enum(['full-width', 'contained', 'boxed']).default('contained'),
  height: z.string().default('80px'),
  
  // Position behavior
  position: z.enum(['static', 'sticky', 'fixed']).default('sticky'),
  hideOnScroll: z.boolean().default(false),
  shrinkOnScroll: z.boolean().default(true),
  
  // Logo settings
  logo: z.object({
    position: z.enum(['left', 'center', 'right']).default('left'),
    maxHeight: z.string().default('50px'),
    showText: z.boolean().default(true),
    text: z.string().default(''),
    textStyle: z.enum(['normal', 'bold', 'italic']).default('bold'),
  }).default({}),
  
  // Navigation settings
  navigation: z.object({
    position: z.enum(['left', 'center', 'right']).default('center'),
    style: z.enum(['horizontal', 'minimal', 'underline', 'pills', 'bordered']).default('horizontal'),
    spacing: z.enum(['compact', 'normal', 'wide']).default('normal'),
    dropdownStyle: z.enum(['simple', 'mega', 'cards']).default('simple'),
  }).default({}),
  
  // CTA Button
  cta: z.object({
    enabled: z.boolean().default(true),
    text: z.string().default('Kontakt'),
    url: z.string().default('#kontakt'),
    style: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
    icon: z.string().optional(),
  }).default({}),
  
  // Search
  search: z.object({
    enabled: z.boolean().default(false),
    position: z.enum(['nav', 'cta-area', 'fullscreen']).default('nav'),
    placeholder: z.string().default('Suchen...'),
  }).default({}),
  
  // Mobile menu
  mobile: z.object({
    breakpoint: z.enum(['sm', 'md', 'lg']).default('md'),
    style: z.enum(['slide-left', 'slide-right', 'slide-down', 'fullscreen', 'overlay']).default('slide-right'),
    showLogo: z.boolean().default(true),
    showCta: z.boolean().default(true),
  }).default({}),
  
  // Styling
  style: z.object({
    backgroundColor: z.string().default('#ffffff'),
    backgroundOpacity: z.number().min(0).max(100).default(100),
    backdropBlur: z.boolean().default(false),
    textColor: z.string().default('#0f172a'),
    borderBottom: z.boolean().default(true),
    borderColor: z.string().default('#e2e8f0'),
    shadow: z.enum(['none', 'sm', 'md', 'lg']).default('sm'),
  }).default({}),
  
  // Topbar (above header)
  topbar: z.object({
    enabled: z.boolean().default(false),
    text: z.string().default(''),
    backgroundColor: z.string().default('#0f172a'),
    textColor: z.string().default('#ffffff'),
    showSocialLinks: z.boolean().default(false),
    showContactInfo: z.boolean().default(true),
    dismissible: z.boolean().default(true),
  }).default({}),
}).default({});

// ============================================================================
// FOOTER SETTINGS
// ============================================================================

export const FooterSettingsSchema = z.object({
  // Enable/disable footer
  enabled: z.boolean().default(true),
  
  // Footer type
  type: z.enum(['simple', 'multi-column', 'mega', 'minimal', 'centered']).default('multi-column'),
  
  // Layout
  layout: z.enum(['full-width', 'contained', 'boxed']).default('contained'),
  columns: z.number().min(1).max(6).default(4),
  
  // Content sections
  sections: z.object({
    about: z.object({
      enabled: z.boolean().default(true),
      title: z.string().default('Über uns'),
      text: z.string().default(''),
      showLogo: z.boolean().default(true),
    }).default({}),
    
    links: z.array(z.object({
      title: z.string(),
      items: z.array(z.object({
        label: z.string(),
        url: z.string(),
        newTab: z.boolean().default(false),
      })),
    })).default([
      { title: 'Navigation', items: [{ label: 'Startseite', url: '/', newTab: false }] },
      { title: 'Rechtliches', items: [{ label: 'Impressum', url: '/impressum', newTab: false }] },
    ]),
    
    newsletter: z.object({
      enabled: z.boolean().default(false),
      title: z.string().default('Newsletter'),
      text: z.string().default('Bleiben Sie auf dem Laufenden'),
      placeholder: z.string().default('Ihre E-Mail'),
      buttonText: z.string().default('Abonnieren'),
      successMessage: z.string().default('Vielen Dank für Ihre Anmeldung!'),
    }).default({}),
    
    contact: z.object({
      enabled: z.boolean().default(true),
      title: z.string().default('Kontakt'),
      showEmail: z.boolean().default(true),
      showPhone: z.boolean().default(true),
      showAddress: z.boolean().default(true),
      showSocialLinks: z.boolean().default(true),
    }).default({}),
  }).default({}),
  
  // Bottom bar
  bottomBar: z.object({
    enabled: z.boolean().default(true),
    copyrightText: z.string().default('© {year} Firmenname. Alle Rechte vorbehalten.'),
    showBackToTop: z.boolean().default(true),
    showPaymentIcons: z.boolean().default(false),
    links: z.array(z.object({
      label: z.string(),
      url: z.string(),
    })).default([
      { label: 'Impressum', url: '/impressum' },
      { label: 'Datenschutz', url: '/datenschutz' },
    ]),
  }).default({}),
  
  // Styling
  style: z.object({
    backgroundColor: z.string().default('#0f172a'),
    textColor: z.string().default('#ffffff'),
    linkColor: z.string().default('#94a3b8'),
    linkHoverColor: z.string().default('#ffffff'),
    borderTop: z.boolean().default(true),
    borderColor: z.string().default('#1e293b'),
    paddingTop: z.string().default('4rem'),
    paddingBottom: z.string().default('2rem'),
  }).default({}),
}).default({});

// ============================================================================
// SIDEBAR SETTINGS
// ============================================================================

export const SidebarSettingsSchema = z.object({
  // Enable sidebars
  leftSidebar: z.object({
    enabled: z.boolean().default(false),
    width: z.string().default('280px'),
    position: z.enum(['fixed', 'sticky', 'static']).default('sticky'),
    collapsible: z.boolean().default(true),
    defaultCollapsed: z.boolean().default(false),
    showOnMobile: z.boolean().default(false),
    mobileStyle: z.enum(['drawer', 'overlay', 'push']).default('drawer'),
    backgroundColor: z.string().default('#ffffff'),
    borderRight: z.boolean().default(true),
    shadow: z.enum(['none', 'sm', 'md', 'lg']).default('sm'),
  }).default({}),
  
  rightSidebar: z.object({
    enabled: z.boolean().default(false),
    width: z.string().default('320px'),
    position: z.enum(['fixed', 'sticky', 'static']).default('sticky'),
    collapsible: z.boolean().default(true),
    defaultCollapsed: z.boolean().default(false),
    showOnMobile: z.boolean().default(false),
    mobileStyle: z.enum(['drawer', 'overlay', 'push']).default('drawer'),
    backgroundColor: z.string().default('#ffffff'),
    borderLeft: z.boolean().default(true),
    shadow: z.enum(['none', 'sm', 'md', 'lg']).default('sm'),
  }).default({}),
}).default({});

// ============================================================================
// BACKGROUND & EFFECTS SETTINGS
// ============================================================================

export const BackgroundEffectsSchema = z.object({
  // Global page background
  pageBackground: z.object({
    type: z.enum(['color', 'gradient', 'image', 'video', 'pattern']).default('color'),
    color: z.string().default('#ffffff'),
    gradient: z.object({
      type: z.enum(['linear', 'radial', 'conic']).default('linear'),
      angle: z.number().min(0).max(360).default(180),
      colors: z.array(z.object({
        color: z.string(),
        position: z.number().min(0).max(100),
      })).default([
        { color: '#ffffff', position: 0 },
        { color: '#f1f5f9', position: 100 },
      ]),
    }).default({}),
    image: z.object({
      url: z.string().default(''),
      size: z.enum(['cover', 'contain', 'auto', 'repeat']).default('cover'),
      position: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
      attachment: z.enum(['scroll', 'fixed', 'local']).default('scroll'),
      overlay: z.object({
        enabled: z.boolean().default(false),
        color: z.string().default('#000000'),
        opacity: z.number().min(0).max(100).default(50),
      }).default({}),
    }).default({}),
    video: z.object({
      url: z.string().default(''),
      poster: z.string().default(''),
      overlay: z.object({
        enabled: z.boolean().default(true),
        color: z.string().default('#000000'),
        opacity: z.number().min(0).max(100).default(40),
      }).default({}),
    }).default({}),
    pattern: z.object({
      type: z.enum(['dots', 'grid', 'lines', 'waves', 'noise', 'custom']).default('dots'),
      color: z.string().default('#e2e8f0'),
      opacity: z.number().min(0).max(100).default(30),
      size: z.number().min(1).max(100).default(20),
      customSvg: z.string().default(''),
    }).default({}),
  }).default({}),
  
  // Decorative elements
  decorations: z.object({
    // Floating shapes
    shapes: z.object({
      enabled: z.boolean().default(false),
      items: z.array(z.object({
        type: z.enum(['circle', 'square', 'triangle', 'blob', 'custom']),
        color: z.string(),
        size: z.string(),
        position: z.object({ x: z.string(), y: z.string() }),
        blur: z.number().default(0),
        opacity: z.number().min(0).max(100).default(20),
        animation: z.enum(['none', 'float', 'pulse', 'rotate']).default('none'),
      })).default([]),
    }).default({}),
    
    // Gradient orbs
    gradientOrbs: z.object({
      enabled: z.boolean().default(false),
      items: z.array(z.object({
        colors: z.array(z.string()),
        size: z.string(),
        position: z.object({ x: z.string(), y: z.string() }),
        blur: z.number().default(80),
        opacity: z.number().min(0).max(100).default(30),
      })).default([]),
    }).default({}),
  }).default({}),
  
  // Cursor effects
  cursor: z.object({
    custom: z.boolean().default(false),
    style: z.enum(['default', 'dot', 'ring', 'glow', 'trail']).default('default'),
    color: z.string().default('#7c3aed'),
    size: z.number().min(10).max(100).default(20),
    mixBlendMode: z.boolean().default(false),
  }).default({}),
  
  // Scroll effects
  scroll: z.object({
    smoothScroll: z.boolean().default(true),
    scrollbarStyle: z.enum(['default', 'thin', 'hidden', 'custom']).default('default'),
    scrollbarColor: z.string().default('#7c3aed'),
    scrollIndicator: z.object({
      enabled: z.boolean().default(false),
      position: z.enum(['top', 'bottom']).default('top'),
      color: z.string().default('#7c3aed'),
      height: z.string().default('3px'),
    }).default({}),
  }).default({}),
}).default({});

// ============================================================================
// ANIMATION SETTINGS
// ============================================================================

export const AnimationSettingsSchema = z.object({
  // Global animation settings
  enabled: z.boolean().default(true),
  reducedMotion: z.boolean().default(false), // Respect prefers-reduced-motion
  
  // Page transitions
  pageTransition: z.object({
    enabled: z.boolean().default(false),
    type: z.enum(['fade', 'slide', 'scale', 'flip', 'none']).default('fade'),
    duration: z.number().min(100).max(2000).default(300),
    easing: z.enum(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']).default('ease-out'),
  }).default({}),
  
  // Scroll animations (on-scroll reveal)
  scrollAnimations: z.object({
    enabled: z.boolean().default(true),
    defaultAnimation: z.enum(['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out', 'flip', 'none']).default('fade-up'),
    duration: z.number().min(100).max(2000).default(600),
    delay: z.number().min(0).max(1000).default(0),
    stagger: z.number().min(0).max(500).default(100),
    threshold: z.number().min(0).max(100).default(20),
    once: z.boolean().default(true),
  }).default({}),
  
  // Hover effects (global defaults)
  hoverEffects: z.object({
    buttons: z.enum(['none', 'lift', 'glow', 'pulse', 'scale']).default('lift'),
    cards: z.enum(['none', 'lift', 'glow', 'border', 'scale']).default('lift'),
    images: z.enum(['none', 'zoom', 'brighten', 'blur', 'grayscale']).default('zoom'),
    links: z.enum(['none', 'underline', 'highlight', 'color']).default('underline'),
  }).default({}),
  
  // Loading animations
  loading: z.object({
    pageLoader: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['spinner', 'bar', 'dots', 'pulse', 'logo', 'custom']).default('spinner'),
      color: z.string().default('#7c3aed'),
      backgroundColor: z.string().default('#ffffff'),
      minDuration: z.number().min(0).max(5000).default(500),
    }).default({}),
    skeleton: z.object({
      enabled: z.boolean().default(true),
      animation: z.enum(['pulse', 'wave', 'none']).default('pulse'),
      baseColor: z.string().default('#e2e8f0'),
      highlightColor: z.string().default('#f1f5f9'),
    }).default({}),
  }).default({}),
  
  // Micro-interactions
  microInteractions: z.object({
    buttonClick: z.boolean().default(true),
    inputFocus: z.boolean().default(true),
    checkboxToggle: z.boolean().default(true),
    tooltipAnimation: z.boolean().default(true),
    notificationSlide: z.boolean().default(true),
  }).default({}),
}).default({});

// ============================================================================
// COOKIE CONSENT & GDPR SETTINGS
// ============================================================================

export const CookieConsentSchema = z.object({
  // Enable cookie consent
  enabled: z.boolean().default(false),
  
  // Consent mode
  mode: z.enum(['opt-in', 'opt-out', 'notice-only']).default('opt-in'),
  
  // Banner settings
  banner: z.object({
    position: z.enum(['bottom', 'top', 'bottom-left', 'bottom-right', 'center']).default('bottom'),
    layout: z.enum(['bar', 'box', 'popup']).default('bar'),
    title: z.string().default('Cookie-Einstellungen'),
    message: z.string().default('Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten.'),
    acceptAllText: z.string().default('Alle akzeptieren'),
    rejectAllText: z.string().default('Alle ablehnen'),
    customizeText: z.string().default('Anpassen'),
    saveText: z.string().default('Einstellungen speichern'),
    closeText: z.string().default('Schließen'),
    showCloseButton: z.boolean().default(true),
    backdropBlur: z.boolean().default(false),
    animation: z.enum(['slide', 'fade', 'none']).default('slide'),
  }).default({}),
  
  // Cookie categories
  categories: z.object({
    necessary: z.object({
      enabled: z.boolean().default(true), // Always enabled
      title: z.string().default('Notwendige Cookies'),
      description: z.string().default('Diese Cookies sind für die Grundfunktionen der Website erforderlich.'),
    }).default({}),
    functional: z.object({
      enabled: z.boolean().default(true),
      title: z.string().default('Funktionale Cookies'),
      description: z.string().default('Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.'),
      defaultChecked: z.boolean().default(false),
    }).default({}),
    analytics: z.object({
      enabled: z.boolean().default(true),
      title: z.string().default('Analyse Cookies'),
      description: z.string().default('Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.'),
      defaultChecked: z.boolean().default(false),
    }).default({}),
    marketing: z.object({
      enabled: z.boolean().default(true),
      title: z.string().default('Marketing Cookies'),
      description: z.string().default('Diese Cookies werden verwendet, um Werbung relevanter für Sie zu machen.'),
      defaultChecked: z.boolean().default(false),
    }).default({}),
  }).default({}),
  
  // Legal links
  links: z.object({
    privacyPolicy: z.string().default('/datenschutz'),
    cookiePolicy: z.string().default('/cookies'),
    impressum: z.string().default('/impressum'),
  }).default({}),
  
  // Styling
  style: z.object({
    backgroundColor: z.string().default('#ffffff'),
    textColor: z.string().default('#0f172a'),
    buttonPrimaryBg: z.string().default('#7c3aed'),
    buttonPrimaryText: z.string().default('#ffffff'),
    buttonSecondaryBg: z.string().default('#f1f5f9'),
    buttonSecondaryText: z.string().default('#0f172a'),
    borderRadius: z.string().default('0.5rem'),
    shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('lg'),
  }).default({}),
  
  // Behavior
  behavior: z.object({
    expireDays: z.number().min(1).max(365).default(365),
    showOnEveryVisit: z.boolean().default(false),
    blockPageScroll: z.boolean().default(false),
    reopenTrigger: z.boolean().default(true), // Show a button to reopen settings
    reopenPosition: z.enum(['bottom-left', 'bottom-right']).default('bottom-left'),
  }).default({}),
}).default({});

// ============================================================================
// PERFORMANCE SETTINGS
// ============================================================================

export const PerformanceSettingsSchema = z.object({
  // Image optimization
  images: z.object({
    lazyLoading: z.boolean().default(true),
    lazyLoadingThreshold: z.string().default('200px'),
    fadeInOnLoad: z.boolean().default(true),
    placeholder: z.enum(['blur', 'color', 'skeleton', 'none']).default('blur'),
    webpConversion: z.boolean().default(true),
  }).default({}),
  
  // Preloading
  preloading: z.object({
    preloadLinks: z.boolean().default(true),
    prefetchPages: z.boolean().default(false),
    preconnectDomains: z.array(z.string()).default([]),
  }).default({}),
  
  // Scripts
  scripts: z.object({
    deferAnalytics: z.boolean().default(true),
    asyncScripts: z.boolean().default(true),
  }).default({}),
}).default({});

// ============================================================================
// ACCESSIBILITY SETTINGS
// ============================================================================

export const AccessibilitySettingsSchema = z.object({
  // Focus styles
  focusStyles: z.object({
    style: z.enum(['default', 'outline', 'ring', 'underline']).default('ring'),
    color: z.string().default('#7c3aed'),
    width: z.string().default('2px'),
    offset: z.string().default('2px'),
  }).default({}),
  
  // Skip links
  skipLinks: z.object({
    enabled: z.boolean().default(true),
    text: z.string().default('Zum Hauptinhalt springen'),
  }).default({}),
  
  // Screen reader
  screenReader: z.object({
    announcePageChanges: z.boolean().default(true),
    liveRegions: z.boolean().default(true),
  }).default({}),
  
  // Visual aids
  visualAids: z.object({
    highContrastMode: z.boolean().default(false),
    largeText: z.boolean().default(false),
    underlineLinks: z.boolean().default(false),
  }).default({}),
}).default({});

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
  
  // ========== NEW SECTIONS ==========
  
  // Header configuration
  header: HeaderSettingsSchema.default({}),
  
  // Footer configuration
  footer: FooterSettingsSchema.default({}),
  
  // Sidebar configuration
  sidebar: SidebarSettingsSchema.default({}),
  
  // Background & visual effects
  backgroundEffects: BackgroundEffectsSchema.default({}),
  
  // Animations
  animations: AnimationSettingsSchema.default({}),
  
  // Cookie consent & GDPR
  cookieConsent: CookieConsentSchema.default({}),
  
  // Performance
  performance: PerformanceSettingsSchema.default({}),
  
  // Accessibility
  accessibility: AccessibilitySettingsSchema.default({}),
});

// Type exports
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type SeoSettings = z.infer<typeof SeoSchema>;
export type CustomCode = z.infer<typeof CustomCodeSchema>;
export type Analytics = z.infer<typeof AnalyticsSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type HeaderSettings = z.infer<typeof HeaderSettingsSchema>;
export type FooterSettings = z.infer<typeof FooterSettingsSchema>;
export type SidebarSettings = z.infer<typeof SidebarSettingsSchema>;
export type BackgroundEffects = z.infer<typeof BackgroundEffectsSchema>;
export type AnimationSettings = z.infer<typeof AnimationSettingsSchema>;
export type CookieConsentSettings = z.infer<typeof CookieConsentSchema>;
export type PerformanceSettings = z.infer<typeof PerformanceSettingsSchema>;
export type AccessibilitySettings = z.infer<typeof AccessibilitySettingsSchema>;
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
