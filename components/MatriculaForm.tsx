"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import {
  criarMatricula,
  FORMAS_INGRESSO,
  type MatriculaFormState,
} from "@/app/matricula/inscricao/actions";
import type { Course, CourseNivel } from "@/lib/data/courses";
import { SITE } from "@/lib/constants";

const campoClasse =
  "mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15";

function mascaraCpf(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

export default function MatriculaForm({
  niveis,
  cursos,
  /* Na página do vestibular o candidato também escolhe como quer ingressar;
     na matrícula direta o campo não aparece. */
  mostrarFormaIngresso = false,
  textoBotao = "Enviar minha matrícula",
}: {
  niveis: CourseNivel[];
  cursos: Course[];
  mostrarFormaIngresso?: boolean;
  textoBotao?: string;
}) {
  const searchParams = useSearchParams();
  const cursoInicial = searchParams.get("curso") ?? "";
  const ingressoInicial =
    searchParams.get("ingresso") === "enem" ? "Nota do ENEM" : FORMAS_INGRESSO[0];
  const [estado, formAction, enviando] = useActionState<MatriculaFormState, FormData>(
    criarMatricula,
    undefined
  );
  const [cursoSlug, setCursoSlug] = useState(cursoInicial);
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  const cursoSelecionado = cursos.find((c) => c.slug === cursoSlug);

  if (estado?.ok) {
    return (
      <div className="rounded-2xl bg-navy-950 p-9 text-center">
        <h2 className="t-h3 text-white">Recebemos seus dados!</h2>
        <p className="mt-3 text-sky-200">
          A equipe de matrículas da LA Faculdade vai entrar em contato pelo telefone e pelo e-mail
          informados para concluir a sua matrícula.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Voltar para o início
          </Link>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border-2 border-white/40 px-8 py-4 font-bold text-white transition-colors hover:bg-white/15"
          >
            Tirar dúvidas no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl bg-surface p-6 sm:p-8">
      {/* O nome do curso vai junto para o painel: assim o gestor lê a
          matrícula mesmo que o curso seja renomeado ou saia do ar depois. */}
      <input type="hidden" name="curso_slug" value={cursoSlug} />
      <input type="hidden" name="curso_nome" value={cursoSelecionado?.nome ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-[14px] font-bold text-navy-950" htmlFor="nome_completo">
            Nome completo
          </label>
          <input
            id="nome_completo"
            name="nome_completo"
            type="text"
            required
            autoComplete="name"
            placeholder="Como está no seu documento"
            className={campoClasse}
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="data_nascimento">
            Data de nascimento
          </label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            required
            autoComplete="bday"
            className={campoClasse}
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="cpf">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            required
            value={cpf}
            onChange={(e) => setCpf(mascaraCpf(e.target.value))}
            placeholder="000.000.000-00"
            className={campoClasse}
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@email.com"
            className={campoClasse}
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="telefone">
            Telefone / WhatsApp
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel"
            value={telefone}
            onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
            placeholder="(00) 00000-0000"
            className={campoClasse}
          />
        </div>

        <div className={mostrarFormaIngresso ? undefined : "sm:col-span-2"}>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="curso">
            Curso desejado
          </label>
          <select
            id="curso"
            name="curso"
            required
            value={cursoSlug}
            onChange={(e) => setCursoSlug(e.target.value)}
            className={campoClasse}
          >
            <option value="" disabled>
              Selecione um curso
            </option>
            {niveis.map((nivel) => (
              <optgroup key={nivel.slug} label={nivel.nome}>
                {cursos
                  .filter((c) => c.nivelSlug === nivel.slug)
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.nome}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {mostrarFormaIngresso && (
          <div>
            <label className="text-[14px] font-bold text-navy-950" htmlFor="forma_ingresso">
              Forma de ingresso
            </label>
            <select
              id="forma_ingresso"
              name="forma_ingresso"
              required
              defaultValue={ingressoInicial}
              className={campoClasse}
            >
              {FORMAS_INGRESSO.map((forma) => (
                <option key={forma} value={forma}>
                  {forma}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {estado?.error && (
        <p className="mt-5 rounded-xl bg-rose/10 px-4 py-3 text-[14px] font-semibold text-rose">
          {estado.error}
        </p>
      )}

      <p className="mt-5 text-xs leading-relaxed text-muted">
        Ao enviar, seus dados são registrados com segurança e a equipe de matrículas da LA Faculdade
        entra em contato para concluir a sua matrícula.
      </p>

      <button
        type="submit"
        disabled={enviando}
        className="mt-7 w-full rounded-full bg-accent px-7 py-4 font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Enviando..." : textoBotao}
      </button>
    </form>
  );
}
