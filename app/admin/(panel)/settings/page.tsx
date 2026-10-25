import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSiteSettings();
  return (
    <>
      <h1 className="font-serif text-4xl">Settings</h1>
      <p className="mt-1 mb-8 text-sm text-muted">
        Contact details, social links and delivery info shown across the website. Changes go live as soon as you save.
      </p>
      {!s.saved && (
        <p className="mb-6 border-l-2 border-gold bg-white px-4 py-3 text-sm">
          These are placeholder values. Replace them with your real details and save.
        </p>
      )}
      <SettingsForm
        initial={{
          whatsappNumber: s.whatsappNumber,
          email: s.email,
          phone: s.phone,
          address: s.address,
          instagramUrl: s.social.instagram,
          facebookUrl: s.social.facebook,
          tiktokUrl: s.social.tiktok,
          deliveryTitle: s.delivery.title,
          deliveryInfo: s.delivery.lines.join("\n"),
        }}
      />
    </>
  );
}
