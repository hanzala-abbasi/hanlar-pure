/** Line-drawn leaf sprig, echoing the gold botanicals on the product labels. Decorative only. */
export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 240" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M60 236C58 180 62 120 74 4" />
      <path d="M61 200C40 194 24 176 20 152c22 4 38 22 41 48Z" />
      <path d="M61 200c-21-6-37-24-41-48" strokeOpacity=".5" />
      <path d="M62 168c20-8 34-28 36-52-21 6-35 26-36 52Z" />
      <path d="M63 128C42 120 30 100 28 76c21 6 34 26 35 52Z" />
      <path d="M65 92c18-10 28-30 28-52-18 9-28 29-28 52Z" />
      <path d="M68 56C52 46 46 28 48 10c15 10 21 27 20 46Z" />
    </svg>
  );
}

/** Small centred divider: rule, leaf, rule. */
export function LeafDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 ${className ?? ""}`}>
      <span className="h-px w-10 bg-current opacity-50" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-4">
        <path d="M5 19C5 10 11 5 20 4c0 9-5 15-15 15Z" />
        <path d="M5 19 14 10" />
      </svg>
      <span className="h-px w-10 bg-current opacity-50" />
    </div>
  );
}
