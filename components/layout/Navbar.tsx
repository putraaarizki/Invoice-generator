"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Generator Invoice",
  "/history": "Riwayat Invoice",
  "/settings": "Pengaturan Profil",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/invoice/")) return "Detail Invoice";
  return "AI Invoice";
}

export default function Navbar() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="h-16 border-b border-border bg-white flex items-center px-4 md:px-6 gap-4 sticky top-0 z-10">
      {/* Mobile menu — SheetTrigger tanpa asChild (Base UI pattern) */}
      <Sheet>
        <SheetTrigger
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-60">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="font-semibold text-base flex-1">{title}</h1>

      {/* User button — Clerk v7 tidak pakai afterSignOutUrl prop */}
      <UserButton />
    </header>
  );
}
