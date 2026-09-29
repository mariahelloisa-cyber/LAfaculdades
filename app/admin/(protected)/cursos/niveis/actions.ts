"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import { MIDIA_INVALIDA, midiaValida } from "@/lib/mediaUrl";

export type NivelFormState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const ordem = Number(formData.get("ordem") ?? 0) || 0;
  const slug = slugify(slugRaw || nome);
  return { nome, slug, titulo, descricao, ordem };
}

export async function createNivel(_prevState: NivelFormState, formData: FormData): Promise<NivelFormState> {
  const { supabase } = await requireAdmin();
  const nivel = parseForm(formData);

  if (!nivel.nome || !nivel.titulo) {
    return { error: "Preencha nome e título." };
  }

  const imagemUrl = String(formData.get("imagem_url") ?? "").trim();
  if (!midiaValida(imagemUrl)) return { error: MIDIA_INVALIDA };

  const { error } = await supabase.from("course_niveis").insert({
    ...nivel,
    imagem_url: imagemUrl,
  });

  if (error) {
    return { error: error.code === "23505" ? "Já existe uma categoria com esse slug." : "Erro ao salvar o nível." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");
  redirect("/admin/cursos/niveis");
}

export async function updateNivel(
  id: string,
  _prevState: NivelFormState,
  formData: FormData
): Promise<NivelFormState> {
  const { supabase } = await requireAdmin();
  const nivel = parseForm(formData);

  if (!nivel.nome || !nivel.titulo) {
    return { error: "Preencha nome e título." };
  }

  const imagemUrl = String(formData.get("imagem_url") ?? "").trim();
  if (!midiaValida(imagemUrl)) return { error: MIDIA_INVALIDA };

  const updateData: Record<string, unknown> = { ...nivel };
  if (imagemUrl) updateData.imagem_url = imagemUrl;

  const { error } = await supabase.from("course_niveis").update(updateData).eq("id", id);
  if (error) {
    return { error: error.code === "23505" ? "Já existe uma categoria com esse slug." : "Erro ao salvar o nível." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");
  redirect("/admin/cursos/niveis");
}

export async function deleteNivel(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabase.from("course_niveis").delete().eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos/niveis");

  if (error) redirect("/admin/cursos/niveis?erro=em-uso");
}
