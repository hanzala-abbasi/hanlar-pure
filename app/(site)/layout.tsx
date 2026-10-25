import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CartHydrator } from "@/components/layout/cart-hydrator";
import { Toaster } from "@/components/ui/toast";
import { getSiteSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-gold px-4 py-2 text-black focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton number={settings.whatsappNumber} />
      <CartHydrator />
      <Toaster />
    </>
  );
}
