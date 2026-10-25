"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; message: string; tone: "success" | "error" };

const EVENT = "hp:toast";

export function toast(message: string, tone: Toast["tone"] = "success") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, tone } }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { message, tone } = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, tone }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
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
            "pointer-events-auto flex items-center gap-3 border bg-black px-5 py-3 text-sm text-white shadow-xl",
            t.tone === "success" ? "border-gold/50" : "border-red-500/60",
          )}
        >
          {t.tone === "success" ? (
            <Check aria-hidden className="size-4 text-gold" />
          ) : (
            <X aria-hidden className="size-4 text-red-400" />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
