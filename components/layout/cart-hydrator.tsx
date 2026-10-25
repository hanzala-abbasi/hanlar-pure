"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Loads the persisted cart after mount (avoids hydration mismatches) and syncs across tabs. */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === useCart.persist.getOptions().name) useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
