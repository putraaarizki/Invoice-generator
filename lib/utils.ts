import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/types/invoice"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateInvoiceNumber(type: "invoice" | "quotation"): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 900 + 100)
  const prefix = type === "invoice" ? "INV" : "QUO"
  return `${prefix}-${year}-${random}`
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}
