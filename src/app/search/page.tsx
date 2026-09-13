import { getTranslations } from "next-intl/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { DirectoryGrid } from "@/components/landing/DirectoryGrid";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { SearchForm } from "@/components/landing/SearchForm";
import { getDirectory } from "@/lib/api/storefront";

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <LocaleProvider>
      <SearchResults {...props} />
    </LocaleProvider>
  );
}

async function SearchResults({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const t = await getTranslations("landing");
  const nav = { owners: t("navOwners"), browse: t("navBrowse"), login: t("navLogin"), cta: t("navCta") };
  const items = await getDirectory(query || undefined, 60);
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingHeader labels={nav} current="directory" />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-5 py-10 sm:px-8">
        <SearchForm placeholder={t("searchPlaceholder")} buttonLabel={t("search")} defaultValue={query} className="mb-10 max-w-xl" size="lg" />
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">{query ? t("searchResultsFor", { query }) : t("directoryTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("directoryCount", { count: items.length })}</p>
        </div>
        <DirectoryGrid items={items} emptyLabel={t("directoryEmpty")} />
      </main>
      <LandingFooter labels={{ tagline: t("footer"), owners: nav.owners, browse: nav.browse, login: nav.login }} />
    </div>
  );
}
