import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/publicClient";

export type Course = {
  id: string;
  slug: string;
  nome: string;
  nivelSlug: string;
  nivelNome: string;
  area: string;
  modalidade: string;
  duracao: string;
  mensalidade: number;
  mensalidadeDe: number;
  capaUrl: string;
  resumo: string;
  descricao: string;
  destaques: string[];
  destaqueHome: boolean;
};

export type CourseNivel = {
  id: string;
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  ordem: number;
};

type CourseRow = {
  id: string;
  slug: string;
  nome: string;
  area: string;
  modalidade: string;
  duracao: string;
  mensalidade: number;
  mensalidade_de: number;
  capa_url: string;
  resumo: string;
  descricao: string;
  destaques: string[];
  destaque_home: boolean;
  course_niveis: { slug: string; nome: string } | null;
};

type NivelRow = {
  id: string;
  slug: string;
  nome: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  ordem: number;
};

const COURSE_FIELDS =
  "id, slug, nome, area, modalidade, duracao, mensalidade, mensalidade_de, capa_url, resumo, descricao, destaques, destaque_home";

function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    nivelSlug: row.course_niveis?.slug ?? "",
    nivelNome: row.course_niveis?.nome ?? "",
    area: row.area,
    modalidade: row.modalidade,
    duracao: row.duracao,
    mensalidade: row.mensalidade,
    mensalidadeDe: row.mensalidade_de,
    capaUrl: row.capa_url,
    resumo: row.resumo,
    descricao: row.descricao,
    destaques: row.destaques,
    destaqueHome: row.destaque_home,
  };
}

function mapNivel(row: NivelRow): CourseNivel {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    titulo: row.titulo,
    descricao: row.descricao,
    imagemUrl: row.imagem_url,
    ordem: row.ordem,
  };
}

export const getCourseNiveis = cache(async (): Promise<CourseNivel[]> => {
  const { data, error } = await supabasePublic
    .from("course_niveis")
    .select("id, slug, nome, titulo, descricao, imagem_url, ordem")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao buscar categorias:", error.message);
    return [];
  }

  return (data as NivelRow[]).map(mapNivel);
});

export async function getCourseNivelBySlug(slug: string): Promise<CourseNivel | null> {
  const { data, error } = await supabasePublic
    .from("course_niveis")
    .select("id, slug, nome, titulo, descricao, imagem_url, ordem")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar categoria de curso:", error.message);
    return null;
  }

  return data ? mapNivel(data as NivelRow) : null;
}

export async function getAllCourses(): Promise<Course[]> {
  const { data, error } = await supabasePublic
    .from("courses")
    .select(`${COURSE_FIELDS}, course_niveis!nivel_id(slug, nome)`)
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar cursos:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCoursesByNivelSlug(nivelSlug: string): Promise<Course[]> {
  const { data, error } = await supabasePublic
    .from("courses")
    .select(`${COURSE_FIELDS}, course_niveis!inner(slug, nome)`)
    .eq("course_niveis.slug", nivelSlug)
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar cursos:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}

export async function getCourseBySlug(nivelSlug: string, slug: string): Promise<Course | null> {
  const { data, error } = await supabasePublic
    .from("courses")
    .select(`${COURSE_FIELDS}, course_niveis!inner(slug, nome)`)
    .eq("course_niveis.slug", nivelSlug)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar curso:", error.message);
    return null;
  }

  return data ? mapCourse(data as unknown as CourseRow) : null;
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabasePublic
    .from("courses")
    .select(`${COURSE_FIELDS}, course_niveis!nivel_id(slug, nome)`)
    .eq("destaque_home", true)
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar cursos em destaque:", error.message);
    return [];
  }

  return (data as unknown as CourseRow[]).map(mapCourse);
}
