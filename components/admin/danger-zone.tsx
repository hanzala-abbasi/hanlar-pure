"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProduct, setProductStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function DangerZone({ id, name, archived }: { id: string; name: string; archived: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <section className="mt-10 border border-red-200 bg-white p-5 sm:p-6">
      <h2 className="font-serif text-2xl">Remove product</h2>
      {archived ? (
        <>
          <p className="mt-2 text-sm text-muted">
            This product is archived and hidden from the shop. You can restore it by changing its status, or delete it
            permanently.
          </p>
          <Button
            variant="outline-dark"
            disabled={pending}
            className="mt-4 border-red-700 text-red-700 hover:border-red-900 hover:text-red-900"
            onClick={() => {
              if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return;
              startTransition(async () => {
                const res = await deleteProduct(id);
                if (res.ok) {
                  toast("Product deleted");
                  router.replace("/admin/products");
                } else toast(res.error, "error");
              });
            }}
          >
            Delete permanently
          </Button>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted">Archiving hides the product from the shop. You can restore it later.</p>
          <Button
            variant="outline-dark"
            disabled={pending}
            className="mt-4"
            onClick={() => {
              if (!confirm(`Archive "${name}"? It will be hidden from the shop.`)) return;
              startTransition(async () => {
                const res = await setProductStatus(id, "ARCHIVED");
                if (res.ok) {
                  toast("Product archived");
                  router.refresh();
                } else toast(res.error, "error");
              });
            }}
          >
            Archive product
          </Button>
        </>
      )}
    </section>
  );
}
