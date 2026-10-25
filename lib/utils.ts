const priceFormatter = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return priceFormatter.format(amount);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Split a newline-separated text field into trimmed, non-empty lines. */
export function toLines(value: string | null | undefined) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
