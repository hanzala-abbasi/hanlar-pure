"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { setProductFeatured } from "@/app/admin/actions";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function FeaturedToggle({ id, featured, name }: { id: string; featured: boolean; name: string }) {
  const [value, setValue] = useState(featured);
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={value}
      aria-label={`Featured: ${name}`}
      disabled={pending}
      className={cn("p-1.5 transition-colors disabled:opacity-50", value ? "text-gold-dark" : "text-black/25 hover:text-black/50")}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(async () => {
          const res = await setProductFeatured(id, next);
          if (res.ok) toast(next ? "Marked as featured" : "Removed from featured");
          else {
            setValue(!next);
            toast(res.error, "error");
          }
        });
      }}
    >
      <Star className="size-4" fill={value ? "currentColor" : "none"} />
    </button>
  );
}
