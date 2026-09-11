"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AREAS } from "@/lib/areas";
import UploadField from "../UploadField";
import type { CourseDisciplina, CourseModulo, CourseNivel } from "@/lib/data/courses";
import type { CourseFormState } from "./actions";

type CourseFormValues = {
  nome: string;
  nivelId: string;
  area: string;
  duracao: string;
  mensalidade: number;
  mensalidadeDe: number;
  capaUrl: string;
  resumo: string;
  descricao: string;
  destaques: string[];
  destaqueHome: boolean;
  paraQuem: string[];
  atuacao: string[];
  grade: CourseModulo[];
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white";

export default function CourseForm({
  action,
  niveis,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  niveis: CourseNivel[];
  defaultValues?: CourseFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [uploading, setUploading] = useState(false);

  // Se um curso antigo tiver uma área fora da lista (digitada errada antes),
  // ela continua aparecendo para não sumir sozinha — mas dá pra corrigir aqui.
  const areasDisponiveis = Array.from(
    new Set([...AREAS, ...(defaultValues?.area ? [defaultValues.area] : [])])
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <label htmlFor="nome" className="text-sm font-semibold text-navy-950">
            Nome do curso
          </label>
          <input id="nome" name="nome" required defaultValue={defaultValues?.nome} className={inputClass} />
        </div>

        <div>
          <label htmlFor="duracao" className="text-sm font-semibold text-navy-950">
            Duração
          </label>
          <input
            id="duracao"
            name="duracao"
            required
            placeholder="8 semestres"
            defaultValue={defaultValues?.duracao}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="nivel_id" className="text-sm font-semibold text-navy-950">
            Nível
          </label>
          <select
            id="nivel_id"
            name="nivel_id"
            required
            defaultValue={defaultValues?.nivelId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecione o nível
            </option>
            {niveis.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="area" className="text-sm font-semibold text-navy-950">
            Área
          </label>
          <select
            id="area"
            name="area"
            required
            defaultValue={defaultValues?.area ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecione a área
            </option>
            {areasDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">Define o ícone do filtro “Área de interesse” no site.</p>
        </div>

        <div>
          <label htmlFor="mensalidade" className="text-sm font-semibold text-navy-950">
            Mensalidade (R$)
          </label>
          <input
            id="mensalidade"
            name="mensalidade"
            required
            placeholder="299.90"
            defaultValue={defaultValues?.mensalidade}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mensalidade_de" className="text-sm font-semibold text-navy-950">
            Valor cheio &quot;De R$&quot; (R$)
          </label>
          <input
            id="mensalidade_de"
            name="mensalidade_de"
            placeholder="499.90"
            defaultValue={defaultValues?.mensalidadeDe}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="resumo" className="text-sm font-semibold text-navy-950">
            Resumo (aparece no card e no hero)
          </label>
          <textarea
            id="resumo"
            name="resumo"
            required
            rows={5}
            defaultValue={defaultValues?.resumo}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="descricao" className="text-sm font-semibold text-navy-950">
            Descrição completa
          </label>
          <textarea
            id="descricao"
            name="descricao"
            required
            rows={5}
            defaultValue={defaultValues?.descricao}
            className={inputClass}
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="destaques" className="text-sm font-semibold text-navy-950">
            Destaques
          </label>
          <p className="mt-0.5 text-xs text-muted">Um por linha.</p>
          <textarea
            id="destaques"
            name="destaques"
            rows={3}
            defaultValue={defaultValues?.destaques.join("\n")}
            className={inputClass}
          />
        </div>
      </div>

      {/* ---- Conteúdo da página "Saiba mais" do curso ---- */}
      <div className="border-t border-navy-950/10 pt-6">
        <h2 className="text-base font-bold text-navy-950">Página do curso</h2>
        <p className="mt-1 text-xs text-muted">
          Tudo aqui é opcional — cada bloco só aparece no site quando você preenche.
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <label htmlFor="para_quem" className="text-sm font-semibold text-navy-950">
            Para quem é este curso
          </label>
          <p className="mt-0.5 text-xs text-muted">Um perfil por linha.</p>
          <textarea
            id="para_quem"
            name="para_quem"
            rows={4}
            defaultValue={defaultValues?.paraQuem.join("\n")}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="atuacao" className="text-sm font-semibold text-navy-950">
            Onde o aluno pode atuar
          </label>
          <p className="mt-0.5 text-xs text-muted">Um item por linha. Viram etiquetas na página.</p>
          <textarea
            id="atuacao"
            name="atuacao"
            rows={4}
            defaultValue={defaultValues?.atuacao.join("\n")}
            className={inputClass}
          />
        </div>
      </div>

      <GradeFields defaultValue={defaultValues?.grade ?? []} />

      <UploadField
        name="capa_url"
        folder="cursos"
        tipo="imagem"
        currentUrl={defaultValues?.capaUrl}
        label="Capa do curso"
        hint="Aparece no card do curso e no topo da página dele."
        onUploadingChange={setUploading}
      />

      <label className="flex items-center gap-3 rounded-lg bg-white px-4 py-3">
        <input
          type="checkbox"
          name="destaque_home"
          defaultChecked={defaultValues?.destaqueHome}
          className="h-4 w-4 accent-[var(--color-accent)]"
        />
        <span className="text-sm font-semibold text-navy-950">
          Mostrar em &quot;Cursos mais procurados&quot; na home
        </span>
      </label>

      {state?.error && <p className="text-sm font-semibold text-rose-dark">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/admin/cursos"
          className="rounded-full border-2 border-navy-950/15 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

/* Grade curricular: semestres e disciplinas montados na tela. O estado inteiro
   vai para o server action num campo escondido em JSON. */
function GradeFields({ defaultValue }: { defaultValue: CourseModulo[] }) {
  const [modulos, setModulos] = useState<CourseModulo[]>(defaultValue);

  function atualizar(i: number, muda: (m: CourseModulo) => CourseModulo) {
    setModulos(modulos.map((m, idx) => (idx === i ? muda(m) : m)));
  }

  function atualizarDisciplina(i: number, j: number, campo: keyof CourseDisciplina, valor: string) {
    atualizar(i, (m) => ({
      ...m,
      disciplinas: m.disciplinas.map((d, idx) => (idx === j ? { ...d, [campo]: valor } : d)),
    }));
  }

  return (
    <div>
      <input type="hidden" name="grade" value={JSON.stringify(modulos)} />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-wide text-navy-950/70">
          Grade curricular
        </span>
        <button
          type="button"
          onClick={() => setModulos([...modulos, { titulo: "", disciplinas: [{ nome: "" }] }])}
          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-white"
        >
          + Semestre
        </button>
      </div>

      <div className="mt-3 space-y-4">
        {modulos.map((modulo, i) => (
          <div key={i} className="rounded-xl border border-navy-950/10 bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <input
                  placeholder="1º Semestre"
                  value={modulo.titulo}
                  onChange={(e) => atualizar(i, (m) => ({ ...m, titulo: e.target.value }))}
                  className={`${inputClass} mt-0 bg-white font-bold`}
                />
              </div>
              <button
                type="button"
                onClick={() => setModulos(modulos.filter((_, idx) => idx !== i))}
                aria-label="Remover semestre"
                className="shrink-0 rounded-lg px-2 py-1.5 text-base font-bold text-rose-dark transition-colors hover:bg-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {modulo.disciplinas.map((disciplina, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <input
                      placeholder="Nome da disciplina"
                      value={disciplina.nome}
                      onChange={(e) => atualizarDisciplina(i, j, "nome", e.target.value)}
                      className={`${inputClass} mt-0 bg-white`}
                    />
                  </div>
                  <div className="w-[92px] shrink-0">
                    <input
                      placeholder="Horas"
                      value={disciplina.horas ?? ""}
                      onChange={(e) => atualizarDisciplina(i, j, "horas", e.target.value)}
                      className={`${inputClass} mt-0 bg-white`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      atualizar(i, (m) => ({
                        ...m,
                        disciplinas: m.disciplinas.filter((_, idx) => idx !== j),
                      }))
                    }
                    aria-label="Remover disciplina"
                    className="shrink-0 rounded-lg px-2 py-1.5 text-base font-bold text-rose-dark transition-colors hover:bg-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => atualizar(i, (m) => ({ ...m, disciplinas: [...m.disciplinas, { nome: "" }] }))}
              className="mt-3 text-xs font-bold uppercase tracking-wide text-accent transition-colors hover:text-accent-hover"
            >
              + Disciplina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
