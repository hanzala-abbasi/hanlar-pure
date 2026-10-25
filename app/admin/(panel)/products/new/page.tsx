import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { ProductForm, emptyProduct } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Add product</h1>
      <ProductForm id={null} initial={emptyProduct} />
    </>
  );
}
