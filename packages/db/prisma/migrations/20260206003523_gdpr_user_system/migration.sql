-- CreateEnum
CREATE TYPE "DataRequestStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "anonymizedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketingConsentAt" TIMESTAMP(3),
ADD COLUMN     "privacyConsentAt" TIMESTAMP(3),
ADD COLUMN     "privacyConsentVersion" TEXT;

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataExportRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DataRequestStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "error" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataExportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symbol" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tree" JSONB NOT NULL,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_email_idx" ON "EmailVerificationToken"("email");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_expires_idx" ON "EmailVerificationToken"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expires_idx" ON "PasswordResetToken"("expires");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "DataExportRequest_userId_idx" ON "DataExportRequest"("userId");

-- CreateIndex
CREATE INDEX "DataExportRequest_status_idx" ON "DataExportRequest"("status");

-- CreateIndex
CREATE INDEX "DataExportRequest_createdAt_idx" ON "DataExportRequest"("createdAt");

-- CreateIndex
CREATE INDEX "Symbol_siteId_idx" ON "Symbol"("siteId");

-- CreateIndex
CREATE INDEX "Symbol_category_idx" ON "Symbol"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_siteId_name_key" ON "Symbol"("siteId", "name");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "Session"("expires");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExportRequest" ADD CONSTRAINT "DataExportRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Symbol" ADD CONSTRAINT "Symbol_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
