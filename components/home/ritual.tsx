import Image from "next/image";
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
        <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
          {ritual.map((r, i) => (
            <li key={r.step}>
              <FadeIn delay={i * 0.08} className="h-full">
                <div className="group relative aspect-[4/3] overflow-hidden bg-off-white md:aspect-[4/5]">
                  <Image
                    src={r.image.src}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-4 left-4 bg-black/80 px-3 py-1 font-serif text-2xl text-gold">
                    {r.step}
                  </span>
                </div>
                <div className="border-b border-gold pt-6 pb-8">
                  <h3 className="font-serif text-3xl">{r.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{r.text}</p>
                  <Link
                    href={r.product.href}
                    className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-black underline decoration-gold underline-offset-8 transition-colors hover:text-gold-dark"
                  >
                    {r.product.label}
                  </Link>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
