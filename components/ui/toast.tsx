"use client";

import { useEffect, useState } from "react";
import { Check, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; message: string; tone: "success" | "error" | "info"; duration: number };

const EVENT = "hp:toast";

export function toast(message: string, tone: Toast["tone"] = "success", duration = 3500) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, tone, duration } }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { message, tone, duration = 3500 } = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, tone, duration }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            "pointer-events-auto flex max-w-md items-center gap-3 border bg-black px-5 py-3 text-sm text-white shadow-xl",
            t.tone === "error" ? "border-red-500/60" : "border-gold/50",
          )}
        >
          {t.tone === "success" && <Check aria-hidden className="size-4 shrink-0 text-gold" />}
          {t.tone === "info" && <Info aria-hidden className="size-4 shrink-0 text-gold" />}
          {t.tone === "error" && <X aria-hidden className="size-4 shrink-0 text-red-400" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
