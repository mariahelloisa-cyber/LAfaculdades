"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type CourseFormState = { error?: string } | undefined;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function parseForm(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const nivel_id = String(formData.get("nivel_id") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const modalidade = String(formData.get("modalidade") ?? "").trim();
  const duracao = String(formData.get("duracao") ?? "").trim();
  const resumo = String(formData.get("resumo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const destaque_home = formData.get("destaque_home") === "on";

  const mensalidade = Number(String(formData.get("mensalidade") ?? "").replace(",", ".")) || 0;
  const mensalidade_de = Number(String(formData.get("mensalidade_de") ?? "").replace(",", ".")) || 0;

  const destaques = String(formData.get("destaques") ?? "")
    .split("\n")
    .map((d) => d.trim())
    .filter(Boolean);

  return {
    nome,
    slug: slugify(slugRaw || nome),
    nivel_id,
    area,
    modalidade,
    duracao,
    mensalidade,
    mensalidade_de,
    resumo,
    descricao,
    destaques,
    destaque_home,
  };
}

function validate(course: ReturnType<typeof parseForm>): string | null {
  if (!course.nome) return "Informe o nome do curso.";
  if (!course.nivel_id) return "Selecione a categoria do curso.";
  if (!course.area) return "Selecione a área do curso.";
  if (!course.modalidade) return "Informe a modalidade.";
  if (!course.duracao) return "Informe a duração.";
  if (!course.resumo) return "Informe o resumo.";
  if (!course.descricao) return "Informe a descrição.";
  if (course.mensalidade <= 0) return "Informe uma mensalidade válida.";
  return null;
}

export async function createCourse(
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const supabase = await requireUser();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  const { error } = await supabase.from("courses").insert({
    ...course,
    capa_url: String(formData.get("capa_url") ?? ""),
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um curso com esse slug." : "Erro ao salvar o curso.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}

export async function updateCourse(
  id: string,
  _prevState: CourseFormState,
  formData: FormData
): Promise<CourseFormState> {
  const supabase = await requireUser();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  const capaUrl = String(formData.get("capa_url") ?? "");

  const updateData: Record<string, unknown> = { ...course };
  if (capaUrl) updateData.capa_url = capaUrl;

  const { error } = await supabase.from("courses").update(updateData).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um curso com esse slug." : "Erro ao salvar o curso.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
  redirect("/admin/cursos");
}

export async function deleteCourse(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("courses").delete().eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
}
