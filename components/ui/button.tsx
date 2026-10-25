import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline-light" | "outline-dark" | "dark" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-black hover:bg-[#d8b465]",
  "outline-light": "border border-white/40 text-white hover:border-gold hover:text-gold",
  "outline-dark": "border border-black/80 text-black hover:border-gold-dark hover:text-gold-dark",
  dark: "bg-black text-white hover:bg-charcoal",
  ghost: "text-black underline-offset-4 hover:text-gold-dark hover:underline",
};

export function buttonClass(variant: Variant = "gold", className?: string) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant = "gold",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "gold",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
