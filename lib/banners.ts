import "server-only";
import { cache } from "react";
import { defaultBanners, type BannerContent } from "@/config/banners";
import { prisma } from "@/lib/prisma";

export type PublicBanner = BannerContent & { id: string };

const fallback: PublicBanner[] = defaultBanners.map((b, i) => ({ ...b, id: `default-${i}` }));

/**
 * Active hero banners in display order. Falls back to the launch banners until the owner
 * has created any (or if the Banner table has not been migrated yet).
 */
export const getActiveBanners = cache(async (): Promise<PublicBanner[]> => {
  try {
    const rows = await prisma.banner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    if (rows.length === 0) return fallback;
    return rows
      .filter((r) => r.active)
      .map(({ id, eyebrow, title, subtitle, ctaLabel, ctaHref, imageUrl, mobileImageUrl, imageAlt, focusX }) => ({
        id,
        eyebrow,
        title,
        subtitle,
        ctaLabel,
        ctaHref,
        imageUrl,
        mobileImageUrl,
        imageAlt,
        focusX,
      }));
  } catch {
    return fallback;
  }
});
