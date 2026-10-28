-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "ctaLabel" TEXT NOT NULL DEFAULT 'Shop Now',
    "ctaHref" TEXT NOT NULL DEFAULT '/shop',
    "imageUrl" TEXT NOT NULL,
    "mobileImageUrl" TEXT,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "focusX" INTEGER NOT NULL DEFAULT 50,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_active_sortOrder_idx" ON "Banner"("active", "sortOrder");
