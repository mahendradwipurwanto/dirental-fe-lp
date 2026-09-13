import { DM_Sans, Inter, Lora, Manrope, Nunito, Playfair_Display, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import type { FontFamily } from "@/lib/site-schema";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const manrope = Manrope({ subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap" });
const nunito = Nunito({ subsets: ["latin"], display: "swap" });
const lora = Lora({ subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });

/** Curated allowlist: arbitrary Google fonts cannot be loaded dynamically with next/font. */
export const storefrontFonts: Record<FontFamily, { className: string; fontFamily: string }> = {
  inter: { className: inter.className, fontFamily: inter.style.fontFamily },
  "plus-jakarta-sans": { className: plusJakarta.className, fontFamily: plusJakarta.style.fontFamily },
  poppins: { className: poppins.className, fontFamily: poppins.style.fontFamily },
  manrope: { className: manrope.className, fontFamily: manrope.style.fontFamily },
  "dm-sans": { className: dmSans.className, fontFamily: dmSans.style.fontFamily },
  nunito: { className: nunito.className, fontFamily: nunito.style.fontFamily },
  lora: { className: lora.className, fontFamily: lora.style.fontFamily },
  "playfair-display": { className: playfair.className, fontFamily: playfair.style.fontFamily },
};
