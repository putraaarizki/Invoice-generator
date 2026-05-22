import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { InvoiceData } from "@/types/invoice";

// ── POST /api/invoices — Save an invoice ──────────────────────────────────────
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { data: InvoiceData };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const invoiceData = body?.data;

  if (!invoiceData || !invoiceData.invoiceNumber || !invoiceData.clientName) {
    return NextResponse.json(
      { error: "Data invoice tidak lengkap" },
      { status: 400 }
    );
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
    .select()
    .single();

  if (error) {
    console.error("[POST /api/invoices] Supabase error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan invoice" },
      { status: 500 }
    );
  }

  return NextResponse.json({ invoice: data }, { status: 201 });
}

// ── GET /api/invoices — List user's invoices ──────────────────────────────────
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, type, client_name, grand_total, currency, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/invoices] Supabase error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }

  return NextResponse.json({ invoices: data ?? [] });
}
