// Seeds the 3 launch products, using the wording and ingredient lists printed on the labels.
// TODO(content): prices are placeholders - confirm before launch.
// Safe to re-run: products are upserted by slug, so existing edits to other fields are overwritten
// only for these three slugs. Placeholder products from the first seed are archived.
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Seed = Omit<Prisma.ProductCreateInput, "images"> & { images: { url: string; alt: string }[] };

const shampooIngredients =
  "Amla Extract, Reetha Extract, Shikakai Extract, Bhringraj Extract, Rosemary Extract, Neem Extract, Aloe Vera Extract, Hibiscus Extract, Fenugreek Extract.";
const shampooDescription =
  "HANLAR PURE Signature Black Shampoo is a premium botanical blend, carefully crafted to gently cleanse the scalp and hair, remove buildup and help keep hair fresh, soft and manageable.\n\nIt is built around nine natural extracts with a long history in South Asian hair care: reetha and shikakai for a gentle, naturally foaming cleanse, amla, bhringraj and hibiscus to condition, and rosemary, neem and aloe vera to keep the scalp feeling fresh and comfortable.";
const shampooBenefits =
  "Helps cleanse hair and leaves it feeling soft and manageable\nSupports scalp health\nAdds natural shine and smoothness";
const shampooHowToUse =
  "Apply to wet hair, gently massage into scalp and hair, lather well. Rinse thoroughly. For best results, use regularly.\n\nFor external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Store in a cool, dry place away from direct sunlight.";
const shampooFaqs = [
  { q: "Can I use it every day?", a: "Yes, it is made for regular use. Adjust to what suits your hair." },
  {
    q: "Can I use it after the Hair Oil?",
    a: "Yes. Signature Black Shampoo is a great way to wash out HANLAR PURE Hair Oil after an oiling treatment.",
  },
];

const products: Seed[] = [
  {
    slug: "signature-black-shampoo",
    name: "Signature Black Shampoo",
    shortDescription:
      "A premium botanical shampoo with reetha, shikakai, amla and bhringraj. Nourishes and repairs for hair that feels fresh, soft and manageable.",
    description: shampooDescription,
    ingredients: shampooIngredients,
    benefits: shampooBenefits,
    howToUse: shampooHowToUse,
    price: 1500,
    size: "200 ml",
    status: "ACTIVE",
    featured: true,
    sortOrder: 0,
    faqs: shampooFaqs,
    images: [
      { url: "/images/products/signature-black-200-1.jpg", alt: "Signature Black Shampoo 200 ml bottle, front label" },
      { url: "/images/products/signature-black-200-2.jpg", alt: "Side label listing the pure ingredients" },
      { url: "/images/products/signature-black-200-3.jpg", alt: "Back label: about the product, benefits and directions" },
      { url: "/images/products/signature-black-200-4.jpg", alt: "Side label: order and reviews, Pure Ingredients Real Care" },
    ],
  },
  {
    slug: "hair-oil",
    name: "Hair Oil",
    shortDescription:
      "A nourishing blend of amla, bhringraj and rosemary with coconut, almond, castor, olive and argan oils and vitamin E. Nourish, strengthen, shine.",
    description:
      "HANLAR PURE Hair Oil is a blend of natural botanical extracts and premium oils, crafted to help nourish the scalp and hair and bring back softness and shine.\n\nAmla, bhringraj, rosemary and fenugreek extracts are carried in five oils: coconut, almond, castor, olive and argan, with vitamin E. It is the hair-oiling ritual many of us grew up with, in a light, easy-to-use pump bottle.",
    // TODO(content): confirm the full list - the back label also shows Aloe Vera Extract.
    ingredients:
      "Amla Extract, Bhringraj Extract, Rosemary Extract, Fenugreek Extract, Aloe Vera Extract, Coconut Oil, Almond Oil, Castor Oil, Olive Oil, Argan Oil, Vitamin E.",
    benefits: "Helps nourish hair and scalp\nImproves softness and shine\nConditions the scalp\nGives hair a stronger, healthier feel",
    howToUse:
      "For regular use, gently massage a suitable amount into the scalp and hair and leave for a few hours before washing. For a deeper treatment, apply the night before. Wash thoroughly, ideally with Signature Black Shampoo.\n\nFor external use only. Avoid contact with eyes. If irritation occurs, discontinue use. Store in a cool, dry place away from direct sunlight.",
    price: 1200,
    size: "100 ml",
    status: "ACTIVE",
    featured: true,
    sortOrder: 1,
    faqs: [
      { q: "How often should I oil my hair?", a: "Once or twice a week works well for most people. Adjust to what suits your hair." },
      { q: "Can I leave it on overnight?", a: "Yes. Applying it the night before and washing it out in the morning gives a deeper treatment." },
      { q: "Will it feel greasy?", a: "Use a small amount and focus on the scalp and ends. Wash it out with shampoo after your treatment." },
    ],
    images: [
      { url: "/images/products/hair-oil-1.jpg", alt: "HANLAR PURE Hair Oil 100 ml pump bottle, front label" },
      { url: "/images/products/hair-oil-2.jpg", alt: "Hair Oil label listing its ingredients" },
    ],
  },
  {
    slug: "signature-black-shampoo-100ml",
    name: "Signature Black Shampoo Travel Size",
    shortDescription:
      "Our Signature Black Shampoo in a 100 ml size, ideal for travel or for trying it for the first time. Cleanse, refresh, nourish.",
    description: shampooDescription,
    ingredients: shampooIngredients,
    benefits: shampooBenefits,
    howToUse: shampooHowToUse,
    price: 900,
    size: "100 ml",
    status: "ACTIVE",
    featured: true,
    sortOrder: 2,
    faqs: shampooFaqs,
    images: [
      { url: "/images/products/signature-black-100-1.jpg", alt: "Signature Black Shampoo 100 ml bottle, front label" },
      { url: "/images/products/signature-black-100-2.jpg", alt: "Signature Black Shampoo 100 ml, back label" },
    ],
  },
];

const retiredSlugs = ["shampoo-2", "shampoo-3"];

async function main() {
  for (const { images, ...data } of products) {
    const imageRows = images.map((img, position) => ({ ...img, position, isPrimary: position === 0 }));
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({ where: { id: existing.id }, data: { ...data, images: { create: imageRows } } });
    } else {
      await prisma.product.create({ data: { ...data, images: { create: imageRows } } });
    }
    console.log(`Seeded ${data.name}`);
  }
  const { count } = await prisma.product.updateMany({
    where: { slug: { in: retiredSlugs } },
    data: { status: "ARCHIVED", featured: false },
  });
  if (count) console.log(`Archived ${count} placeholder product(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
