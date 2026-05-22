"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { saveSenderProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface ProfileData {
  company_name?: string;
  company_email?: string;
  company_address?: string;
  company_phone?: string;
  default_currency?: string;
  default_payment_terms?: string;
  default_tax_rate?: number;
}

interface Props {
  initialData: ProfileData | null;
}

export default function SettingsForm({ initialData }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [currency, setCurrency] = useState(
    initialData?.default_currency ?? "IDR"
  );

  async function handleSubmit(formData: FormData) {
    formData.set("defaultCurrency", currency);

    startTransition(async () => {
      try {
        await saveSenderProfile(formData);
        toast.success("Profil berhasil disimpan!", {
          description: "Data akan otomatis muncul di invoice baru.",
        });
      } catch (err) {
        toast.error("Gagal menyimpan profil.", {
          description: err instanceof Error ? err.message : "Coba lagi.",
        });
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {/* Info Perusahaan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Perusahaan</CardTitle>
          <CardDescription>
            Data ini akan otomatis muncul di setiap invoice yang kamu buat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nama Perusahaan / Freelancer *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Contoh: Budi Design Studio"
                defaultValue={initialData?.company_name ?? ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                type="email"
                placeholder="email@kamu.com"
                defaultValue={initialData?.company_email ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyPhone">No. Telepon / WhatsApp</Label>
              <Input
                id="companyPhone"
                name="companyPhone"
                placeholder="+62 812 3456 7890"
                defaultValue={initialData?.company_phone ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Alamat</Label>
            <Textarea
              id="companyAddress"
              name="companyAddress"
              placeholder="Jl. Contoh No. 123, Jakarta Selatan"
              defaultValue={initialData?.company_address ?? ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Default Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Invoice</CardTitle>
          <CardDescription>
            Nilai default yang akan dipakai saat AI generate invoice baru.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mata Uang Default</Label>
              <Select
                value={currency}
                onValueChange={(val) => setCurrency(val ?? "IDR")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">IDR — Rupiah Indonesia</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultTaxRate">PPN / Tax Default (%)</Label>
              <Input
                id="defaultTaxRate"
                name="defaultTaxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                defaultValue={initialData?.default_tax_rate ?? 0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultPaymentTerms">Info Pembayaran Default</Label>
            <Textarea
              id="defaultPaymentTerms"
              name="defaultPaymentTerms"
              placeholder="Contoh: Transfer BCA 1234567890 a/n Budi Santoso"
              defaultValue={initialData?.default_payment_terms ?? ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button type="submit" disabled={isPending} className="min-w-32">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Profil"
        )}
      </Button>
    </form>
  );
}
