import type { PublicTenant } from "@/lib/api/storefront";
import { waLink } from "@/lib/i18n/format";
import type { NavItem } from "@/lib/site-schema";
import { storeUrls } from "./urls";

export type LinkKind = "catalog" | "page" | "external" | "whatsapp" | "block" | "home";

/** Resolves an owner-configured link (nav item, button, hero CTA) to an href. */
export function resolveLink(kind: LinkKind, target: string, tenant: Pick<PublicTenant, "slug" | "contact">): { href: string; external: boolean } {
  const slug = tenant.slug;
  switch (kind) {
    case "home":
      return { href: storeUrls.home(slug), external: false };
    case "catalog":
      return { href: storeUrls.catalog(slug), external: false };
    case "page":
      return { href: target ? storeUrls.page(slug, target) : storeUrls.home(slug), external: false };
    case "block":
      return { href: `${storeUrls.home(slug)}#${target}`, external: false };
    case "whatsapp":
      return { href: tenant.contact.whatsapp ? waLink(tenant.contact.whatsapp) : "#", external: true };
    case "external":
      return { href: /^https?:\/\//.test(target) ? target : "#", external: true };
  }
}

export function navHref(slug: string, item: NavItem, contact: PublicTenant["contact"]): { href: string; external: boolean } {
  return resolveLink(item.kind, item.target, { slug, contact });
}
