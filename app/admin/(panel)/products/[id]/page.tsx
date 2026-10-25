import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { faqsSchema } from "@/lib/validations";
import { ProductForm } from "@/components/admin/product-form";
import { DangerZone } from "@/components/admin/danger-zone";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] } },
  });
  if (!product) notFound();

  const faqs = faqsSchema.safeParse(product.faqs);
  const isPublic = product.status === "ACTIVE" || product.status === "OUT_OF_STOCK";

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Edit: {product.name}</h1>
        {isPublic && (
          <Link
            href={`/shop/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] hover:text-gold-dark"
          >
            <ExternalLink aria-hidden className="size-3.5" /> View in shop
          </Link>
        )}
      </div>
      <ProductForm
        key={product.updatedAt.toISOString()}
        id={product.id}
        initial={{
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          ingredients: product.ingredients ?? "",
          benefits: product.benefits ?? "",
          howToUse: product.howToUse ?? "",
          price: product.price,
          size: product.size,
          status: product.status,
          featured: product.featured,
          sortOrder: product.sortOrder,
          faqs: faqs.success ? faqs.data : [],
          images: product.images.map((img) => ({ url: img.url, alt: img.alt ?? "" })),
        }}
      />
      <DangerZone id={product.id} name={product.name} archived={product.status === "ARCHIVED"} />
    </>
  );
}
