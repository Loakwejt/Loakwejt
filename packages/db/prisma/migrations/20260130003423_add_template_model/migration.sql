-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'BUSINESS');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'CONTACT', 'TEAM', 'FAQ', 'FOOTER', 'HEADER', 'GALLERY', 'STATS', 'BLOG', 'ECOMMERCE', 'CONTENT', 'FULL_PAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMP(3),

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "faviconUrl" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "customDomain" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "builderTree" JSONB NOT NULL DEFAULT '{}',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImage" TEXT,
    "isHomepage" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "publishedRevisionId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageRevision" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "builderTree" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "comment" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "siteId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL DEFAULT '[]',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "slug" TEXT,
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "siteId" TEXT,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "folder" TEXT,
    "tags" TEXT[],
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "caption" TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "sku" TEXT,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "images" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "subtotal" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "shipping" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "shippingAddress" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "schema" JSONB NOT NULL DEFAULT '{}',
    "submitLabel" TEXT NOT NULL DEFAULT 'Submit',
    "successMessage" TEXT NOT NULL DEFAULT 'Thank you for your submission!',
    "redirectUrl" TEXT,
    "notifyEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "enableRecaptcha" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "readAt" TIMESTAMP(3),
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "spamScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumCategory" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumThread" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "category" "TemplateCategory" NOT NULL DEFAULT 'FULL_PAGE',
    "style" TEXT,
    "websiteType" TEXT,
    "tags" TEXT[],
    "tree" JSONB NOT NULL,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_stripeCustomerId_key" ON "Workspace"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_stripeSubscriptionId_key" ON "Workspace"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Workspace_slug_idx" ON "Workspace"("slug");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_idx" ON "WorkspaceMember"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_customDomain_key" ON "Site"("customDomain");

-- CreateIndex
CREATE INDEX "Site_workspaceId_idx" ON "Site"("workspaceId");

-- CreateIndex
CREATE INDEX "Site_slug_idx" ON "Site"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Site_workspaceId_slug_key" ON "Site"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "Page_siteId_idx" ON "Page"("siteId");

-- CreateIndex
CREATE INDEX "Page_createdById_idx" ON "Page"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Page_siteId_slug_key" ON "Page"("siteId", "slug");

-- CreateIndex
CREATE INDEX "PageRevision_pageId_idx" ON "PageRevision"("pageId");

-- CreateIndex
CREATE INDEX "PageRevision_createdById_idx" ON "PageRevision"("createdById");

-- CreateIndex
CREATE INDEX "Collection_workspaceId_idx" ON "Collection"("workspaceId");

-- CreateIndex
CREATE INDEX "Collection_siteId_idx" ON "Collection"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_siteId_slug_key" ON "Collection"("siteId", "slug");

-- CreateIndex
CREATE INDEX "Record_collectionId_idx" ON "Record"("collectionId");

-- CreateIndex
CREATE INDEX "Record_createdById_idx" ON "Record"("createdById");

-- CreateIndex
CREATE INDEX "Record_status_idx" ON "Record"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Record_collectionId_slug_key" ON "Record"("collectionId", "slug");

-- CreateIndex
CREATE INDEX "Asset_workspaceId_idx" ON "Asset"("workspaceId");

-- CreateIndex
CREATE INDEX "Asset_siteId_idx" ON "Asset"("siteId");

-- CreateIndex
CREATE INDEX "Asset_uploadedById_idx" ON "Asset"("uploadedById");

-- CreateIndex
CREATE INDEX "Asset_folder_idx" ON "Asset"("folder");

-- CreateIndex
CREATE INDEX "Product_siteId_idx" ON "Product"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_siteId_slug_key" ON "Product"("siteId", "slug");

-- CreateIndex
CREATE INDEX "Order_siteId_idx" ON "Order"("siteId");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Form_siteId_idx" ON "Form"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_siteId_slug_key" ON "Form"("siteId", "slug");

-- CreateIndex
CREATE INDEX "FormSubmission_formId_idx" ON "FormSubmission"("formId");

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormSubmission_createdAt_idx" ON "FormSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "ForumCategory_siteId_idx" ON "ForumCategory"("siteId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_siteId_slug_key" ON "ForumCategory"("siteId", "slug");

-- CreateIndex
CREATE INDEX "ForumThread_categoryId_idx" ON "ForumThread"("categoryId");

-- CreateIndex
CREATE INDEX "ForumThread_authorEmail_idx" ON "ForumThread"("authorEmail");

-- CreateIndex
CREATE INDEX "ForumPost_threadId_idx" ON "ForumPost"("threadId");

-- CreateIndex
CREATE INDEX "ForumPost_authorEmail_idx" ON "ForumPost"("authorEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "Template"("category");

-- CreateIndex
CREATE INDEX "Template_isPublished_idx" ON "Template"("isPublished");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_publishedRevisionId_fkey" FOREIGN KEY ("publishedRevisionId") REFERENCES "PageRevision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageRevision" ADD CONSTRAINT "PageRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageRevision" ADD CONSTRAINT "PageRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumThread" ADD CONSTRAINT "ForumThread_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
