import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SeoLandingPage } from "@/components/landing/SeoLandingPage";

export const metadata: Metadata = {
  title: "Cara Kerja | Rental Platform",
  description: "Pelajari cara mendaftar sebagai partner, membangun toko rental, membagikan link, dan menerima booking online.",
};

export default function HowItWorksPage() {
  return <LocaleProvider><SeoLandingPage kind="how" /></LocaleProvider>;
}
