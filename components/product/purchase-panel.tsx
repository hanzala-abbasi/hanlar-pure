"use client";

import { useState } from "react";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { AddToCartButton, OrderNowButton, type CartProductInfo } from "@/components/product/add-to-cart-button";

export function PurchasePanel({ product }: { product: CartProductInfo }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex items-center gap-3">
        {product.inStock && <QuantitySelector value={qty} onChange={setQty} />}
        <AddToCartButton product={product} quantity={qty} variant="outline-dark" className="h-12 flex-1" />
      </div>
      {product.inStock && <OrderNowButton product={product} quantity={qty} className="h-12 w-full" />}
    </div>
  );
}
