import type { Metadata } from "next";
import { getShopProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/product-card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop HANLAR PURE natural hair care: Signature Black Shampoo and botanical Hair Oil. Prices in PKR, delivery across Pakistan.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getShopProducts();

  return (
    <>
      <PageHeader eyebrow="The Collection" title="Shop" intro="Botanical shampoo and hair oil, made with natural extracts and premium oils." />
      <section className="py-16 md:py-24">
        <Container>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="py-20 text-center text-muted">New products are coming soon.</p>
          )}
        </Container>
      </section>
    </>
  );
}
