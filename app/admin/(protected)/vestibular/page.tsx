import { createClient } from "@/lib/supabase/server";
import { PageHeader, StatCard } from "../AdminUI";
import MatriculasLista, { type MatriculaRow } from "../matriculas/MatriculasLista";

export default async function AdminVestibularPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matriculas")
    .select("*")
    .eq("forma_ingresso", "Vestibular")
    .order("created_at", { ascending: false });

  const lista = (data ?? []) as MatriculaRow[];
  const novos = lista.filter((m) => m.status === "novo").length;
  const matriculados = lista.filter((m) => m.status === "matriculado").length;

  return (
    <div>
      <PageHeader
        icon="vestibular"
        title="Inscrições do vestibular"
        description="Candidatos inscritos no vestibular online. Envie o link da prova pelo e-mail ou WhatsApp e marque o status de cada um."
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de inscritos" value={lista.length} icon="vestibular" cor="azul" />
        <StatCard label="Aguardando contato" value={novos} icon="blog" cor="amarelo" />
        <StatCard label="Matriculados" value={matriculados} icon="niveis" cor="verde" />
      </div>

      <MatriculasLista lista={lista} vazio="Nenhuma inscrição no vestibular ainda." />
    </div>
  );
}
