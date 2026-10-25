"use client";

import { useState } from "react";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { AddToCartButton, type CartProductInfo } from "@/components/product/add-to-cart-button";

export function PurchasePanel({ product }: { product: CartProductInfo }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-3">
      {product.inStock && <QuantitySelector value={qty} onChange={setQty} />}
      <AddToCartButton product={product} quantity={qty} className="h-12 flex-1 sm:flex-none sm:px-12" />
    </div>
  );
}
