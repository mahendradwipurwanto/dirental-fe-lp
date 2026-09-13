import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const ADMIN_URL = process.env.ADMIN_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // Object storage host(s) serving owner-uploaded images, plus picsum for seed data.
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_ASSET_HOSTS ?? "kencana.basic.box.cloudeka.id")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean)
        .map((hostname) => ({ protocol: "https" as const, hostname })),
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  async redirects() {
    // The owner landing page moved from /lp to the site root.
    return [{ source: "/lp", destination: "/", permanent: true }];
  },
  async rewrites() {
    // Browser-side storefront reads (quotes, availability, booking status polling) go through the
    // same origin, so no CORS and no secrets in the client.
    return [{ source: "/api/storefront/:path*", destination: `${API_URL}/v1/public/:path*` }];
  },
  async headers() {
    return ["/:slug/preview", "/:slug/preview/block"].map((source) => (
      {
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Content-Security-Policy", value: `frame-ancestors 'self' ${ADMIN_URL}` },
          { key: "Cache-Control", value: "no-store" },
        ],
      }
    ));
  },
};

export default withNextIntl(nextConfig);
