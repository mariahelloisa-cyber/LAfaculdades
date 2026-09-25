import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "../AdminUI";
import MatriculasLista, { type MatriculaRow } from "./MatriculasLista";

export default async function AdminMatriculasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matriculas")
    /* "*" em vez da lista de colunas: modalidade, polo e tipo_ingresso só
       existem depois da migração do vestibular, e pedi-las num banco antigo
       derrubaria a lista inteira. */
    .select("*")
    // Quem escolheu o vestibular aparece em /admin/vestibular.
    .neq("forma_ingresso", "Vestibular")
    .order("created_at", { ascending: false });

  const lista = (data ?? []) as MatriculaRow[];
  const novos = lista.filter((m) => m.status === "novo").length;
  const matriculados = lista.filter((m) => m.status === "matriculado").length;

  return (
    <div>
      <PageHeader
        icon="matriculas"
        title="Matrículas"
        description="Pedidos de matrícula enviados pelo formulário do site. Entre em contato e marque o status de cada candidato."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total recebido" value={lista.length} icon="matriculas" cor="azul" />
        <StatCard label="Aguardando contato" value={novos} icon="blog" cor="amarelo" />
        <StatCard label="Matriculados" value={matriculados} icon="niveis" cor="verde" />
      </div>

      <MatriculasLista lista={lista} vazio="Nenhuma matrícula recebida ainda." />
    </div>
  );
}
