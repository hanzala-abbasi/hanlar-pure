"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteBanner, importDefaultBanners, setBannerActive } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function BannerActiveToggle({ id, active, title }: { id: string; active: boolean; title: string }) {
  const [value, setValue] = useState(active);
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={value}
      aria-label={`Show on home page: ${title}`}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50",
        value ? "text-emerald-700" : "text-black/40 hover:text-black/70",
      )}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(async () => {
          const res = await setBannerActive(id, next);
          if (res.ok) toast(next ? "Banner is now live" : "Banner hidden");
          else {
            setValue(!next);
            toast(res.error, "error");
          }
        });
      }}
    >
      {value ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}
      {value ? "Live" : "Hidden"}
    </button>
  );
}

export function BannerDeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Delete ${title}`}
      title="Delete"
      className="p-2 text-muted transition-colors hover:text-red-700 disabled:opacity-50"
      onClick={() => {
        if (!confirm(`Delete the banner "${title}"? This cannot be undone.`)) return;
        startTransition(async () => {
          const res = await deleteBanner(id);
          toast(res.ok ? "Banner deleted" : res.error, res.ok ? undefined : "error");
        });
      }}
    >
      <Trash2 className="size-4" />
    </button>
  );
}

export function ImportDefaultBannersButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="outline-dark"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await importDefaultBanners();
          toast(res.ok ? "Launch banners imported. You can now edit them." : res.error, res.ok ? undefined : "error");
        })
      }
    >
      {pending ? "Importing..." : "Edit the launch banners"}
    </Button>
  );
}
