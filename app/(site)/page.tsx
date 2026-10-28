import { brandIntro, homeFaqs } from "@/config/content";
import { getActiveBanners } from "@/lib/banners";
import { getFeaturedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { IngredientsShowcase } from "@/components/home/ingredients-showcase";
import { Ritual } from "@/components/home/ritual";
import { LifestyleGallery } from "@/components/home/lifestyle-gallery";
import { ProductGrid } from "@/components/product/product-card";
import { AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function HomePage() {
  const [banners, featured, settings] = await Promise.all([
    getActiveBanners(),
    getFeaturedProducts(4),
    getSiteSettings(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Hero banners={banners} />

      {/* Brand intro */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="font-serif text-2xl leading-snug md:text-3xl">{brandIntro}</p>
          </FadeIn>
        </Container>
      </section>

      {/* Featured products */}
      <section id="featured" className="scroll-mt-20 pb-20 md:pb-28">
        <Container>
          <FadeIn>
            <SectionHeading eyebrow="The Collection" title="Our Products" />
          </FadeIn>
          {featured.length > 0 ? (
            <FadeIn>
              <ProductGrid products={featured} />
            </FadeIn>
          ) : (
            <p className="text-center text-muted">New products are coming soon.</p>
          )}
          <div className="mt-14 text-center">
            <ButtonLink href="/shop" variant="outline-dark">
              View All Products
            </ButtonLink>
          </div>
        </Container>
      </section>

      <IngredientsShowcase />

      <Ritual />

      <Benefits />

      <LifestyleGallery instagramUrl={settings.social.instagram || undefined} />

      {/* FAQ */}
      <section className="bg-off-white py-20 md:py-28">
        <Container className="max-w-3xl">
          <FadeIn>
            <SectionHeading eyebrow="Questions" title="Frequently Asked" />
          </FadeIn>
          <FadeIn>
            <div className="border-t border-black/10">
              {homeFaqs.map((f) => (
                <AccordionItem key={f.q} title={f.q}>
                  {f.a}
                </AccordionItem>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
