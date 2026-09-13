import Link from "next/link";
import type { BlockCtx } from "@/components/storefront/BlockRenderer";
import type { ButtonItem } from "@/lib/site-schema";
import { resolveLink } from "@/lib/storefront/links";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline: "border border-current hover:bg-current/10",
  link: "underline underline-offset-4 hover:opacity-80 px-0",
} as const;

/** Renders a list of configured buttons; on dark surfaces the primary variant flips to secondary so it stays visible. */
export function ButtonRow({ buttons, ctx, onDark = false, size = "md", className = "" }: { buttons: ButtonItem[]; ctx: BlockCtx; onDark?: boolean; size?: "md" | "lg"; className?: string }) {
  if (buttons.length === 0) return null;
  const h = size === "lg" ? "h-12 px-6 text-[15px]" : "h-11 px-5 text-sm";
  return (
    <div className={`block-align flex flex-wrap items-center gap-3 ${className}`}>
      {buttons.map((b) => {
        const { href, external } = resolveLink(b.kind, b.target, ctx.site.tenant);
        const variant = onDark && b.variant === "primary" ? "secondary" : b.variant;
        const cls = `inline-flex items-center rounded-[var(--radius)] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${variant === "link" ? "" : h} ${variants[variant]}`;
        return external ? (
          <a key={b.id} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {b.label}
          </a>
        ) : (
          <Link key={b.id} href={href} className={cls}>
            {b.label}
          </Link>
        );
      })}
    </div>
  );
}
