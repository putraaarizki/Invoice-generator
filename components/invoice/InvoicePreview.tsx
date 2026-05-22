"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceData } from "@/types/invoice";

interface Props {
  data: InvoiceData;
}

export default function InvoicePreview({ data }: Props) {
  const isQuotation = data.type === "quotation";
  const docLabel = isQuotation ? "QUOTATION" : "INVOICE";

  return (
    <div
      id="invoice-preview"
      className="bg-white text-gray-900 p-10 min-h-[297mm] w-full font-sans text-sm leading-relaxed"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        // Inline fallback for browsers that ignore @media print colour rules
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      } as React.CSSProperties}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {data.senderName || "Nama Perusahaan"}
          </h1>
          {data.senderAddress && (
            <p className="mt-1 text-xs text-gray-500 whitespace-pre-line max-w-[200px]">
              {data.senderAddress}
            </p>
          )}
          {data.senderPhone && (
            <p className="text-xs text-gray-500">{data.senderPhone}</p>
          )}
          {data.senderEmail && (
            <p className="text-xs text-gray-500">{data.senderEmail}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-3xl font-extrabold text-gray-800 tracking-widest">
            {docLabel}
          </p>
          <p className="mt-1 text-xs text-gray-500">#{data.invoiceNumber}</p>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────── */}
      <div className="border-t-2 border-gray-900 mb-6" />

      {/* ── Meta row: Bill To + Dates ──────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        {/* Bill To */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {isQuotation ? "Penawaran Untuk" : "Tagihan Kepada"}
          </p>
          <p className="font-bold text-gray-900">
            {data.clientName || "—"}
          </p>
          {data.clientAddress && (
            <p className="text-xs text-gray-500 whitespace-pre-line mt-0.5 max-w-[220px]">
              {data.clientAddress}
            </p>
          )}
          {data.clientPhone && (
            <p className="text-xs text-gray-500">{data.clientPhone}</p>
          )}
          {data.clientEmail && (
            <p className="text-xs text-gray-500">{data.clientEmail}</p>
          )}
        </div>

        {/* Dates */}
        <div className="shrink-0 text-right space-y-1.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Tanggal Terbit
            </p>
            <p className="text-sm font-medium">
              {data.issueDate ? formatDate(data.issueDate) : "—"}
            </p>
          </div>
          {isQuotation && data.validUntil ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Berlaku Hingga
              </p>
              <p className="text-sm font-medium">{formatDate(data.validUntil)}</p>
            </div>
          ) : !isQuotation && data.dueDate ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Jatuh Tempo
              </p>
              <p className="text-sm font-medium text-red-600">
                {formatDate(data.dueDate)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Line Items Table ────────────────────────────── */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr
            className="bg-gray-900 text-white text-xs uppercase tracking-widest"
            style={{ backgroundColor: "#111827", color: "#ffffff" }}
          >
            <th className="text-left py-2.5 px-4 font-semibold rounded-tl-sm">
              Deskripsi
            </th>
            <th className="text-center py-2.5 px-3 font-semibold">Qty</th>
            <th className="text-right py-2.5 px-3 font-semibold">Harga Satuan</th>
            <th className="text-right py-2.5 px-4 font-semibold rounded-tr-sm">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr
              key={item.id}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-2.5 px-4 text-gray-800">
                {item.description || <span className="text-gray-400 italic">—</span>}
              </td>
              <td className="py-2.5 px-3 text-center text-gray-600">
                {item.qty}
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 tabular-nums">
                {formatCurrency(item.price, data.currency)}
              </td>
              <td className="py-2.5 px-4 text-right font-medium tabular-nums">
                {formatCurrency(item.total, data.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totals ──────────────────────────────────────── */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {formatCurrency(data.subtotal, data.currency)}
            </span>
          </div>

          {data.taxRate != null && data.taxRate > 0 && data.taxAmount != null && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>PPN {data.taxRate}%</span>
              <span className="tabular-nums">
                {formatCurrency(data.taxAmount, data.currency)}
              </span>
            </div>
          )}

          {data.discountAmount != null && data.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Diskon</span>
              <span className="tabular-nums text-red-500">
                -{formatCurrency(data.discountAmount, data.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between border-t-2 border-gray-900 pt-2 mt-2">
            <span className="font-bold text-sm">Total</span>
            <span className="font-bold text-sm tabular-nums">
              {formatCurrency(data.grandTotal, data.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer: Payment & Notes ──────────────────────── */}
      {(data.paymentTerms || data.notes) && (
        <div className="border-t border-gray-200 pt-5 grid grid-cols-2 gap-6">
          {data.paymentTerms && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Info Pembayaran
              </p>
              <p className="text-xs text-gray-600 whitespace-pre-line">
                {data.paymentTerms}
              </p>
            </div>
          )}
          {data.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Catatan
              </p>
              <p className="text-xs text-gray-600 whitespace-pre-line">
                {data.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Thank You ───────────────────────────────────── */}
      <div className="mt-10 border-t border-gray-100 pt-4 text-center">
        <p className="text-xs text-gray-400">
          {isQuotation
            ? "Penawaran ini berlaku sesuai tanggal di atas. Hubungi kami untuk informasi lebih lanjut."
            : "Terima kasih atas kepercayaan Anda. Pembayaran tepat waktu sangat kami apresiasi."}
        </p>
      </div>
    </div>
  );
}
