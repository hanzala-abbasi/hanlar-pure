import { z } from "zod";

export const productStatuses = ["ACTIVE", "OUT_OF_STOCK", "DRAFT", "ARCHIVED"] as const;
export type ProductStatusValue = (typeof productStatuses)[number];

export const statusLabels: Record<ProductStatusValue, string> = {
  ACTIVE: "Active",
  OUT_OF_STOCK: "Out of stock",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

// Uploaded images live on Cloudinary in production, or under /uploads and /images locally.
const imageUrl = z
  .string()
  .refine(
    (url) => url.startsWith("https://res.cloudinary.com/") || /^\/(uploads|images)\/[\w./-]+$/.test(url),
    "Image must be uploaded through the dashboard",
  );

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only"),
  shortDescription: z.string().trim().min(10, "Add a short description (10+ characters)").max(300),
  description: z.string().trim().min(10, "Add a full description (10+ characters)").max(10000),
  ingredients: z.string().trim().max(5000),
  benefits: z.string().trim().max(5000),
  howToUse: z.string().trim().max(5000),
  price: z.number({ error: "Enter a price" }).int("Whole rupees only").min(0).max(10_000_000),
  size: z.string().trim().min(1, "Size is required").max(40),
  status: z.enum(productStatuses),
  featured: z.boolean(),
  sortOrder: z.number({ error: "Enter a number" }).int().min(-1000).max(1000),
  faqs: z
    .array(z.object({ q: z.string().trim().min(1, "Question is required"), a: z.string().trim().min(1, "Answer is required") }))
    .max(20),
  images: z.array(z.object({ url: imageUrl, alt: z.string().trim().max(200) })).max(12, "Up to 12 images"),
});

export type ProductInput = z.infer<typeof productSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email").max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s()-]*$/, "Please enter a valid phone number"),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(5000),
  // Honeypot: real users never fill this in.
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const faqsSchema = z.array(z.object({ q: z.string(), a: z.string() }));

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+\.[^\s]+$/.test(v), "Enter a full link starting with https://, or leave empty to hide");

export const settingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Digits only in international format, no + or spaces (e.g. 923001234567)"),
  email: z.email("Enter a valid email").max(200),
  phone: z.string().trim().min(5, "Enter a phone number").max(30).regex(/^[+\d\s()-]+$/, "Enter a valid phone number"),
  address: z.string().trim().min(3, "Enter an address").max(300),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  deliveryTitle: z.string().trim().min(3, "Enter a title").max(100),
  deliveryInfo: z.string().trim().min(3, "Add at least one line").max(1000),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const bannerSchema = z.object({
  eyebrow: z.string().trim().max(60),
  title: z.string().trim().min(2, "Title is required").max(80),
  subtitle: z.string().trim().max(200),
  ctaLabel: z.string().trim().min(2, "Button text is required").max(30),
  ctaHref: z
    .string()
    .trim()
    .max(300)
    .refine((v) => /^\/[\w\-./#?=&]*$/.test(v) || /^https:\/\/[^\s]+$/.test(v), "Use a page path like /shop or a full https:// link"),
  imageUrl: imageUrl,
  mobileImageUrl: imageUrl.nullable(),
  imageAlt: z.string().trim().max(200),
  focusX: z.number().int().min(0).max(100),
  active: z.boolean(),
  sortOrder: z.number({ error: "Enter a number" }).int().min(-1000).max(1000),
});

export type BannerInput = z.infer<typeof bannerSchema>;
