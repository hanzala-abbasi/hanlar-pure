import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, ExternalLink, Plus, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import { formatPrice } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { statusLabels, type ProductStatusValue } from "@/lib/validations";

export const metadata: Metadata = { title: "Overview" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
const statusColors: Record<ProductStatusValue, string> = {
  ACTIVE: "bg-emerald-600",
  OUT_OF_STOCK: "bg-amber-500",
  DRAFT: "bg-black/30",
  ARCHIVED: "bg-black/10",
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export default async function AdminOverviewPage() {
  await requireAdmin();
  const weekAgo = daysAgo(7);

  const [products, totalMessages, unreadMessages, weekMessages, recentMessages, settings] = await Promise.all([
    prisma.product.findMany({
      include: { images: { orderBy: { position: "asc" }, take: 1 }, _count: { select: { images: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    getSiteSettings(),
  ]);
  const posts = getAllPosts();

  const byStatus = Object.fromEntries(
    (Object.keys(statusLabels) as ProductStatusValue[]).map((s) => [s, products.filter((p) => p.status === s).length]),
  ) as Record<ProductStatusValue, number>;
  const live = products.filter((p) => p.status === "ACTIVE" || p.status === "OUT_OF_STOCK");
  const featuredLive = live.filter((p) => p.featured);
  const avgPrice = live.length ? Math.round(live.reduce((s, p) => s + p.price, 0) / live.length) : 0;

  // Things the owner should fix, most important first.
  const attention = [
    ...live.filter((p) => p._count.images === 0).map((p) => ({ p, issue: "Visible in the shop but has no images" })),
    ...live.filter((p) => p.status === "OUT_OF_STOCK").map((p) => ({ p, issue: "Marked out of stock" })),
    ...live
      .filter((p) => !p.ingredients || !p.howToUse)
      .map((p) => ({ p, issue: `Missing ${[!p.ingredients && "ingredients", !p.howToUse && "how to use"].filter(Boolean).join(" and ")}` })),
    ...products.filter((p) => p.status === "DRAFT").map((p) => ({ p, issue: "Draft: not visible in the shop yet" })),
  ];

  const isProd = process.env.NODE_ENV === "production";
  const checklist = [
    { done: settings.saved, label: "Save your contact details and social links", href: "/admin/settings" },
    {
      done: settings.whatsappNumber !== "923000000000",
      label: "Set your real WhatsApp number (orders are sent here)",
      href: "/admin/settings",
    },
    { done: live.length > 0, label: "Publish at least one product", href: "/admin/products" },
    { done: featuredLive.length > 0, label: "Feature products on the home page", href: "/admin/products" },
    {
      done: !!process.env.CLOUDINARY_CLOUD_NAME,
      label: "Connect Cloudinary for image uploads (CLOUDINARY_* env vars)",
    },
    { done: !!process.env.RESEND_API_KEY && !!process.env.CONTACT_TO_EMAIL, label: "Connect Resend so contact messages are emailed to you" },
    {
      done: !siteConfig.url.includes("localhost") || !isProd,
      label: "Set NEXT_PUBLIC_SITE_URL to your domain",
    },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const stats = [
    { label: "Live products", value: byStatus.ACTIVE, sub: `${byStatus.OUT_OF_STOCK} out of stock`, href: "/admin/products" },
    { label: "Featured on home", value: featuredLive.length, sub: "Up to 4 are shown", href: "/admin/products" },
    { label: "Unread messages", value: unreadMessages, sub: `${weekMessages} in the last 7 days · ${totalMessages} total`, href: "/admin/messages?filter=unread" },
    { label: "Average price", value: formatPrice(avgPrice), sub: `${posts.length} blog posts published`, href: "/admin/products" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Overview</h1>
          <p className="mt-1 text-sm text-muted">A snapshot of your store.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/settings" className={buttonClass("outline-dark", "px-4")}>
            <Settings aria-hidden className="size-4" /> Settings
          </Link>
          <Link href="/admin/products/new" className={buttonClass("dark", "px-4")}>
            <Plus aria-hidden className="size-4" /> Add product
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">{s.label}</p>
            <p className="mt-2 font-serif text-4xl">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Catalog status */}
        <Panel title="Catalog" action={{ href: "/admin/products", label: "All products" }}>
          <p className="text-sm text-muted">{products.length} products in total</p>
          {products.length > 0 && (
            <div className="mt-4 flex h-3 overflow-hidden bg-off-white" role="img" aria-label="Products by status">
              {(Object.keys(byStatus) as ProductStatusValue[]).map((s) =>
                byStatus[s] ? (
                  <div key={s} className={statusColors[s]} style={{ width: `${(byStatus[s] / products.length) * 100}%` }} />
                ) : null,
              )}
            </div>
          )}
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {(Object.keys(byStatus) as ProductStatusValue[]).map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span aria-hidden className={`size-2.5 rounded-full ${statusColors[s]}`} />
                {statusLabels[s]} <span className="font-medium">{byStatus[s]}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 mb-3 text-xs uppercase tracking-[0.15em] text-muted">Recently updated</h3>
          <ul className="divide-y divide-black/5">
            {products.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <div className="relative size-10 shrink-0 overflow-hidden bg-off-white">
                  {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-medium hover:text-gold-dark">
                    {p.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {statusLabels[p.status]} · {formatPrice(p.price)} · {dateFormat.format(p.updatedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Setup checklist */}
        <Panel title={`Launch checklist (${doneCount}/${checklist.length})`}>
          <div className="mb-4 h-1.5 bg-off-white">
            <div className="h-full bg-gold" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
          </div>
          <ul className="space-y-3 text-sm">
            {checklist.map((c) => (
              <li key={c.label} className="flex gap-2.5">
                {c.done ? (
                  <CheckCircle2 aria-label="Done" className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                ) : (
                  <Circle aria-label="To do" className="mt-0.5 size-4 shrink-0 text-black/30" />
                )}
                {c.href && !c.done ? (
                  <Link href={c.href} className="underline-offset-4 hover:text-gold-dark hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span className={c.done ? "text-muted line-through" : undefined}>{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Needs attention */}
        <Panel title="Needs attention">
          {attention.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted">
              <CheckCircle2 aria-hidden className="size-4 text-emerald-600" /> Everything looks good.
            </p>
          ) : (
            <ul className="divide-y divide-black/5">
              {attention.slice(0, 8).map(({ p, issue }, i) => (
                <li key={`${p.id}-${i}`} className="flex items-start gap-2.5 py-2.5 text-sm">
                  <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <div>
                    <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-gold-dark">
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted">{issue}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Recent messages */}
        <Panel title="Recent messages" action={{ href: "/admin/messages", label: "Inbox" }}>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {recentMessages.map((m) => (
                <li key={m.id} className="py-2.5 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {!m.read && <span aria-label="Unread" className="mr-2 inline-block size-2 rounded-full bg-gold" />}
                      {m.name}
                    </p>
                    <p className="shrink-0 text-xs text-muted">{dateFormat.format(m.createdAt)}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Current contact details */}
      <Panel title="Contact details on the website" action={{ href: "/admin/settings", label: "Edit" }} className="mt-6">
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["WhatsApp", `+${settings.whatsappNumber}`],
            ["Phone", settings.phone],
            ["Email", settings.email],
            ["Address", settings.address],
            ["Instagram", settings.social.instagram || "Hidden"],
            ["Facebook", settings.social.facebook || "Hidden"],
            ["TikTok", settings.social.tiktok || "Hidden"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-xs uppercase tracking-[0.15em] text-muted">{k}</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/"
          target="_blank"
          className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] hover:text-gold-dark"
        >
          <ExternalLink aria-hidden className="size-3.5" /> View website
        </Link>
      </Panel>
    </>
  );
}

function Panel({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`bg-white p-5 shadow-sm sm:p-6 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-muted hover:text-gold-dark"
          >
            {action.label} <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
