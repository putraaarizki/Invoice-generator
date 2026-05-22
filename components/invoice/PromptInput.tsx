"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLES = [
  "Invoice untuk PT Maju Jaya, jasa website company profile Rp 3.500.000, deadline bayar 7 hari",
  "Invoice for John Doe, landing page design $500, logo design $200, 10% tax",
  "Penawaran untuk Toko Berkah: konten IG 12 post Rp 1.200.000, caption writing Rp 300.000, PPN 11%",
  "Invoice buat Pak Budi, jasa konsultasi SEO 2 jam rate 500 ribu per jam",
];

interface Props {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  hasInvoice: boolean;
  onReset: () => void;
}

export default function PromptInput({
  onGenerate,
  isLoading,
  hasInvoice,
  onReset,
}: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 5 || isLoading) return;
    onGenerate(prompt.trim());
  };

  if (hasInvoice) {
    return (
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground border border-dashed rounded-xl py-3 hover:bg-muted transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Buat invoice / quotation baru
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Invoice untuk PT Maju Jaya, jasa desain logo Rp 2.500.000, deadline bayar 14 hari..."
          className="min-h-[110px] text-sm resize-none"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={isLoading || prompt.trim().length < 5}
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AI sedang generate invoice...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Invoice
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Ctrl + Enter untuk generate cepat
        </p>
      </form>

      {/* Contoh prompt */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">
          Coba contoh prompt:
        </p>
        <div className="space-y-1.5">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="w-full flex items-center gap-2 text-left text-xs text-muted-foreground bg-muted/50 hover:bg-muted px-3 py-2 rounded-lg transition-colors group"
            >
              <ChevronRight className="w-3 h-3 shrink-0 group-hover:text-foreground" />
              <span className="truncate">{ex}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
