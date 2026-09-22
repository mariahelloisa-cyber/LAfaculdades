import { createClient } from "@/lib/supabase/server";
import { Chip, EmptyState, ListCard, PageHeader, StatCard } from "../AdminUI";
import { DeleteMatriculaButton, STATUS_LABEL, StatusSelect } from "./MatriculaActions";

type MatriculaRow = {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  cpf: string;
  email: string;
  telefone: string;
  curso_nome: string;
  forma_ingresso: string;
  status: string;
  created_at: string;
};

function formatarCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;
}

function formatarTelefone(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return tel;
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function AdminMatriculasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matriculas")
    .select(
      "id, nome_completo, data_nascimento, cpf, email, telefone, curso_nome, forma_ingresso, status, created_at"
    )
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

      <ListCard title="Lista">
        <div className="divide-y divide-navy-950/8">
          {lista.map((m) => (
            <div key={m.id} className="flex flex-wrap items-start gap-4 py-4">
              <div className="min-w-[260px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-bold text-navy-950">{m.nome_completo}</p>
                  <Chip cor={m.status === "novo" ? "amarelo" : "azul"}>
                    {STATUS_LABEL[m.status] ?? m.status}
                  </Chip>
                </div>

                <p className="mt-1.5 text-sm font-semibold text-accent">
                  {m.curso_nome}
                  {m.forma_ingresso && (
                    <span className="font-normal text-muted"> · {m.forma_ingresso}</span>
                  )}
                </p>

                {/* Os dados de contato ficam clicáveis: o gestor liga, abre o
                    WhatsApp ou manda e-mail sem precisar copiar nada. */}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <a href={`tel:+55${m.telefone.replace(/\D/g, "")}`} className="hover:text-accent">
                    {formatarTelefone(m.telefone)}
                  </a>
                  <a
                    href={`https://wa.me/55${m.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#16a34a] hover:underline"
                  >
                    WhatsApp
                  </a>
                  <a href={`mailto:${m.email}`} className="hover:text-accent">
                    {m.email}
                  </a>
                  <span>CPF {formatarCpf(m.cpf)}</span>
                  <span>Nasc. {formatarData(`${m.data_nascimento}T00:00:00`)}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted">Recebido em {formatarData(m.created_at)}</span>
                <StatusSelect id={m.id} status={m.status} />
                <DeleteMatriculaButton id={m.id} nome={m.nome_completo} />
              </div>
            </div>
          ))}
        </div>

        {lista.length === 0 && <EmptyState>Nenhuma matrícula recebida ainda.</EmptyState>}
      </ListCard>
    </div>
  );
}
