import Link from "next/link";
import { ritual } from "@/config/content";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

export function Ritual() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="The HANLAR PURE Ritual"
            title="Oil. Cleanse. Shine."
            intro="Our Hair Oil and Signature Black Shampoo are made to work together, the way hair oiling and herbal washing always have."
          />
        </FadeIn>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {ritual.map((r, i) => (
            <li key={r.step}>
              <FadeIn delay={i * 0.08} className="h-full border-t border-gold pt-8">
                <p className="font-serif text-5xl text-gold-dark">{r.step}</p>
                <h3 className="mt-3 font-serif text-3xl">{r.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{r.text}</p>
                <Link
                  href={r.product.href}
                  className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-black underline decoration-gold underline-offset-8 transition-colors hover:text-gold-dark"
                >
                  {r.product.label}
                </Link>
              </FadeIn>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
