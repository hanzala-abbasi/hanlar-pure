import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_PK",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang/dir live here so an Urdu locale (lang="ur" dir="rtl") can be added later.
    <html lang="en" dir="ltr" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        {children}
        {/* ANALYTICS PLACEHOLDER: add Google Analytics / Search Console verification here in Phase 2. */}
      </body>
    </html>
  );
}
