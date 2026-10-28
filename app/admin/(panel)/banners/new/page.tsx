import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { BannerForm, emptyBanner } from "@/components/admin/banner-form";

export const metadata: Metadata = { title: "Add banner" };

export default async function NewBannerPage() {
  await requireAdmin();
  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Add banner</h1>
      <BannerForm id={null} initial={emptyBanner} />
    </>
  );
}
