import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 gap-6">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <FileSearch className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-lg font-medium">Halaman tidak ditemukan</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Ke Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Beranda
        </Link>
      </div>
    </div>
  );
}
