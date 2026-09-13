import type { CSSProperties } from "react";
import type { Theme } from "@/lib/site-schema";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White or near-black, whichever contrasts better with `bg`. */
export function contrastText(bg: string): string {
  return luminance(bg) > 0.4 ? "#0f172a" : "#ffffff";
}

const radiusRem: Record<Theme["radius"], string> = { none: "0rem", sm: "0.25rem", md: "0.625rem", lg: "1rem", xl: "1.5rem" };

/**
 * Maps theme tokens onto the shadcn CSS variables. shadcn's utilities are `var(--primary)` etc.
 * (declared with `@theme inline`), so setting these inline on a wrapper re-themes every component
 * inside it without leaking onto the platform pages.
 */
export function themeToStyle(theme: Theme, fontFamily: string): CSSProperties {
  const { primary, secondary, background, foreground } = theme;
  const mix = (a: string, pct: number, b: string) => `color-mix(in oklab, ${a} ${pct}%, ${b})`;
  return {
    fontFamily,
    "--primary": primary,
    "--primary-foreground": contrastText(primary),
    "--secondary": secondary,
    "--secondary-foreground": contrastText(secondary),
    "--background": background,
    "--foreground": foreground,
    "--card": background,
    "--card-foreground": foreground,
    "--popover": background,
    "--popover-foreground": foreground,
    "--muted": mix(foreground, 6, background),
    "--muted-foreground": mix(foreground, 65, background),
    "--accent": mix(primary, 10, background),
    "--accent-foreground": foreground,
    "--border": mix(foreground, 12, background),
    "--input": mix(foreground, 16, background),
    "--ring": primary,
    "--radius": radiusRem[theme.radius],
    "--storefront-primary": primary,
  } as CSSProperties;
}
