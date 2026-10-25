import { Cherry, Droplet, Flower2, Leaf, Nut, Sprout, Sun, Wheat } from "lucide-react";
import type { Ingredient, IngredientIcon } from "@/config/ingredients";
import { cn } from "@/lib/utils";

const icons: Record<IngredientIcon, typeof Leaf> = {
  fruit: Cherry,
  leaf: Leaf,
  flower: Flower2,
  seed: Wheat,
  drop: Droplet,
  sprout: Sprout,
  nut: Nut,
  sun: Sun,
};

export function IngredientIconBadge({ icon, className }: { icon: IngredientIcon; className?: string }) {
  const Icon = icons[icon];
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full border border-sage/30 bg-sage/10 text-sage-dark",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.4} />
    </span>
  );
}

export function IngredientCard({ ingredient, showFoundIn = true }: { ingredient: Ingredient; showFoundIn?: boolean }) {
  return (
    <article className="flex h-full flex-col border border-black/8 bg-white p-6 transition-colors duration-300 hover:border-sage/50">
      <div className="flex items-center gap-4">
        <IngredientIconBadge icon={ingredient.icon} />
        <div>
          <h3 className="font-serif text-2xl leading-tight">{ingredient.name}</h3>
          {ingredient.aka && <p className="text-xs uppercase tracking-[0.15em] text-muted">{ingredient.aka}</p>}
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{ingredient.note}</p>
      {showFoundIn && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Found in">
          {ingredient.foundIn.map((line) => (
            <li
              key={line}
              className="border border-gold/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold-dark"
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
