-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "companyEmail" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyPhone" TEXT,
ADD COLUMN     "companyVatId" TEXT,
ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "enableUserAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "userAuthEnabledAt" TIMESTAMP(3);
