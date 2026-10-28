import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { buttonClass } from "@/components/ui/button";
import { BannerActiveToggle, BannerDeleteButton, ImportDefaultBannersButton } from "@/components/admin/banner-row-actions";

export const metadata: Metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  await requireAdmin();
  let banners: Awaited<ReturnType<typeof prisma.banner.findMany>>;
  try {
    banners = await prisma.banner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  } catch {
    return (
      <>
        <h1 className="font-serif text-4xl">Banners</h1>
        <div className="mt-8 border-l-2 border-gold bg-white px-5 py-4 text-sm leading-relaxed">
          <p className="font-medium">The banner database table is not set up yet.</p>
          <p className="mt-2 text-muted">
            Stop the server, run <code>npx prisma migrate deploy</code> and <code>npx prisma generate</code>, then start it
            again. Until then the home page shows the launch banners.
          </p>
        </div>
      </>
    );
  }
  const live = banners.filter((b) => b.active).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Banners</h1>
          <p className="mt-1 text-sm text-muted">
            The home page hero. Live banners change automatically every few seconds, in the order below.
          </p>
        </div>
        <Link href="/admin/banners/new" className={buttonClass("dark")}>
          <Plus aria-hidden className="size-4" /> Add banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="mt-10 bg-white p-10 text-center">
          <p className="text-muted">
            No banners saved yet, so the home page shows the four launch banners. Import them to edit, reorder or hide
            them, or add your own.
          </p>
          <div className="mt-6">
            <ImportDefaultBannersButton />
          </div>
        </div>
      ) : (
        <>
          {live === 0 && (
            <p className="mt-6 border-l-2 border-gold bg-white px-4 py-3 text-sm">
              Every banner is hidden, so the home page has no hero. Set at least one banner to Live.
            </p>
          )}
          <ul className="mt-8 space-y-3">
            {banners.map((b) => (
              <li key={b.id} className={`flex items-center gap-4 bg-white p-3 shadow-sm ${b.active ? "" : "opacity-60"}`}>
                <div className="relative aspect-[16/9] w-32 shrink-0 overflow-hidden bg-off-white sm:w-44">
                  <Image src={b.imageUrl} alt="" fill sizes="176px" className="object-cover" style={{ objectPosition: `${b.focusX}% 50%` }} />
                </div>
                <div className="min-w-0 flex-1">
                  {b.eyebrow && <p className="truncate text-[10px] uppercase tracking-[0.2em] text-gold-dark">{b.eyebrow}</p>}
                  <Link href={`/admin/banners/${b.id}`} className="font-serif text-xl hover:text-gold-dark">
                    {b.title}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    Order {b.sortOrder} · Button: {b.ctaLabel} → {b.ctaHref}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                  <BannerActiveToggle id={b.id} active={b.active} title={b.title} />
                  <Link
                    href={`/admin/banners/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs uppercase tracking-[0.15em] hover:text-gold-dark"
                  >
                    <Pencil aria-hidden className="size-3.5" /> Edit
                  </Link>
                  <BannerDeleteButton id={b.id} title={b.title} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
