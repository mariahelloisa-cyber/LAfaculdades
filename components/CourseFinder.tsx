"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { courses } from "@/lib/data/courses";
import FilterPills from "./FilterPills";
import CourseRail from "./CourseRail";

const TABS = ["Graduação", "Pós-Graduação"] as const;

export default function CourseFinder() {
  const [tab, setTab] = useState<string>(TABS[0]);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const nivel = tab === "Graduação" ? "graduacao" : "pos-graduacao";
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => c.nivel === nivel)
      .filter((c) => !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q));
  }, [tab, query]);

  return (
    <div>
      {/* No mobile a busca vem antes do título, como na referência */}
      <div className="mb-8 flex flex-col-reverse gap-6 lg:mb-10 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="t-h2 text-navy-950">Cursos mais procurados</h2>

        <label className="relative block w-full lg:w-[420px]">
          <span className="sr-only">Buscar curso</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procure o curso ideal pra você!"
            className="w-full rounded-full border-2 border-navy-950 bg-white py-4 pl-6 pr-14 text-[15px] font-bold text-navy-950 outline-none placeholder:text-navy-950/60 focus:border-accent"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-navy-950"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </label>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <FilterPills options={[...TABS]} value={tab} onChange={setTab} />
        <Link
          href={tab === "Graduação" ? "/graduacao" : "/pos-graduacao"}
          className="text-sm font-bold text-navy-950 underline underline-offset-4 hover:opacity-70"
        >
          Ver todos os cursos
        </Link>
      </div>

      <CourseRail courses={list} />
    </div>
  );
}
