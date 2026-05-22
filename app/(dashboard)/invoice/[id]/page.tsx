import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getInvoiceById } from "./actions";
import InvoiceDetailClient from "./InvoiceDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const result = await getInvoiceById(id);

  if (!result.success) {
    redirect("/history");
  }

  const { invoice } = result;

  return (
    <InvoiceDetailClient
      invoiceId={invoice.id}
      initialData={invoice.data}
      status={invoice.status}
      invoiceNumber={invoice.invoice_number}
    />
  );
}
