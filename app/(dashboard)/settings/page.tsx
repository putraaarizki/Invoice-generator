import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSenderProfile } from "./actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await getSenderProfile();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">Pengaturan Profil</h2>
        <p className="text-muted-foreground text-sm">
          Isi data perusahaan kamu agar otomatis muncul di setiap invoice.
        </p>
      </div>

      <SettingsForm initialData={profile} />
    </div>
  );
}
