import { z } from 'zod';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  details: z.record(z.unknown()).optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// WORKSPACE TYPES
// ============================================================================

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
  plan: z.enum(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

export const WorkspaceTypeEnum = z.enum([
  'WEBSITE',
  'SHOP',
  'BLOG',
  'FORUM',
  'WIKI',
  'PORTFOLIO',
  'LANDING',
]);

export type WorkspaceType = z.infer<typeof WorkspaceTypeEnum>;

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  type: WorkspaceTypeEnum.optional().default('WEBSITE'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  companyName: z.string().max(200).optional(),
  companyEmail: z.string().email().optional().or(z.literal('')),
  companyPhone: z.string().max(50).optional(),
  companyAddress: z.string().max(500).optional(),
  companyVatId: z.string().max(50).optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
});

export type CreateWorkspaceRequest = z.infer<typeof CreateWorkspaceSchema>;

export const WorkspaceMemberSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']),
  user: UserSchema,
  createdAt: z.string(),
});

export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
});

export type InviteMemberRequest = z.infer<typeof InviteMemberSchema>;

// ============================================================================
// SITE TYPES
// ============================================================================

export const SiteSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  settings: z.record(z.unknown()),
  customDomain: z.string().nullable(),
  isPublished: z.boolean(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Site = z.infer<typeof SiteSchema>;

export const CreateSiteSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
});

export type CreateSiteRequest = z.infer<typeof CreateSiteSchema>;

export const UpdateSiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  faviconUrl: z.string().url().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  companyName: z.string().max(200).optional().nullable(),
  companyEmail: z.string().email().optional().nullable(),
  companyPhone: z.string().max(50).optional().nullable(),
  companyAddress: z.string().max(500).optional().nullable(),
  companyVatId: z.string().max(50).optional().nullable(),
  companyWebsite: z.string().url().optional().nullable(),
  enableUserAuth: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
});

export type UpdateSiteRequest = z.infer<typeof UpdateSiteSchema>;

// ============================================================================
// PAGE TYPES
// ============================================================================

export const PageSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  builderTree: z.unknown(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  ogImage: z.string().nullable(),
  isHomepage: z.boolean(),
  isDraft: z.boolean(),
  publishedRevisionId: z.string().nullable(),
  createdById: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Page = z.infer<typeof PageSchema>;

export const CreatePageSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  isHomepage: z.boolean().optional(),
});

export type CreatePageRequest = z.infer<typeof CreatePageSchema>;

export const UpdatePageSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional().nullable(),
  builderTree: z.unknown().optional(),
  metaTitle: z.string().max(100).optional().nullable(),
  metaDescription: z.string().max(300).optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
  isHomepage: z.boolean().optional(),
});

export type UpdatePageRequest = z.infer<typeof UpdatePageSchema>;

// ============================================================================
// PAGE REVISION TYPES
// ============================================================================

export const PageRevisionSchema = z.object({
  id: z.string(),
  pageId: z.string(),
  builderTree: z.unknown(),
  version: z.number(),
  comment: z.string().nullable(),
  createdById: z.string(),
  createdAt: z.string(),
});

export type PageRevision = z.infer<typeof PageRevisionSchema>;

export const PublishPageSchema = z.object({
  comment: z.string().max(500).optional(),
});

export type PublishPageRequest = z.infer<typeof PublishPageSchema>;

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export const CollectionSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  siteId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  schema: z.array(z.unknown()),
  isSystem: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Collection = z.infer<typeof CollectionSchema>;

export const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  schema: z.array(z.unknown()),
  siteId: z.string().optional(),
});

export type CreateCollectionRequest = z.infer<typeof CreateCollectionSchema>;

// ============================================================================
// RECORD TYPES
// ============================================================================

export const RecordSchema = z.object({
  id: z.string(),
  collectionId: z.string(),
  data: z.record(z.unknown()),
  slug: z.string().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.string().nullable(),
  createdById: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CollectionRecord = z.infer<typeof RecordSchema>;

export const CreateRecordSchema = z.object({
  data: z.record(z.unknown()),
  slug: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export type CreateRecordRequest = z.infer<typeof CreateRecordSchema>;

export const UpdateRecordSchema = z.object({
  data: z.record(z.unknown()).optional(),
  slug: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export type UpdateRecordRequest = z.infer<typeof UpdateRecordSchema>;

// ============================================================================
// ASSET TYPES
// ============================================================================

export const AssetSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  siteId: z.string().nullable(),
  name: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  alt: z.string().nullable(),
  uploadedById: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Asset = z.infer<typeof AssetSchema>;

// ============================================================================
// BILLING TYPES
// ============================================================================

export const SubscriptionSchema = z.object({
  id: z.string(),
  status: z.enum(['active', 'canceled', 'past_due', 'trialing', 'unpaid']),
  plan: z.enum(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const CreateCheckoutSchema = z.object({
  plan: z.enum(['PRO', 'BUSINESS', 'ENTERPRISE']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreateCheckoutRequest = z.infer<typeof CreateCheckoutSchema>;

// ============================================================================
// INTEGRATIONS
// ============================================================================

export const IntegrationId = z.enum([
  // Analytics & Tracking
  'google-analytics',
  'google-search-console',
  'google-tag-manager',
  'google-recaptcha',
  'google-ads',
  'plausible-analytics',
  'microsoft-clarity',
  // Heatmaps
  'hotjar',
  // Social Pixels
  'meta-pixel',
  'tiktok-pixel',
  'linkedin-insight',
  'pinterest-tag',
  // Communication & Chat
  'whatsapp-chat',
  'crisp-chat',
  'calendly',
  // E-Mail Marketing
  'mailchimp',
  'brevo',
  // Automation
  'zapier',
  'make',
  'slack-notifications',
  // Maps & Embeds
  'google-maps',
  // SEO
  'schema-markup',
  // Payments
  'paypal',
  // AI
  'openai-chatbot',
  // Other
  'custom-code',
  'cookie-consent',
]);

export type IntegrationId = z.infer<typeof IntegrationId>;

export const IntegrationConfigSchema = z.object({
  // Analytics & Tracking
  googleAnalyticsId: z.string().optional(),       // G-XXXXXXXXXX
  googleSearchConsoleId: z.string().optional(),    // Verification meta tag
  googleTagManagerId: z.string().optional(),       // GTM-XXXXXXX
  googleRecaptchaSiteKey: z.string().optional(),   // reCAPTCHA v3 site key
  googleAdsId: z.string().optional(),              // AW-XXXXXXXXX
  plausibleDomain: z.string().optional(),          // Domain für Plausible
  plausibleSelfHostUrl: z.string().optional(),     // Self-hosted Plausible URL
  microsoftClarityId: z.string().optional(),       // Clarity Project ID
  // Heatmaps
  hotjarSiteId: z.string().optional(),              // Hotjar Site ID
  // Social Pixels
  metaPixelId: z.string().optional(),              // Facebook/Meta Pixel ID
  tiktokPixelId: z.string().optional(),            // TikTok Pixel ID
  linkedinPartnerId: z.string().optional(),        // LinkedIn Partner ID
  pinterestTagId: z.string().optional(),           // Pinterest Tag ID
  // Communication & Chat
  whatsappNumber: z.string().optional(),           // WhatsApp Business Nummer
  whatsappMessage: z.string().optional(),          // Vordefinierte Nachricht
  crispWebsiteId: z.string().optional(),           // Crisp Website ID
  calendlyUrl: z.string().optional(),              // Calendly Scheduling Link
  // E-Mail Marketing
  mailchimpApiKey: z.string().optional(),          // Mailchimp API Key
  mailchimpAudienceId: z.string().optional(),      // Mailchimp Audience/List ID
  brevoApiKey: z.string().optional(),              // Brevo (Sendinblue) API Key
  brevoListId: z.string().optional(),              // Brevo List ID
  // Automation
  zapierWebhookUrl: z.string().optional(),         // Zapier Webhook URL
  makeWebhookUrl: z.string().optional(),           // Make (Integromat) Webhook URL
  slackWebhookUrl: z.string().optional(),          // Slack Incoming Webhook
  slackChannel: z.string().optional(),             // Slack Channel Name
  // Maps & Embeds
  googleMapsApiKey: z.string().optional(),         // Google Maps API Key
  googleMapsEmbedUrl: z.string().optional(),       // Oder Embed-URL
  // SEO
  schemaMarkupEnabled: z.boolean().optional(),     // Schema.org auto-generation
  schemaMarkupType: z.enum(['Organization', 'LocalBusiness', 'Product', 'Article', 'WebSite']).optional(),
  schemaMarkupCustom: z.string().optional(),       // Custom JSON-LD
  // Payments
  paypalClientId: z.string().optional(),           // PayPal Client ID
  paypalSandbox: z.boolean().optional(),           // PayPal Sandbox Mode
  // AI
  openaiApiKey: z.string().optional(),             // OpenAI API Key
  openaiAssistantId: z.string().optional(),        // OpenAI Assistant ID
  openaiChatbotName: z.string().optional(),        // Chatbot Display Name
  // Custom Code
  customHeadCode: z.string().optional(),           // Custom <head> scripts
  customBodyCode: z.string().optional(),           // Custom </body> scripts
  // Cookie Consent
  cookieConsentEnabled: z.boolean().optional(),    // DSGVO Cookie Banner
  cookieConsentProvider: z.enum(['klaro', 'cookiebot', 'custom']).optional(),
  cookiebotId: z.string().optional(),              // Cookiebot Domain Group ID
});

export type IntegrationConfig = z.infer<typeof IntegrationConfigSchema>;

// Which integrations each plan has access to
export const PLAN_INTEGRATIONS: Record<string, IntegrationId[]> = {
  FREE: [],
  PRO: [
    'google-analytics',
    'plausible-analytics',
    'microsoft-clarity',
    'google-search-console',
    'google-recaptcha',
    'google-maps',
    'schema-markup',
    'whatsapp-chat',
    'cookie-consent',
  ],
  BUSINESS: [
    'google-analytics',
    'plausible-analytics',
    'microsoft-clarity',
    'google-search-console',
    'google-tag-manager',
    'google-recaptcha',
    'google-ads',
    'meta-pixel',
    'tiktok-pixel',
    'linkedin-insight',
    'pinterest-tag',
    'hotjar',
    'whatsapp-chat',
    'crisp-chat',
    'calendly',
    'mailchimp',
    'brevo',
    'zapier',
    'make',
    'slack-notifications',
    'google-maps',
    'schema-markup',
    'paypal',
    'custom-code',
    'cookie-consent',
  ],
  ENTERPRISE: [
    'google-analytics',
    'plausible-analytics',
    'microsoft-clarity',
    'google-search-console',
    'google-tag-manager',
    'google-recaptcha',
    'google-ads',
    'meta-pixel',
    'tiktok-pixel',
    'linkedin-insight',
    'pinterest-tag',
    'hotjar',
    'whatsapp-chat',
    'crisp-chat',
    'calendly',
    'mailchimp',
    'brevo',
    'zapier',
    'make',
    'slack-notifications',
    'google-maps',
    'schema-markup',
    'paypal',
    'openai-chatbot',
    'custom-code',
    'cookie-consent',
  ],
};

// Human-readable integration metadata
export const INTEGRATION_META: Record<string, { name: string; description: string; icon: string; docsUrl: string; category: string }> = {
  // ── Analytics & Tracking ──────────────────────────────────────────
  'google-analytics': {
    name: 'Google Analytics',
    description: 'Verfolge Besucher, Seitenaufrufe und Conversions mit GA4.',
    icon: 'bar-chart',
    docsUrl: 'https://analytics.google.com',
    category: 'Analytics & Tracking',
  },
  'plausible-analytics': {
    name: 'Plausible Analytics',
    description: 'Datenschutzfreundliche Web-Analyse ohne Cookies — EU-gehostet.',
    icon: 'activity',
    docsUrl: 'https://plausible.io',
    category: 'Analytics & Tracking',
  },
  'microsoft-clarity': {
    name: 'Microsoft Clarity',
    description: 'Kostenlose Heatmaps, Session Recordings und Behaviour-Insights.',
    icon: 'monitor-dot',
    docsUrl: 'https://clarity.microsoft.com',
    category: 'Analytics & Tracking',
  },
  'google-search-console': {
    name: 'Google Search Console',
    description: 'Überwache deine Suchleistung und indexierte Seiten.',
    icon: 'search',
    docsUrl: 'https://search.google.com/search-console',
    category: 'Analytics & Tracking',
  },
  'google-tag-manager': {
    name: 'Google Tag Manager',
    description: 'Verwalte alle deine Marketing-Tags an einem Ort.',
    icon: 'tag',
    docsUrl: 'https://tagmanager.google.com',
    category: 'Analytics & Tracking',
  },
  'google-recaptcha': {
    name: 'Google reCAPTCHA',
    description: 'Schütze deine Formulare vor Spam und Bots.',
    icon: 'shield-check',
    docsUrl: 'https://www.google.com/recaptcha',
    category: 'Analytics & Tracking',
  },
  'hotjar': {
    name: 'Hotjar',
    description: 'Heatmaps, Recordings und Feedback von deinen Besuchern.',
    icon: 'flame',
    docsUrl: 'https://www.hotjar.com',
    category: 'Analytics & Tracking',
  },
  // ── Advertising & Social Pixels ───────────────────────────────────
  'google-ads': {
    name: 'Google Ads',
    description: 'Tracke Conversions deiner Google Ads Kampagnen.',
    icon: 'megaphone',
    docsUrl: 'https://ads.google.com',
    category: 'Werbung & Social Pixels',
  },
  'meta-pixel': {
    name: 'Meta Pixel',
    description: 'Retargeting und Conversion-Tracking für Facebook & Instagram.',
    icon: 'eye',
    docsUrl: 'https://business.facebook.com',
    category: 'Werbung & Social Pixels',
  },
  'tiktok-pixel': {
    name: 'TikTok Pixel',
    description: 'Conversion-Tracking und Zielgruppen-Optimierung für TikTok Ads.',
    icon: 'music',
    docsUrl: 'https://ads.tiktok.com',
    category: 'Werbung & Social Pixels',
  },
  'linkedin-insight': {
    name: 'LinkedIn Insight Tag',
    description: 'B2B-Conversion-Tracking und Retargeting über LinkedIn.',
    icon: 'briefcase',
    docsUrl: 'https://business.linkedin.com/marketing-solutions/insight-tag',
    category: 'Werbung & Social Pixels',
  },
  'pinterest-tag': {
    name: 'Pinterest Tag',
    description: 'Conversion-Tracking für Pinterest Ads und Shopping.',
    icon: 'pin',
    docsUrl: 'https://business.pinterest.com',
    category: 'Werbung & Social Pixels',
  },
  // ── Communication & Chat ──────────────────────────────────────────
  'whatsapp-chat': {
    name: 'WhatsApp Chat',
    description: 'Floating WhatsApp-Button für direkten Kundenkontakt.',
    icon: 'message-circle',
    docsUrl: 'https://business.whatsapp.com',
    category: 'Kommunikation & Chat',
  },
  'crisp-chat': {
    name: 'Crisp Live Chat',
    description: 'Live-Chat-Widget mit Chatbot, Wissensdatenbank und Inbox.',
    icon: 'messages-square',
    docsUrl: 'https://crisp.chat',
    category: 'Kommunikation & Chat',
  },
  'calendly': {
    name: 'Calendly',
    description: 'Terminbuchung direkt auf deiner Website einbetten.',
    icon: 'calendar',
    docsUrl: 'https://calendly.com',
    category: 'Kommunikation & Chat',
  },
  // ── E-Mail Marketing ──────────────────────────────────────────────
  'mailchimp': {
    name: 'Mailchimp',
    description: 'Verbinde Newsletter-Anmeldungen mit deinem Mailchimp-Konto.',
    icon: 'mail',
    docsUrl: 'https://mailchimp.com',
    category: 'E-Mail Marketing',
  },
  'brevo': {
    name: 'Brevo (Sendinblue)',
    description: 'E-Mail-Marketing, SMS und Marketing-Automation — DSGVO-konform.',
    icon: 'send',
    docsUrl: 'https://www.brevo.com',
    category: 'E-Mail Marketing',
  },
  // ── Automation ────────────────────────────────────────────────────
  'zapier': {
    name: 'Zapier',
    description: 'Verbinde Builderly mit 6.000+ Apps via Webhooks.',
    icon: 'zap',
    docsUrl: 'https://zapier.com',
    category: 'Automation',
  },
  'make': {
    name: 'Make (Integromat)',
    description: 'Visuelle Automations-Workflows mit Webhook-Trigger.',
    icon: 'workflow',
    docsUrl: 'https://www.make.com',
    category: 'Automation',
  },
  'slack-notifications': {
    name: 'Slack Benachrichtigungen',
    description: 'Erhalte Echtzeit-Benachrichtigungen in Slack bei Formularen, Bestellungen etc.',
    icon: 'hash',
    docsUrl: 'https://api.slack.com/messaging/webhooks',
    category: 'Automation',
  },
  // ── Maps & Embeds ─────────────────────────────────────────────────
  'google-maps': {
    name: 'Google Maps',
    description: 'Interaktive Karten und Standort-Anzeige auf deiner Website.',
    icon: 'map-pin',
    docsUrl: 'https://developers.google.com/maps',
    category: 'Maps & Embeds',
  },
  // ── SEO ────────────────────────────────────────────────────────────
  'schema-markup': {
    name: 'Schema.org Markup',
    description: 'Strukturierte Daten (JSON-LD) für bessere Google-Rich-Snippets.',
    icon: 'file-json',
    docsUrl: 'https://schema.org',
    category: 'SEO',
  },
  // ── Payments ───────────────────────────────────────────────────────
  'paypal': {
    name: 'PayPal',
    description: 'PayPal-Buttons und Checkout direkt auf deiner Website.',
    icon: 'wallet',
    docsUrl: 'https://developer.paypal.com',
    category: 'Zahlungen',
  },
  // ── AI ─────────────────────────────────────────────────────────────
  'openai-chatbot': {
    name: 'KI-Chatbot (OpenAI)',
    description: 'GPT-basierter Chatbot, der Fragen zu deiner Website beantwortet.',
    icon: 'bot',
    docsUrl: 'https://platform.openai.com',
    category: 'KI & Chatbots',
  },
  // ── Other ──────────────────────────────────────────────────────────
  'custom-code': {
    name: 'Custom Code',
    description: 'Füge eigene Scripts in Head oder Body deiner Seite ein.',
    icon: 'code',
    docsUrl: '',
    category: 'Sonstiges',
  },
  'cookie-consent': {
    name: 'Cookie Consent (DSGVO)',
    description: 'DSGVO-konformer Cookie-Banner für deine Website.',
    icon: 'cookie',
    docsUrl: '',
    category: 'Datenschutz & Recht',
  },
};

// ============================================================================
// ENTITLEMENTS
// ============================================================================

export const EntitlementsSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  maxSites: z.number(),
  maxPagesPerSite: z.number(),
  maxStorage: z.number(), // in bytes
  maxCustomDomains: z.number(),
  maxTeamMembers: z.number(),
  maxFormSubmissionsPerMonth: z.number(),
  customDomains: z.boolean(),
  removeWatermark: z.boolean(),
  prioritySupport: z.boolean(),
  dedicatedSupport: z.boolean(),
  ecommerce: z.boolean(),
  passwordProtection: z.boolean(),
  ssoSaml: z.boolean(),
  whiteLabel: z.boolean(),
  auditLog: z.boolean(),
  slaGuarantee: z.boolean(),
  integrations: z.array(IntegrationId),
});

export type Entitlements = z.infer<typeof EntitlementsSchema>;

export const PLAN_ENTITLEMENTS: Record<string, Entitlements> = {
  FREE: {
    plan: 'FREE',
    maxSites: 1,
    maxPagesPerSite: 5,
    maxStorage: 500 * 1024 * 1024, // 500MB
    maxCustomDomains: 0,
    maxTeamMembers: 1,
    maxFormSubmissionsPerMonth: 50,
    customDomains: false,
    removeWatermark: false,
    prioritySupport: false,
    dedicatedSupport: false,
    ecommerce: false,
    passwordProtection: false,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: [],
  },
  PRO: {
    plan: 'PRO',
    maxSites: 3,
    maxPagesPerSite: 25,
    maxStorage: 2 * 1024 * 1024 * 1024, // 2GB
    maxCustomDomains: 1,
    maxTeamMembers: 3,
    maxFormSubmissionsPerMonth: 500,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: false,
    dedicatedSupport: false,
    ecommerce: false,
    passwordProtection: false,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: [
      'google-analytics', 'plausible-analytics', 'microsoft-clarity',
      'google-search-console', 'google-recaptcha', 'google-maps',
      'schema-markup', 'whatsapp-chat', 'cookie-consent',
    ],
  },
  BUSINESS: {
    plan: 'BUSINESS',
    maxSites: 10,
    maxPagesPerSite: 100,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    maxCustomDomains: 3,
    maxTeamMembers: 10,
    maxFormSubmissionsPerMonth: 2000,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: true,
    dedicatedSupport: false,
    ecommerce: true,
    passwordProtection: true,
    ssoSaml: false,
    whiteLabel: false,
    auditLog: false,
    slaGuarantee: false,
    integrations: [
      'google-analytics', 'plausible-analytics', 'microsoft-clarity',
      'google-search-console', 'google-tag-manager', 'google-recaptcha',
      'google-ads', 'meta-pixel', 'tiktok-pixel', 'linkedin-insight',
      'pinterest-tag', 'hotjar', 'whatsapp-chat', 'crisp-chat', 'calendly',
      'mailchimp', 'brevo', 'zapier', 'make', 'slack-notifications',
      'google-maps', 'schema-markup', 'paypal', 'custom-code', 'cookie-consent',
    ],
  },
  ENTERPRISE: {
    plan: 'ENTERPRISE',
    maxSites: 999,
    maxPagesPerSite: 999,
    maxStorage: 50 * 1024 * 1024 * 1024, // 50GB
    maxCustomDomains: 999,
    maxTeamMembers: 999,
    maxFormSubmissionsPerMonth: 999999,
    customDomains: true,
    removeWatermark: true,
    prioritySupport: true,
    dedicatedSupport: true,
    ecommerce: true,
    passwordProtection: true,
    ssoSaml: true,
    whiteLabel: true,
    auditLog: true,
    slaGuarantee: true,
    integrations: [
      'google-analytics', 'plausible-analytics', 'microsoft-clarity',
      'google-search-console', 'google-tag-manager', 'google-recaptcha',
      'google-ads', 'meta-pixel', 'tiktok-pixel', 'linkedin-insight',
      'pinterest-tag', 'hotjar', 'whatsapp-chat', 'crisp-chat', 'calendly',
      'mailchimp', 'brevo', 'zapier', 'make', 'slack-notifications',
      'google-maps', 'schema-markup', 'paypal', 'openai-chatbot',
      'custom-code', 'cookie-consent',
    ],
  },
};

// ============================================================================
// PLAN CONFIG — DB-basierte konfigurierbare Plan-Limits
// ============================================================================

export const PlanConfigSchema = z.object({
  id: z.string(),
  plan: z.enum(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  displayName: z.string(),
  description: z.string(),
  maxSites: z.number().int().min(0),
  maxPagesPerSite: z.number().int().min(0),
  maxStorage: z.number().int().min(0), // in bytes (BigInt → number in JSON)
  maxCustomDomains: z.number().int().min(0),
  maxTeamMembers: z.number().int().min(0),
  maxFormSubmissionsPerMonth: z.number().int().min(0),
  customDomains: z.boolean(),
  removeWatermark: z.boolean(),
  prioritySupport: z.boolean(),
  dedicatedSupport: z.boolean(),
  ecommerce: z.boolean(),
  passwordProtection: z.boolean(),
  ssoSaml: z.boolean(),
  whiteLabel: z.boolean(),
  auditLog: z.boolean(),
  slaGuarantee: z.boolean(),
  integrations: z.array(z.string()),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type PlanConfig = z.infer<typeof PlanConfigSchema>;

/** Schema für PATCH /api/admin/plan-configs/:plan */
export const UpdatePlanConfigSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  maxSites: z.number().int().min(0).optional(),
  maxPagesPerSite: z.number().int().min(0).optional(),
  maxStorage: z.number().int().min(0).optional(),
  maxCustomDomains: z.number().int().min(0).optional(),
  maxTeamMembers: z.number().int().min(0).optional(),
  maxFormSubmissionsPerMonth: z.number().int().min(0).optional(),
  customDomains: z.boolean().optional(),
  removeWatermark: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
  dedicatedSupport: z.boolean().optional(),
  ecommerce: z.boolean().optional(),
  passwordProtection: z.boolean().optional(),
  ssoSaml: z.boolean().optional(),
  whiteLabel: z.boolean().optional(),
  auditLog: z.boolean().optional(),
  slaGuarantee: z.boolean().optional(),
  integrations: z.array(z.string()).optional(),
});

export type UpdatePlanConfig = z.infer<typeof UpdatePlanConfigSchema>;

/** Schema für die Workspace Usage-Übersicht */
export const WorkspaceUsageSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE']),
  limits: PlanConfigSchema.omit({ id: true, createdAt: true, updatedAt: true }),
  usage: z.object({
    sites: z.number(),
    pagesMax: z.number(), // höchste Seitenanzahl einer einzelnen Site
    storageUsed: z.number(),
    teamMembers: z.number(),
    customDomains: z.number(),
  }),
});

export type WorkspaceUsage = z.infer<typeof WorkspaceUsageSchema>;
