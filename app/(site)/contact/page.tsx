import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";
import { ContactForm } from "@/components/contact/contact-form";
import { SocialLinks } from "@/components/layout/footer";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with HANLAR PURE on WhatsApp, email or phone.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader eyebrow="We're here to help" title="Contact Us" intro="The quickest way to reach us is WhatsApp." />
      <section className="py-16 md:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <a
              href={whatsappLink(settings.whatsappNumber, "Hello HANLAR PURE, I have a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("gold", "w-full sm:w-auto")}
            >
              <WhatsAppIcon className="size-4" /> Chat on WhatsApp
            </a>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <Mail aria-hidden className="mt-1 size-5 text-gold-dark" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Email</p>
                  <a href={`mailto:${settings.email}`} className="hover:text-gold-dark">
                    {settings.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone aria-hidden className="mt-1 size-5 text-gold-dark" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Phone</p>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold-dark">
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin aria-hidden className="mt-1 size-5 text-gold-dark" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Address</p>
                  <p>{settings.address}</p>
                </div>
              </li>
            </ul>
            <p className="mt-10 mb-4 text-xs uppercase tracking-[0.2em] text-muted">Follow us</p>
            <SocialLinks settings={settings} className="text-black" />
          </div>

          <div>
            <h2 className="mb-8 font-serif text-3xl">Send us a message</h2>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
