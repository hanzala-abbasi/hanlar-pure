import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { BannerForm } from "@/components/admin/banner-form";

export const metadata: Metadata = { title: "Edit banner" };

export default async function EditBannerPage({ params }: PageProps<"/admin/banners/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Edit banner</h1>
      <BannerForm
        key={banner.updatedAt.toISOString()}
        id={banner.id}
        initial={{
          eyebrow: banner.eyebrow,
          title: banner.title,
          subtitle: banner.subtitle,
          ctaLabel: banner.ctaLabel,
          ctaHref: banner.ctaHref,
          imageUrl: banner.imageUrl,
          mobileImageUrl: banner.mobileImageUrl,
          imageAlt: banner.imageAlt,
          focusX: banner.focusX,
          active: banner.active,
          sortOrder: banner.sortOrder,
        }}
      />
    </>
  );
}
