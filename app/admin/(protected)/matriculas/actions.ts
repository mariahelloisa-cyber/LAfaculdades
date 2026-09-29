"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { STATUS_MATRICULA, type StatusMatricula } from "@/lib/matriculas";


/** O gestor marca em que pé está o contato com o candidato. */
export async function atualizarStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
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
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("matriculas").delete().eq("id", id);

  revalidatePath("/admin/matriculas");
  revalidatePath("/admin/vestibular");
  revalidatePath("/admin");
}
