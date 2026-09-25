"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/data/courses";
import CourseCard from "./CourseCard";
import SearchInput from "./SearchInput";

/* A carga horária é texto livre ("570h", "4 semestres", ""). Só entra no
   filtro de duração o que dá para ler como número de horas; o resto fica
   fora da faixa e é tratado à parte, para nenhum curso sumir sem motivo. */
function horasDe(course: Course): number | null {
  const bruto = course.cargaHoraria || course.duracao;
  const m = bruto.match(/(\d+)\s*h/i);
  return m ? Number(m[1]) : null;
}

type Secao = "duracao" | "formacao" | "area";

export default function CourseCatalog({ courses }: { courses: Course[] }) {
  /* Ordem alfabética de verdade: o banco ordena por bytes, então "Ética"
     cairia depois de "Zootecnia". localeCompare resolve os acentos. */
  const ordenados = useMemo(
    () => [...courses].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [courses]
  );

  const formacoes = useMemo(
    () => Array.from(new Set(ordenados.map((c) => c.nivelNome))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [ordenados]
  );
  const areas = useMemo(
    () => Array.from(new Set(ordenados.map((c) => c.area))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [ordenados]
  );

  /* Limites do slider: menor e maior carga horária cadastradas. Sem nenhum
     curso com horas legíveis, a seção de duração nem aparece. */
  const [minHoras, maxHoras] = useMemo(() => {
    const todas = ordenados.map(horasDe).filter((h): h is number => h !== null);
    return todas.length ? [Math.min(...todas), Math.max(...todas)] : [0, 0];
  }, [ordenados]);
  const temDuracao = maxHoras > minHoras;

  const [formacao, setFormacao] = useState<string[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [faixa, setFaixa] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");
  const [aberta, setAberta] = useState<Record<Secao, boolean>>({
    duracao: true,
    formacao: true,
    area: true,
  });

  const [de, ate] = faixa ?? [minHoras, maxHoras];
  const faixaMexida = faixa !== null && (de > minHoras || ate < maxHoras);

  const alterna = (lista: string[], set: (v: string[]) => void, valor: string) =>
    set(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  const limparTudo = () => {
    setFormacao([]);
    setArea([]);
    setFaixa(null);
    setQuery("");
  };

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ordenados
      .filter((c) => formacao.length === 0 || formacao.includes(c.nivelNome))
      .filter((c) => area.length === 0 || area.includes(c.area))
      .filter((c) => {
        if (!faixaMexida) return true;
        const h = horasDe(c);
        /* Curso sem carga horária legível não tem como ser comparado com a
           faixa, então sai da lista assim que o aluno mexe no slider. */
        return h !== null && h >= de && h <= ate;
      })
      .filter((c) => !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q));
  }, [ordenados, formacao, area, faixaMexida, de, ate, query]);

  /* Chips do topo: um por filtro ativo, cada um removível. */
  const chips = [
    ...formacao.map((v) => ({ label: v, remove: () => alterna(formacao, setFormacao, v) })),
    ...area.map((v) => ({ label: v, remove: () => alterna(area, setArea, v) })),
    ...(faixaMexida ? [{ label: `${de}h a ${ate}h`, remove: () => setFaixa(null) }] : []),
  ];

  const preenchimento = temDuracao
    ? {
        left: `${((de - minHoras) / (maxHoras - minHoras)) * 100}%`,
        right: `${100 - ((ate - minHoras) / (maxHoras - minHoras)) * 100}%`,
      }
    : { left: "0%", right: "0%" };

  return (
    <div>
      <h1 className="font-display text-[2.25rem] font-extrabold leading-[1.02] tracking-tight text-black lg:text-[52px]">
        Escolha o seu curso
      </h1>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* ---------- Barra lateral de filtros ---------- */}
        <aside className="shrink-0 lg:w-[210px]">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[17px] font-bold text-black">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Filtrar
            </span>
            {chips.length > 0 && (
              <button
                onClick={limparTudo}
                className="text-[13px] font-bold text-black underline underline-offset-4 hover:opacity-70"
              >
                Limpar tudo
              </button>
            )}
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.remove}
                  className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-accent-hover"
                >
                  {chip.label}
                  <span aria-hidden className="text-[14px] leading-none">
                    ×
                  </span>
                  <span className="sr-only">remover filtro</span>
                </button>
              ))}
            </div>
          )}

          {temDuracao && (
            <Secao
              titulo="Duração"
              aberta={aberta.duracao}
              onToggle={() => setAberta((a) => ({ ...a, duracao: !a.duracao }))}
            >
              <p className="text-[13px] font-bold text-black">Qual carga horária?</p>

              <span className="mt-3 inline-flex rounded-full bg-[#EDEDED] px-3 py-1.5 text-[12px] font-semibold text-black">
                {de}h a {ate}h
              </span>

              {/* Trilho atrás, dois inputs por cima (ver .range-slider no CSS) */}
              <div className="relative mt-5 h-[22px]">
                <span
                  aria-hidden
                  className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-[#dde5ee]"
                />
                <span
                  aria-hidden
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent"
                  style={preenchimento}
                />
                <input
                  type="range"
                  className="range-slider"
                  min={minHoras}
                  max={maxHoras}
                  step={10}
                  value={de}
                  aria-label="Carga horária mínima"
                  onChange={(e) => setFaixa([Math.min(Number(e.target.value), ate), ate])}
                />
                <input
                  type="range"
                  className="range-slider"
                  min={minHoras}
                  max={maxHoras}
                  step={10}
                  value={ate}
                  aria-label="Carga horária máxima"
                  onChange={(e) => setFaixa([de, Math.max(Number(e.target.value), de)])}
                />
              </div>
            </Secao>
          )}

          <Secao
            titulo="Formação"
            aberta={aberta.formacao}
            onToggle={() => setAberta((a) => ({ ...a, formacao: !a.formacao }))}
          >
            {formacoes.map((f) => (
              <Caixa
                key={f}
                label={f}
                marcada={formacao.includes(f)}
                onChange={() => alterna(formacao, setFormacao, f)}
              />
            ))}
          </Secao>

          <Secao
            titulo="Área de Interesse"
            aberta={aberta.area}
            onToggle={() => setAberta((a) => ({ ...a, area: !a.area }))}
          >
            {areas.map((a) => (
              <Caixa key={a} label={a} marcada={area.includes(a)} onChange={() => alterna(area, setArea, a)} />
            ))}
          </Secao>
        </aside>

        {/* ---------- Busca + grid ---------- */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-end">
            <SearchInput value={query} onChange={setQuery} />
          </div>

          <p className="mt-6 text-xs font-medium text-muted">
            {filtrados.length} {filtrados.length === 1 ? "curso" : "cursos"}
          </p>

          {filtrados.length === 0 ? (
            <p className="py-16 text-center font-semibold text-muted">
              Nenhum curso encontrado para essa busca.
            </p>
          ) : (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {filtrados.map((course) => (
                <CourseCard key={`${course.nivelSlug}-${course.slug}`} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Bloco recolhível da barra lateral — título com a seta e o conteúdo. */
function Secao({
  titulo,
  aberta,
  onToggle,
  children,
}: {
  titulo: string;
  aberta: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7 border-t border-black/10 pt-5">
      <button onClick={onToggle} aria-expanded={aberta} className="flex w-full items-center justify-between gap-3">
        <span className="text-[17px] font-bold text-black">{titulo}</span>
        <svg
          width="13"
          height="8"
          viewBox="0 0 10 6"
          fill="none"
          className={`shrink-0 transition-transform duration-200 ${aberta ? "" : "rotate-180"}`}
          aria-hidden
        >
          <path d="M9 5 5 1 1 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {aberta && <div className="mt-4">{children}</div>}
    </section>
  );
}

function Caixa({
  label,
  marcada,
  onChange,
}: {
  label: string;
  marcada: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[14px] font-medium text-black">
      <input
        type="checkbox"
        checked={marcada}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-accent"
      />
      {label}
    </label>
  );
}
