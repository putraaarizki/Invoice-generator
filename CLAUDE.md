# AI Invoice & Quotation Generator — CLAUDE.md
> Panduan lengkap untuk vibe coding dengan Claude Code.
> Baca file ini sebelum menulis satu baris kode pun.

---

## 1. Project Overview

Aplikasi web yang memungkinkan user login, lalu mengetik deskripsi proyek dalam bahasa natural (bahasa Indonesia atau Inggris), dan AI akan mengubahnya menjadi Invoice atau Quotation profesional yang bisa diedit dan didownload sebagai PDF.

**Target user:** Freelancer dan agency kecil di Indonesia.

---

## 2. Tech Stack (Final)

| Kebutuhan | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 14 (App Router) | Modern, mendukung Server Actions |
| Language | TypeScript | Type-safe, mengurangi bug |
| Styling | Tailwind CSS + Shadcn UI | Cepat, konsisten, profesional |
| Auth | **Clerk** | Paling mudah untuk Next.js, free tier 10k MAU |
| Database | **Supabase** (PostgreSQL) | Gratis, ada UI visual, mudah di-manage |
| AI | Google Gemini API (`gemini-1.5-flash`) | Murah, cepat, cukup powerful |
| Icons | Lucide React | Sudah bundle dengan Shadcn |
| PDF | Browser Print CSS (`@media print`) | Zero dependency, hasil bersih A4 |
| Deploy | Vercel (Free Tier) | Compatible sempurna dengan Next.js |

---

## 3. Struktur Folder

```
/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx    # Halaman login Clerk
│   │   └── sign-up/[[...sign-up]]/page.tsx    # Halaman register Clerk
│   ├── (dashboard)/
│   │   ├── layout.tsx                          # Layout dengan sidebar + navbar
│   │   ├── dashboard/
│   │   │   └── page.tsx                        # Halaman utama: workspace generator
│   │   ├── history/
│   │   │   └── page.tsx                        # Riwayat semua invoice
│   │   ├── invoice/
│   │   │   └── [id]/
│   │   │       └── page.tsx                    # Detail + edit invoice lama
│   │   └── settings/
│   │       └── page.tsx                        # Profil pengirim (nama, logo, dll)
│   ├── api/
│   │   └── generate-invoice/
│   │       └── route.ts                        # API route untuk Gemini
│   ├── layout.tsx                              # Root layout + ClerkProvider
│   ├── page.tsx                                # Landing page (sebelum login)
│   └── globals.css                             # Tailwind + print CSS
├── components/
│   ├── ui/                                     # Komponen Shadcn (auto-generated)
│   ├── invoice/
│   │   ├── PromptInput.tsx                     # Textarea input natural language
│   │   ├── InvoiceForm.tsx                     # Form editable hasil AI
│   │   ├── InvoicePreview.tsx                  # Preview dokumen A4 live
│   │   ├── InvoiceActions.tsx                  # Tombol: Download, Save, Share
│   │   └── InvoiceHistory.tsx                  # List riwayat invoice
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── shared/
│       ├── CurrencySelector.tsx
│       └── LoadingOverlay.tsx
├── lib/
│   ├── gemini.ts                               # Helper Gemini API
│   ├── supabase.ts                             # Supabase client (server & browser)
│   └── utils.ts                               # Helper: format currency, generate invoice number
├── hooks/
│   ├── useInvoice.ts                           # State management invoice
│   └── useSenderProfile.ts                    # Ambil profil pengirim dari Supabase
├── types/
│   └── invoice.ts                             # Semua TypeScript interfaces
├── .env.local                                 # Semua API keys (JANGAN di-commit)
└── middleware.ts                              # Clerk auth middleware
```

---

## 4. TypeScript Interfaces (Lengkap)

```typescript
// types/invoice.ts

export type Currency = "IDR" | "USD" | "EUR" | "SGD";
export type DocumentType = "invoice" | "quotation";

export interface LineItem {
  id: string;           // untuk React key, generate di client
  description: string;
  qty: number;
  price: number;
  total: number;        // qty * price, dihitung otomatis
}

export interface InvoiceData {
  // Metadata dokumen
  type: DocumentType;
  invoiceNumber: string;    // Format: INV-2025-001 atau QUO-2025-001
  issueDate: string;        // ISO string: "2025-01-15"
  dueDate?: string;         // Untuk invoice; quotation pakai "validUntil"
  validUntil?: string;      // Untuk quotation

  // Info penerima (client)
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;

  // Info pengirim (diisi dari profil user)
  senderName: string;
  senderEmail?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderLogoUrl?: string;

  // Item & kalkulasi
  currency: Currency;
  items: LineItem[];
  subtotal: number;
  taxRate?: number;         // Contoh: 11 (untuk 11% PPN)
  taxAmount?: number;       // Dihitung otomatis: subtotal * taxRate / 100
  discountAmount?: number;
  grandTotal: number;

  // Catatan tambahan
  notes?: string;
  paymentTerms?: string;    // Contoh: "Transfer BCA 1234567890 a/n Budi"
}

export interface SenderProfile {
  userId: string;           // dari Clerk
  companyName: string;
  companyEmail?: string;
  companyAddress?: string;
  companyPhone?: string;
  logoUrl?: string;
  defaultCurrency: Currency;
  defaultPaymentTerms?: string;
  defaultTaxRate?: number;
}

// Untuk data yang disimpan di Supabase
export interface SavedInvoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  type: DocumentType;
  clientName: string;
  grandTotal: number;
  currency: Currency;
  status: "draft" | "sent" | "paid";  // untuk tracking
  data: InvoiceData;                   // full data sebagai JSONB
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Database Schema (Supabase)

Jalankan SQL ini di Supabase SQL Editor:

```sql
-- Aktifkan UUID extension
create extension if not exists "uuid-ossp";

-- Tabel untuk riwayat invoice
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,              -- user ID dari Clerk
  invoice_number text not null,
  type text not null check (type in ('invoice', 'quotation')),
  client_name text not null,
  grand_total numeric not null,
  currency text not null default 'IDR',
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  data jsonb not null,                -- seluruh InvoiceData disimpan di sini
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabel untuk profil pengirim
create table sender_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text unique not null,       -- user ID dari Clerk (unique: 1 user 1 profil)
  company_name text,
  company_email text,
  company_address text,
  company_phone text,
  logo_url text,
  default_currency text default 'IDR',
  default_payment_terms text,
  default_tax_rate numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security: user hanya bisa akses data miliknya sendiri
alter table invoices enable row level security;
alter table sender_profiles enable row level security;

create policy "user can manage own invoices"
  on invoices for all
  using (user_id = requesting_user_id());

create policy "user can manage own profile"
  on sender_profiles for all
  using (user_id = requesting_user_id());

-- Helper function untuk RLS dengan Clerk
create or replace function requesting_user_id()
returns text
language sql stable
as $$
  select coalesce(
    current_setting('request.jwt.claims', true)::json->>'sub',
    (current_setting('request.jwt.claims', true)::json->>'user_id')
  )
$$;
```

---

## 6. Environment Variables

```env
# .env.local

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/settings  # Arahkan ke settings dulu untuk isi profil

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # Hanya untuk server-side

# Google Gemini
GEMINI_API_KEY=AIza...                        # HANYA server-side, tidak pakai NEXT_PUBLIC_
```

---

## 7. Gemini API — System Prompt

```typescript
// lib/gemini.ts — System prompt yang digunakan

const SYSTEM_PROMPT = `
You are an expert billing assistant for Indonesian freelancers and agencies.

Your task: Parse the user's natural language input (in Indonesian or English) and extract structured billing data.

STRICT RULES:
1. Return ONLY a valid JSON object. No markdown, no explanation, no code blocks.
2. If user doesn't mention a value, use null or a sensible default.
3. Always generate a unique invoice number: use format "INV-[YEAR]-[3-digit-random]" for invoices, "QUO-[YEAR]-[3-digit-random]" for quotations.
4. Calculate all totals correctly: total = qty * price, subtotal = sum of all totals, taxAmount = subtotal * taxRate / 100, grandTotal = subtotal + taxAmount - discountAmount.
5. Default currency is IDR unless user specifies otherwise.
6. If input mentions "quotation", "penawaran", "quote" → type = "quotation". Otherwise → type = "invoice".
7. issueDate should be today's date in ISO format.
8. For dueDate, if not mentioned, default to 14 days from today for invoices.

Return this exact JSON structure (no extra fields, no missing required fields):
{
  "type": "invoice" | "quotation",
  "invoiceNumber": "INV-2025-001",
  "issueDate": "2025-01-15",
  "dueDate": "2025-01-29",
  "clientName": "string",
  "clientEmail": "string | null",
  "clientAddress": "string | null",
  "clientPhone": "string | null",
  "currency": "IDR" | "USD" | "EUR" | "SGD",
  "items": [
    {
      "id": "item-1",
      "description": "string",
      "qty": number,
      "price": number,
      "total": number
    }
  ],
  "subtotal": number,
  "taxRate": number | null,
  "taxAmount": number | null,
  "discountAmount": number | null,
  "grandTotal": number,
  "notes": "string | null",
  "paymentTerms": "string | null"
}
`;
```

---

## 8. API Route — `/api/generate-invoice`

```typescript
// app/api/generate-invoice/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  // 1. Pastikan user sudah login
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Ambil input user
  const { prompt } = await request.json();
  if (!prompt || prompt.trim().length < 10) {
    return NextResponse.json({ error: "Prompt terlalu pendek" }, { status: 400 });
  }

  // 3. Panggil Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,  // dari lib/gemini.ts
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 4. Parse JSON dengan aman
  try {
    const data = JSON.parse(text);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "AI gagal menghasilkan format yang benar. Coba ulangi." },
      { status: 500 }
    );
  }
}
```

---

## 9. Print CSS untuk PDF (di globals.css)

```css
/* globals.css — tambahkan di bagian bawah */

@media print {
  /* Sembunyikan semua UI, hanya tampilkan preview */
  body * {
    visibility: hidden;
  }

  #invoice-preview,
  #invoice-preview * {
    visibility: visible;
  }

  #invoice-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    background: white !important;
    color: black !important;
  }

  @page {
    size: A4;
    margin: 0;
  }
}
```

---

## 10. Urutan Build (Phase by Phase)

Ikuti urutan ini PERSIS. Jangan loncat ke phase berikutnya sebelum phase ini selesai.

### Phase 1 — Setup Project (1-2 jam)
- [ ] `npx create-next-app@latest` dengan TypeScript + Tailwind
- [ ] Install Shadcn UI: `npx shadcn-ui@latest init`
- [ ] Install Clerk: `npm install @clerk/nextjs`
- [ ] Install Supabase: `npm install @supabase/supabase-js`
- [ ] Install Gemini: `npm install @google/generative-ai`
- [ ] Setup `.env.local` dengan semua keys
- [ ] Setup `middleware.ts` untuk Clerk
- [ ] Buat folder structure sesuai Section 3
- [ ] Jalankan SQL schema di Supabase (Section 5)

### Phase 2 — Auth & Layout (1-2 jam)
- [ ] Buat halaman sign-in dan sign-up Clerk
- [ ] Buat `(dashboard)/layout.tsx` dengan Navbar dan Sidebar
- [ ] Buat halaman `settings/page.tsx` untuk isi profil pengirim
- [ ] Connect settings form ke Supabase (`sender_profiles` table)

### Phase 3 — Core Generator (2-3 jam)
- [ ] Buat API route `/api/generate-invoice`
- [ ] Buat komponen `PromptInput.tsx`
- [ ] Buat komponen `InvoiceForm.tsx` (editable setelah AI generate)
- [ ] Buat komponen `InvoicePreview.tsx` (live preview A4)
- [ ] Sambungkan: input → API → form + preview

### Phase 4 — Save & History (1-2 jam)
- [ ] Tombol "Save Invoice" → simpan ke Supabase
- [ ] Halaman `history/page.tsx` → tampilkan daftar invoice
- [ ] Halaman `invoice/[id]/page.tsx` → edit invoice lama

### Phase 5 — PDF & Polish (1 jam)
- [ ] Implement print CSS di `InvoicePreview`
- [ ] Tombol "Download PDF" → trigger `window.print()`
- [ ] Tombol "Share via WhatsApp" → generate pesan dengan detail invoice
- [ ] Loading states, error handling, empty states
- [ ] Test responsiveness desktop

---

## 11. Coding Rules untuk Claude Code

1. **Selalu gunakan TypeScript** — tidak ada `any`, gunakan interface dari `types/invoice.ts`
2. **Server vs Client Components:**
   - Default: Server Component
   - Gunakan `"use client"` HANYA jika komponen butuh: useState, useEffect, event handler, hooks Clerk di client
3. **API calls dari client** → selalu ke `/api/...` route, TIDAK langsung panggil Gemini/Supabase dari browser
4. **Error handling wajib** — setiap fetch/API call harus ada try-catch dan pesan error yang jelas untuk user
5. **Loading states wajib** — setiap action async harus ada loading indicator (Skeleton atau Spinner)
6. **Supabase dari server** → gunakan `SUPABASE_SERVICE_ROLE_KEY`, dari client gunakan `SUPABASE_ANON_KEY` + RLS
7. **Kalkulasi angka** → selalu lakukan di client saat user edit form, bukan andalkan AI untuk recalculate
8. **Format currency:**
   ```typescript
   // utils.ts
   export function formatCurrency(amount: number, currency: Currency): string {
     return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
       style: "currency",
       currency,
       minimumFractionDigits: 0,
     }).format(amount);
   }
   ```

---

## 12. Shadcn Components yang Perlu Di-install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add label
```

---

## 13. Contoh Prompt yang Harus Bisa Di-parse AI

Test AI kamu dengan contoh-contoh ini setelah Phase 3 selesai:

```
# Test 1 (Bahasa Indonesia, sederhana)
"Buat invoice untuk PT Maju Jaya, jasa pembuatan website company profile 1 halaman seharga 3 juta rupiah. Deadline bayar 7 hari."

# Test 2 (Bahasa Inggris, multiple items)
"Invoice for John Doe at johndoe@email.com. Landing page design $500, logo design $200, 2 revisions included $0. Add 10% tax."

# Test 3 (Quotation)
"Penawaran untuk Toko Berkah: desain konten Instagram 12 post Rp 1.200.000, caption writing Rp 300.000, posting & scheduling Rp 200.000. PPN 11%."

# Test 4 (Minimal info)
"Invoice buat Pak Budi jasa konsultasi SEO 2 jam, rate 500 ribu per jam."
```

---

## 14. Feature Checklist untuk Portfolio

Pastikan semua ini berfungsi sebelum publish ke portfolio:

- [ ] User bisa register dan login
- [ ] User bisa isi profil perusahaan (nama, email, alamat)
- [ ] Input teks natural language → AI generate invoice
- [ ] Form bisa diedit setelah AI generate
- [ ] Preview dokumen live saat form diedit
- [ ] Bisa ganti currency (IDR/USD/EUR/SGD)
- [ ] Bisa download sebagai PDF (A4, rapi)
- [ ] Invoice tersimpan ke database
- [ ] Ada halaman riwayat invoice
- [ ] Bisa buka dan edit invoice lama
- [ ] Loading state saat AI sedang bekerja
- [ ] Error message yang jelas saat gagal
- [ ] Responsive di desktop

---

*File ini adalah satu-satunya source of truth untuk project ini. Update file ini jika ada perubahan keputusan teknis.*
