import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SeoLandingPage } from "@/components/landing/SeoLandingPage";

export const metadata: Metadata = {
  title: "Tentang Kami | Rental Platform",
  description: "Rental Platform membangun ekosistem rental Indonesia bersama pemilik rental sebagai partner.",
};

export default function AboutPage() {
  return <LocaleProvider><SeoLandingPage kind="about" /></LocaleProvider>;
}
