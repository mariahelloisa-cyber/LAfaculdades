import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "./server";

/* Estar logado não basta: o Supabase aceita cadastro pela API pública, então
   o painel exige que o usuário esteja em public.admins (supabase/schema.sql).
   A RLS do banco aplica a mesma regra; isto aqui só evita abrir o painel e
   rodar ações para quem não é admin. */
export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

/** Em que pé está o segundo fator (TOTP) da sessão:
 *  - "ok": sessão já confirmou o código (aal2);
 *  - "verificar": a conta tem autenticador, falta digitar o código;
 *  - "cadastrar": a conta ainda não tem autenticador.
 *
 *  Os fatores vêm do `user` devolvido por getUser() — validado no servidor do
 *  Supabase —, e não do objeto guardado no cookie, que o navegador consegue
 *  editar. O nível (aal) sai do mesmo token que o getUser() acabou de validar.
 *  A palavra final é do banco: a RLS (admin_com_mfa) só libera com aal2. */
export async function estadoMfa(supabase: SupabaseClient, user: User): Promise<"ok" | "verificar" | "cadastrar"> {
  const temFator = (user.factors ?? []).some((f) => f.factor_type === "totp" && f.status === "verified");
  if (!temFator) return "cadastrar";
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  return data?.currentLevel === "aal2" ? "ok" : "verificar";
}

export const ROTA_MFA_VERIFICAR = "/admin/mfa";
export const ROTA_MFA_CADASTRAR = "/admin/mfa/cadastrar";

/** Para as telas do segundo fator: admin logado só com a senha (aal1). */
export async function requireAdminSemMfa() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!(await isAdmin(supabase))) redirect("/admin/login");
  return { supabase, user };
}

/** Para Server Actions e o layout do painel: devolve o cliente já autenticado
 *  com senha E segundo fator, ou manda para o login / para o código. */
export async function requireAdmin() {
  const { supabase, user } = await requireAdminSemMfa();
  const estado = await estadoMfa(supabase, user);
  if (estado === "cadastrar") redirect(ROTA_MFA_CADASTRAR);
  if (estado === "verificar") redirect(ROTA_MFA_VERIFICAR);
  return { supabase, user };
}
