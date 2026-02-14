-- CreateTable
CREATE TABLE "PlanConfig" (
    "id" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "maxSites" INTEGER NOT NULL DEFAULT 1,
    "maxPagesPerSite" INTEGER NOT NULL DEFAULT 5,
    "maxStorage" BIGINT NOT NULL DEFAULT 524288000,
    "maxCustomDomains" INTEGER NOT NULL DEFAULT 0,
    "maxTeamMembers" INTEGER NOT NULL DEFAULT 1,
    "maxFormSubmissionsPerMonth" INTEGER NOT NULL DEFAULT 50,
    "customDomains" BOOLEAN NOT NULL DEFAULT false,
    "removeWatermark" BOOLEAN NOT NULL DEFAULT false,
    "prioritySupport" BOOLEAN NOT NULL DEFAULT false,
    "dedicatedSupport" BOOLEAN NOT NULL DEFAULT false,
    "ecommerce" BOOLEAN NOT NULL DEFAULT false,
    "passwordProtection" BOOLEAN NOT NULL DEFAULT false,
    "ssoSaml" BOOLEAN NOT NULL DEFAULT false,
    "whiteLabel" BOOLEAN NOT NULL DEFAULT false,
    "auditLog" BOOLEAN NOT NULL DEFAULT false,
    "slaGuarantee" BOOLEAN NOT NULL DEFAULT false,
    "integrations" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanConfig_plan_key" ON "PlanConfig"("plan");
