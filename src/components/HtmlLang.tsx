"use client";
import { useEffect } from "react";

/** Keeps <html lang> in sync with the cookie locale without making the root layout dynamic. */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
