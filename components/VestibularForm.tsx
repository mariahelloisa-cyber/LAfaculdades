"use client";

import { useActionState, useState } from "react";
import { inscreverVestibular, type VestibularFormState } from "@/app/vestibular/actions";
import type { Course } from "@/lib/data/courses";
import { SITE, VESTIBULAR } from "@/lib/constants";

/* Visual escuro do formulário: rótulos em caixa alta, campos um degrau mais
   escuros que o card e selects um degrau mais claros, como na referência. */
const rotuloClasse = "text-[12px] font-bold uppercase tracking-[0.04em] text-sky-200/85";
const inputClasse =
  "mt-2 w-full rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3.5 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent focus:ring-4 focus:ring-accent/20";
const selectClasse =
  "mt-2 w-full appearance-none rounded-xl border border-white/10 bg-navy-800/60 py-3.5 pl-4 pr-11 text-[15px] font-semibold text-white outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-navy-900";

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

function Seta() {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
      className="pointer-events-none absolute right-4 top-[calc(50%+4px)] -translate-y-1/2 text-white/60"
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Passo({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <p className="text-[13px] font-extrabold uppercase tracking-[0.04em] text-accent">
      Passo {numero}: {titulo}
    </p>
  );
}

export default function VestibularForm({ cursos }: { cursos: Course[] }) {
  const [estado, formAction, enviando] = useActionState<VestibularFormState, FormData>(
    inscreverVestibular,
    undefined
  );
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cursoSlug, setCursoSlug] = useState("");

  const cursoSelecionado = cursos.find((c) => c.slug === cursoSlug);

  if (estado?.ok) {
    return (
      <div className="rounded-[28px] border border-accent/25 bg-navy-900 p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="t-h3 mt-5 text-white">Inscrição confirmada!</h3>

        {VESTIBULAR.provaUrl ? (
          <>
            <p className="mt-3 text-sky-200">
              Sua prova já está liberada. Reserve um momento tranquilo, com boa conexão, e comece quando
              estiver pronto.
            </p>
            <a
              href={VESTIBULAR.provaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Começar minha prova
            </a>
          </>
        ) : (
          <p className="mt-3 text-sky-200">
            Em breve você recebe o link da prova online no e-mail e no WhatsApp informados. Fique de olho
            também na caixa de spam.
          </p>
        )}

        <div className="mt-4">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border-2 border-white/30 px-8 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
          >
            Tirar dúvidas no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-accent/20 bg-navy-900 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-9"
    >
      {/* O nome do curso vai junto para o painel: assim o gestor lê a
          inscrição mesmo que o curso seja renomeado ou saia do ar depois. */}
      <input type="hidden" name="curso_slug" value={cursoSlug} />
      <input type="hidden" name="curso_nome" value={cursoSelecionado?.nome ?? ""} />

      <h3 className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-white">
        Inscrição no Processo
      </h3>

      <div className="mt-6">
        <Passo numero="01" titulo="Informações pessoais & identificação" />
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={rotuloClasse} htmlFor="nome_completo">
            Nome completo *
          </label>
          <input
            id="nome_completo"
            name="nome_completo"
            type="text"
            required
            autoComplete="name"
            placeholder="Seu nome completo"
            className={inputClasse}
          />
        </div>

        <div>
          <label className={rotuloClasse} htmlFor="cpf">
            CPF *
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
            className={inputClasse}
          />
        </div>

        <div>
          <label className={rotuloClasse} htmlFor="data_nascimento">
            Data de nascimento *
          </label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            required
            autoComplete="bday"
            className={`${inputClasse} [color-scheme:dark]`}
          />
        </div>

        <div>
          <label className={rotuloClasse} htmlFor="telefone">
            Celular (com DDD) *
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
            className={inputClasse}
          />
        </div>

        <div>
          <label className={rotuloClasse} htmlFor="email">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@email.com"
            className={inputClasse}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-7">
        <Passo numero="02" titulo="Curso & forma de ingresso" />
      </div>

      <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <label className={rotuloClasse} htmlFor="curso">
            Curso *
          </label>
          <select
            id="curso"
            required
            value={cursoSlug}
            onChange={(e) => setCursoSlug(e.target.value)}
            className={selectClasse}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {cursos.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
          <Seta />
        </div>

        <div className="relative sm:col-span-2">
          <label className={rotuloClasse} htmlFor="tipo_ingresso">
            Tipo de ingresso *
          </label>
          <select id="tipo_ingresso" name="tipo_ingresso" required defaultValue="" className={selectClasse}>
            <option value="" disabled>
              Selecione uma opção
            </option>
            {VESTIBULAR.tiposIngresso.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Seta />
        </div>
      </div>

      {estado?.error && (
        <p className="mt-6 rounded-xl bg-rose/15 px-4 py-3 text-[14px] font-semibold text-rose">
          {estado.error}
        </p>
      )}

      <p className="mt-7 flex gap-2.5 text-[13px] leading-relaxed text-sky-200/70">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
          <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.2" stroke="currentColor" strokeWidth="1.9" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        Seus dados ficam registrados com segurança e são usados só para o processo seletivo da LA Faculdade.
      </p>

      <button
        type="submit"
        disabled={enviando}
        className="mt-6 w-full rounded-full bg-accent px-7 py-4 text-[16px] font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Fazer minha inscrição"}
      </button>
    </form>
  );
}
