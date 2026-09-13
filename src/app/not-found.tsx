import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleProvider } from "@/components/LocaleProvider";
import { BrandMark } from "@/components/BrandMark";

async function Body() {
  const t = await getTranslations("common");
  return (
    <>
      <h1 className="display text-4xl">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground">{t("notFoundBody")}</p>
      <Link href="/" className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        {t("goHome")}
      </Link>
    </>
  );
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <BrandMark />
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <LocaleProvider>
        <Body />
      </LocaleProvider>
    </main>
  );
}
