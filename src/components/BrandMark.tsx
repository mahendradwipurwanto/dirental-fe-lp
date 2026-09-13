/** A tiny hang-tag: the platform mark. */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`tag-punched-sm inline-flex h-7 items-center rounded-md bg-primary pr-2 text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground ${className}`}>
      Rp
    </span>
  );
}
