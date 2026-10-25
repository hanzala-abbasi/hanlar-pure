import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10 max-w-2xl md:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className={cn("mb-3 text-xs uppercase tracking-[0.3em]", dark ? "text-gold" : "text-gold-dark")}>
          {eyebrow}
        </p>
      )}
      <Tag className={cn("font-serif text-4xl leading-tight md:text-5xl", dark ? "text-white" : "text-black")}>
        {title}
      </Tag>
      {intro && <p className={cn("mt-4 leading-relaxed", dark ? "text-white/70" : "text-muted")}>{intro}</p>}
    </div>
  );
}
