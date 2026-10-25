import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { faqsSchema } from "@/lib/validations";

// Public catalog queries. DRAFT and ARCHIVED products never leave this module.
const PUBLIC_STATUSES = ["ACTIVE", "OUT_OF_STOCK"] as const;

const productInclude = {
  images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export type PublicProduct = ReturnType<typeof toPublic>;

function toPublic(p: ProductRow) {
  const faqs = faqsSchema.safeParse(p.faqs);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    ingredients: p.ingredients,
    benefits: p.benefits,
    howToUse: p.howToUse,
    price: p.price,
    size: p.size,
    status: p.status,
    inStock: p.status === "ACTIVE",
    featured: p.featured,
    faqs: faqs.success ? faqs.data : [],
    images: p.images.map((img) => ({ url: img.url, alt: img.alt || p.name })),
    updatedAt: p.updatedAt,
  };
}

const orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ sortOrder: "asc" }, { createdAt: "asc" }];

export const getShopProducts = cache(async () => {
  const rows = await prisma.product.findMany({
    where: { status: { in: [...PUBLIC_STATUSES] } },
    include: productInclude,
    orderBy,
  });
  return rows.map(toPublic);
});

export const getFeaturedProducts = cache(async (limit = 4) => {
  const rows = await prisma.product.findMany({
    where: { status: { in: [...PUBLIC_STATUSES] }, featured: true },
    include: productInclude,
    orderBy,
    take: limit,
  });
  return rows.map(toPublic);
});

export const getProductBySlug = cache(async (slug: string) => {
  const row = await prisma.product.findFirst({
    where: { slug, status: { in: [...PUBLIC_STATUSES] } },
    include: productInclude,
  });
  return row ? toPublic(row) : null;
});

export async function getRelatedProducts(excludeId: string, limit = 3) {
  const rows = await prisma.product.findMany({
    where: { status: { in: [...PUBLIC_STATUSES] }, id: { not: excludeId } },
    include: productInclude,
    orderBy,
    take: limit,
  });
  return rows.map(toPublic);
}

/** Fresh price/status lookup for the cart. Never trust prices stored in localStorage. */
export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { id: { in: ids.slice(0, 50) }, status: { in: [...PUBLIC_STATUSES] } },
    include: productInclude,
  });
  return rows.map(toPublic);
}
