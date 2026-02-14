/*
  Warnings:

  - You are about to drop the column `siteId` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `ForumCategory` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `maxPagesPerSite` on the `PlanConfig` table. All the data in the column will be lost.
  - You are about to drop the column `maxSites` on the `PlanConfig` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `SiteUser` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `SiteUserPasswordReset` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `Symbol` table. All the data in the column will be lost.
  - You are about to drop the `Site` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `ForumCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,email]` on the table `SiteUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,provider,providerId]` on the table `SiteUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `Symbol` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customDomain]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `ForumCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `SiteUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `SiteUserPasswordReset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Symbol` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFYING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "SslStatus" AS ENUM ('PENDING', 'PROVISIONING', 'ACTIVE', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('WEBSITE', 'SHOP', 'BLOG', 'FORUM', 'WIKI', 'PORTFOLIO', 'LANDING');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY', 'INVOICE', 'MANUAL');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('GIFT_CARD', 'STORE_CREDIT', 'LOYALTY_REWARD');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'ABANDONED', 'RECOVERED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CreditNoteStatus" AS ENUM ('DRAFT', 'ISSUED', 'VOIDED');

-- CreateEnum
CREATE TYPE "DebitNoteStatus" AS ENUM ('DRAFT', 'ISSUED', 'VOIDED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "EmailTemplateType" AS ENUM ('ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'ORDER_REFUNDED', 'PAYMENT_RECEIVED', 'INVOICE_SENT', 'ABANDONED_CART', 'REVIEW_REQUEST', 'WELCOME', 'ACCOUNT_ACTIVATED', 'PASSWORD_RESET', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_CANCELLED', 'SUBSCRIPTION_RENEWED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'DAMAGED', 'INITIAL');

-- CreateEnum
CREATE TYPE "SubscriptionInterval" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ShopSubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'PAST_DUE', 'TRIALING');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ClaimType" AS ENUM ('RETURN', 'REFUND', 'EXCHANGE', 'WARRANTY', 'DAMAGE', 'MISSING_ITEM', 'WRONG_ITEM');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AutomationTrigger" AS ENUM ('ORDER_CREATED', 'ORDER_PAID', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'CART_ABANDONED', 'NEW_CUSTOMER', 'REVIEW_SUBMITTED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_CANCELLED', 'FORM_SUBMITTED', 'LOW_STOCK', 'BOOKING_CREATED', 'BOOKING_CONFIRMED', 'CLAIM_CREATED');

-- CreateEnum
CREATE TYPE "AutomationAction" AS ENUM ('SEND_EMAIL', 'SEND_WEBHOOK', 'SEND_SLACK', 'UPDATE_ORDER_STATUS', 'ADD_TAG', 'CREATE_TASK', 'NOTIFY_ADMIN');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PROCESSING';

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Symbol" DROP CONSTRAINT "Symbol_siteId_fkey";

-- DropIndex
DROP INDEX "Asset_siteId_idx";

-- DropIndex
DROP INDEX "Collection_siteId_idx";

-- DropIndex
DROP INDEX "Collection_siteId_slug_key";

-- DropIndex
DROP INDEX "Form_siteId_idx";

-- DropIndex
DROP INDEX "Form_siteId_slug_key";

-- DropIndex
DROP INDEX "ForumCategory_siteId_idx";

-- DropIndex
DROP INDEX "ForumCategory_siteId_slug_key";

-- DropIndex
DROP INDEX "Order_siteId_idx";

-- DropIndex
DROP INDEX "Page_siteId_idx";

-- DropIndex
DROP INDEX "Page_siteId_slug_key";

-- DropIndex
DROP INDEX "Product_siteId_idx";

-- DropIndex
DROP INDEX "Product_siteId_slug_key";

-- DropIndex
DROP INDEX "SiteUser_siteId_email_key";

-- DropIndex
DROP INDEX "SiteUser_siteId_idx";

-- DropIndex
DROP INDEX "SiteUser_siteId_provider_providerId_key";

-- DropIndex
DROP INDEX "SiteUserPasswordReset_siteId_email_idx";

-- DropIndex
DROP INDEX "Symbol_siteId_idx";

-- DropIndex
DROP INDEX "Symbol_siteId_name_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "siteId";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "siteId";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "siteId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ForumCategory" DROP COLUMN "siteId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "siteId",
ADD COLUMN     "couponId" TEXT,
ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workspaceId" TEXT NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "siteId",
ADD COLUMN     "scheduledPublishAt" TIMESTAMP(3),
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlanConfig" DROP COLUMN "maxPagesPerSite",
DROP COLUMN "maxSites",
ADD COLUMN     "maxPages" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "siteId",
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "compareAtPrice" INTEGER,
ADD COLUMN     "costPrice" INTEGER,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "isDigital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "lowStockThreshold" INTEGER,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "manufacturerSku" TEXT,
ADD COLUMN     "manufacturerUrl" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "options" JSONB,
ADD COLUMN     "requiresShipping" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shortDescription" VARCHAR(500),
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "taxRate" DOUBLE PRECISION,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vendor" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "workspaceId" TEXT NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "SiteUser" DROP COLUMN "siteId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SiteUserPasswordReset" DROP COLUMN "siteId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Symbol" DROP COLUMN "siteId",
ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "enableUserAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "faviconUrl" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "type" "WorkspaceType" NOT NULL DEFAULT 'WEBSITE',
ADD COLUMN     "userAuthEnabledAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Site";

-- CreateTable
CREATE TABLE "CustomDomain" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "status" "DomainStatus" NOT NULL DEFAULT 'PENDING',
    "verificationToken" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "sslStatus" "SslStatus" NOT NULL DEFAULT 'PENDING',
    "sslIssuedAt" TIMESTAMP(3),
    "sslExpiresAt" TIMESTAMP(3),
    "dnsConfigured" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" TIMESTAMP(3),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" "DiscountType" NOT NULL DEFAULT 'PERCENTAGE',
    "value" INTEGER NOT NULL,
    "minOrderAmount" INTEGER,
    "maxUses" INTEGER,
    "maxUsesPerUser" INTEGER DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'MANUAL',
    "config" JSONB NOT NULL DEFAULT '{}',
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingMethod" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "freeAbove" INTEGER,
    "estimatedDaysMin" INTEGER DEFAULT 3,
    "estimatedDaysMax" INTEGER DEFAULT 5,
    "countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "maxWeight" DOUBLE PRECISION,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 19.0,
    "taxIncluded" BOOLEAN NOT NULL DEFAULT true,
    "requireAccount" BOOLEAN NOT NULL DEFAULT false,
    "enableGuestCheckout" BOOLEAN NOT NULL DEFAULT true,
    "orderNotifyEmail" TEXT,
    "termsUrl" TEXT,
    "privacyUrl" TEXT,
    "returnPolicyUrl" TEXT,
    "imprintUrl" TEXT,
    "shopName" TEXT,
    "shopLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "pageId" TEXT,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxZone" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultRate" DOUBLE PRECISION NOT NULL DEFAULT 19.0,
    "reducedRate" DOUBLE PRECISION,
    "taxClasses" JSONB NOT NULL DEFAULT '{}',
    "taxIncluded" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL DEFAULT 'GIFT_CARD',
    "initialValue" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "purchaserEmail" TEXT,
    "purchaserName" TEXT,
    "recipientEmail" TEXT,
    "recipientName" TEXT,
    "personalMessage" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "email" TEXT,
    "siteUserId" TEXT,
    "sessionId" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "recoveryEmailSentAt" TIMESTAMP(3),
    "recoveryEmailCount" INTEGER NOT NULL DEFAULT 0,
    "recoveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "orderId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerAddress" JSONB,
    "sellerName" TEXT,
    "sellerAddress" JSONB,
    "sellerVatId" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "subtotal" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "shipping" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "taxBreakdown" JSONB,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "footerText" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditNote" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "orderId" TEXT,
    "creditNoteNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "subtotal" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "reason" TEXT,
    "status" "CreditNoteStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebitNote" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "orderId" TEXT,
    "debitNoteNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "subtotal" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "reason" TEXT,
    "status" "DebitNoteStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebitNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerAddress" JSONB,
    "items" JSONB NOT NULL DEFAULT '[]',
    "subtotal" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "notes" TEXT,
    "convertedInvoiceId" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT NOT NULL,
    "siteUserId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,
    "adminResponse" TEXT,
    "adminRespondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "EmailTemplateType" NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "bodyText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "interval" "SubscriptionInterval" NOT NULL DEFAULT 'MONTHLY',
    "trialDays" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopSubscription" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "siteUserId" TEXT,
    "status" "ShopSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "siteUserId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Berlin',
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "adminNotes" TEXT,
    "reminderSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "type" "ClaimType" NOT NULL,
    "reason" TEXT NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "status" "ClaimStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "refundAmount" INTEGER,
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSettings" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "creditNotePrefix" TEXT NOT NULL DEFAULT 'CN',
    "debitNotePrefix" TEXT NOT NULL DEFAULT 'DN',
    "quotePrefix" TEXT NOT NULL DEFAULT 'QT',
    "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1,
    "nextCreditNoteNumber" INTEGER NOT NULL DEFAULT 1,
    "nextDebitNoteNumber" INTEGER NOT NULL DEFAULT 1,
    "nextQuoteNumber" INTEGER NOT NULL DEFAULT 1,
    "companyName" TEXT,
    "companyAddress" TEXT,
    "companyVatId" TEXT,
    "companyEmail" TEXT,
    "companyPhone" TEXT,
    "companyLogo" TEXT,
    "companyWebsite" TEXT,
    "bankName" TEXT,
    "bankIban" TEXT,
    "bankBic" TEXT,
    "bankAccountHolder" TEXT,
    "defaultTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 19.0,
    "showTaxBreakdown" BOOLEAN NOT NULL DEFAULT true,
    "footerText" TEXT,
    "headerText" TEXT,
    "termsText" TEXT,
    "defaultPaymentTermsDays" INTEGER NOT NULL DEFAULT 14,
    "locale" TEXT NOT NULL DEFAULT 'de-DE',
    "dateFormat" TEXT NOT NULL DEFAULT 'dd.MM.yyyy',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger" "AutomationTrigger" NOT NULL,
    "triggerConfig" JSONB NOT NULL DEFAULT '{}',
    "action" "AutomationAction" NOT NULL,
    "actionConfig" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "runCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomDomain_domain_key" ON "CustomDomain"("domain");

-- CreateIndex
CREATE INDEX "CustomDomain_workspaceId_idx" ON "CustomDomain"("workspaceId");

-- CreateIndex
CREATE INDEX "CustomDomain_domain_idx" ON "CustomDomain"("domain");

-- CreateIndex
CREATE INDEX "ProductCategory_workspaceId_idx" ON "ProductCategory"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_workspaceId_slug_key" ON "ProductCategory"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "Coupon_workspaceId_idx" ON "Coupon"("workspaceId");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_workspaceId_code_key" ON "Coupon"("workspaceId", "code");

-- CreateIndex
CREATE INDEX "PaymentMethod_workspaceId_idx" ON "PaymentMethod"("workspaceId");

-- CreateIndex
CREATE INDEX "ShippingMethod_workspaceId_idx" ON "ShippingMethod"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_workspaceId_key" ON "ShopSettings"("workspaceId");

-- CreateIndex
CREATE INDEX "PageView_workspaceId_createdAt_idx" ON "PageView"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "PageView_workspaceId_path_idx" ON "PageView"("workspaceId", "path");

-- CreateIndex
CREATE INDEX "PageView_pageId_idx" ON "PageView"("pageId");

-- CreateIndex
CREATE INDEX "TaxZone_workspaceId_idx" ON "TaxZone"("workspaceId");

-- CreateIndex
CREATE INDEX "Voucher_workspaceId_idx" ON "Voucher"("workspaceId");

-- CreateIndex
CREATE INDEX "Voucher_code_idx" ON "Voucher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_workspaceId_code_key" ON "Voucher"("workspaceId", "code");

-- CreateIndex
CREATE INDEX "Cart_workspaceId_idx" ON "Cart"("workspaceId");

-- CreateIndex
CREATE INDEX "Cart_siteUserId_idx" ON "Cart"("siteUserId");

-- CreateIndex
CREATE INDEX "Cart_email_idx" ON "Cart"("email");

-- CreateIndex
CREATE INDEX "Cart_status_idx" ON "Cart"("status");

-- CreateIndex
CREATE INDEX "Cart_updatedAt_idx" ON "Cart"("updatedAt");

-- CreateIndex
CREATE INDEX "Invoice_workspaceId_idx" ON "Invoice"("workspaceId");

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "CreditNote_workspaceId_idx" ON "CreditNote"("workspaceId");

-- CreateIndex
CREATE INDEX "CreditNote_orderId_idx" ON "CreditNote"("orderId");

-- CreateIndex
CREATE INDEX "DebitNote_workspaceId_idx" ON "DebitNote"("workspaceId");

-- CreateIndex
CREATE INDEX "DebitNote_orderId_idx" ON "DebitNote"("orderId");

-- CreateIndex
CREATE INDEX "Quote_workspaceId_idx" ON "Quote"("workspaceId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "Review_workspaceId_idx" ON "Review"("workspaceId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "Review"("status");

-- CreateIndex
CREATE INDEX "EmailTemplate_workspaceId_idx" ON "EmailTemplate"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_workspaceId_type_key" ON "EmailTemplate"("workspaceId", "type");

-- CreateIndex
CREATE INDEX "InventoryMovement_workspaceId_idx" ON "InventoryMovement"("workspaceId");

-- CreateIndex
CREATE INDEX "InventoryMovement_productId_idx" ON "InventoryMovement"("productId");

-- CreateIndex
CREATE INDEX "InventoryMovement_createdAt_idx" ON "InventoryMovement"("createdAt");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_workspaceId_idx" ON "SubscriptionPlan"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_workspaceId_slug_key" ON "SubscriptionPlan"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "ShopSubscription_workspaceId_idx" ON "ShopSubscription"("workspaceId");

-- CreateIndex
CREATE INDEX "ShopSubscription_planId_idx" ON "ShopSubscription"("planId");

-- CreateIndex
CREATE INDEX "ShopSubscription_email_idx" ON "ShopSubscription"("email");

-- CreateIndex
CREATE INDEX "ShopSubscription_status_idx" ON "ShopSubscription"("status");

-- CreateIndex
CREATE INDEX "Booking_workspaceId_idx" ON "Booking"("workspaceId");

-- CreateIndex
CREATE INDEX "Booking_startTime_idx" ON "Booking"("startTime");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_customerEmail_idx" ON "Booking"("customerEmail");

-- CreateIndex
CREATE INDEX "Claim_workspaceId_idx" ON "Claim"("workspaceId");

-- CreateIndex
CREATE INDEX "Claim_orderId_idx" ON "Claim"("orderId");

-- CreateIndex
CREATE INDEX "Claim_status_idx" ON "Claim"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSettings_workspaceId_key" ON "InvoiceSettings"("workspaceId");

-- CreateIndex
CREATE INDEX "AutomationRule_workspaceId_idx" ON "AutomationRule"("workspaceId");

-- CreateIndex
CREATE INDEX "AutomationRule_trigger_idx" ON "AutomationRule"("trigger");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_workspaceId_slug_key" ON "Collection"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "Form_workspaceId_idx" ON "Form"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Form_workspaceId_slug_key" ON "Form"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "ForumCategory_workspaceId_idx" ON "ForumCategory"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_workspaceId_slug_key" ON "ForumCategory"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "Order_workspaceId_idx" ON "Order"("workspaceId");

-- CreateIndex
CREATE INDEX "Order_couponId_idx" ON "Order"("couponId");

-- CreateIndex
CREATE INDEX "Page_workspaceId_idx" ON "Page"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_workspaceId_slug_key" ON "Page"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "Product_workspaceId_idx" ON "Product"("workspaceId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_workspaceId_isActive_idx" ON "Product"("workspaceId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Product_workspaceId_slug_key" ON "Product"("workspaceId", "slug");

-- CreateIndex
CREATE INDEX "SiteUser_workspaceId_idx" ON "SiteUser"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUser_workspaceId_email_key" ON "SiteUser"("workspaceId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUser_workspaceId_provider_providerId_key" ON "SiteUser"("workspaceId", "provider", "providerId");

-- CreateIndex
CREATE INDEX "SiteUserPasswordReset_workspaceId_email_idx" ON "SiteUserPasswordReset"("workspaceId", "email");

-- CreateIndex
CREATE INDEX "Symbol_workspaceId_idx" ON "Symbol"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_workspaceId_name_key" ON "Symbol"("workspaceId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_customDomain_key" ON "Workspace"("customDomain");

-- CreateIndex
CREATE INDEX "Workspace_customDomain_idx" ON "Workspace"("customDomain");

-- AddForeignKey
ALTER TABLE "CustomDomain" ADD CONSTRAINT "CustomDomain_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symbol" ADD CONSTRAINT "Symbol_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteUser" ADD CONSTRAINT "SiteUser_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingMethod" ADD CONSTRAINT "ShippingMethod_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopSettings" ADD CONSTRAINT "ShopSettings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumCategory" ADD CONSTRAINT "ForumCategory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxZone" ADD CONSTRAINT "TaxZone_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_siteUserId_fkey" FOREIGN KEY ("siteUserId") REFERENCES "SiteUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPlan" ADD CONSTRAINT "SubscriptionPlan_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopSubscription" ADD CONSTRAINT "ShopSubscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopSubscription" ADD CONSTRAINT "ShopSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceSettings" ADD CONSTRAINT "InvoiceSettings_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationRule" ADD CONSTRAINT "AutomationRule_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
