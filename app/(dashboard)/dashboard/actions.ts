"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { InvoiceData } from "@/types/invoice";

export async function saveInvoice(
  invoiceData: InvoiceData
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Tidak terautentikasi" };

  if (!invoiceData?.invoiceNumber || !invoiceData?.clientName) {
    return { success: false, error: "Data invoice tidak lengkap" };
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id: userId,
      invoice_number: invoiceData.invoiceNumber,
      type: invoiceData.type,
      client_name: invoiceData.clientName,
      grand_total: invoiceData.grandTotal,
      currency: invoiceData.currency,
      status: "draft",
      data: invoiceData,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[saveInvoice]", error.message);
    return { success: false, error: "Gagal menyimpan invoice" };
  }

  return { success: true, id: data.id as string };
}
