import { Droplet, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { benefits } from "@/config/content";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = { leaf: Leaf, sparkles: Sparkles, droplet: Droplet, shield: ShieldCheck };

export function Benefits() {
  return (
    <section className="bg-black py-20 text-white md:py-28">
      <Container>
        <FadeIn>
          <SectionHeading dark eyebrow="Why HANLAR PURE" title="Rooted in nature, crafted with care" />
        </FadeIn>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => {
            const Icon = icons[b.icon];
            return (
              <FadeIn key={b.title} delay={i * 0.08} className="text-center">
                <div>
                  <span className="mx-auto mb-5 flex size-14 items-center justify-center border border-gold/40 text-gold">
                    <Icon aria-hidden className="size-6" strokeWidth={1.4} />
                  </span>
                  <h3 className="font-serif text-2xl">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{b.text}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
