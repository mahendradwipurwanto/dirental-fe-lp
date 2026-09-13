import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { DirectoryGrid } from "@/components/landing/DirectoryGrid";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { SearchForm } from "@/components/landing/SearchForm";
import { getDirectory } from "@/lib/api/storefront";
import { ADMIN_URL } from "@/lib/platform";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing");
  return { title: t("navBrowse"), description: t("directorySub"), alternates: { canonical: "/browse" } };
}

export default function DirectoryPage() {
  return (
    <LocaleProvider>
      <Directory />
    </LocaleProvider>
  );
}

async function Directory() {
  const t = await getTranslations("landing");
  const nav = { owners: t("navOwners"), browse: t("navBrowse"), login: t("navLogin"), cta: t("navCta") };
  const directory = await getDirectory(undefined, 24);

  return (
    <div className="flex min-h-dvh flex-col">
      <LandingHeader labels={nav} current="directory" />
      <main className="flex-1">
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-20">
            <h1 className="display max-w-2xl text-4xl text-foreground md:text-5xl">{t("directoryHeadline")}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("directorySub")}</p>
            <SearchForm placeholder={t("searchPlaceholder")} buttonLabel={t("search")} className="mt-8 max-w-xl" size="lg" />
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">{t("directoryTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("directoryCount", { count: directory.length })}</p>
          </div>
          <DirectoryGrid items={directory} emptyLabel={t("directoryEmpty")} />
        </section>

        <section className="mx-auto max-w-[1120px] px-5 pb-16 sm:px-8">
          <div className="flex flex-col gap-5 rounded-2xl bg-ink px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <p className="text-xl font-bold tracking-tight">{t("ownerBandTitle")}</p>
              <p className="mt-1 text-white/70">{t("ownerBandSub")}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link href="/" className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/10">
                {t("ownerBandLearn")}
              </Link>
              <Link href={`${ADMIN_URL}/signup`} className="rounded-lg bg-marigold px-4 py-2.5 text-sm font-semibold text-ink hover:bg-marigold/90">
                {t("navCta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter labels={{ tagline: t("footer"), owners: nav.owners, browse: nav.browse, login: nav.login }} />
    </div>
  );
}
