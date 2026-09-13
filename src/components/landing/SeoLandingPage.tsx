import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, CreditCard, Link2, Users } from "lucide-react";
import { Faq } from "@/components/lp/Faq";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { ADMIN_URL } from "@/lib/platform";

type PageKind = "owners" | "how" | "about" | "faq";
const signup = `${ADMIN_URL}/signup`;
const labels = { owners: "Untuk Pemilik Rental", how: "Cara Kerja", about: "Tentang Kami", faq: "FAQ", login: "Masuk", cta: "Jadi Partner" };
const features = [
  [Link2, "Link rental sendiri", "Satu link untuk dibagikan ke pelanggan."],
  [CalendarDays, "Kalender ketersediaan", "Kurangi risiko double booking."],
  [CreditCard, "Kelola booking", "Semua booking tersusun dalam satu tempat."],
  [Bell, "Notifikasi otomatis", "Tidak perlu mengecek booking satu per satu."],
  [Users, "Akses tim", "Ajak staf membantu mengelola bisnis."],
];
const steps = [
  ["01", "Daftar sebagai partner", "Ceritakan bisnis rental Anda dan dapatkan akses ke platform."],
  ["02", "Bangun toko rental Anda", "Tambahkan item, atur harga, dan kelola ketersediaan."],
  ["03", "Bagikan ke pelanggan", "Dapatkan link toko yang bisa dibagikan melalui WhatsApp, Instagram, atau media lainnya."],
  ["04", "Terima & kelola booking", "Pelanggan melakukan booking dan Anda mengelola semuanya dari satu tempat."],
];
const faqItems = [
  ["Apakah Rental Platform memiliki bisnis rental sendiri?", "Tidak. Kami menyediakan teknologi dan infrastruktur agar bisnis rental milik partner dapat berkembang."],
  ["Berapa biaya menjadi partner?", "Kami merancang solusi yang mudah dan terjangkau untuk bisnis kecil hingga besar. Tim kami akan menjelaskan pilihan yang tersedia saat pendaftaran."],
  ["Apakah pelanggan tetap menjadi milik saya?", "Ya. Anda tetap memegang kendali atas bisnis, harga, pelanggan, dan hubungan dengan penyewa."],
  ["Apakah saya bisa menentukan harga sendiri?", "Tentu. Anda mengatur harga, ketersediaan, aturan sewa, dan informasi toko Anda sendiri."],
  ["Apakah bisa menggunakan domain sendiri?", "Dukungan domain sendiri sedang kami siapkan. Untuk saat ini, Anda mendapatkan link toko yang siap dibagikan."],
  ["Apakah bisnis rental kecil bisa bergabung?", "Bisa. Rental Platform dibuat untuk membantu pemilik rental di berbagai tahap dan skala bisnis."],
];

export function SeoLandingPage({ kind }: { kind: PageKind }) {
  return <div className="min-h-dvh bg-background"><LandingHeader labels={labels} current={kind === "owners" ? "owners" : kind} /><main>{kind === "owners" ? <OwnersPage /> : null}{kind === "how" ? <HowPage /> : null}{kind === "about" ? <AboutPage /> : null}{kind === "faq" ? <FaqPage /> : null}<FinalCta /></main><LandingFooter labels={{ tagline: "Bersama memajukan bisnis rental di Indonesia.", ...labels }} /></div>;
}

function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: React.ReactNode; body: string }) {
  return <section className="border-b border-border/70"><div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32"><p className="eyebrow">{eyebrow}</p><h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">{body}</p></div></section>;
}

function OwnersPage() {
  return <><PageIntro eyebrow="Untuk pemilik rental" title={<>Teknologi rental yang mudah, terjangkau, dan tetap milik Anda.</>} body="Rental Platform membantu pemilik rental mendapatkan lebih banyak pelanggan, mengelola booking, dan membangun toko online tanpa kehilangan kendali atas bisnis." /><section className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-32"><div><p className="eyebrow">Bangun bisnis dengan tenang</p><h2 className="display mt-5 text-4xl sm:text-5xl">Anda fokus pada rentalnya. Kami urus teknologinya.</h2><p className="mt-7 text-lg leading-8 text-muted-foreground">Buat toko rental sendiri, atur harga dan ketersediaan, bagikan link ke pelanggan, lalu kelola setiap booking dari satu tempat.</p><Link href={signup} className="mt-9 inline-flex h-14 items-center gap-2 rounded-xl bg-marigold px-7 font-bold text-ink">Jadi Partner Sekarang <ArrowRight className="h-4 w-4" /></Link></div><Image src="/assets/images/hero-product-v2.png" alt="Dashboard dan toko rental online" width={1536} height={1024} className="rounded-[2rem] shadow-[0_30px_60px_-35px_rgba(20,48,43,.45)]" priority /></section><section className="bg-accent/45 py-24 sm:py-32"><div className="mx-auto max-w-[1240px] px-5 sm:px-8"><p className="eyebrow">Yang Anda dapatkan</p><h2 className="display mt-5 text-4xl sm:text-5xl">Semua yang penting untuk tumbuh.</h2><div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">{features.map(([Icon, title, body]) => <div key={title as string} className="flex gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-primary"><Icon className="h-5 w-5" /></span><div><h3 className="text-lg font-bold">{title as string}</h3><p className="mt-2 leading-7 text-muted-foreground">{body as string}</p></div></div>)}</div></div></section></>;
}

function HowPage() {
  return <><PageIntro eyebrow="Cara kerja" title={<>Mulai sebagai partner, berkembang bersama.</>} body="Empat langkah sederhana untuk mulai menerima booking secara online, tanpa sistem yang rumit." /><section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32"><ol className="grid gap-12 md:grid-cols-4">{steps.map(([number, title, body]) => <li key={number} className="border-t-2 border-primary pt-6"><span className="text-5xl font-semibold tracking-[-.06em] text-primary/80">{number}</span><h2 className="mt-7 text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-muted-foreground">{body}</p></li>)}</ol></section><section className="bg-card py-24 sm:py-32"><div className="mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div><p className="eyebrow">Pembayaran yang sederhana</p><h2 className="display mt-5 text-4xl sm:text-5xl">Booking, transfer, konfirmasi. Selesai.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Pelanggan transfer langsung ke rekening Anda. Anda tetap menentukan instruksi pembayaran dan melakukan konfirmasi dari platform.</p></div><Image src="/assets/images/payment-flow-v2.png" alt="Alur pembayaran rental" width={2135} height={736} className="w-full" /></div></section></>;
}

function AboutPage() {
  return <><PageIntro eyebrow="Tentang kami" title={<>Kami sedang membangun ekosistem rental di Indonesia.</>} body="Rental Platform hadir untuk membuat teknologi rental lebih mudah diakses oleh pemilik rental kecil maupun besar. Kami membangun bersama partner, bukan menjual kepada klien." /><section className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-32"><Image src="/assets/images/partner-owner-v2.png" alt="Pemilik rental Indonesia menggunakan teknologi untuk bisnisnya" width={1122} height={1402} className="w-full rounded-[2rem]" /><div><p className="eyebrow">Cara kami bekerja</p><h2 className="display mt-5 text-4xl sm:text-5xl">Partner kami ikut membentuk platform ini.</h2><p className="mt-7 text-lg leading-8 text-muted-foreground">Kami mendengarkan masukan dari lapangan, memahami tantangan operasional rental, lalu membangun fitur yang membantu bisnis berjalan lebih rapi.</p><div className="mt-10 space-y-7">{[["01", "Kami tumbuh bersama", "Ketika bisnis partner berkembang, platform kami juga berkembang."], ["02", "Kami mendengarkan", "Masukan partner menjadi bagian dari keputusan produk."], ["03", "Kami membuka peluang", "Bersama partner, kami menciptakan akses rental yang lebih luas."]].map(([number, title, body]) => <div key={number} className="grid grid-cols-[3rem_1fr] gap-4"><span className="text-sm font-bold text-primary">{number}</span><div><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 leading-7 text-muted-foreground">{body}</p></div></div>)}</div></div></section><div className="mx-5 mb-24 overflow-hidden rounded-[2rem] sm:mx-8 lg:mx-auto lg:max-w-[1240px]"><Image src="/assets/images/partner-landscape-v2.png" alt="Lanskap Indonesia sebagai simbol perjalanan bersama" width={2172} height={724} className="h-auto w-full" /></div></>;
}

function FaqPage() {
  return <><PageIntro eyebrow="Pertanyaan umum" title={<>Ada pertanyaan? Kami siap membantu.</>} body="Temukan jawaban tentang biaya, kontrol bisnis, pembayaran, domain, dan cara bergabung sebagai partner Rental Platform." /><section className="mx-auto grid max-w-[1240px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:py-32"><div><p className="eyebrow">Jawaban untuk partner</p><h2 className="display mt-5 text-4xl sm:text-5xl">Hal-hal yang sering ditanyakan.</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Jika masih ada yang belum jelas, hubungi tim support kami.</p></div><Faq items={faqItems.map(([q, a], index) => ({ id: `seo-q${index}`, q, a }))} /></section></>;
}

function FinalCta() {
  return <section className="mx-5 mb-8 rounded-[2rem] bg-ink px-6 py-14 text-white sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-[1240px] lg:px-16 lg:py-16"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><h2 className="display max-w-2xl text-4xl sm:text-5xl">Mari bangun bisnis rental yang lebih mudah bersama.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-white/70">Mudah, terjangkau, dan dibuat untuk bisnis Anda.</p></div><Link href={signup} className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-marigold px-7 font-bold text-ink">Jadi Partner Sekarang <ArrowRight className="h-4 w-4" /></Link></div></section>;
}
