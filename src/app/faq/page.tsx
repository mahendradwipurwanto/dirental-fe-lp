import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SeoLandingPage } from "@/components/landing/SeoLandingPage";

export const metadata: Metadata = {
  title: "FAQ | Rental Platform",
  description: "Jawaban pertanyaan umum tentang biaya, kontrol bisnis, pembayaran, domain, dan cara bergabung sebagai partner Rental Platform.",
};

export default function FaqPage() {
  return <LocaleProvider><SeoLandingPage kind="faq" /></LocaleProvider>;
}
