import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { MessageActions, MarkAllRead } from "@/components/admin/message-actions";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export const metadata: Metadata = { title: "Messages" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

/** Convert a local Pakistani number (03xx...) to WhatsApp's international format. */
function toWhatsApp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  await requireAdmin();
  const { filter } = await searchParams;
  const unreadOnly = filter === "unread";

  const [messages, total, unread] = await Promise.all([
    prisma.contactMessage.findMany({
      where: unreadOnly ? { read: false } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const tabs = [
    { href: "/admin/messages", label: `All (${total})`, active: !unreadOnly },
    { href: "/admin/messages?filter=unread", label: `Unread (${unread})`, active: unreadOnly },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Messages</h1>
          <p className="mt-1 text-sm text-muted">Sent from the Contact page form.</p>
        </div>
        {unread > 0 && <MarkAllRead />}
      </div>

      <div className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={t.active ? "page" : undefined}
            className={cn(
              "border px-3 py-1.5 text-xs uppercase tracking-[0.15em]",
              t.active ? "border-black bg-black text-white" : "border-black/15 bg-white hover:border-black/40",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {messages.length === 0 ? (
        <p className="mt-6 bg-white p-10 text-center text-muted">
          {unreadOnly ? "No unread messages." : "No messages yet."}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn("bg-white p-5 shadow-sm", !m.read && "border-l-4 border-gold")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {m.name}
                    {!m.read && (
                      <span className="ml-2 bg-gold/20 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-gold-dark">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{dateFormat.format(m.createdAt)}</p>
                </div>
                <MessageActions id={m.id} read={m.read} name={m.name} />
              </div>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-gold-dark">
                  <Mail aria-hidden className="size-3.5" /> {m.email}
                </a>
                {m.phone && (
                  <>
                    <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-gold-dark">
                      <Phone aria-hidden className="size-3.5" /> {m.phone}
                    </a>
                    <a
                      href={whatsappLink(toWhatsApp(m.phone))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-gold-dark"
                    >
                      <WhatsAppIcon className="size-3.5" /> Reply on WhatsApp
                    </a>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
