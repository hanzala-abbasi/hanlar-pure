import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { PolicyPage } from "@/components/ui/policy-page";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

// TODO(content): replace with the final privacy policy.
export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return (
    <PolicyPage title="Privacy Policy">
      <h2>Information we collect</h2>
      <p>
        When you contact us or place an order on WhatsApp, we receive the details you choose to share, such as your
        name, phone number, email and delivery address.
      </p>
      <h2>How we use it</h2>
      <p>We use your information only to respond to you, confirm and deliver your order, and provide support.</p>
      <h2>Your cart</h2>
      <p>Your cart is stored in your own browser and is not sent to us until you choose to order on WhatsApp.</p>
      <h2>Contact</h2>
      <p>Questions about privacy? Email us at {settings.email}.</p>
    </PolicyPage>
  );
}
