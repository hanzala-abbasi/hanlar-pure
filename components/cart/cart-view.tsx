"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { getCartProducts } from "@/app/(site)/cart/actions";
import { whatsappLink } from "@/config/site";
import { useCart, useCartHydrated } from "@/lib/cart-store";
import { buildOrderMessage } from "@/lib/whatsapp-order";
import { formatPrice } from "@/lib/utils";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { WhatsAppIcon } from "@/components/ui/social-icons";

type FreshProduct = Awaited<ReturnType<typeof getCartProducts>>[number];

export function CartView({ whatsappNumber }: { whatsappNumber: string }) {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const [fresh, setFresh] = useState<Map<string, FreshProduct> | null>(null);

  // Re-fetch current prices and availability whenever the set of products changes.
  const idsKey = items
    .map((i) => i.productId)
    .sort()
    .join(",");
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const ids = idsKey ? idsKey.split(",") : [];
    getCartProducts(ids)
      .then((products) => {
        if (!cancelled) setFresh(new Map(products.map((p) => [p.id, p])));
      })
      .catch(() => {
        if (!cancelled) setFresh(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, idsKey]);

  const rows = useMemo(
    () =>
      items.map((item) => {
        const product = fresh?.get(item.productId);
        return {
          item,
          product,
          display: product ?? { ...item.snapshot, id: item.productId, inStock: false },
          available: !!product && product.inStock,
        };
      }),
    [items, fresh],
  );

  if (!hydrated || (items.length > 0 && !fresh)) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading cart">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse bg-off-white" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-serif text-3xl">Your cart is empty</p>
        <p className="mt-3 text-muted">Discover our collection and find your new favourite.</p>
        <ButtonLink href="/shop" className="mt-8">
          Continue Shopping
        </ButtonLink>
      </div>
    );
  }

  const orderable = rows.filter((r) => r.available && r.product);
  const total = orderable.reduce((sum, r) => sum + r.product!.price * r.item.quantity, 0);
  const message = buildOrderMessage(
    orderable.map((r) => ({
      name: r.product!.name,
      size: r.product!.size,
      price: r.product!.price,
      quantity: r.item.quantity,
    })),
    total,
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-black/10 border-y border-black/10">
        {rows.map(({ item, display, available, product }) => (
          <li key={item.productId} className="flex gap-4 py-6 sm:gap-6">
            <Link
              href={`/shop/${display.slug}`}
              className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-off-white sm:w-24"
            >
              {display.image && (
                <Image src={display.image} alt={display.name} fill sizes="96px" className="object-cover" />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <Link href={`/shop/${display.slug}`} className="font-serif text-xl hover:text-gold-dark">
                  {display.name}
                </Link>
                <p className="text-sm text-muted">{display.size}</p>
                {available ? (
                  <p className="mt-1 text-sm">{formatPrice(display.price)}</p>
                ) : (
                  <p className="mt-1 text-sm text-red-700">
                    {product ? "Out of stock" : "No longer available"} - not included in your order
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {available && (
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => setQuantity(item.productId, q)}
                    label={`Quantity for ${display.name}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => remove(item.productId)}
                  className="flex size-12 items-center justify-center text-muted transition-colors hover:text-red-700"
                  aria-label={`Remove ${display.name} from cart`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit bg-off-white p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-2xl">Order Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery</dt>
            <dd className="text-right">Confirmed on WhatsApp</dd>
          </div>
          <div className="flex justify-between border-t border-black/10 pt-3 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        {orderable.length > 0 ? (
          <a
            href={whatsappLink(whatsappNumber, message)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("gold", "mt-6 w-full")}
          >
            <WhatsAppIcon className="size-4" /> Order via WhatsApp
          </a>
        ) : (
          <p className="mt-6 text-sm text-red-700">None of the items in your cart can be ordered right now.</p>
        )}
        <p className="mt-4 text-xs leading-relaxed text-muted">
          We will confirm your order and delivery details on WhatsApp. No payment is taken on this website.
        </p>
        <Link href="/shop" className="mt-6 block text-center text-xs uppercase tracking-[0.2em] hover:text-gold-dark">
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
