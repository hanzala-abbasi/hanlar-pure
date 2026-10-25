import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { PolicyPage } from "@/components/ui/policy-page";

export const metadata: Metadata = { title: "Delivery Policy", alternates: { canonical: "/delivery-policy" } };

// TODO(content): replace with the final delivery policy.
export default async function DeliveryPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <PolicyPage title="Delivery Policy">
      <h2>Where we deliver</h2>
      <p>We deliver across Pakistan.</p>
      <h2>Delivery times</h2>
      <ul>
        {settings.delivery.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <h2>Delivery charges</h2>
      <p>Delivery charges depend on your city and are confirmed with you on WhatsApp before dispatch.</p>
    </PolicyPage>
  );
}
