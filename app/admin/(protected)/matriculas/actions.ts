"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const STATUS_MATRICULA = ["novo", "em_contato", "matriculado", "descartado"] as const;
export type StatusMatricula = (typeof STATUS_MATRICULA)[number];

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

/** O gestor marca em que pé está o contato com o candidato. */
export async function atualizarStatus(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !STATUS_MATRICULA.includes(status as StatusMatricula)) return;

  await supabase
    .from("matriculas")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/matriculas");
  revalidatePath("/admin/vestibular");
  revalidatePath("/admin");
}

export async function excluirMatricula(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("matriculas").delete().eq("id", id);

  revalidatePath("/admin/matriculas");
  revalidatePath("/admin/vestibular");
  revalidatePath("/admin");
}
