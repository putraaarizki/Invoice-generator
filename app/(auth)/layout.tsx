import Link from "next/link";
import { FileText, Sparkles, Clock, Download } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Ketik deskripsi proyek, invoice langsung jadi dalam hitungan detik.",
  },
  {
    icon: FileText,
    title: "Profesional",
    desc: "Template invoice & quotation siap pakai, tampilan bersih dan rapi.",
  },
  {
    icon: Clock,
    title: "Riwayat Lengkap",
    desc: "Semua invoice tersimpan otomatis, bisa diedit kapan saja.",
  },
  {
    icon: Download,
    title: "Export PDF",
    desc: "Download sebagai PDF A4 langsung dari browser, tanpa plugin.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel (hidden on mobile) ────────── */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 bg-gray-950 text-white p-12 justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            AI Invoice
          </span>
        </Link>

        {/* Headline + features */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Invoice profesional
              <br />
              <span className="text-white/50">dalam hitungan detik.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Cukup ketik deskripsi proyekmu dalam bahasa sehari-hari — AI akan
              langsung menyusun invoice yang siap dikirim.
            </p>
          </div>

          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="w-4 h-4 text-white/80" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{f.title}</p>
                  <p className="text-sm text-white/50 mt-0.5 leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} AI Invoice Generator. Untuk freelancer
          &amp; agency Indonesia.
        </p>
      </div>

      {/* ── Right: Clerk form ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 mb-8 text-gray-900"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-base">AI Invoice</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
