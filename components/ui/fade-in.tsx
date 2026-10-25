"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/** Subtle fade-up on scroll, triggered once. Instant for prefers-reduced-motion. */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  // Render the same element on server and client (a different tree for reduced motion causes a hydration
  // mismatch that leaves content hidden); reduced motion just makes the reveal instant.
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
