"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, PenLine, Sparkles, Zap, Edit3, Download } from "lucide-react";
import { toast } from "sonner";
import { useInvoice } from "@/hooks/useInvoice";
import { useSenderProfile } from "@/hooks/useSenderProfile";
import { saveInvoice } from "./actions";
import PromptInput from "@/components/invoice/PromptInput";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import InvoiceActions from "@/components/invoice/InvoiceActions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SenderInfo } from "@/hooks/useInvoice";

type MobileTab = "form" | "preview";

// ── How-it-works steps shown before first generation ─────────────────────────

const steps = [
  {
    icon: Zap,
    label: "Ketik deskripsi",
    desc: "Tulis kebutuhan invoice dalam bahasa bebas — Indonesia atau Inggris.",
  },
  {
    icon: Sparkles,
    label: "AI generate",
    desc: "AI membaca konteks & langsung menyusun invoice lengkap.",
  },
  {
    icon: Edit3,
    label: "Edit & sesuaikan",
    desc: "Ubah item, nominal, atau data klien sebelum dikirim.",
  },
  {
    icon: Download,
    label: "Download PDF",
    desc: "Ekspor ke PDF A4 siap kirim, atau share via WhatsApp.",
  },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useSenderProfile();
  const [isPendingSave, startSave] = useTransition();
  const [mobileTab, setMobileTab] = useState<MobileTab>("form");

  const {
    invoiceData,
    isGenerating,
    error,
    generate,
    updateField,
    updateItem,
    addItem,
    removeItem,
    reset,
  } = useInvoice();

  // Map SenderProfile → SenderInfo
  const senderInfo: SenderInfo = profile
    ? {
        senderName: profile.companyName,
        senderEmail: profile.companyEmail,
        senderAddress: profile.companyAddress,
        senderPhone: profile.companyPhone,
        currency: profile.defaultCurrency,
        taxRate: profile.defaultTaxRate,
        paymentTerms: profile.defaultPaymentTerms,
      }
    : {};

  const handleGenerate = (prompt: string) => {
    generate(prompt, senderInfo);
  };

  const handleSave = async () => {
    if (!invoiceData) return;
    return new Promise<void>((resolve) => {
      startSave(async () => {
        const result = await saveInvoice(invoiceData);
        if (result.success) {
          toast.success("Invoice berhasil disimpan!", {
            description: `#${invoiceData.invoiceNumber}`,
          });
          router.push("/history");
        } else {
          toast.error("Gagal menyimpan. Coba lagi.", {
            description: result.error,
          });
        }
        resolve();
      });
    });
  };

  const hasInvoice = !!invoiceData;

  return (
    <div className="h-full flex flex-col">
      {/* ── Page header ─────────────────────────────────── */}
      <div className="flex-none pb-4">
        <h2 className="text-2xl font-bold">Generator Invoice</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Ketik deskripsi project kamu, AI akan membuat invoice secara otomatis.
        </p>
      </div>

      {/* ── Mobile tab switcher (only when invoice exists) ─ */}
      {hasInvoice && (
        <div className="flex-none flex md:hidden border rounded-lg overflow-hidden mb-4">
          <button
            onClick={() => setMobileTab("form")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
              mobileTab === "form"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <PenLine className="w-4 h-4" />
            Form
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
              mobileTab === "preview"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <FileText className="w-4 h-4" />
            Preview
          </button>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────── */}
      <div
        className={cn(
          "flex-1 min-h-0",
          hasInvoice
            ? "grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 items-start"
            : "grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start max-w-5xl"
        )}
      >
        {/* ── Left/main panel ──────────────────────────── */}
        <div
          className={cn(
            "flex flex-col gap-4",
            hasInvoice && mobileTab === "preview" ? "hidden md:flex" : "flex",
            hasInvoice && "md:max-h-[calc(100vh-9rem)] md:overflow-y-auto"
          )}
        >
          {/* Prompt card */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <PromptInput
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              hasInvoice={hasInvoice}
              onReset={reset}
            />
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-start gap-2">
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Generating skeleton */}
          {isGenerating && !hasInvoice && (
            <div className="rounded-xl border bg-card p-8 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-muted" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">AI sedang menyusun invoice...</p>
                <p className="text-xs text-muted-foreground">
                  Biasanya selesai dalam 5–10 detik
                </p>
              </div>
              {/* Shimmer lines */}
              <div className="w-full space-y-2 mt-2">
                {[100, 80, 90, 60].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-muted animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invoice form (after generation) */}
          {hasInvoice && (
            <>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <InvoiceForm
                  data={invoiceData}
                  onUpdateField={updateField}
                  onUpdateItem={updateItem}
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                />
              </div>

              <Separator className="md:hidden" />

              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Aksi
                </p>
                <InvoiceActions
                  data={invoiceData}
                  onSave={handleSave}
                  saveLabel="Simpan Invoice"
                  isSaving={isPendingSave}
                />
              </div>
            </>
          )}
        </div>

        {/* ── Right panel: Preview OR how-it-works ─────── */}
        {hasInvoice ? (
          <div
            className={cn(
              mobileTab === "form" ? "hidden md:block" : "block",
              "md:sticky md:top-6"
            )}
          >
            {/* Preview card */}
            <div className="rounded-xl border shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none">
              <div className="overflow-auto max-h-[calc(100vh-8rem)]">
                <div className="origin-top-left min-w-[595px]">
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>
            </div>

            {/* Actions below preview (desktop only) */}
            <div className="hidden md:block mt-4 rounded-xl border bg-card p-4 shadow-sm">
              <InvoiceActions
                data={invoiceData}
                onSave={handleSave}
                saveLabel="Simpan Invoice"
                isSaving={isPendingSave}
              />
            </div>
          </div>
        ) : (
          /* How-it-works guide (only before first generation) */
          <div className="hidden lg:flex flex-col gap-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cara Kerja
              </p>
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium tabular-nums">
                        {i + 1}.
                      </span>
                      <p className="text-sm font-medium">{step.label}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips card */}
            <div className="rounded-xl border bg-amber-50 border-amber-200 p-5 space-y-2">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                💡 Tips
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Semakin detail deskripsi kamu, semakin akurat hasil AI-nya.
                Sebutkan nama klien, jenis pekerjaan, nominal, dan deadline bayar.
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Tekan <kbd className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 font-mono text-[11px]">Ctrl</kbd>
                {" + "}
                <kbd className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 font-mono text-[11px]">Enter</kbd>
                {" "}untuk generate cepat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
