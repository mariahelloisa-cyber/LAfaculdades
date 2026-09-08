"use client";

import { useMemo, useState } from "react";
import { Course } from "@/lib/data/courses";
import CourseCard from "./CourseCard";
import AreaIcons from "./AreaIcons";
import SearchInput from "./SearchInput";

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  const areas = useMemo(
    () => ["Todas", ...Array.from(new Set(courses.map((c) => c.area))).sort()],
    [courses]
  );
  const [area, setArea] = useState("Todas");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => area === "Todas" || c.area === area)
      .filter((c) => !q || c.nome.toLowerCase().includes(q) || c.area.toLowerCase().includes(q));
  }, [courses, area, query]);

  return (
    <div>
      <h2 className="t-h3 mb-6 text-navy-950">Área de interesse</h2>

      {/* Filtros à esquerda, busca à direita (empilhados no mobile) */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 lg:flex-1">
          <AreaIcons areas={areas} value={area} onChange={setArea} />
        </div>
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[10px]">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center font-semibold text-muted">
          Nenhum curso encontrado para essa busca.
        </p>
      )}
    </div>
  );
}
