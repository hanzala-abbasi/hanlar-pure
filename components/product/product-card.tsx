import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export function ProductCard({ product, priority = false }: { product: PublicProduct; priority?: boolean }) {
  const [primary, secondary] = product.images;
  const sizes = "(min-width: 1024px) 33vw, 50vw";

  return (
    <article className="group flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-off-white"
        aria-hidden
        tabIndex={-1}
      >
        {primary && (
          <Image
            src={primary.url}
            alt={primary.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
        {secondary && (
          <Image
            src={secondary.url}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
          />
        )}
        {!product.inStock && <Badge className="absolute top-4 left-4">Out of Stock</Badge>}
      </Link>

      <div className="flex flex-1 flex-col pt-3 text-center sm:pt-5">
        <h3 className="font-serif text-lg leading-tight sm:text-2xl">
          <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-gold-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 mb-4 text-xs text-muted sm:mb-5 sm:text-sm">
          {product.size} · <span className="text-black">{formatPrice(product.price)}</span>
        </p>
        <AddToCartButton
          variant="outline-dark"
          className="mx-auto mt-auto w-full max-w-60 px-2 tracking-[0.12em] sm:px-6 sm:tracking-[0.2em]"
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            size: product.size,
            image: primary?.url,
            inStock: product.inStock,
          }}
        />
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 3} />
      ))}
    </div>
  );
}
