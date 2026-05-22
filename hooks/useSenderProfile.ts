"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import type { SenderProfile } from "@/types/invoice";

interface SupabaseProfile {
  user_id: string;
  company_name: string;
  company_email?: string;
  company_address?: string;
  company_phone?: string;
  logo_url?: string;
  default_currency: string;
  default_payment_terms?: string;
  default_tax_rate?: number;
}

function mapToSenderProfile(data: SupabaseProfile): SenderProfile {
  return {
    userId: data.user_id,
    companyName: data.company_name,
    companyEmail: data.company_email,
    companyAddress: data.company_address,
    companyPhone: data.company_phone,
    logoUrl: data.logo_url,
    defaultCurrency: (data.default_currency as SenderProfile["defaultCurrency"]) ?? "IDR",
    defaultPaymentTerms: data.default_payment_terms,
    defaultTaxRate: data.default_tax_rate ?? 0,
  };
}

export function useSenderProfile() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<SenderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Gagal mengambil profil");
        const data = await res.json();
        if (data.profile) {
          setProfile(mapToSenderProfile(data.profile));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, isLoading, error };
}
