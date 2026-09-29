import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./server";

/* Estar logado não basta: o Supabase aceita cadastro pela API pública, então
   o painel exige que o usuário esteja em public.admins (supabase/schema.sql).
   A RLS do banco aplica a mesma regra; isto aqui só evita abrir o painel e
   rodar ações para quem não é admin. */
export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

/** Para Server Actions e o layout do painel: devolve o cliente já autenticado
 *  ou manda para o login. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  if (!(await isAdmin(supabase))) redirect("/admin/login");
  return { supabase, user };
}
