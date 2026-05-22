"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { InvoiceData } from "@/types/invoice";

export interface FullInvoiceRow {
  id: string;
  invoice_number: string;
  type: string;
  client_name: string;
  grand_total: number;
  currency: string;
  status: "draft" | "sent" | "paid";
  created_at: string;
  data: InvoiceData;
}

export async function getInvoiceById(id: string): Promise<
  | { success: true; invoice: FullInvoiceRow }
  | { success: false; error: string }
> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Tidak terautentikasi" };

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, type, client_name, grand_total, currency, status, created_at, data")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { success: false, error: "Invoice tidak ditemukan" };
  }

  return { success: true, invoice: data as FullInvoiceRow };
}

export async function updateInvoice(
  id: string,
  invoiceData: InvoiceData
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Tidak terautentikasi" };

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("invoices")
    .update({
      invoice_number: invoiceData.invoiceNumber,
      type: invoiceData.type,
      client_name: invoiceData.clientName,
      grand_total: invoiceData.grandTotal,
      currency: invoiceData.currency,
      data: invoiceData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[updateInvoice]", error.message);
    return { success: false, error: "Gagal memperbarui invoice" };
  }

  return { success: true };
}
