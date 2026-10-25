import "server-only";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { toLines } from "@/lib/utils";

export type SiteSettings = {
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  social: { instagram: string; facebook: string; tiktok: string };
  delivery: { title: string; lines: string[] };
  /** False until the owner saves settings in the dashboard. */
  saved: boolean;
};

const d = siteConfig.defaults;
const fallback: SiteSettings = {
  whatsappNumber: d.whatsappNumber,
  email: d.email,
  phone: d.phone,
  address: d.address,
  social: { ...d.social },
  delivery: { title: d.delivery.title, lines: [...d.delivery.lines] },
  saved: false,
};

/** Contact/social settings from the database, falling back to config/site.ts defaults. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return fallback;
    return {
      whatsappNumber: row.whatsappNumber,
      email: row.email,
      phone: row.phone,
      address: row.address,
      social: { instagram: row.instagramUrl, facebook: row.facebookUrl, tiktok: row.tiktokUrl },
      delivery: { title: row.deliveryTitle, lines: toLines(row.deliveryInfo) },
      saved: true,
    };
  } catch (err) {
    console.error("Could not load site settings, using defaults", err);
    return fallback;
  }
});
