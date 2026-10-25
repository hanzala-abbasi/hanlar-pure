import { formatPrice } from "@/lib/utils";

export type OrderLine = { name: string; size: string; price: number; quantity: number };

export function buildOrderMessage(lines: OrderLine[], total: number) {
  const items = lines.map(
    (l, i) => `${i + 1}. ${l.name} (${l.size}) x ${l.quantity} = ${formatPrice(l.price * l.quantity)}`,
  );
  return [
    "Hello HANLAR PURE, I would like to place an order:",
    "",
    ...items,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "Name:",
    "Delivery address:",
    "City:",
  ].join("\n");
}
