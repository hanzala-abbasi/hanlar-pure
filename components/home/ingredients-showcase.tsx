import Image from "next/image";
import { IngredientExplorer } from "@/components/ingredients/ingredient-explorer";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { LeafDivider } from "@/components/ui/leaf-ornament";
import { SectionHeading } from "@/components/ui/section-heading";

export function IngredientsShowcase() {
  return (
    <section id="ingredients" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <Container>
        <div className="mb-16 grid items-center gap-10 md:grid-cols-[2fr_3fr] lg:gap-16">
          <FadeIn className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-full md:max-w-none">
            <Image
              src="/images/products/signature-black-200-2.jpg"
              alt="Signature Black Shampoo label listing its pure ingredients: amla, reetha, shikakai, bhringraj, neem, aloe vera, hibiscus and fenugreek extracts"
              fill
              sizes="(min-width: 768px) 40vw, 320px"
              className="object-cover"
            />
          </FadeIn>
          <FadeIn>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-sage-dark">Pure Ingredients</p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Nature&apos;s care, in every bottle</h2>
            <LeafDivider className="mt-6 justify-start text-sage-dark" />
            <p className="mt-6 leading-relaxed text-muted">
              Long before shelves were full of hair products, hair was washed with reetha and shikakai and oiled with
              amla and bhringraj. We start from those same botanicals, add premium oils such as argan, almond and castor,
              and print every ingredient on the label so you always know what you are using.
            </p>
            <ButtonLink href="/ingredients" variant="outline-dark" className="mt-8">
              Our Ingredient Guide
            </ButtonLink>
          </FadeIn>
        </div>

        <FadeIn>
          <SectionHeading eyebrow="What's Inside" title="Meet the botanicals" />
          <IngredientExplorer limit={6} />
        </FadeIn>
        <div className="mt-12 text-center">
          <ButtonLink href="/ingredients" variant="dark">
            See All Ingredients
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
