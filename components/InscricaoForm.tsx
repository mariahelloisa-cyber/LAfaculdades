"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Course, CourseNivel } from "@/lib/data/courses";
import { SITE } from "@/lib/constants";

export default function InscricaoForm({
  niveis,
  cursos,
}: {
  niveis: CourseNivel[];
  cursos: Course[];
}) {
  const searchParams = useSearchParams();
  const cursoInicial = searchParams.get("curso") ?? "";
  const [enviado, setEnviado] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Sem backend/gateway de pagamento configurado ainda: registra a intenção
    // localmente e orienta o candidato a confirmar o pagamento pelo WhatsApp.
    const numero = Math.floor(100000 + Math.random() * 900000);
    setProtocolo(`LA-${new Date().getFullYear()}-${numero}`);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl bg-navy-950 p-9 text-center">
        <h2 className="t-h3 text-white">Inscrição recebida!</h2>
        <p className="mt-3 text-sky-200">
          Guarde o seu protocolo <span className="font-bold text-white">{protocolo}</span>. A equipe de
          matrículas vai falar com você pelo WhatsApp para confirmar o pagamento e liberar sua vaga.
        </p>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
        >
          Falar agora no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-[14px] font-bold text-navy-950" htmlFor="nome">
            Nome completo
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="Como está no seu documento"
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
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
            placeholder="voce@email.com"
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="telefone">
            WhatsApp
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            required
            placeholder="(00) 00000-0000"
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="curso">
            Curso
          </label>
          <select
            id="curso"
            name="curso"
            required
            defaultValue={cursoInicial}
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
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

        <div>
          <label className="text-[14px] font-bold text-navy-950" htmlFor="ingresso">
            Forma de ingresso
          </label>
          <select
            id="ingresso"
            name="ingresso"
            required
            defaultValue="Faça agora sua matrícula e comcece já."
            className="mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15"
          >
            <option>Faça agora sua matrícula e comcece já.</option>
            <option>Se inscreva no nosso Vestibular.</option>
            <option>Nota do ENEM</option>
          </select>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted leading-relaxed">
        Ao enviar, a equipe de matrículas da LA Faculdade entrará em contato pelo WhatsApp para confirmar o
        pagamento da inscrição e os próximos passos.
      </p>

      <button
        type="submit"
        className="mt-7 w-full rounded-full bg-accent px-7 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
      >
        Finalizar inscrição
      </button>
    </form>
  );
}
