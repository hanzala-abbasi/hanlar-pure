import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getShopProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";

// Admin routes are intentionally excluded.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticPages = ["", "/shop", "/ingredients", "/about", "/contact", "/blog", "/privacy-policy", "/delivery-policy", "/return-policy"];
  const products = await getShopProducts();
  const posts = getAllPosts();

  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: p.updatedAt, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
