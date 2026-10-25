"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { productSchema, productStatuses, settingsSchema } from "@/lib/validations";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Refresh every public page that can show product data. */
function revalidateCatalog(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/shop/[slug]", "page");
  for (const slug of slugs) revalidatePath(`/shop/${slug}`);
  revalidatePath("/sitemap.xml");
}

// ---------- Auth ----------

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `login:${ip}`;
  const limit = rateLimit(key, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    const minutes = Math.ceil(limit.retryAfterMs / 60000);
    return { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
  }

  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) return { error: "Incorrect password." };

  resetRateLimit(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Products ----------

export async function saveProduct(id: string | null, input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { images, faqs, ...fields } = parsed.data;
  const data = {
    ...fields,
    ingredients: fields.ingredients || null,
    benefits: fields.benefits || null,
    howToUse: fields.howToUse || null,
    faqs: faqs.length ? faqs : Prisma.DbNull,
  };
  const imageRows = images.map((img, position) => ({
    url: img.url,
    alt: img.alt || null,
    position,
    isPrimary: position === 0,
  }));

  try {
    let previousSlug: string | undefined;
    const product = await prisma.$transaction(async (tx) => {
      if (!id) {
        return tx.product.create({ data: { ...data, images: { create: imageRows } } });
      }
      const existing = await tx.product.findUnique({ where: { id }, select: { slug: true } });
      if (!existing) throw new Error("NOT_FOUND");
      previousSlug = existing.slug;
      await tx.productImage.deleteMany({ where: { productId: id } });
      return tx.product.update({ where: { id }, data: { ...data, images: { create: imageRows } } });
    });

    revalidateCatalog([product.slug, ...(previousSlug ? [previousSlug] : [])]);
    return { ok: true, id: product.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: "That slug is already used by another product.", fieldErrors: { slug: ["Slug must be unique"] } };
    }
    if (err instanceof Error && err.message === "NOT_FOUND") return { ok: false, error: "Product not found." };
    console.error("saveProduct failed", err);
    return { ok: false, error: "Could not save the product. Please try again." };
  }
}

export async function setProductStatus(id: string, status: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.enum(productStatuses).safeParse(status);
  if (!parsed.success) return { ok: false, error: "Invalid status." };
  try {
    const product = await prisma.product.update({ where: { id }, data: { status: parsed.data } });
    revalidateCatalog([product.slug]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update status." };
  }
}

export async function setProductFeatured(id: string, featured: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    const product = await prisma.product.update({ where: { id }, data: { featured: !!featured } });
    revalidateCatalog([product.slug]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update product." };
  }
}

/** Permanent delete. Only allowed for archived products, so nothing live disappears by accident. */
export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id }, select: { status: true, slug: true } });
  if (!product) return { ok: false, error: "Product not found." };
  if (product.status !== "ARCHIVED") return { ok: false, error: "Archive the product before deleting it." };
  await prisma.product.delete({ where: { id } });
  revalidateCatalog([product.slug]);
  return { ok: true };
}

// ---------- Site settings ----------

export async function saveSettings(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  });
  // Contact details appear in the header, footer and many pages: refresh the whole site.
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------- Contact messages ----------

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contactMessage.update({ where: { id }, data: { read: !!read } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update message." };
  }
}

export async function markAllMessagesRead(): Promise<ActionResult> {
  await requireAdmin();
  await prisma.contactMessage.updateMany({ where: { read: false }, data: { read: true } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete message." };
  }
}
