import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { getSiteSettings, type SiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/container";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";

export function SocialLinks({ settings, className = "" }: { settings: SiteSettings; className?: string }) {
  // Links left empty in Admin > Settings are hidden.
  const links = [
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: whatsappLink(settings.whatsappNumber), label: "WhatsApp", Icon: WhatsAppIcon },
  ].filter((l) => l.href);
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex size-10 items-center justify-center border border-current/25 transition-colors hover:border-gold hover:text-gold"
          >
            <Icon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="bg-black text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-4 md:py-20">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl tracking-[0.25em]">
            HANLAR <span className="text-gold">PURE</span>
          </p>
          <p className="mt-4 max-w-sm leading-relaxed text-white/65">
            {siteConfig.tagline} Natural botanicals and premium oils, crafted in Pakistan and delivered with care.
          </p>
          <SocialLinks settings={settings} className="mt-8 text-white/80" />
        </div>

        <div>
          <h2 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">Explore</h2>
          <ul className="space-y-3 text-sm text-white/70">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
            {siteConfig.policies.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">Contact</h2>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={`mailto:${settings.email}`} className="break-all transition-colors hover:text-gold">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-gold">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-6 text-xs text-white/60">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
