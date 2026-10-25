import Image from "next/image";
import { extractCount, oilCount } from "@/config/ingredients";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { LeafSprig } from "@/components/ui/leaf-ornament";

const highlights = ["Amla", "Reetha", "Shikakai", "Bhringraj", "Rosemary", "Argan Oil"];

export function Hero() {
  const stats = [
    { value: extractCount, label: "Botanical extracts" },
    { value: oilCount, label: "Oils & vitamins" },
    { value: "PK", label: "Made in Pakistan" },
  ];

  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Soft gold glow and botanical line art, as on the labels */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 size-[640px] -translate-y-1/2 translate-x-1/4 rounded-full bg-gold/10 blur-3xl"
      />
      <LeafSprig className="pointer-events-none absolute -bottom-6 -left-6 h-72 text-gold/25 md:h-96" />
      <LeafSprig className="pointer-events-none absolute top-20 right-4 hidden h-64 -scale-x-100 text-gold/20 lg:block" />

      <Container className="relative grid min-h-[100svh] items-center gap-12 pt-28 pb-16 md:grid-cols-2 md:pt-24">
        <FadeIn className="order-2 text-center md:order-1 md:text-left">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-gold">Pure Ingredients · Real Care</p>
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Nature&apos;s Care.
            <br />
            <span className="text-gold">Premium Hair.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-white/70 md:mx-0">
            Botanical shampoo and hair oil made with time-honoured ingredients from South Asian hair-care tradition,
            finished to a premium standard.
          </p>

          <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2 md:mx-0 md:justify-start">
            {highlights.map((h) => (
              <li key={h} className="border border-gold/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/75">
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <ButtonLink href="/shop">Shop Now</ButtonLink>
            <ButtonLink href="#ingredients" variant="outline-light">
              Explore Ingredients
            </ButtonLink>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6 text-center md:text-left">
            {stats.map((s) => (
              <div key={s.label} className="px-3 first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-3xl text-gold">{s.value}</dd>
                <dd aria-hidden className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* Two bottles in arched frames, the shampoo leading */}
        <div className="relative order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-md">
          <div className="relative ml-auto aspect-[4/5] w-[72%] overflow-hidden rounded-t-full border border-gold/30">
            <Image
              src="/images/products/signature-black-200-1.jpg"
              alt="HANLAR PURE Signature Black Shampoo, 200 ml"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 320px, 72vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-[-8%] left-0 aspect-[4/5] w-[48%] overflow-hidden rounded-t-full border border-gold/30 shadow-2xl shadow-black">
            <Image
              src="/images/products/hair-oil-1.jpg"
              alt="HANLAR PURE Hair Oil, 100 ml"
              fill
              loading="eager"
              sizes="(min-width: 768px) 215px, 48vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
