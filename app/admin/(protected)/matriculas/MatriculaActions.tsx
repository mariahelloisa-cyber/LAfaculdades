"use client";

import { AdminIcon } from "../adminIcons";
import { atualizarStatus, excluirMatricula, STATUS_MATRICULA } from "./actions";

export const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  matriculado: "Matriculado",
  descartado: "Descartado",
};

/** Muda o status direto na lista: sem tela de edição, o gestor liga e marca. */
export function StatusSelect({ id, status }: { id: string; status: string }) {
  return (
    <form action={atualizarStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        aria-label="Status do contato"
        className="rounded-lg border border-navy-950/15 bg-white px-2.5 py-1.5 text-[12px] font-bold text-navy-950 outline-none transition-colors focus:border-accent"
      >
        {STATUS_MATRICULA.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </form>
  );
}

export function DeleteMatriculaButton({ id, nome }: { id: string; nome: string }) {
  return (
    <form
      action={excluirMatricula}
      onSubmit={(e) => {
        if (!confirm(`Excluir a matrícula de "${nome}"? Essa ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Excluir matrícula de ${nome}`}
        title="Excluir"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-white transition-colors hover:bg-rose-dark"
      >
        <AdminIcon name="excluir" size={16} />
      </button>
    </form>
  );
}
