import type { Metadata } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SeoLandingPage } from "@/components/landing/SeoLandingPage";

export const metadata: Metadata = {
  title: "Untuk Pemilik Rental | Rental Platform",
  description: "Teknologi rental yang mudah dan terjangkau untuk membantu pemilik rental mengelola booking dan mengembangkan bisnis.",
};

export default function OwnersPage() {
  return <LocaleProvider><SeoLandingPage kind="owners" /></LocaleProvider>;
}
