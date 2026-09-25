import { Chip, EmptyState, ListCard } from "../AdminUI";
import { DeleteMatriculaButton, STATUS_LABEL, StatusSelect } from "./MatriculaActions";

export type MatriculaRow = {
  id: string;
  nome_completo: string;
  data_nascimento: string;
  cpf: string;
  email: string;
  telefone: string;
  curso_nome: string;
  forma_ingresso: string;
  modalidade?: string | null;
  polo?: string | null;
  tipo_ingresso?: string | null;
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

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Lista usada pelas páginas de Matrículas e de Inscrições do vestibular —
 *  as duas leem a mesma tabela, só com filtros diferentes. */
export default function MatriculasLista({
  lista,
  vazio,
}: {
  lista: MatriculaRow[];
  vazio: string;
}) {
  return (
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

              {/* Só as inscrições do vestibular trazem esses três campos. */}
              {(m.modalidade || m.polo || m.tipo_ingresso) && (
                <p className="mt-1 text-[13px] text-muted">
                  {[m.modalidade, m.polo, m.tipo_ingresso].filter(Boolean).join(" · ")}
                </p>
              )}

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

      {lista.length === 0 && <EmptyState>{vazio}</EmptyState>}
    </ListCard>
  );
}
