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
  plan: z.enum(['FREE', 'PRO', 'BUSINESS']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
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
  plan: z.enum(['FREE', 'PRO', 'BUSINESS']),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const CreateCheckoutSchema = z.object({
  plan: z.enum(['PRO', 'BUSINESS']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreateCheckoutRequest = z.infer<typeof CreateCheckoutSchema>;

// ============================================================================
// ENTITLEMENTS
// ============================================================================

export const EntitlementsSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'BUSINESS']),
  maxSites: z.number(),
  maxPagesPerSite: z.number(),
  maxStorage: z.number(), // in bytes
  customDomains: z.boolean(),
  removeWatermark: z.boolean(),
  prioritySupport: z.boolean(),
});

export type Entitlements = z.infer<typeof EntitlementsSchema>;

export const PLAN_ENTITLEMENTS: Record<string, Entitlements> = {
  FREE: {
    plan: 'FREE',
    maxSites: 1,
    maxPagesPerSite: 5,
    maxStorage: 100 * 1024 * 1024, // 100MB
    customDomains: false,
    removeWatermark: false,
    prioritySupport: false,
  },
  PRO: {
    plan: 'PRO',
    maxSites: 5,
    maxPagesPerSite: 50,
    maxStorage: 1024 * 1024 * 1024, // 1GB
    customDomains: true,
    removeWatermark: true,
    prioritySupport: false,
  },
  BUSINESS: {
    plan: 'BUSINESS',
    maxSites: 20,
    maxPagesPerSite: 200,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    customDomains: true,
    removeWatermark: true,
    prioritySupport: true,
  },
};
