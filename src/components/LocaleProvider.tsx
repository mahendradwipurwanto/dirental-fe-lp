import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";
import { HtmlLang } from "./HtmlLang";

async function Inner({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <NextIntlClientProvider>
      <HtmlLang lang={locale} />
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * Reads the locale cookie (a dynamic API) inside its own Suspense boundary. Routes call this
 * AFTER any notFound() checks so a missing tenant still produces a real 404 status code.
 */
export function LocaleProvider({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <Inner>{children}</Inner>
    </Suspense>
  );
}
