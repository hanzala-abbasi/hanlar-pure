import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const unread = await prisma.contactMessage.count({ where: { read: false } });
  return (
    <>
      <header className="bg-black text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/admin" className="font-serif text-lg tracking-[0.2em]">
            HANLAR <span className="text-gold">PURE</span>
            <span className="ml-3 hidden text-xs tracking-[0.2em] text-white/60 sm:inline">ADMIN</span>
          </Link>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
            <Link href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 hover:text-gold">
              <ExternalLink aria-hidden className="size-3.5" /> <span className="hidden sm:inline">View site</span>
            </Link>
            <form action={logout}>
              <button type="submit" className="flex items-center gap-1.5 px-3 py-2 uppercase hover:text-gold">
                <LogOut aria-hidden className="size-3.5" /> Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav unread={unread} />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </>
  );
}
