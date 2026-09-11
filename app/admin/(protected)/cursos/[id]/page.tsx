import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseNiveis, normalizeGrade } from "@/lib/data/courses";
import { PageHeader } from "../../AdminUI";
import CourseForm from "../CourseForm";
import { updateCourse } from "../actions";

export default async function EditarCursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: curso }, niveis] = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id, slug, nome, nivel_id, area, modalidade, duracao, mensalidade, mensalidade_de, capa_url, resumo, descricao, destaques, destaque_home, para_quem, atuacao, grade"
      )
      .eq("id", id)
      .maybeSingle(),
    getCourseNiveis(),
  ]);

  if (!curso) notFound();

  const updateCourseWithId = updateCourse.bind(null, id);

  return (
    <div>
      <PageHeader icon="cursos" title="Editar curso" description={curso.nome} />
      <div className="mt-6 max-w-5xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <CourseForm
          action={updateCourseWithId}
          niveis={niveis}
          submitLabel="Salvar alterações"
          defaultValues={{
            nome: curso.nome,
            nivelId: curso.nivel_id,
            area: curso.area,
            duracao: curso.duracao,
            mensalidade: curso.mensalidade,
            mensalidadeDe: curso.mensalidade_de,
            capaUrl: curso.capa_url,
            resumo: curso.resumo,
            descricao: curso.descricao,
            destaques: curso.destaques,
            destaqueHome: curso.destaque_home,
            paraQuem: curso.para_quem ?? [],
            atuacao: curso.atuacao ?? [],
            grade: normalizeGrade(curso.grade),
          }}
        />
      </div>
    </div>
  );
}
