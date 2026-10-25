import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | HANLAR PURE Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-off-white">
      {children}
      <Toaster />
    </div>
  );
}
