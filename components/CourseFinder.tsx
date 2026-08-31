"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Course } from "@/lib/data/courses";
import FilterPills from "./FilterPills";
import CourseCard from "./CourseCard";

export default function CourseFinder({ courses }: { courses: Course[] }) {
  const niveis = useMemo(
    () => Array.from(new Set(courses.map((c) => c.nivelNome))),
    [courses]
  );
  const [tabEscolhida, setTab] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Derivado no render: se o nível escolhido sumiu (curso despromovido no
  // admin, por exemplo), cai no primeiro nível disponível.
  const tab = tabEscolhida && niveis.includes(tabEscolhida) ? tabEscolhida : niveis[0] ?? "";

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => c.nivelNome === tab)
      .filter((c) => !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q));
  }, [courses, tab, query]);

  const nivelSlug = courses.find((c) => c.nivelNome === tab)?.nivelSlug ?? "";

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* Linha 1 — título à esquerda, busca à direita.
          No mobile a busca vem antes do título, como já era. */}
      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h2 className="text-[2.25rem] font-extrabold leading-[1.02] tracking-tight text-black lg:text-[52px]">
          Cursos mais procurados
        </h2>

        <label className="relative block w-full shrink-0 sm:w-[380px]">
          <span className="sr-only">Buscar curso</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procure o curso ideal pra você!"
            className="h-[55px] w-full rounded-[30px] border border-black bg-white pl-6 pr-14 text-[15px] font-semibold text-black outline-none transition-colors placeholder:text-black/55 focus:border-accent"
          />
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-black"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </label>
      </div>

      {/* Linha 2 — abas à esquerda, "Ver todos" à direita */}
      {niveis.length > 0 && (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <FilterPills options={niveis} value={tab} onChange={setTab} />
          {nivelSlug && (
            <Link
              href={`/${nivelSlug}`}
              className="text-[13px] font-bold text-black underline underline-offset-4 hover:opacity-70"
            >
              Ver todos os cursos
            </Link>
          )}
        </div>
      )}

      {/* Grid — 4 colunas no desktop, 2 no tablet, 1 no mobile */}
      {list.length === 0 ? (
        <p className="py-12 text-center font-semibold text-muted">
          Nenhum curso encontrado para essa busca.
        </p>
      ) : (
        <div className="mt-12 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((course) => (
            <CourseCard key={`${course.nivelSlug}-${course.slug}`} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
