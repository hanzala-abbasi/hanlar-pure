import { Container } from "@/components/ui/container";

/** Black title band used at the top of inner pages. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="bg-black pt-16 pb-14 text-white md:pt-20 md:pb-20">
      <Container className="text-center">
        {eyebrow && <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>}
        <h1 className="font-serif text-4xl md:text-6xl">{title}</h1>
        {intro && <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">{intro}</p>}
      </Container>
    </section>
  );
}
