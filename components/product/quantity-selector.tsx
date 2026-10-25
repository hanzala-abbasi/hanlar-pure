"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/cart-store";

export function QuantitySelector({
  value,
  onChange,
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-12 items-center border border-black/20">
      <button
        type="button"
        className="flex h-full w-11 items-center justify-center transition-colors hover:text-gold-dark disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="flex h-full w-11 items-center justify-center transition-colors hover:text-gold-dark disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
