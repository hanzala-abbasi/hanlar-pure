"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMessage, markAllMessagesRead, setMessageRead } from "@/app/admin/actions";
import { toast } from "@/components/ui/toast";

export function MessageActions({ id, read, name }: { id: string; read: boolean; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        toast(success);
        router.refresh();
      } else toast(res.error ?? "Something went wrong", "error");
    });

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => setMessageRead(id, !read), read ? "Marked as unread" : "Marked as read")}
        className="px-2 py-1 text-xs uppercase tracking-[0.15em] text-muted hover:text-black disabled:opacity-50"
      >
        {read ? "Mark unread" : "Mark read"}
      </button>
      <button
        type="button"
        disabled={pending}
        aria-label={`Delete message from ${name}`}
        onClick={() => confirm(`Delete the message from ${name}?`) && run(() => deleteMessage(id), "Message deleted")}
        className="p-2 text-muted hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export function MarkAllRead() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markAllMessagesRead();
          toast("All messages marked as read");
          router.refresh();
        })
      }
      className="border border-black/15 bg-white px-3 py-2 text-xs uppercase tracking-[0.15em] hover:border-black/40 disabled:opacity-50"
    >
      Mark all as read
    </button>
  );
}
