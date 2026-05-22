export type Currency = "IDR" | "USD" | "EUR" | "SGD";
export type DocumentType = "invoice" | "quotation";

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  price: number;
  total: number;
}

export interface InvoiceData {
  type: DocumentType;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  validUntil?: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  senderName: string;
  senderEmail?: string;
  senderAddress?: string;
  senderPhone?: string;
  senderLogoUrl?: string;
  currency: Currency;
  items: LineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  grandTotal: number;
  notes?: string;
  paymentTerms?: string;
}

export interface SenderProfile {
  userId: string;
  companyName: string;
  companyEmail?: string;
  companyAddress?: string;
  companyPhone?: string;
  logoUrl?: string;
  defaultCurrency: Currency;
  defaultPaymentTerms?: string;
  defaultTaxRate?: number;
}

export interface SavedInvoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  type: DocumentType;
  clientName: string;
  grandTotal: number;
  currency: Currency;
  status: "draft" | "sent" | "paid";
  data: InvoiceData;
  createdAt: string;
  updatedAt: string;
}
