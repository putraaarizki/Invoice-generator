"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { updateInvoiceStatus, type InvoiceRow } from "./actions";

// ── Badge helpers ─────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: InvoiceRow["type"] }) {
  return type === "invoice" ? (
    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
      Invoice
    </Badge>
  ) : (
    <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
      Quotation
    </Badge>
  );
}

function StatusBadge({ status }: { status: InvoiceRow["status"] }) {
  if (status === "paid") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
        Paid
      </Badge>
    );
  }
  if (status === "sent") {
    return (
      <Badge className="bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-100">
        Sent
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Draft
    </Badge>
  );
}

// ── Status Select ─────────────────────────────────────────────────────────────

interface StatusSelectProps {
  invoiceId: string;
  currentStatus: InvoiceRow["status"];
  isLoading: boolean;
  onChange: (id: string, status: InvoiceRow["status"]) => void;
}

function StatusSelect({
  invoiceId,
  currentStatus,
  isLoading,
  onChange,
}: StatusSelectProps) {
  return (
    <div className="relative flex items-center gap-1.5">
      {isLoading && (
        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground shrink-0" />
      )}
      <Select
        value={currentStatus}
        onValueChange={(val) => {
          if (val && val !== currentStatus) {
            onChange(invoiceId, val as InvoiceRow["status"]);
          }
        }}
        disabled={isLoading}
      >
        <SelectTrigger size="sm" className="w-[90px] h-7 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  initialInvoices: InvoiceRow[];
}

export default function HistoryTable({ initialInvoices }: Props) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initialInvoices);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const handleStatusChange = async (
    id: string,
    status: InvoiceRow["status"]
  ) => {
    // Optimistic update
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    setLoadingIds((prev) => new Set(prev).add(id));

    try {
      const result = await updateInvoiceStatus(id, status);
      if (!result.success) {
        // Rollback
        const original = initialInvoices.find((inv) => inv.id === id);
        if (original) {
          setInvoices((prev) =>
            prev.map((inv) =>
              inv.id === id ? { ...inv, status: original.status } : inv
            )
          );
        }
        toast.error("Gagal mengubah status");
      }
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (invoices.length === 0) {
    return null; // Parent renders empty state
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[140px] pl-4">Nomor</TableHead>
            <TableHead>Klien</TableHead>
            <TableHead className="w-[110px]">Tipe</TableHead>
            <TableHead className="w-[140px] text-right">Total</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[120px]">Tanggal</TableHead>
            <TableHead className="w-[70px] pr-4 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="pl-4 font-medium">
                {inv.invoice_number}
              </TableCell>

              <TableCell className="text-muted-foreground max-w-[180px] truncate">
                {inv.client_name}
              </TableCell>

              <TableCell>
                <TypeBadge type={inv.type} />
              </TableCell>

              <TableCell className="text-right tabular-nums font-medium">
                {formatCurrency(inv.grand_total, inv.currency)}
              </TableCell>

              <TableCell>
                <StatusSelect
                  invoiceId={inv.id}
                  currentStatus={inv.status}
                  isLoading={loadingIds.has(inv.id)}
                  onChange={handleStatusChange}
                />
              </TableCell>

              <TableCell className="text-muted-foreground text-xs">
                {new Date(inv.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell className="pr-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/invoice/${inv.id}`} />}
                >
                  Lihat
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
