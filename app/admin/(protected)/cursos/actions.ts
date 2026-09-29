"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import { MIDIA_INVALIDA, midiaValida } from "@/lib/mediaUrl";
import { normalizeGrade } from "@/lib/data/courses";

export type CourseFormState = { error?: string } | undefined;

function linhas(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/* Grade curricular: o formulario manda a grade inteira como JSON no campo
   escondido "grade" (semestres -> disciplinas com nome e horas). */
function parseGrade(valor: FormDataEntryValue | null) {
  try {
    return normalizeGrade(JSON.parse(String(valor ?? "[]")));
  } catch {
    return [];
  }
}

function parseForm(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const nivel_id = String(formData.get("nivel_id") ?? "").trim();
  const area = String(formData.get("area") ?? "").trim();
  const duracao = String(formData.get("duracao") ?? "").trim();
  const carga_horaria = String(formData.get("carga_horaria") ?? "").trim();
  const resumo = String(formData.get("resumo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const destaque_home = formData.get("destaque_home") === "on";

  const mensalidade = Number(String(formData.get("mensalidade") ?? "").replace(",", ".")) || 0;
  const mensalidade_de = Number(String(formData.get("mensalidade_de") ?? "").replace(",", ".")) || 0;

  const destaques = linhas(formData.get("destaques"));
  const para_quem = linhas(formData.get("para_quem"));
  const atuacao = linhas(formData.get("atuacao"));
  const grade = parseGrade(formData.get("grade"));

  return {
    nome,
    nivel_id,
    area,
    duracao,
    carga_horaria,
    mensalidade,
    mensalidade_de,
    resumo,
    descricao,
    destaques,
    destaque_home,
    para_quem,
    atuacao,
    grade,
  };
}

function validate(course: ReturnType<typeof parseForm>): string | null {
  if (!course.nome) return "Informe o nome do curso.";
  if (!course.nivel_id) return "Selecione a categoria do curso.";
  if (!course.area) return "Selecione a área do curso.";
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
  const { supabase } = await requireAdmin();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  /* Slug e modalidade saíram do formulário: o slug vem do nome e a modalidade
     nasce como EAD. Na edição nenhum dos dois é tocado, para não trocar a URL
     de um curso já publicado. O FAQ é único para todos os cursos (lib/faq.ts). */
  const capaUrl = String(formData.get("capa_url") ?? "").trim();
  if (!midiaValida(capaUrl)) return { error: MIDIA_INVALIDA };

  const { error } = await supabase.from("courses").insert({
    ...course,
    slug: slugify(course.nome),
    modalidade: "EAD",
    mercado: "",
    capa_url: capaUrl,
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
  const { supabase } = await requireAdmin();
  const course = parseForm(formData);

  const erro = validate(course);
  if (erro) return { error: erro };

  const capaUrl = String(formData.get("capa_url") ?? "").trim();
  if (!midiaValida(capaUrl)) return { error: MIDIA_INVALIDA };

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
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("courses").delete().eq("id", id);

  revalidatePath("/", "layout");
  revalidatePath("/admin/cursos");
}
