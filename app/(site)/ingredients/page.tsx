import type { Metadata } from "next";
import Image from "next/image";
import { ingredients, type ProductLine } from "@/config/ingredients";
import { IngredientCard } from "@/components/ingredients/ingredient-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { LeafDivider } from "@/components/ui/leaf-ornament";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Our Ingredients",
  description:
    "The natural botanicals and premium oils in HANLAR PURE hair care: amla, reetha, shikakai, bhringraj, rosemary, neem, hibiscus, argan oil and more.",
  alternates: { canonical: "/ingredients" },
};

const labels: { line: ProductLine; title: string; href: string; image: string; alt: string }[] = [
  {
    line: "Shampoo",
    title: "Signature Black Shampoo",
    href: "/shop/signature-black-shampoo",
    image: "/images/products/signature-black-200-2.jpg",
    alt: "Signature Black Shampoo side label listing its pure ingredients",
  },
  {
    line: "Hair Oil",
    title: "Hair Oil",
    href: "/shop/hair-oil",
    image: "/images/products/hair-oil-2.jpg",
    alt: "Hair Oil label listing its botanical extracts and premium oils",
  },
];

export default function IngredientsPage() {
  const extracts = ingredients.filter((i) => i.kind === "extract");
  const oils = ingredients.filter((i) => i.kind === "oil");

  return (
    <>
      <PageHeader
        eyebrow="Pure Ingredients · Real Care"
        title="Our Ingredients"
        intro="Time-honoured botanicals and premium oils. Every one of them is printed on the label."
      />

      <section className="py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <FadeIn>
            <p className="font-serif text-3xl leading-snug md:text-4xl">
              For generations, hair across the subcontinent was washed with reetha and shikakai and oiled with amla and
              bhringraj. HANLAR PURE carries that tradition forward.
            </p>
            <LeafDivider className="mt-8 text-sage-dark" />
          </FadeIn>
        </Container>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow={`${extracts.length} Botanical Extracts`}
              title="From the garden"
              intro="Herbs, fruits, seeds and flowers with a long history in South Asian hair care."
            />
          </FadeIn>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {extracts.map((ing, i) => (
              <li key={ing.slug}>
                <FadeIn delay={(i % 3) * 0.06} className="h-full">
                  <IngredientCard ingredient={ing} />
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Premium Oils & Vitamin E"
              title="Nourishment you can feel"
              intro="The base of our Hair Oil: a blend of five oils and vitamin E for softness and shine."
            />
          </FadeIn>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {oils.map((ing, i) => (
              <li key={ing.slug}>
                <FadeIn delay={(i % 3) * 0.06} className="h-full">
                  <IngredientCard ingredient={ing} />
                </FadeIn>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <Container>
          <FadeIn>
            <SectionHeading dark eyebrow="Read the Label" title="What's in each bottle" />
          </FadeIn>
          <div className="grid gap-14 md:grid-cols-2">
            {labels.map((l) => {
              const list = ingredients.filter((i) => i.foundIn.includes(l.line));
              return (
                <FadeIn key={l.line} className="grid items-start gap-6 sm:grid-cols-[2fr_3fr]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/30">
                    <Image src={l.image} alt={l.alt} fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl text-gold">{l.title}</h3>
                    <ul className="mt-5 space-y-2 text-sm text-white/75">
                      {list.map((i) => (
                        <li key={i.slug} className="flex items-center gap-3 border-b border-white/10 pb-2">
                          <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                          {i.name}
                          {i.kind === "extract" && " Extract"}
                        </li>
                      ))}
                    </ul>
                    <ButtonLink href={l.href} variant="outline-light" className="mt-6">
                      View Product
                    </ButtonLink>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <p className="mx-auto mt-16 max-w-2xl text-center text-xs leading-relaxed text-white/50">
            For external use only. Avoid contact with eyes. If you have sensitive skin or known allergies, check the
            ingredient list and do a patch test first; if irritation occurs, discontinue use. Ingredient notes describe
            traditional use and are not medical advice.
          </p>
        </Container>
      </section>
    </>
  );
}
