"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export type CartProductInfo = {
  id: string;
  name: string;
  slug: string;
  price: number;
  size: string;
  image?: string;
  inStock: boolean;
};

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "gold",
  className,
}: {
  product: CartProductInfo;
  quantity?: number;
  variant?: "gold" | "dark" | "outline-dark";
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button variant={variant} className={className} disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        add(
          {
            productId: product.id,
            snapshot: {
              name: product.name,
              slug: product.slug,
              price: product.price,
              size: product.size,
              image: product.image,
            },
          },
          quantity,
        );
        setAdded(true);
        toast(`${product.name} added to cart`);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? (
        <>
          <Check aria-hidden className="size-4" /> Added
        </>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}

/** Orders are only taken over WhatsApp for now; tell shoppers before they reach the cart. */
export function showOrderNotice() {
  toast(
    "We currently accept orders through WhatsApp only. No other payment method is available for now.",
    "info",
    6000,
  );
}

/**
 * Buy-now shortcut: puts the product in the cart (at least `quantity`, never stacking on top of or
 * lowering an earlier add) and opens the cart, where the order is sent over WhatsApp.
 */
export function OrderNowButton({
  product,
  quantity = 1,
  variant = "gold",
  className,
}: {
  product: CartProductInfo;
  quantity?: number;
  variant?: "gold" | "dark" | "outline-dark";
  className?: string;
}) {
  const router = useRouter();

  if (!product.inStock) {
    return (
      <Button variant={variant} className={className} disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        const { items, add, setQuantity } = useCart.getState();
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          setQuantity(product.id, Math.max(existing.quantity, quantity));
        } else {
          add(
            {
              productId: product.id,
              snapshot: {
                name: product.name,
                slug: product.slug,
                price: product.price,
                size: product.size,
                image: product.image,
              },
            },
            quantity,
          );
        }
        showOrderNotice();
        router.push("/cart");
      }}
    >
      Order Now
    </Button>
  );
}
