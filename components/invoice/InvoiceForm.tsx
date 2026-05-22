"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceData, LineItem, Currency } from "@/types/invoice";

interface Props {
  data: InvoiceData;
  onUpdateField: <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => void;
  onUpdateItem: (id: string, field: keyof LineItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export default function InvoiceForm({
  data,
  onUpdateField,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}: Props) {
  return (
    <div className="space-y-5 text-sm">

      {/* ── Dokumen ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Jenis Dokumen</Label>
          <Select
            value={data.type}
            onValueChange={(val) =>
              onUpdateField("type", (val ?? "invoice") as InvoiceData["type"])
            }
          >
            <SelectTrigger className="text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="quotation">Quotation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nomor</Label>
          <Input
            value={data.invoiceNumber}
            onChange={(e) => onUpdateField("invoiceNumber", e.target.value)}
            className="text-sm h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Tanggal Terbit</Label>
          <Input
            type="date"
            value={data.issueDate}
            onChange={(e) => onUpdateField("issueDate", e.target.value)}
            className="text-sm h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            {data.type === "quotation" ? "Berlaku Hingga" : "Jatuh Tempo"}
          </Label>
          <Input
            type="date"
            value={
              data.type === "quotation"
                ? (data.validUntil ?? "")
                : (data.dueDate ?? "")
            }
            onChange={(e) =>
              onUpdateField(
                data.type === "quotation" ? "validUntil" : "dueDate",
                e.target.value
              )
            }
            className="text-sm h-9"
          />
        </div>
      </div>

      <Separator />

      {/* ── Pengirim ──────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Pengirim (Kamu)
        </p>
        <div className="space-y-2.5">
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Perusahaan / Freelancer</Label>
            <Input
              value={data.senderName ?? ""}
              onChange={(e) => onUpdateField("senderName", e.target.value)}
              placeholder="Studio Kreatif Kamu"
              className="text-sm h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={data.senderEmail ?? ""}
                onChange={(e) => onUpdateField("senderEmail", e.target.value)}
                placeholder="kamu@email.com"
                className="text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telepon</Label>
              <Input
                value={data.senderPhone ?? ""}
                onChange={(e) => onUpdateField("senderPhone", e.target.value)}
                placeholder="+62 812..."
                className="text-sm h-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alamat</Label>
            <Textarea
              value={data.senderAddress ?? ""}
              onChange={(e) => onUpdateField("senderAddress", e.target.value)}
              placeholder="Jl. Contoh No. 1, Jakarta"
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Klien ──────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Penerima (Klien)
        </p>
        <div className="space-y-2.5">
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Klien *</Label>
            <Input
              value={data.clientName}
              onChange={(e) => onUpdateField("clientName", e.target.value)}
              placeholder="PT Maju Jaya"
              className="text-sm h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Email Klien</Label>
              <Input
                type="email"
                value={data.clientEmail ?? ""}
                onChange={(e) => onUpdateField("clientEmail", e.target.value)}
                placeholder="klien@email.com"
                className="text-sm h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telepon Klien</Label>
              <Input
                value={data.clientPhone ?? ""}
                onChange={(e) => onUpdateField("clientPhone", e.target.value)}
                placeholder="+62 812..."
                className="text-sm h-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alamat Klien</Label>
            <Textarea
              value={data.clientAddress ?? ""}
              onChange={(e) => onUpdateField("clientAddress", e.target.value)}
              placeholder="Jl. Klien No. 2..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Currency & Tax ────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Mata Uang</Label>
          <Select
            value={data.currency}
            onValueChange={(val) =>
              onUpdateField("currency", (val ?? "IDR") as Currency)
            }
          >
            <SelectTrigger className="text-sm h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IDR">IDR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="SGD">SGD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">PPN / Tax (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={data.taxRate ?? ""}
            onChange={(e) =>
              onUpdateField(
                "taxRate",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="0"
            className="text-sm h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Diskon</Label>
          <Input
            type="number"
            min="0"
            value={data.discountAmount ?? ""}
            onChange={(e) =>
              onUpdateField(
                "discountAmount",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder="0"
            className="text-sm h-9"
          />
        </div>
      </div>

      <Separator />

      {/* ── Line Items ──────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Item / Layanan
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddItem}
            className="h-7 text-xs gap-1"
          >
            <Plus className="w-3 h-3" /> Tambah
          </Button>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-1.5 text-xs text-muted-foreground mb-2 px-1">
          <span className="col-span-5">Deskripsi</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-3 text-right">Harga</span>
          <span className="col-span-2 text-right">Total</span>
        </div>

        <div className="space-y-2">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-1.5 items-center group"
            >
              <Input
                value={item.description}
                onChange={(e) =>
                  onUpdateItem(item.id, "description", e.target.value)
                }
                placeholder="Deskripsi layanan..."
                className="col-span-5 text-xs h-8"
              />
              <Input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) =>
                  onUpdateItem(item.id, "qty", Number(e.target.value) || 1)
                }
                className="col-span-2 text-xs h-8 text-center"
              />
              <Input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) =>
                  onUpdateItem(item.id, "price", Number(e.target.value) || 0)
                }
                className="col-span-3 text-xs h-8 text-right"
              />
              <div className="col-span-2 flex items-center justify-end gap-1">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(item.total, data.currency)}
                </span>
                {data.items.length > 1 && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity p-0.5 rounded hover:bg-destructive/10"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals summary */}
        <div className="mt-4 pt-3 border-t space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {formatCurrency(data.subtotal, data.currency)}
            </span>
          </div>
          {data.taxRate != null && data.taxRate > 0 && data.taxAmount != null && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>PPN {data.taxRate}%</span>
              <span className="tabular-nums">
                {formatCurrency(data.taxAmount, data.currency)}
              </span>
            </div>
          )}
          {data.discountAmount != null && data.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Diskon</span>
              <span className="text-destructive tabular-nums">
                -{formatCurrency(data.discountAmount, data.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm pt-1 border-t">
            <span>Total</span>
            <span className="tabular-nums">
              {formatCurrency(data.grandTotal, data.currency)}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Catatan & Pembayaran ─────────────────── */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Info Pembayaran</Label>
          <Textarea
            value={data.paymentTerms ?? ""}
            onChange={(e) => onUpdateField("paymentTerms", e.target.value)}
            placeholder="Transfer BCA 1234567890 a/n Nama Kamu"
            rows={2}
            className="text-sm resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Catatan Tambahan</Label>
          <Textarea
            value={data.notes ?? ""}
            onChange={(e) => onUpdateField("notes", e.target.value)}
            placeholder="Terima kasih atas kepercayaan Anda..."
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
