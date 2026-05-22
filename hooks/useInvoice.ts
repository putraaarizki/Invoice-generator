"use client";

import { useState, useCallback } from "react";
import type { InvoiceData, LineItem, Currency } from "@/types/invoice";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recalcTotals(data: InvoiceData): InvoiceData {
  const items = data.items.map((item) => ({
    ...item,
    total: Math.round(item.qty * item.price * 100) / 100,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount =
    data.taxRate && data.taxRate > 0
      ? Math.round(subtotal * data.taxRate) / 100
      : undefined;
  const discountAmount = data.discountAmount ?? 0;
  const grandTotal = subtotal + (taxAmount ?? 0) - discountAmount;

  return {
    ...data,
    items,
    subtotal,
    taxAmount,
    grandTotal,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SenderInfo {
  senderName?: string;
  senderEmail?: string;
  senderAddress?: string;
  senderPhone?: string;
  currency?: Currency;
  taxRate?: number;
  paymentTerms?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInvoice(initialData?: InvoiceData) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(
    initialData ? recalcTotals(initialData) : null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (prompt: string, senderInfo: SenderInfo = {}) => {
      setIsGenerating(true);
      setError(null);

      try {
        const res = await fetch("/api/generate-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Gagal generate invoice");
        }

        // Merge data AI dengan info pengirim dari profil
        const merged: InvoiceData = {
          ...json.data,
          senderName: senderInfo.senderName ?? json.data.senderName ?? "",
          senderEmail: senderInfo.senderEmail ?? json.data.senderEmail ?? undefined,
          senderAddress: senderInfo.senderAddress ?? json.data.senderAddress ?? undefined,
          senderPhone: senderInfo.senderPhone ?? json.data.senderPhone ?? undefined,
          currency: json.data.currency ?? senderInfo.currency ?? "IDR",
          taxRate: json.data.taxRate ?? senderInfo.taxRate ?? undefined,
          paymentTerms:
            json.data.paymentTerms ?? senderInfo.paymentTerms ?? undefined,
        };

        setInvoiceData(recalcTotals(merged));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui"
        );
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const updateField = useCallback(
    <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
      setInvoiceData((prev) => {
        if (!prev) return null;
        return recalcTotals({ ...prev, [key]: value });
      });
    },
    []
  );

  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setInvoiceData((prev) => {
        if (!prev) return null;
        const items = prev.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        );
        return recalcTotals({ ...prev, items });
      });
    },
    []
  );

  const addItem = useCallback(() => {
    setInvoiceData((prev) => {
      if (!prev) return null;
      const newItem: LineItem = {
        id: `item-${Date.now()}`,
        description: "",
        qty: 1,
        price: 0,
        total: 0,
      };
      return recalcTotals({ ...prev, items: [...prev.items, newItem] });
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoiceData((prev) => {
      if (!prev || prev.items.length <= 1) return prev;
      return recalcTotals({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      });
    });
  }, []);

  const reset = useCallback(() => {
    setInvoiceData(null);
    setError(null);
  }, []);

  return {
    invoiceData,
    isGenerating,
    error,
    generate,
    updateField,
    updateItem,
    addItem,
    removeItem,
    reset,
  };
}
