"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type CourseFormState = { error?: string } | undefined;

function linhas(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/* Grade curricular: linhas iniciadas por "#" abrem um módulo (ex.: "# 1º
   semestre") e as linhas seguintes são as disciplinas dele. Disciplinas
   soltas antes do primeiro "#" caem num módulo único "Disciplinas". */
function parseGrade(valor: FormDataEntryValue | null) {
  const modulos: { titulo: string; disciplinas: string[] }[] = [];

  for (const linha of linhas(valor)) {
    if (linha.startsWith("#")) {
      modulos.push({ titulo: linha.replace(/^#+\s*/, ""), disciplinas: [] });
      continue;
    }
    if (modulos.length === 0) modulos.push({ titulo: "Disciplinas", disciplinas: [] });
    modulos[modulos.length - 1].disciplinas.push(linha);
  }

  return modulos.filter((m) => m.titulo && m.disciplinas.length > 0);
}

/* FAQ do curso: pares pergunta/resposta repetidos no formulário. */
function parseFaq(formData: FormData) {
  const perguntas = formData.getAll("faq_pergunta").map(String);
  const respostas = formData.getAll("faq_resposta").map(String);

  return perguntas
    .map((pergunta, i) => ({
      pergunta: pergunta.trim(),
      resposta: String(respostas[i] ?? "").trim(),
    }))
    .filter((f) => f.pergunta && f.resposta);
}

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

  const destaques = linhas(formData.get("destaques"));
  const para_quem = linhas(formData.get("para_quem"));
  const atuacao = linhas(formData.get("atuacao"));
  const mercado = String(formData.get("mercado") ?? "").trim();
  const grade = parseGrade(formData.get("grade"));
  const faq = parseFaq(formData);

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
    para_quem,
    mercado,
    atuacao,
    grade,
    faq,
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
