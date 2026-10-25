import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/policy-page";

export const metadata: Metadata = { title: "Return Policy", alternates: { canonical: "/return-policy" } };

// TODO(content): replace with the final return policy.
export default function ReturnPolicyPage() {
  return (
    <PolicyPage title="Return Policy">
      <h2>Damaged or incorrect items</h2>
      <p>
        If your order arrives damaged or you received the wrong item, contact us on WhatsApp within 48 hours of
        delivery with a photo and we will make it right.
      </p>
      <h2>Opened products</h2>
      <p>For hygiene reasons, opened or used products cannot be returned unless they are faulty.</p>
      <h2>How to start a return</h2>
      <p>Message us on WhatsApp with your name and order details and we will guide you through the next steps.</p>
    </PolicyPage>
  );
}
