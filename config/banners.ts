// Launch banners. Shown on the home page until the owner adds banners in Admin > Banners,
// and used by prisma/seed.ts to fill the Banner table.

export type BannerContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  imageAlt: string;
  focusX: number;
};

export const defaultBanners: BannerContent[] = [
  {
    eyebrow: "Pure Ingredients · Real Care",
    title: "Nature's Care. Premium Hair.",
    subtitle: "Botanical shampoo and hair oil made with amla, reetha, shikakai and bhringraj.",
    ctaLabel: "Shop the Collection",
    ctaHref: "/shop",
    imageUrl: "/images/banners/collection.jpg",
    mobileImageUrl: null,
    imageAlt: "Signature Black Shampoo 100 ml and 200 ml with Hair Oil on a travertine ledge",
    focusX: 29,
  },
  {
    eyebrow: "Hair Oil · 100 ml",
    title: "Nourish. Strengthen. Shine.",
    subtitle: "Amla, bhringraj and rosemary in five premium oils with vitamin E.",
    ctaLabel: "Shop Hair Oil",
    ctaHref: "/shop/hair-oil",
    imageUrl: "/images/banners/hair-oil.jpg",
    mobileImageUrl: null,
    imageAlt: "HANLAR PURE Hair Oil on a marble plinth with argan nuts and rosemary",
    focusX: 49,
  },
  {
    eyebrow: "Signature Black Shampoo · 200 ml",
    title: "Nourish & Repair.",
    subtitle: "Reetha and shikakai for a gentle, naturally foaming cleanse.",
    ctaLabel: "Shop Shampoo",
    ctaHref: "/shop/signature-black-shampoo",
    imageUrl: "/images/banners/signature-black-200.jpg",
    mobileImageUrl: null,
    imageAlt: "Signature Black Shampoo 200 ml on a travertine counter in warm light",
    focusX: 31,
  },
  {
    eyebrow: "Signature Black Shampoo · 100 ml",
    title: "Cleanse. Refresh. Nourish.",
    subtitle: "Our signature formula in a travel size, ideal for a first try.",
    ctaLabel: "Shop Travel Size",
    ctaHref: "/shop/signature-black-shampoo-100ml",
    imageUrl: "/images/banners/signature-black-100.jpg",
    mobileImageUrl: null,
    imageAlt: "Signature Black Shampoo 100 ml beside a sweep of glossy black hair",
    focusX: 37,
  },
];
