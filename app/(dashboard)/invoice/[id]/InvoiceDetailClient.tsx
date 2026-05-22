"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useInvoice } from "@/hooks/useInvoice";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import InvoiceActions from "@/components/invoice/InvoiceActions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateInvoice } from "./actions";
import type { InvoiceData } from "@/types/invoice";

interface Props {
  invoiceId: string;
  initialData: InvoiceData;
  status: "draft" | "sent" | "paid";
  invoiceNumber: string;
}

export default function InvoiceDetailClient({
  invoiceId,
  initialData,
  status,
  invoiceNumber,
}: Props) {
  const [isPendingUpdate, startUpdate] = useTransition();

  const {
    invoiceData,
    updateField,
    updateItem,
    addItem,
    removeItem,
  } = useInvoice(initialData);

  const handleUpdate = async () => {
    if (!invoiceData) return;
    return new Promise<void>((resolve) => {
      startUpdate(async () => {
        const result = await updateInvoice(invoiceId, invoiceData);
        if (result.success) {
          toast.success("Invoice berhasil diperbarui!");
        } else {
          toast.error("Gagal memperbarui.", { description: result.error });
        }
        resolve();
      });
    });
  };

  if (!invoiceData) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 -ml-2"
          render={<Link href="/history" />}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div>
            <h2 className="text-xl font-bold leading-tight">
              {invoiceData.type === "quotation" ? "Quotation" : "Invoice"}{" "}
              <span className="text-muted-foreground font-normal">
                #{invoiceNumber}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">
              {invoiceData.clientName}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 items-start">
        {/* Left: form + actions */}
        <div className="flex flex-col gap-4 md:max-h-[calc(100vh-9rem)] md:overflow-y-auto">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <InvoiceForm
              data={invoiceData}
              onUpdateField={updateField}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Aksi
            </p>
            <InvoiceActions
              data={invoiceData}
              onSave={handleUpdate}
              saveLabel="Update Invoice"
              isSaving={isPendingUpdate}
            />
          </div>
        </div>

        {/* Right: preview */}
        <div className="md:sticky md:top-6">
          <div className="rounded-xl border shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none">
            <div className="overflow-auto max-h-[calc(100vh-8rem)]">
              <div className="origin-top-left min-w-[595px]">
                <InvoicePreview data={invoiceData} />
              </div>
            </div>
          </div>

          <div className="hidden md:block mt-4 rounded-xl border bg-card p-4 shadow-sm">
            <InvoiceActions
              data={invoiceData}
              onSave={handleUpdate}
              saveLabel="Update Invoice"
              isSaving={isPendingUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "draft" | "sent" | "paid" }) {
  const map = {
    paid: cn("bg-green-100 text-green-700 border-green-200 hover:bg-green-100"),
    sent: cn("bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100"),
    draft: undefined,
  } as const;

  return (
    <Badge
      variant={status === "draft" ? "outline" : "default"}
      className={map[status]}
    >
      {status === "paid" ? "Paid" : status === "sent" ? "Sent" : "Draft"}
    </Badge>
  );
}
