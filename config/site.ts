// Single source of truth for brand, contact and social details.
// TODO(content): replace every placeholder value below with the real details.

export const siteConfig = {
  name: "HANLAR PURE",
  tagline: "Nature's Care. Premium Hair.",
  description:
    "HANLAR PURE natural hair care. Botanical shampoo and hair oil made with amla, reetha, shikakai, bhringraj and premium oils, delivered across Pakistan.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-PK",
  currency: "PKR",

  // Contact, social and delivery details are edited in Admin > Settings (stored in the database).
  // These are only the fallbacks used before the owner saves settings for the first time.
  defaults: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000", // TODO(content)
    email: "hello@hanlarpure.com", // TODO(content)
    phone: "+92 300 0000000", // TODO(content)
    address: "Street address, City, Pakistan", // TODO(content)
    social: {
      instagram: "https://instagram.com/hanlar.pure13",
      facebook: "https://facebook.com/", // TODO(content)
      tiktok: "https://tiktok.com/@hanlar.pure13",
    },
    delivery: {
      title: "Delivery across Pakistan",
      lines: [
        "Delivery in 3-5 working days to major cities.",
        "Cash on delivery available.",
        "We confirm every order personally on WhatsApp before dispatch.",
      ],
    },
  },

  nav: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],

  policies: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/delivery-policy", label: "Delivery Policy" },
    { href: "/return-policy", label: "Return Policy" },
  ],
} as const;

export function whatsappLink(number: string, text?: string) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
