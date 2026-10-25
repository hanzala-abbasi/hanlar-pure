import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block bg-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
