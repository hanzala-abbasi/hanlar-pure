# HANLAR PURE website (Phase 1)

Premium catalog website for HANLAR PURE hair care, with a WhatsApp ordering cart and an admin dashboard.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · Prisma + PostgreSQL · Zustand · React Hook Form + Zod · MDX blog · Cloudinary (images) · Resend (contact email) · Vercel.

---

## What's included

**Public site:** Home, Shop, Product details (gallery + zoom, tabs, FAQ, JSON-LD), Cart (orders sent via WhatsApp), About, Contact (form), Blog (MDX), Privacy / Delivery / Return policy pages, sitemap.xml, robots.txt.

**Admin dashboard** (`/admin`, password protected):

| Page | What it does |
|---|---|
| **Overview** `/admin` | Stats (live products, featured, unread messages, average price), catalog status breakdown, recently updated products, "needs attention" list (products without images, missing ingredients, drafts, out of stock), launch checklist, recent messages, current contact details. |
| **Products** `/admin/products` | Table of all products with quick status change and featured toggle. Add / edit products with multiple images (upload, reorder, set primary, remove), FAQ items, sort order. Archive, then delete permanently. |
| **Messages** `/admin/messages` | Contact form inbox: unread filter, mark read / unread, mark all read, delete, reply by email, phone or WhatsApp. |
| **Settings** `/admin/settings` | WhatsApp number, phone, email, address, Instagram / Facebook / TikTok links (leave empty to hide an icon), delivery info. Saving updates the whole site immediately. |

Changes made in the dashboard appear on the live site without redeploying.

---

## Run locally

Requirements: Node.js 20+ and a PostgreSQL database (a free [Neon](https://neon.tech) or [Supabase](https://supabase.com) database works).

```bash
npm install
cp .env.example .env        # then fill in the values (see below)
npm run db:deploy           # create the database tables
npm run db:seed             # add the 3 starter products
npm run dev                 # http://localhost:3000 (admin: http://localhost:3000/admin)
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm run db:studio` (browse the database).

> Local image uploads: if the Cloudinary variables are empty, uploaded images are saved to `public/uploads` (development only). In production Cloudinary is required.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string. On Vercel use the **pooled** URL from Neon/Supabase. |
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Use a long, unique password. |
| `ADMIN_SESSION_SECRET` | yes | Random string of 32+ characters used to sign the admin cookie. Generate with `openssl rand -base64 32`. Changing it logs the admin out. |
| `NEXT_PUBLIC_SITE_URL` | yes | Your domain, e.g. `https://hanlarpure.com` (used for SEO, sitemap, Open Graph). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | no | Default WhatsApp number used until you save one in Admin > Settings. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | yes in production | Image uploads from the dashboard. Free account at [cloudinary.com](https://cloudinary.com). |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | no | Email contact-form messages to you via [Resend](https://resend.com). Without them, messages are still saved and shown in Admin > Messages. |
| `CONTACT_FROM_EMAIL` | no | Verified sender address in Resend, e.g. `HANLAR PURE <hello@yourdomain.com>`. |

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New > Project**, import the repository.
3. Add every environment variable above in **Settings > Environment Variables**.
4. Deploy. The `vercel-build` script runs `prisma generate`, applies database migrations (`prisma migrate deploy`) and builds the site.
5. Seed the starter products once from your computer: set `DATABASE_URL` in `.env` to the production database, then run `npm run db:seed`.
6. Open `https://your-domain/admin`, log in, and complete the launch checklist on the Overview page.

## Editing content

| What | Where |
|---|---|
| Products, prices, images, product FAQ | Admin > Products |
| WhatsApp, phone, email, address, social links, delivery info | Admin > Settings |
| Home page intro, benefits, FAQ, About page copy | `config/content.ts` |
| Brand name, tagline, menu, fallback contact values | `config/site.ts` |
| Blog posts | Add `.mdx` files to `content/blog/` (copy an existing post's frontmatter), then redeploy |
| Policy pages | `app/(site)/(policies)/*/page.tsx` |
| Brand colours | CSS variables at the top of `app/globals.css` (`--gold` etc.) |
| Placeholder product photos | `public/images/products/` (replace via the dashboard instead) |

Every placeholder is marked with `TODO(content)`. Search the project for it before launch. Keep product and blog claims general and supportable: no medical claims or guaranteed results.

## Security notes

- `/admin` is protected by one shared password and a signed, httpOnly cookie (7-day session). `proxy.ts` blocks unauthenticated requests, and every admin page and server action checks the session again.
- Login attempts are rate-limited (5 per 15 minutes per IP, kept in memory per server instance). For stronger protection, swap `lib/rate-limit.ts` for Upstash.
- Uploads are restricted to JPEG / PNG / WebP up to 5 MB. Images go directly from the browser to Cloudinary using a short-lived signature.

## Technical notes

- **Caching:** public pages are statically generated. After any dashboard change, the affected pages are refreshed with `revalidatePath()`. Next.js 16's new "Cache Components" mode is turned off in `next.config.ts` on purpose: the classic static + revalidate model is simpler and well proven for this site.
- **Database migrations** live in `prisma/migrations`. After changing `prisma/schema.prisma`, run `npm run db:migrate` locally to create a new migration.
- **Cart:** stored in the browser (`localStorage`). The cart page always reloads current prices and stock from the database, so stale prices are never sent in an order.
- **Analytics:** a marked placeholder is in `app/layout.tsx` for Google Analytics / Search Console (Phase 2).
- **Out of scope for Phase 1:** payments, customer accounts, order management, stock counts, reviews, multiple languages / currencies. The structure (`lang`/`dir` on `<html>`, content in config files) allows adding Urdu later.
