import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaf, Truck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { matchIngredients } from "@/config/ingredients";
import { getSiteSettings } from "@/lib/settings";
import { getProductBySlug, getRelatedProducts, getShopProducts } from "@/lib/products";
import { formatPrice, toLines } from "@/lib/utils";
import { Gallery } from "@/components/product/gallery";
import { IngredientCard } from "@/components/ingredients/ingredient-card";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductGrid } from "@/components/product/product-card";
import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateStaticParams() {
  const products = await getShopProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const image = product.images[0];
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
  };
}

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
    </div>
  );
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([getRelatedProducts(product.id, 3), getSiteSettings()]);
  const benefits = toLines(product.benefits);
  const keyIngredients = matchIngredients(product.ingredients);
  const url = `${siteConfig.url}/shop/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((img) => (img.url.startsWith("http") ? img.url : `${siteConfig.url}${img.url}`)),
    sku: product.id,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "PKR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <section className="py-10 md:py-16">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-[0.2em] text-muted">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-gold-dark">
                  Home
                </Link>{" "}
                /
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-dark">
                  Shop
                </Link>{" "}
                /
              </li>
              <li aria-current="page" className="text-black">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
            <Gallery images={product.images} name={product.name} />

            <div className="md:pt-4">
              {!product.inStock && <Badge className="mb-4">Out of Stock</Badge>}
              <h1 className="font-serif text-4xl leading-tight md:text-5xl">{product.name}</h1>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">{product.size}</p>
              <p className="mt-6 text-2xl">{formatPrice(product.price)}</p>
              <p className="mt-6 leading-relaxed text-muted">{product.shortDescription}</p>
              {keyIngredients.length > 0 && (
                <p className="mt-4 flex items-center gap-2 text-sm text-sage-dark">
                  <Leaf aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                  Made with{" "}
                  {keyIngredients
                    .slice(0, 3)
                    .map((i) => i.name.toLowerCase())
                    .join(", ")}
                  {keyIngredients.length > 3 && ` & ${keyIngredients.length - 3} more pure ingredients`}
                </p>
              )}

              <div className="mt-8">
                <PurchasePanel
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    size: product.size,
                    image: product.images[0]?.url,
                    inStock: product.inStock,
                  }}
                />
              </div>

              <div className="mt-8 flex gap-4 bg-off-white p-5">
                <Truck aria-hidden className="mt-0.5 size-5 shrink-0 text-gold-dark" strokeWidth={1.5} />
                <div>
                  <h2 className="font-medium">{settings.delivery.title}</h2>
                  <ul className="mt-1 space-y-1 text-sm text-muted">
                    {settings.delivery.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-black/10">
                <AccordionItem title="Description" defaultOpen>
                  <Paragraphs text={product.description} />
                </AccordionItem>
                {product.ingredients && (
                  <AccordionItem title="Ingredients">
                    <Paragraphs text={product.ingredients} />
                  </AccordionItem>
                )}
                {benefits.length > 0 && (
                  <AccordionItem title="Benefits">
                    <ul className="list-disc space-y-1 pl-5">
                      {benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </AccordionItem>
                )}
                {product.howToUse && (
                  <AccordionItem title="How to Use">
                    <Paragraphs text={product.howToUse} />
                  </AccordionItem>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {keyIngredients.length > 0 && (
        <section className="bg-cream py-16 md:py-24">
          <Container>
            <FadeIn>
              <SectionHeading
                eyebrow="Pure Ingredients"
                title="What's inside"
                intro={`The natural ingredients that go into ${product.name}, and why we chose them.`}
              />
            </FadeIn>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {keyIngredients.map((ing, i) => (
                <li key={ing.slug}>
                  <FadeIn delay={(i % 3) * 0.06} className="h-full">
                    <IngredientCard ingredient={ing} showFoundIn={false} />
                  </FadeIn>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <ButtonLink href="/ingredients" variant="outline-dark">
                Our Ingredient Guide
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {product.faqs.length > 0 && (
        <section className="py-12 md:py-16">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="Questions" title="Product FAQ" />
            <div className="border-t border-black/10">
              {product.faqs.map((f) => (
                <AccordionItem key={f.q} title={f.q}>
                  {f.a}
                </AccordionItem>
              ))}
            </div>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-off-white py-16 md:py-24">
          <Container>
            <FadeIn>
              <SectionHeading eyebrow="Discover" title="You May Also Like" />
              <ProductGrid products={related} />
            </FadeIn>
          </Container>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
