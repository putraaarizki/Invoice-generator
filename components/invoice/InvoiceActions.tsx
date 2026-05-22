"use client";

import { Download, Save, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceData } from "@/types/invoice";

interface Props {
  data: InvoiceData;
  /** If provided, a Save button is shown that calls this handler */
  onSave?: () => Promise<void>;
  saveLabel?: string;
  isSaving?: boolean;
}

export default function InvoiceActions({
  data,
  onSave,
  saveLabel = "Simpan Invoice",
  isSaving = false,
}: Props) {
  // ── Download PDF via print ──────────────────────────────
  const handleDownload = () => {
    window.print();
  };

  // ── Share via WhatsApp ──────────────────────────────────
  const handleWhatsApp = () => {
    const isQuotation = data.type === "quotation";
    const docLabel = isQuotation ? "Quotation" : "Invoice";
    const formatted = new Intl.NumberFormat(
      data.currency === "IDR" ? "id-ID" : "en-US",
      { style: "currency", currency: data.currency, minimumFractionDigits: 0 }
    ).format(data.grandTotal);

    const lines = [
      `Halo ${data.clientName || ""},`,
      ``,
      `Berikut ${docLabel} dari ${data.senderName || "kami"}:`,
      `📄 No: ${data.invoiceNumber}`,
      `💰 Total: ${formatted}`,
      isQuotation && data.validUntil
        ? `📅 Berlaku hingga: ${data.validUntil}`
        : !isQuotation && data.dueDate
        ? `📅 Jatuh tempo: ${data.dueDate}`
        : null,
      ``,
      data.paymentTerms ? `💳 ${data.paymentTerms}` : null,
      ``,
      `Terima kasih!`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-2">
      {/* Save — only rendered when a handler is provided */}
      {onSave && (
        <Button
          className="w-full gap-2"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saveLabel}
            </>
          )}
        </Button>
      )}

      {/* Download PDF */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleDownload}
      >
        <Download className="w-4 h-4" />
        Download PDF
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
        onClick={handleWhatsApp}
      >
        <MessageCircle className="w-4 h-4" />
        Kirim via WhatsApp
      </Button>
    </div>
  );
}
