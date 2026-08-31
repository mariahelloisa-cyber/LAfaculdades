import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../../AdminUI";
import NivelForm from "../NivelForm";
import { updateNivel } from "../actions";

export default async function EditarNivelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: nivel } = await supabase
    .from("course_niveis")
    .select("id, slug, nome, titulo, descricao, imagem_url, ordem")
    .eq("id", id)
    .maybeSingle();

  if (!nivel) notFound();

  const updateNivelWithId = updateNivel.bind(null, id);

  return (
    <div>
      <PageHeader icon="niveis" title="Editar a categoria de curso" description={`/${nivel.slug}`} />
      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <NivelForm
          action={updateNivelWithId}
          submitLabel="Salvar alterações"
          defaultValues={{
            nome: nivel.nome,
            slug: nivel.slug,
            titulo: nivel.titulo,
            descricao: nivel.descricao,
            imagemUrl: nivel.imagem_url,
            ordem: nivel.ordem,
          }}
        />
      </div>
    </div>
  );
}
