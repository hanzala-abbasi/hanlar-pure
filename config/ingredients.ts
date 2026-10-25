// Ingredient glossary, taken from the HANLAR PURE product labels.
// Notes describe traditional use only: keep them free of medical claims or guaranteed results.

export type IngredientIcon = "fruit" | "leaf" | "flower" | "seed" | "drop" | "sprout" | "nut" | "sun";
export type ProductLine = "Shampoo" | "Hair Oil";

export type Ingredient = {
  slug: string;
  name: string;
  /** Local / common name shown under the ingredient name. */
  aka?: string;
  kind: "extract" | "oil";
  icon: IngredientIcon;
  note: string;
  foundIn: ProductLine[];
};

export const ingredients: Ingredient[] = [
  {
    slug: "amla",
    name: "Amla",
    aka: "Indian gooseberry",
    kind: "extract",
    icon: "fruit",
    note: "A cornerstone of South Asian hair care for generations, prized for conditioning hair and bringing out its natural shine.",
    foundIn: ["Shampoo", "Hair Oil"],
  },
  {
    slug: "bhringraj",
    name: "Bhringraj",
    aka: "False daisy",
    kind: "extract",
    icon: "flower",
    note: "Known in Ayurveda as the “king of hair”, this herb is traditionally massaged into the scalp as part of a hair-oiling ritual.",
    foundIn: ["Shampoo", "Hair Oil"],
  },
  {
    slug: "rosemary",
    name: "Rosemary",
    kind: "extract",
    icon: "sprout",
    note: "An aromatic herb loved in scalp-care routines for its fresh, invigorating feel.",
    foundIn: ["Shampoo", "Hair Oil"],
  },
  {
    slug: "fenugreek",
    name: "Fenugreek",
    aka: "Methi",
    kind: "extract",
    icon: "seed",
    note: "Seeds rich in natural mucilage, traditionally used to soften hair and leave it smooth and manageable.",
    foundIn: ["Shampoo", "Hair Oil"],
  },
  {
    slug: "aloe-vera",
    name: "Aloe Vera",
    kind: "extract",
    icon: "leaf",
    note: "The soothing gel of the aloe leaf, used to help hair and scalp feel hydrated and comfortable.",
    // TODO(content): confirm aloe vera is in the Hair Oil (it appears on the back label's ingredient line).
    foundIn: ["Shampoo", "Hair Oil"],
  },
  {
    slug: "reetha",
    name: "Reetha",
    aka: "Soapnut",
    kind: "extract",
    icon: "fruit",
    note: "Soapnut berries foam naturally in water. For centuries they were the original way to wash hair gently.",
    foundIn: ["Shampoo"],
  },
  {
    slug: "shikakai",
    name: "Shikakai",
    aka: "“Fruit for hair”",
    kind: "extract",
    icon: "seed",
    note: "Pods traditionally paired with reetha for a mild cleanse that leaves hair soft rather than stripped.",
    foundIn: ["Shampoo"],
  },
  {
    slug: "neem",
    name: "Neem",
    kind: "extract",
    icon: "leaf",
    note: "Leaves valued across the subcontinent for keeping the scalp feeling clean and fresh.",
    foundIn: ["Shampoo"],
  },
  {
    slug: "hibiscus",
    name: "Hibiscus",
    aka: "Gurhal",
    kind: "extract",
    icon: "flower",
    note: "Flowers and leaves traditionally used to condition hair and help it feel soft and smooth.",
    foundIn: ["Shampoo"],
  },
  {
    slug: "coconut-oil",
    name: "Coconut Oil",
    kind: "oil",
    icon: "nut",
    note: "The classic hair-oiling base: light, easily absorbed and deeply nourishing for the lengths.",
    foundIn: ["Hair Oil"],
  },
  {
    slug: "almond-oil",
    name: "Almond Oil",
    aka: "Badam",
    kind: "oil",
    icon: "nut",
    note: "A lightweight oil that helps soften hair and adds a healthy-looking gloss.",
    foundIn: ["Hair Oil"],
  },
  {
    slug: "castor-oil",
    name: "Castor Oil",
    kind: "oil",
    icon: "drop",
    note: "A rich, thick oil traditionally used to condition the scalp and give hair a fuller, stronger feel.",
    foundIn: ["Hair Oil"],
  },
  {
    slug: "olive-oil",
    name: "Olive Oil",
    kind: "oil",
    icon: "drop",
    note: "Conditions dry ends and helps tame frizz for smoother-looking hair.",
    foundIn: ["Hair Oil"],
  },
  {
    slug: "argan-oil",
    name: "Argan Oil",
    kind: "oil",
    icon: "drop",
    note: "Morocco’s “liquid gold”: adds silkiness and shine without feeling heavy.",
    foundIn: ["Hair Oil"],
  },
  {
    slug: "vitamin-e",
    name: "Vitamin E",
    kind: "oil",
    icon: "sun",
    note: "An antioxidant vitamin that helps keep the oil blend fresh and conditions hair.",
    foundIn: ["Hair Oil"],
  },
];

export const extractCount = ingredients.filter((i) => i.kind === "extract").length;
export const oilCount = ingredients.filter((i) => i.kind === "oil").length;

/** Glossary entries mentioned in a product's free-text ingredient list, in label order. */
export function matchIngredients(text: string | null | undefined): Ingredient[] {
  const haystack = (text ?? "").toLowerCase();
  return ingredients
    .map((ing) => ({ ing, at: haystack.indexOf(ing.name.toLowerCase().replace(/ oil$/, "")) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at)
    .map((m) => m.ing);
}
