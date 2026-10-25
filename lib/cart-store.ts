"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_QTY = 20;

// Only IDs and quantities are trusted. Name/price/image are a display snapshot that
// the cart page replaces with fresh data from the database.
export type CartItem = {
  productId: string;
  quantity: number;
  snapshot: { name: string; slug: string; price: number; size: string; image?: string };
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const clamp = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, snapshot: item.snapshot, quantity: clamp(i.quantity + quantity) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: clamp(quantity) }] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity) } : i)),
        })),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "hanlar-pure-cart", version: 1, skipHydration: true },
  ),
);

const subscribeHydration = (cb: () => void) => useCart.persist.onFinishHydration(cb);

/** True once the cart has been read from localStorage. Render cart-dependent UI only after this. */
export function useCartHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export function useCartCount() {
  return useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}
