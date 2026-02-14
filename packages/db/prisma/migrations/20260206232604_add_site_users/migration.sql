-- CreateEnum
CREATE TYPE "SiteUserRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER', 'VIP');

-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'ENTERPRISE';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "siteUserId" TEXT;

-- CreateTable
CREATE TABLE "SiteUser" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "profileData" JSONB NOT NULL DEFAULT '{}',
    "role" "SiteUserRole" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "emailVerified" TIMESTAMP(3),
    "verificationToken" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteUserSession" (
    "id" TEXT NOT NULL,
    "siteUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteUserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteUserPasswordReset" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteUserPasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteUser_siteId_idx" ON "SiteUser"("siteId");

-- CreateIndex
CREATE INDEX "SiteUser_email_idx" ON "SiteUser"("email");

-- CreateIndex
CREATE INDEX "SiteUser_role_idx" ON "SiteUser"("role");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUser_siteId_email_key" ON "SiteUser"("siteId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUser_siteId_provider_providerId_key" ON "SiteUser"("siteId", "provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUserSession_token_key" ON "SiteUserSession"("token");

-- CreateIndex
CREATE INDEX "SiteUserSession_siteUserId_idx" ON "SiteUserSession"("siteUserId");

-- CreateIndex
CREATE INDEX "SiteUserSession_token_idx" ON "SiteUserSession"("token");

-- CreateIndex
CREATE INDEX "SiteUserSession_expiresAt_idx" ON "SiteUserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SiteUserPasswordReset_token_key" ON "SiteUserPasswordReset"("token");

-- CreateIndex
CREATE INDEX "SiteUserPasswordReset_token_idx" ON "SiteUserPasswordReset"("token");

-- CreateIndex
CREATE INDEX "SiteUserPasswordReset_siteId_email_idx" ON "SiteUserPasswordReset"("siteId", "email");

-- CreateIndex
CREATE INDEX "Order_siteUserId_idx" ON "Order"("siteUserId");

-- AddForeignKey
ALTER TABLE "SiteUserSession" ADD CONSTRAINT "SiteUserSession_siteUserId_fkey" FOREIGN KEY ("siteUserId") REFERENCES "SiteUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_siteUserId_fkey" FOREIGN KEY ("siteUserId") REFERENCES "SiteUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
