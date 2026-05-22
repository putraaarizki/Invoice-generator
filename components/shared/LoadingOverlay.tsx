"use client";

import { Loader2 } from "lucide-react";

interface Props {
  message?: string;
}

export default function LoadingOverlay({ message = "Loading..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
