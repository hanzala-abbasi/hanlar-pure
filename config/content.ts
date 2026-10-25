// Editable marketing copy for the home and about pages.
// TODO(content): owner to review. Wording follows the product labels.
// Keep claims generic and supportable: no medical claims or guaranteed results.

export type Benefit = { icon: "leaf" | "sparkles" | "droplet" | "shield"; title: string; text: string };
export type Faq = { q: string; a: string };
export type RitualStep = { step: string; title: string; text: string; product: { label: string; href: string } };

export const brandIntro =
  "HANLAR PURE brings the botanicals our grandmothers trusted (amla, reetha, shikakai and bhringraj) together with premium oils, in hair care that feels as good as it looks.";

export const benefits: Benefit[] = [
  {
    icon: "leaf",
    title: "Natural botanicals",
    text: "Every formula is built around plant extracts with a long history in South Asian hair care.",
  },
  {
    icon: "droplet",
    title: "Premium oils",
    text: "Coconut, almond, castor, olive and argan oils with vitamin E, blended for nourishment and shine.",
  },
  {
    icon: "sparkles",
    title: "Gentle, everyday care",
    text: "Made to cleanse and condition without leaving hair feeling stripped or heavy.",
  },
  {
    icon: "shield",
    title: "Nothing hidden",
    text: "The full ingredient list is printed on every bottle and on every product page.",
  },
];

export const ritual: RitualStep[] = [
  {
    step: "01",
    title: "Oil",
    text: "Massage HANLAR PURE Hair Oil into the scalp and through the lengths. Leave it on for a few hours, or overnight for a deeper treatment.",
    product: { label: "Hair Oil", href: "/shop/hair-oil" },
  },
  {
    step: "02",
    title: "Cleanse",
    text: "Apply Signature Black Shampoo to wet hair and massage gently. Reetha and shikakai lather to lift away oil and buildup.",
    product: { label: "Signature Black Shampoo", href: "/shop/signature-black-shampoo" },
  },
  {
    step: "03",
    title: "Shine",
    text: "Rinse thoroughly and enjoy hair that feels soft, fresh and manageable. Repeat the ritual once or twice a week.",
    product: { label: "Shop the collection", href: "/shop" },
  },
];

export const aboutTeaser =
  "We started HANLAR PURE with one idea: the ingredients that have cared for hair in our homes for generations deserve a premium place on your shelf. A few well-made products, honest labels, and personal service on every order.";

export const homeFaqs: Faq[] = [
  {
    q: "What ingredients do you use?",
    a: "Our Signature Black Shampoo is made with amla, reetha, shikakai, bhringraj, rosemary, neem, aloe vera, hibiscus and fenugreek extracts. Our Hair Oil blends amla, bhringraj, rosemary and fenugreek extracts with coconut, almond, castor, olive and argan oils and vitamin E. See the Ingredients page for more.",
  },
  {
    q: "Can I use the Hair Oil and Shampoo together?",
    a: "Yes, they are designed to work as a pair. Apply the Hair Oil a few hours before washing (or the night before), then wash it out with Signature Black Shampoo.",
  },
  {
    q: "How do I place an order?",
    a: "Add products to your cart and tap \"Order via WhatsApp\". Your order summary is sent to us on WhatsApp and we confirm the details with you.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes. Cash on delivery is available across Pakistan. We confirm the delivery charge with you on WhatsApp before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 3-5 working days in major cities. Remote areas may take a little longer.",
  },
  {
    q: "Are the products suitable for everyone?",
    a: "Our products are for external use only. If you have sensitive skin or known allergies, check the ingredient list and do a small patch test first. If irritation occurs, stop using the product.",
  },
];

export const about = {
  story:
    "HANLAR PURE began at home, with the hair-oiling rituals and herbal washes many of us grew up with. We wanted those familiar ingredients (amla, reetha, shikakai, bhringraj) in products that feel premium to use every day, with labels that tell you exactly what is inside.",
  vision: "To be a trusted name in natural, premium hair care from Pakistan, known for quality and honesty.",
  mission:
    "To craft hair care from time-honoured botanicals and premium oils that is pleasant to use every day, and to support every customer personally.",
  approach:
    "We keep our range small so we can get each product right. We choose ingredients with a long tradition behind them, list every one on the label, and only say what we can stand behind.",
};
