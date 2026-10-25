"use client";

import { useState } from "react";
import { ingredients, type ProductLine } from "@/config/ingredients";
import { IngredientCard } from "@/components/ingredients/ingredient-card";
import { cn } from "@/lib/utils";

const filters: { label: string; value: ProductLine | "All" }[] = [
  { label: "All Ingredients", value: "All" },
  { label: "In the Shampoo", value: "Shampoo" },
  { label: "In the Hair Oil", value: "Hair Oil" },
];

/** Ingredient grid with a product filter. Shows a limited set when `limit` is passed. */
export function IngredientExplorer({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<ProductLine | "All">("All");
  const visible = ingredients.filter((i) => filter === "All" || i.foundIn.includes(filter)).slice(0, limit);

  return (
    <div>
      <div role="group" aria-label="Filter ingredients" className="mb-10 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300",
              filter === f.value
                ? "border-black bg-black text-white"
                : "border-black/20 text-black/70 hover:border-sage-dark hover:text-sage-dark",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((ing) => (
          <li key={ing.slug}>
            <IngredientCard ingredient={ing} />
          </li>
        ))}
      </ul>
    </div>
  );
}
