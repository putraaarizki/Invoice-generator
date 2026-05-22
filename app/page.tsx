"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Instrument_Serif } from "next/font/google";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// ─── Data ────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "Apakah gratis selamanya?", a: "Ya, tier gratis tersedia dengan fitur lengkap untuk kebutuhan sehari-hari freelancer dan agency kecil." },
  { q: "AI bisa paham bahasa Indonesia?", a: "Ya, didukung Google Gemini yang mendukung Bahasa Indonesia secara native dengan sangat baik." },
  { q: "Data invoice saya aman?", a: "Invoice disimpan di database terenkripsi dengan Row Level Security — hanya akun kamu yang bisa mengaksesnya." },
  { q: "Bisa export ke format apa?", a: "Saat ini mendukung PDF siap cetak format A4 yang bisa langsung dikirim ke klien." },
  { q: "Apakah bisa untuk quotation juga?", a: "Ya! Selain invoice, kamu bisa generate quotation/penawaran harga dengan format yang sama profesionalnya." },
];

const testimonials = [
  { initials: "BS", name: "Budi Santoso", role: "Freelance Web Developer, Jakarta", quote: "Dulu 30 menit bikin invoice, sekarang 30 detik. Game changer buat freelancer." },
  { initials: "RA", name: "Rina Anggraini", role: "Creative Director, Surabaya", quote: "Klien saya terkesan karena invoicenya terlihat sangat profesional. Padahal cuma butuh satu kalimat." },
  { initials: "DH", name: "Dimas Hadiyanto", role: "UI/UX Designer, Bandung", quote: "Multi-currency-nya sangat membantu untuk klien luar negeri. Tidak perlu kalkulasi manual lagi." },
];

const painPoints = [
  { icon: "🕐", title: "30+ Menit per Invoice", desc: "Mengisi template Excel atau Word satu per satu, menghitung total secara manual." },
  { icon: "🔢", title: "Rentan Salah Hitung", desc: "Salah ketik angka, lupa pajak, atau format yang tidak konsisten antar invoice." },
  { icon: "😤", title: "Klien Lama Menunggu", desc: "Invoice tertunda karena template tidak siap, klien tidak sabar menunggu." },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ isSignedIn }: { isSignedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg border-b border-zinc-200 shadow-sm" : "bg-white border-b border-zinc-100"}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-zinc-900 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
            <span className="text-white text-[11px] font-black tracking-tight">AI</span>
          </div>
          <span className="text-[15px] tracking-tight">AI Invoice</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[{ label: "Fitur", href: "#fitur" }, { label: "Cara Kerja", href: "#cara-kerja" }, { label: "FAQ", href: "#faq" }].map((item) => (
            <a key={item.href} href={item.href} className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium">{item.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/sign-in" className="hidden sm:inline-flex text-[13px] text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors font-medium">Masuk</Link>
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="text-[13px] bg-zinc-900 text-white px-5 py-2.5 rounded-full hover:bg-zinc-700 transition-colors font-semibold">
            {isSignedIn ? "Dashboard →" : "Mulai Gratis"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Invoice Preview ─────────────────────────────────────────────────────

function HeroPreview() {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-100 via-blue-50 to-indigo-100 rounded-3xl blur-2xl opacity-60" />

      <div className="relative rounded-2xl border border-zinc-200/80 bg-white shadow-2xl overflow-hidden">
        {/* Browser bar */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-zinc-200/80 rounded-md h-5 max-w-xs mx-auto flex items-center justify-center">
            <span className="text-[10px] text-zinc-400 font-medium">app.aiinvoice.id/dashboard</span>
          </div>
        </div>

        {/* App layout */}
        <div className="flex min-h-72">
          {/* Sidebar */}
          <div className="w-48 bg-zinc-50 border-r border-zinc-100 p-4 hidden sm:flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-zinc-900 rounded-lg" />
              <div className="w-20 h-3 bg-zinc-800 rounded" />
            </div>
            {["bg-zinc-900", "bg-zinc-200", "bg-zinc-200"].map((bg, i) => (
              <div key={i} className={`w-full h-8 ${bg} rounded-lg flex items-center px-3 gap-2`}>
                <div className={`w-3.5 h-3.5 rounded ${i === 0 ? "bg-white/30" : "bg-zinc-300"}`} />
                <div className={`w-16 h-2 rounded ${i === 0 ? "bg-white/40" : "bg-zinc-300"}`} />
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="flex-1 p-5 space-y-4 bg-white">
            {/* AI Prompt input */}
            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">AI</span>
                </div>
                <span className="text-[11px] font-semibold text-violet-700">Generator AI</span>
              </div>
              <div className="text-[11px] text-zinc-500 bg-white rounded-lg border border-zinc-200 p-2.5 leading-relaxed">
                &quot;Buat invoice untuk PT Maju Jaya, jasa website company profile Rp 3.500.000, jatuh tempo 14 hari&quot;
              </div>
              <div className="flex justify-end">
                <div className="bg-violet-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full">Generate ✦</div>
              </div>
            </div>

            {/* Generated invoice card */}
            <div className="rounded-xl border border-zinc-100 p-4 space-y-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[13px] font-bold text-zinc-900">INVOICE</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">INV-2025-047</div>
                  <div className="text-[10px] text-zinc-500 mt-2 font-medium">Kepada: PT Maju Jaya</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Menunggu Bayar</div>
                  <div className="text-[10px] text-zinc-400 mt-1.5">Jatuh tempo: 29 Mei 2025</div>
                </div>
              </div>

              <div className="border-t border-zinc-50 pt-2 space-y-1">
                {[
                  { desc: "Jasa Pembuatan Website Company Profile", qty: 1, total: "Rp 3.500.000" },
                  { desc: "PPN 11%", qty: null, total: "Rp 385.000" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1 text-[10px]">
                    <span className="text-zinc-600">{item.desc}</span>
                    <span className={`font-semibold ${i === 1 ? "text-zinc-400" : "text-zinc-800"}`}>{item.total}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1.5 border-t border-zinc-100 text-[11px] font-bold">
                  <span className="text-zinc-900">Total</span>
                  <span className="text-zinc-900">Rp 3.885.000</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <div className="flex-1 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px] font-semibold">Download PDF</span>
                </div>
                <div className="w-20 h-7 border border-zinc-200 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-500 text-[10px]">Simpan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <div className="min-h-screen bg-white text-zinc-900">
        <Navbar isSignedIn={!!isSignedIn} />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="pt-16 pb-8 md:pt-24 md:pb-12 px-5 text-center overflow-hidden">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-violet-200">
              <span className="text-violet-400">✦</span> Didukung Google Gemini AI
            </div>

            {/* Headline — mixed serif + weight */}
            <h1 className="text-[2.6rem] sm:text-5xl md:text-[4rem] lg:text-[4.5rem] leading-[1.08] tracking-tight text-zinc-900">
              <span className={`${serif.className} italic text-zinc-700`}>Invoice profesional,</span>
              <br />
              <span className="font-black text-zinc-900">dibuat AI</span>
              <br />
              <span className={`${serif.className} italic text-zinc-700`}>dalam hitungan detik.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-zinc-500 max-w-lg mx-auto leading-relaxed">
              Ketik deskripsi projekmu dalam bahasa natural — Indonesia atau Inggris.
              AI kami langsung ubah jadi invoice siap kirim.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/sign-up" className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-all shadow-md hover:shadow-lg">
                Mulai Gratis →
              </Link>
              <a href="#cara-kerja" className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-zinc-700 px-8 py-3.5 rounded-full text-sm font-semibold border border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition-all">
                Lihat Cara Kerja
              </a>
            </div>
            <p className="text-xs text-zinc-400">Gratis selamanya · Tidak perlu kartu kredit</p>

            {/* Hero Visual */}
            <div className="pt-6">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ──────────────────────────────────────── */}
        <section className="bg-zinc-950 py-10 px-5">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-7">
              Dipercaya freelancer &amp; agency di Indonesia 🇮🇩
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-0 sm:divide-x sm:divide-zinc-800">
              {[{ value: "500+", label: "Invoice Dibuat" }, { value: "100+", label: "Pengguna Aktif" }, { value: "4.9★", label: "Rating Pengguna" }].map((s) => (
                <div key={s.label} className="sm:px-14 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PAIN POINTS ───────────────────────────────────────────── */}
        <section className="py-24 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-50 px-3 py-1 rounded-full">Masalah yang Sering Dialami</span>
              <h2 className={`${serif.className} italic text-4xl md:text-5xl text-zinc-900 mt-5 leading-tight`}>
                Bikin invoice pakai<br />cara lama itu menyiksa.
              </h2>
              <p className="text-zinc-500 mt-4 max-w-md mx-auto text-sm">Freelancer Indonesia rata-rata buang 3+ jam per minggu hanya untuk urusan administrasi invoicing.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {painPoints.map((p) => (
                <div key={p.title} className="relative rounded-2xl border border-red-100 bg-red-50/40 p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/50 rounded-full -translate-y-8 translate-x-8 blur-xl" />
                  <span className="text-3xl">{p.icon}</span>
                  <h3 className="font-bold text-zinc-900 mt-3 mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* The solution bridge */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-zinc-900 text-white px-6 py-3 rounded-2xl">
                <span className="text-xl">✦</span>
                <span className="text-sm font-medium">AI Invoice menyelesaikan semua masalah ini dalam 30 detik</span>
                <span className="text-xl">✦</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────── */}
        <section id="fitur" className="py-24 px-5 bg-zinc-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-500 bg-violet-50 px-3 py-1 rounded-full">Fitur Unggulan</span>
              <h2 className={`${serif.className} italic text-4xl md:text-5xl text-zinc-900 mt-5 leading-tight`}>
                Semua yang kamu butuhkan,<br />sudah tersedia.
              </h2>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Large card: AI */}
              <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-7 text-white relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16" />
                <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl mb-5">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI yang Paham Bahasa Indonesia</h3>
                <p className="text-violet-200 text-sm leading-relaxed max-w-sm">
                  Tulis deskripsi dalam bahasa apapun — Indonesia, Inggris, atau campuran keduanya. Gemini AI akan memahami dan mengisi semua detail secara otomatis.
                </p>
                <div className="mt-5 bg-white/10 rounded-xl p-3 text-xs text-violet-100 font-mono leading-relaxed">
                  &quot;Invoice buat Pak Budi, desain logo Rp 2.5jt, revisi 2x included...&quot;
                </div>
              </div>

              {/* Small card: PDF */}
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">📄</div>
                <h3 className="font-bold text-zinc-900 mb-2">Download PDF Instan</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Format A4 profesional. Satu klik, langsung siap kirim ke klien.</p>
                <div className="mt-4 flex gap-1.5">
                  {["PDF", "A4", "Print-ready"].map((tag) => (
                    <span key={tag} className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Small card: Edit */}
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">✏️</div>
                <h3 className="font-bold text-zinc-900 mb-2">Edit Bebas Setelah Generate</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Semua field bisa diubah — nama klien, harga, deskripsi, pajak.</p>
              </div>

              {/* Large card: Multi-currency */}
              <div className="lg:col-span-2 rounded-2xl bg-zinc-900 p-7 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full -translate-y-20 translate-x-20" />
                <div className="flex justify-between items-start">
                  <div>
                    <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-5">💱</div>
                    <h3 className="text-xl font-bold mb-2">Multi-Currency &amp; Riwayat Lengkap</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">IDR, USD, EUR, SGD — semua invoice tersimpan otomatis dan bisa diakses kapan saja.</p>
                  </div>
                  <div className="hidden sm:flex flex-col gap-2 shrink-0">
                    {[
                      { currency: "IDR", amount: "Rp 3.500.000", color: "bg-green-500/20 text-green-400" },
                      { currency: "USD", amount: "$250.00", color: "bg-blue-500/20 text-blue-400" },
                      { currency: "SGD", amount: "S$340.00", color: "bg-yellow-500/20 text-yellow-400" },
                    ].map((c) => (
                      <div key={c.currency} className={`${c.color} rounded-lg px-3 py-2 text-xs font-semibold min-w-[130px] flex justify-between`}>
                        <span>{c.currency}</span><span>{c.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Small card: Speed */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-6">
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-2xl mb-4">⚡</div>
                <h3 className="font-bold text-zinc-900 mb-2">Selesai dalam 30 Detik</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">Lebih cepat dari template manual manapun yang pernah kamu pakai.</p>
                <div className="mt-4 text-3xl font-black text-orange-500">30s</div>
              </div>

              {/* Small card: Quotation */}
              <div className="rounded-2xl bg-white border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-pink-100 rounded-xl flex items-center justify-center text-2xl mb-4">📋</div>
                <h3 className="font-bold text-zinc-900 mb-2">Invoice &amp; Quotation</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Generate keduanya dari satu tempat. AI otomatis paham mana yang diminta.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
        <section id="cara-kerja" className="py-24 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">Cara Kerja</span>
              <h2 className={`${serif.className} italic text-4xl md:text-5xl text-zinc-900 mt-5`}>
                Semudah kirim pesan WhatsApp.
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-0">
              {[
                { num: "01", title: "Tulis Deskripsi Projek", desc: "Ceritakan projek kamu seperti ngobrol biasa. Tidak perlu format khusus.", color: "bg-violet-600" },
                { num: "02", title: "AI Generate Invoice", desc: "Gemini AI mengisi semua detail otomatis — item, harga, tanggal, total, dan pajak.", color: "bg-blue-600" },
                { num: "03", title: "Download atau Simpan", desc: "Edit jika perlu, download PDF siap kirim, atau simpan ke riwayat.", color: "bg-green-600" },
              ].map((step, i) => (
                <div key={step.num} className="flex flex-col md:flex-row items-center flex-1">
                  <div className="flex flex-col items-center text-center flex-1 px-6 group">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} text-white flex items-center justify-center font-black text-lg mb-5 group-hover:scale-110 transition-transform`}>
                      {step.num}
                    </div>
                    <h3 className="font-bold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed max-w-[180px]">{step.desc}</p>
                  </div>
                  {i < 2 && <div className="hidden md:block text-3xl text-zinc-200 shrink-0 mt-4">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORKFLOW DEMO ─────────────────────────────────────────── */}
        <section className="py-16 px-5 bg-zinc-50">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-zinc-950 p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-900/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-900/30 rounded-full blur-3xl" />

              <div className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-6">Demo Langsung</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Input */}
                  <div className="space-y-3">
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-3">1. Kamu Tulis Ini:</div>
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-700 p-4 text-sm text-zinc-300 leading-relaxed font-mono">
                      &quot;Buat invoice untuk PT Kreatif Nusantara. Landing page design $500, logo design $200, 2 revisions $0. Add 10% tax.&quot;
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-violet-600 hover:bg-violet-500 transition-colors text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 cursor-pointer">
                        <span>✦</span> Generate Invoice
                      </div>
                    </div>
                  </div>

                  {/* Output */}
                  <div className="space-y-3">
                    <div className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-3">2. AI Generate Ini:</div>
                    <div className="bg-white rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-black text-zinc-900">INVOICE · INV-2025-089</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">PT Kreatif Nusantara</div>
                        </div>
                        <div className="text-[9px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">USD</div>
                      </div>
                      <div className="space-y-1 text-[10px] border-t border-zinc-100 pt-2">
                        {[["Landing page design", "$500.00"], ["Logo design", "$200.00"], ["2 Revisions", "$0.00"]].map(([d, p]) => (
                          <div key={d} className="flex justify-between text-zinc-600">
                            <span>{d}</span><span className="font-medium">{p}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-zinc-500 pt-1 border-t border-zinc-50">
                          <span>Tax 10%</span><span>$70.00</span>
                        </div>
                        <div className="flex justify-between font-black text-zinc-900 pt-1 text-[11px]">
                          <span>Total</span><span>$770.00</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <div className="flex-1 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
                          <span className="text-white text-[9px] font-bold">Download PDF</span>
                        </div>
                        <div className="w-16 h-7 border border-zinc-200 rounded-lg flex items-center justify-center">
                          <span className="text-zinc-400 text-[9px]">Simpan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
        <section className="py-24 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className={`${serif.className} italic text-4xl md:text-5xl text-zinc-900`}>
                Kata mereka yang sudah pakai.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={t.name} className={`rounded-2xl p-6 space-y-4 ${i === 1 ? "bg-zinc-950 text-white border border-zinc-800" : "bg-zinc-50 border border-zinc-200"}`}>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className={`text-sm leading-relaxed italic ${i === 1 ? "text-zinc-300" : "text-zinc-700"}`}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 1 ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-600"}`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${i === 1 ? "text-white" : "text-zinc-900"}`}>{t.name}</div>
                      <div className={`text-xs ${i === 1 ? "text-zinc-500" : "text-zinc-400"}`}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 px-5 bg-zinc-50">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`${serif.className} italic text-4xl md:text-5xl text-zinc-900`}>
                Pertanyaan Umum
              </h2>
              <p className="text-zinc-500 mt-3 text-sm">Ada pertanyaan lain? Hubungi kami kapan saja.</p>
            </div>
            <Accordion className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={i} className="bg-white border border-zinc-200 rounded-xl px-5 !border-b not-last:border-b">
                  <AccordionTrigger className="py-4 text-sm font-semibold text-zinc-900 hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-zinc-500 pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────── */}
        <section className="py-24 px-5 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-zinc-950 px-8 py-16 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-1/3 w-64 h-64 bg-violet-900/40 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs px-4 py-1.5 rounded-full border border-white/20">
                  ✦ Gratis, selamanya
                </div>
                <h2 className={`${serif.className} italic text-4xl md:text-5xl text-white leading-tight`}>
                  Siap kirim invoice<br />pertamamu?
                </h2>
                <p className="text-zinc-400 text-sm">Tidak perlu kartu kredit. Mulai dalam 30 detik.</p>
                <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-zinc-100 transition-all shadow-lg">
                  Mulai Sekarang →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="bg-zinc-950 px-5 pt-14 pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 pb-10 border-b border-zinc-800">
              <div>
                <Link href="/" className="flex items-center gap-2.5 font-bold text-white mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                    <span className="text-zinc-900 text-[11px] font-black">AI</span>
                  </div>
                  <span className="text-[15px]">AI Invoice</span>
                </Link>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Generator invoice dan quotation berbasis AI untuk freelancer &amp; agency Indonesia.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[{ label: "Fitur", href: "#fitur" }, { label: "Cara Kerja", href: "#cara-kerja" }, { label: "FAQ", href: "#faq" }, { label: "Masuk", href: "/sign-in" }, { label: "Daftar Gratis", href: "/sign-up" }].map((item) => (
                  <a key={item.href} href={item.href} className="text-xs text-zinc-400 hover:text-white transition-colors">{item.label}</a>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-8">
              <p className="text-xs text-zinc-600">© 2025 AI Invoice Generator. All rights reserved.</p>
              <p className="text-xs text-zinc-600">Made with ❤️ in Indonesia</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
