import Image from "next/image";
import { lifestyleGallery } from "@/config/content";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeading } from "@/components/ui/section-heading";

/** Five lifestyle shots: a tall feature image flanked by a 2x2 grid on desktop. */
export function LifestyleGallery({ instagramUrl }: { instagramUrl?: string }) {
  const [feature, ...rest] = lifestyleGallery;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="At Home with HANLAR PURE"
            title="Part of your everyday ritual"
            intro="From the vanity to the bathroom shelf, made to be used and loved every day."
          />
        </FadeIn>
        <FadeIn className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          <div className="relative col-span-2 row-span-2 aspect-[4/5] overflow-hidden md:aspect-auto">
            <Image src={feature.src} alt={feature.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          {rest.map((img) => (
            <div key={img.src} className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
            </div>
          ))}
        </FadeIn>
        {instagramUrl && (
          <p className="mt-10 text-center">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-black underline decoration-gold underline-offset-8 transition-colors hover:text-gold-dark"
            >
              Follow us on Instagram
            </a>
          </p>
        )}
      </Container>
    </section>
  );
}
