"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { PublicBanner } from "@/lib/banners";
import { ButtonLink } from "@/components/ui/button";
import { useFocalPosition } from "@/components/ui/focal-image";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 6000;
const DESKTOP_SIZES = "(min-width: 1024px) 65vw, 100vw";

/** Banner image, with an optional portrait image for phones (art direction via <picture>). */
function BannerImage({ banner, priority }: { banner: PublicBanner; priority: boolean }) {
  const { ref, style } = useFocalPosition(banner.focusX);

  if (!banner.mobileImageUrl) {
    return (
      <Image
        ref={ref}
        src={banner.imageUrl}
        alt={banner.imageAlt}
        fill
        priority={priority}
        sizes={DESKTOP_SIZES}
        style={style}
        className="object-cover"
      />
    );
  }

  const common = { alt: banner.imageAlt, fill: true, priority, style, className: "object-cover" };
  const { props: desktop } = getImageProps({ ...common, src: banner.imageUrl, sizes: DESKTOP_SIZES });
  const { props: mobile } = getImageProps({ ...common, src: banner.mobileImageUrl, sizes: "100vw" });
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img {...mobile} ref={ref} />
    </picture>
  );
}

/**
 * Home hero: full-width banner with white-and-gold copy on a dark, blurred backdrop. Banners cross-fade
 * automatically (no buttons), pausing while hovered or when the visitor prefers reduced motion.
 */
export function Hero({ banners }: { banners: PublicBanner[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const count = banners.length;

  useEffect(() => {
    if (count < 2 || hovered || reduce) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [index, count, hovered, reduce]);

  if (count === 0) return null;

  // Text column: from the page container's left edge, 24rem wide. The sharp banner starts where it ends.
  const textLeft = "lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative bg-black text-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 lg:h-[clamp(560px,calc(100svh-4.5rem),860px)]">
        {banners.map((banner, i) => {
          const active = i === index;
          const Title = i === 0 ? "h1" : "h2";
          return (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
              className={cn("relative [grid-area:1/1]", active ? "z-10" : "pointer-events-none z-0")}
            >
              {/* Visuals: full width. Desktop shows a blurred, darkened copy edge to edge with the sharp banner on the right. */}
              <div
                className={cn(
                  "relative aspect-square overflow-hidden transition-opacity duration-1000 ease-out sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto",
                  active ? "opacity-100" : "opacity-0",
                )}
              >
                <div aria-hidden className="absolute inset-0 hidden lg:block">
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    fill
                    sizes="20vw"
                    className="scale-110 object-cover blur-2xl brightness-[0.45] saturate-[1.2]"
                  />
                </div>
                <div className="absolute inset-0 lg:left-[calc(max(2rem,calc((100vw-72rem)/2+2rem))+24rem)] lg:[mask-image:linear-gradient(to_right,transparent,black_9rem)]">
                  <div
                    className={cn(
                      "absolute inset-0 transition-transform duration-[7000ms] ease-out",
                      active && !reduce ? "scale-[1.04]" : "scale-100",
                    )}
                  >
                    <BannerImage banner={banner} priority={i === 0} />
                  </div>
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent lg:hidden" />
              </div>

              {/* Copy: below the image on phones, over the dark left side on desktop */}
              <div className={cn("relative px-5 pt-6 pb-16 sm:px-8 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[calc(max(2rem,calc((100vw-72rem)/2+2rem))+24rem)] lg:items-center lg:py-16 lg:pr-8", textLeft)}>
                <div
                  className={cn(
                    "max-w-md transition-all ease-out",
                    // The outgoing text leaves quickly; the new text arrives once it has gone, so they never overlap.
                    active ? "translate-y-0 opacity-100 delay-300 duration-700" : "translate-y-3 opacity-0 duration-300",
                  )}
                >
                  {banner.eyebrow && (
                    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-gold">{banner.eyebrow}</p>
                  )}
                  <Title className="font-serif text-4xl leading-[1.05] text-white sm:text-5xl">{banner.title}</Title>
                  {banner.subtitle && <p className="mt-5 leading-relaxed text-white/80">{banner.subtitle}</p>}
                  <ButtonLink href={banner.ctaHref} className="mt-8">
                    {banner.ctaLabel}
                  </ButtonLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress marks: decorative only, the banners change on their own */}
      {count > 1 && (
        <div aria-hidden className={cn("absolute bottom-6 left-5 z-20 flex gap-1.5 sm:left-8 lg:left-0", textLeft)}>
          {banners.map((b, i) => (
            <span
              key={b.id}
              className={cn("h-px transition-all duration-700", i === index ? "w-10 bg-gold" : "w-5 bg-white/30")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
