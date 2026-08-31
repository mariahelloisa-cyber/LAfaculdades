"use client";

import { useMemo, useState } from "react";
import { Course } from "@/lib/data/courses";
import CourseCard from "./CourseCard";
import AreaIcons from "./AreaIcons";

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  const areas = useMemo(
    () => ["Todas", ...Array.from(new Set(courses.map((c) => c.area))).sort()],
    [courses]
  );
  const [area, setArea] = useState("Todas");

  const filtered = area === "Todas" ? courses : courses.filter((c) => c.area === area);

  return (
    <div>
      <h2 className="t-h3 mb-6 text-navy-950">Área de interesse</h2>
      <AreaIcons areas={areas} value={area} onChange={setArea} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[10px]">
        {filtered.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center font-semibold text-muted">
          Nenhum curso encontrado para essa área.
        </p>
      )}
    </div>
  );
}
