import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInvoices } from "./actions";
import HistoryTable from "./HistoryTable";

// ── Skeleton loader ───────────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <div className="h-10 border-b bg-muted/50 px-4 flex items-center gap-6">
        {[140, 160, 80, 110, 100, 90, 56].map((w, i) => (
          <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-14 border-b last:border-0 px-4 flex items-center gap-6"
        >
          {[140, 160, 80, 110, 100, 90, 56].map((w, j) => (
            <Skeleton key={j} className="h-4 rounded" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-16 text-center gap-4 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <FileText className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-base">Belum ada invoice</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Buat invoice pertamamu menggunakan AI generator, lalu simpan untuk
          melihatnya di sini.
        </p>
      </div>
      <Button className="mt-2 gap-2" render={<Link href="/dashboard" />}>
        <Plus className="w-4 h-4" />
        Buat Invoice
      </Button>
    </div>
  );
}

// ── Async data fetcher ────────────────────────────────────────────────────────

async function InvoiceList() {
  const result = await getInvoices();

  if (!result.success) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {result.error}
      </div>
    );
  }

  if (result.invoices.length === 0) {
    return <EmptyState />;
  }

  return <HistoryTable initialInvoices={result.invoices} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Riwayat Invoice</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Semua invoice dan quotation yang pernah kamu buat.
          </p>
        </div>
        <Button className="gap-2" render={<Link href="/dashboard" />}>
          <Plus className="w-4 h-4" />
          Buat Invoice Baru
        </Button>
      </div>

      {/* Table with Suspense for streaming skeleton */}
      <Suspense fallback={<HistorySkeleton />}>
        <InvoiceList />
      </Suspense>
    </div>
  );
}
