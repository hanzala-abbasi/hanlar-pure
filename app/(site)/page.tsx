import Image from "next/image";
import { aboutTeaser, brandIntro, homeFaqs } from "@/config/content";
import { siteConfig } from "@/config/site";
import { getFeaturedProducts } from "@/lib/products";
import { getAllPosts, toMeta } from "@/lib/blog";
import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { IngredientsShowcase } from "@/components/home/ingredients-showcase";
import { Ritual } from "@/components/home/ritual";
import { ProductGrid } from "@/components/product/product-card";
import { PostCard } from "@/components/blog/post-card";
import { AccordionItem } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { LeafDivider } from "@/components/ui/leaf-ornament";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  const posts = getAllPosts().slice(0, 3).map(toMeta);

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
      <Hero />

      {/* Brand intro */}
      <section className="py-20 md:py-28">
        <Container>
          <FadeIn className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-dark">{siteConfig.name}</p>
            <p className="font-serif text-3xl leading-snug md:text-4xl">{brandIntro}</p>
            <LeafDivider className="mt-8 text-gold-dark" />
          </FadeIn>
        </Container>
      </section>

      {/* Featured products */}
      <section id="featured" className="scroll-mt-20 bg-off-white py-20 md:py-28">
        <Container>
          <FadeIn>
            <SectionHeading eyebrow="The Collection" title="Featured Products" />
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

      <Benefits />

      <Ritual />

      {/* About teaser */}
      <section className="bg-off-white py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <FadeIn className="relative aspect-[4/5] overflow-hidden bg-off-white">
            <Image
              src="/images/products/signature-black-200-4.jpg"
              alt="Back of the Signature Black Shampoo bottle: Pure Ingredients, Real Care"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </FadeIn>
          <FadeIn>
            <SectionHeading align="left" eyebrow="Our Story" title="Pure ingredients, real care" />
            <p className="-mt-4 leading-relaxed text-muted">{aboutTeaser}</p>
            <ButtonLink href="/about" variant="outline-dark" className="mt-8">
              Read Our Story
            </ButtonLink>
          </FadeIn>
        </Container>
      </section>

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28">
          <Container>
            <FadeIn>
              <SectionHeading eyebrow="Journal" title="Latest from the Blog" />
            </FadeIn>
            <div className="grid gap-12 md:grid-cols-3">
              {posts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.08}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

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
