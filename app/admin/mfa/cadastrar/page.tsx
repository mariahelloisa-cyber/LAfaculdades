import { redirect } from "next/navigation";
import { ROTA_MFA_VERIFICAR, estadoMfa, requireAdminSemMfa } from "@/lib/supabase/admin";
import { CadastrarMfa } from "../MfaForms";

export default async function AdminMfaCadastroPage() {
  const { supabase, user } = await requireAdminSemMfa();
  const estado = await estadoMfa(supabase, user);
  if (estado === "ok") redirect("/admin");
  if (estado === "verificar") redirect(ROTA_MFA_VERIFICAR);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-14">
      <CadastrarMfa />
    </div>
  );
}
