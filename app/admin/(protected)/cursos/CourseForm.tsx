"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { AREAS } from "@/lib/areas";
import UploadField from "../UploadField";
import type { CourseNivel } from "@/lib/data/courses";
import type { CourseFormState } from "./actions";

const MODALIDADES_SUGERIDAS = ["EAD", "Semipresencial", "Presencial"];

type CourseFormValues = {
  nome: string;
  slug: string;
  nivelId: string;
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
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const [uploading, setUploading] = useState(false);

  // Se um curso antigo tiver uma área fora da lista (digitada errada antes),
  // ela continua aparecendo para não sumir sozinha — mas dá pra corrigir aqui.
  const areasDisponiveis = Array.from(
    new Set([...AREAS, ...(defaultValues?.area ? [defaultValues.area] : [])])
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="nome" className="text-sm font-semibold text-navy-950">
          Nome do curso
        </label>
        <input
          id="nome"
          name="nome"
          required
          defaultValue={defaultValues?.nome}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-semibold text-navy-950">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
          <label htmlFor="modalidade" className="text-sm font-semibold text-navy-950">
            Modalidade principal
          </label>
          <input
            id="modalidade"
            name="modalidade"
            list="modalidades-sugeridas"
            required
            defaultValue={defaultValues?.modalidade}
            className={inputClass}
          />
          <datalist id="modalidades-sugeridas">
            {MODALIDADES_SUGERIDAS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
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
      </div>

      <div>
        <label htmlFor="resumo" className="text-sm font-semibold text-navy-950">
          Resumo (aparece no card e no hero)
        </label>
        <textarea
          id="resumo"
          name="resumo"
          required
          rows={2}
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

      <div>
        <label htmlFor="destaques" className="text-sm font-semibold text-navy-950">
          Destaques
        </label>
        <p className="mt-0.5 text-xs text-muted">Um por linha.</p>
        <textarea
          id="destaques"
          name="destaques"
          rows={4}
          defaultValue={defaultValues?.destaques.join("\n")}
          className={inputClass}
        />
      </div>

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
