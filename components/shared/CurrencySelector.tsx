"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Currency } from "@/types/invoice";

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "IDR", label: "IDR — Rupiah" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "SGD", label: "SGD — Singapore Dollar" },
];

interface Props {
  value: Currency;
  onChange: (value: Currency) => void;
  disabled?: boolean;
}

export default function CurrencySelector({ value, onChange, disabled }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange((val ?? "IDR") as Currency)}
      disabled={disabled}
    >
      <SelectTrigger className="text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
