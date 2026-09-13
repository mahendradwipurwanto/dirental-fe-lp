/** Brand name shown on platform pages; override with NEXT_PUBLIC_PLATFORM_NAME. */
export const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME?.trim() || "Rental Platform";

/** Host shown in example links, e.g. `sewa.id/nama-tokomu`. */
export const SITE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").host;
  } catch {
    return "localhost:3000";
  }
})();

export const ADMIN_URL = process.env.ADMIN_URL ?? process.env.NEXT_PUBLIC_ADMIN_ORIGIN ?? "http://localhost:3001";
