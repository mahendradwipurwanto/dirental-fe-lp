export const storeUrls = {
  home: (slug: string) => `/${slug}`,
  catalog: (slug: string, params?: { category?: string; q?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.q) qs.set("q", params.q);
    const s = qs.toString();
    return `/${slug}/items${s ? `?${s}` : ""}`;
  },
  item: (slug: string, itemSlug: string) => `/${slug}/items/${itemSlug}`,
  checkout: (slug: string) => `/${slug}/checkout`,
  booking: (slug: string, code: string, token: string) => `/${slug}/booking/${code}?token=${encodeURIComponent(token)}`,
  page: (slug: string, pageSlug: string) => `/${slug}/p/${pageSlug}`,
};
