"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Currency, DocumentType } from "@/types/invoice";

export interface InvoiceRow {
  id: string;
  invoice_number: string;
  type: DocumentType;
  client_name: string;
  grand_total: number;
  currency: Currency;
  status: "draft" | "sent" | "paid";
  created_at: string;
}

export async function getInvoices(): Promise<
  { success: true; invoices: InvoiceRow[] } | { success: false; error: string }
> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Tidak terautentikasi" };

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, type, client_name, grand_total, currency, status, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getInvoices]", error.message);
    return { success: false, error: "Gagal mengambil data" };
  }

  return { success: true, invoices: (data ?? []) as InvoiceRow[] };
}

export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "sent" | "paid"
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Tidak terautentikasi" };

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId); // RLS safety: only own invoices

  if (error) {
    console.error("[updateInvoiceStatus]", error.message);
    return { success: false, error: "Gagal mengubah status" };
  }

  return { success: true };
}
