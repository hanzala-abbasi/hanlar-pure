import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Log in" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black px-5">
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-2xl tracking-[0.25em] text-white">
          HANLAR <span className="text-gold">PURE</span>
        </p>
        <h1 className="mt-2 mb-10 text-center text-xs uppercase tracking-[0.3em] text-white/60">Admin Dashboard</h1>
        <LoginForm />
      </div>
    </div>
  );
}
