import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Native <details>: keyboard accessible with zero JavaScript.
export function AccordionItem({
  title,
  children,
  defaultOpen,
  className,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details className={cn("group border-b border-black/10", className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium transition-colors hover:text-gold-dark">
        <span>{title}</span>
        <Plus
          aria-hidden
          className="size-4 shrink-0 text-gold-dark transition-transform duration-300 group-open:rotate-45"
        />
      </summary>
      <div className="pb-6 leading-relaxed text-muted">{children}</div>
    </details>
  );
}
