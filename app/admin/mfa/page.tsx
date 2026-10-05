import { redirect } from "next/navigation";
import { ROTA_MFA_CADASTRAR, estadoMfa, requireAdminSemMfa } from "@/lib/supabase/admin";
import { VerificarMfaForm } from "./MfaForms";

export default async function AdminMfaPage() {
  const { supabase, user } = await requireAdminSemMfa();
  const estado = await estadoMfa(supabase, user);
  if (estado === "ok") redirect("/admin");
  if (estado === "cadastrar") redirect(ROTA_MFA_CADASTRAR);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14">
      <VerificarMfaForm />
    </div>
  );
}
