import type { Metadata } from "next";
import Image from "next/image";
import { about } from "@/config/content";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind HANLAR PURE: natural botanicals and premium oils, made in Pakistan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const pillars = [
    { title: "Our Vision", text: about.vision },
    { title: "Our Mission", text: about.mission },
    { title: "Our Approach", text: about.approach },
  ];

  return (
    <>
      <PageHeader eyebrow="About HANLAR PURE" title="Our Story" intro="Nature's Care. Premium Hair." />

      <section className="py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <FadeIn className="relative aspect-[4/5] overflow-hidden bg-off-white">
            <Image
              src="/images/lifestyle/hair-oil-vanity.jpg"
              alt="HANLAR PURE Hair Oil on travertine with amla, almonds, rosemary and a dish of oil"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </FadeIn>
          <FadeIn>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-dark">Where it began</p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Rooted in tradition, made with intention</h2>
            <p className="mt-6 leading-relaxed text-muted">{about.story}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <Container className="grid gap-12 md:grid-cols-3">
          {pillars.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.08} className="border-t border-gold/40 pt-8">
              <h2 className="font-serif text-3xl text-gold">{p.title}</h2>
              <p className="mt-4 leading-relaxed text-white/70">{p.text}</p>
            </FadeIn>
          ))}
        </Container>
      </section>

      <section className="py-20 text-center md:py-28">
        <Container>
          <FadeIn>
            <h2 className="font-serif text-4xl">Discover the collection</h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/shop">Shop Now</ButtonLink>
              <ButtonLink href="/ingredients" variant="outline-dark">
                Explore Ingredients
              </ButtonLink>
            </div>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
