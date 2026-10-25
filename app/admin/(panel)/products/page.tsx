import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { StatusSelect } from "@/components/admin/status-select";
import { FeaturedToggle } from "@/components/admin/featured-toggle";

export const metadata: Metadata = { title: "Products" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const counts = {
    total: products.length,
    active: products.filter((p) => p.status === "ACTIVE").length,
    draft: products.filter((p) => p.status === "DRAFT").length,
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {counts.total} total · {counts.active} live · {counts.draft} draft
          </p>
        </div>
        <Link href="/admin/products/new" className={buttonClass("dark")}>
          <Plus aria-hidden className="size-4" /> Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 bg-white p-10 text-center text-muted">No products yet. Add your first product.</p>
      ) : (
        <div className="mt-8 overflow-x-auto bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((p) => (
                <tr key={p.id} className={p.status === "ARCHIVED" ? "opacity-60" : undefined}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden bg-off-white">
                        {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <div>
                        <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-gold-dark">
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted">
                          {p.size} · /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <StatusSelect id={p.id} status={p.status} name={p.name} />
                  </td>
                  <td className="px-4 py-3">
                    <FeaturedToggle id={p.id} featured={p.featured} name={p.name} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{dateFormat.format(p.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs uppercase tracking-[0.15em] hover:text-gold-dark"
                    >
                      <Pencil aria-hidden className="size-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
