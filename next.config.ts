import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is off on purpose: product pages are statically rendered and
  // refreshed with revalidatePath() after admin edits. See README > "Caching".
  cacheComponents: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
