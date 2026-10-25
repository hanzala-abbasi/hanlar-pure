import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-black px-5 text-center text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">404</p>
      <h1 className="mt-4 font-serif text-5xl">Page not found</h1>
      <p className="mt-4 text-white/70">The page you are looking for does not exist or is no longer available.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonClass("gold")}>
          Back to Home
        </Link>
        <Link href="/shop" className={buttonClass("outline-light")}>
          Visit the Shop
        </Link>
      </div>
    </main>
  );
}
