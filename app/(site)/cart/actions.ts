"use server";

import { z } from "zod";
import { getProductsByIds } from "@/lib/products";

const idsSchema = z.array(z.string().min(1).max(40)).max(50);

/** Returns current price, name, image and stock for the given product IDs. */
export async function getCartProducts(ids: unknown) {
  const parsed = idsSchema.safeParse(ids);
  if (!parsed.success) return [];
  const products = await getProductsByIds(parsed.data);
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    size: p.size,
    image: p.images[0]?.url,
    inStock: p.inStock,
  }));
}
