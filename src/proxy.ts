import { NextResponse, type NextRequest } from "next/server";
import { RESERVED_SLUGS } from "@/lib/site-schema";

const reserved = new Set<string>(RESERVED_SLUGS);

/**
 * Reserved first-path segments (e.g. /admin, /login) must never resolve to a tenant storefront.
 * Rewriting to the not-found route here yields a real 404 status instead of a streamed soft-404.
 */
export function proxy(req: NextRequest) {
  const first = req.nextUrl.pathname.split("/")[1]?.toLowerCase() ?? "";
  if (first && reserved.has(first) && !["search", "about", "terms", "privacy", "api", "lp", "browse"].includes(first)) {
    return NextResponse.rewrite(new URL("/_not-found", req.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.\\w+$).*)"],
};
