"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryHorizontal, LayoutDashboard, Mail, Package, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/banners", label: "Banners", Icon: GalleryHorizontal },
  { href: "/admin/messages", label: "Messages", Icon: Mail },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav aria-label="Admin" className="border-b border-black/10 bg-white">
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-3.5 text-xs uppercase tracking-[0.15em] whitespace-nowrap transition-colors",
                isActive(href) ? "border-gold-dark text-black" : "border-transparent text-muted hover:text-black",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
              {href === "/admin/messages" && unread > 0 && (
                <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] leading-none font-semibold text-black">
                  <span className="sr-only">, unread: </span>
                  {unread}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
