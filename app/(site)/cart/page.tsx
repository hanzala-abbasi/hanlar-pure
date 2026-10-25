import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default async function CartPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader eyebrow="Your Selection" title="Cart" />
      <section className="py-14 md:py-20">
        <Container className="max-w-4xl">
          <CartView whatsappNumber={settings.whatsappNumber} />
        </Container>
      </section>
    </>
  );
}
