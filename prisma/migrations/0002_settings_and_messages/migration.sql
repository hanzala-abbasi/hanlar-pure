-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "tiktokUrl" TEXT NOT NULL DEFAULT '',
    "deliveryTitle" TEXT NOT NULL,
    "deliveryInfo" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

