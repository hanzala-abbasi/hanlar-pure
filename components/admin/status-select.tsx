"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { statusLabels, type ProductStatusValue } from "@/lib/validations";
import { setProductStatus } from "@/app/admin/actions";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const tones: Record<ProductStatusValue, string> = {
  ACTIVE: "border-emerald-600/40 text-emerald-800",
  OUT_OF_STOCK: "border-amber-600/40 text-amber-800",
  DRAFT: "border-black/20 text-muted",
  ARCHIVED: "border-black/20 text-muted",
};

export function StatusSelect({ id, status, name }: { id: string; status: ProductStatusValue; name: string }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      aria-label={`Status for ${name}`}
      value={value}
      disabled={pending}
      className={cn("border bg-white px-2 py-1.5 text-xs disabled:opacity-50", tones[value])}
      onChange={(e) => {
        const next = e.target.value as ProductStatusValue;
        if (next === "ARCHIVED" && !confirm(`Archive "${name}"? It will be hidden from the shop.`)) return;
        const prev = value;
        setValue(next);
        startTransition(async () => {
          const res = await setProductStatus(id, next);
          if (res.ok) {
            toast(`Status set to ${statusLabels[next]}`);
            router.refresh();
          } else {
            setValue(prev);
            toast(res.error, "error");
          }
        });
      }}
    >
      {Object.entries(statusLabels).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
