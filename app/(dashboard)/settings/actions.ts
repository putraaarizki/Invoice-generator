"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function saveSenderProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = {
    user_id: userId,
    company_name: formData.get("companyName") as string,
    company_email: formData.get("companyEmail") as string,
    company_address: formData.get("companyAddress") as string,
    company_phone: formData.get("companyPhone") as string,
    default_currency: formData.get("defaultCurrency") as string,
    default_payment_terms: formData.get("defaultPaymentTerms") as string,
    default_tax_rate: Number(formData.get("defaultTaxRate") ?? 0),
    updated_at: new Date().toISOString(),
  };

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("sender_profiles")
    .upsert(profile, { onConflict: "user_id" });

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  return { success: true };
}

export async function getSenderProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("sender_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found, bukan error sebenarnya
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}
