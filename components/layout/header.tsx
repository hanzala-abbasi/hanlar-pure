"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCartCount, useCartHydrated } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hydrated = useCartHydrated();
  const count = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !isHome || scrolled || open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
          solid ? "border-b border-white/10 bg-black" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.25em] text-white transition-colors hover:text-gold sm:text-2xl"
            onClick={() => setOpen(false)}
          >
            HANLAR <span className="text-gold">PURE</span>
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-5 lg:gap-8">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-xs uppercase tracking-[0.2em] transition-colors hover:text-gold",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100",
                      isActive(item.href) ? "text-gold after:scale-x-100" : "text-white/85",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/cart"
              className="relative p-2 text-white transition-colors hover:text-gold"
              aria-label={hydrated && count > 0 ? `Cart, ${count} items` : "Cart"}
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="p-2 text-white transition-colors hover:text-gold md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Mobile" className="h-[calc(100dvh-4.5rem)] bg-black md:hidden">
            <ul className="flex flex-col items-center gap-2 pt-12">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block px-6 py-3 font-serif text-3xl transition-colors hover:text-gold",
                      isActive(item.href) ? "text-gold" : "text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      {/* Inner pages start below the fixed header; the home hero sits underneath it. */}
      {!isHome && <div aria-hidden className="h-18 bg-black" />}
    </>
  );
}
