"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Course } from "@/lib/data/courses";
import CourseCard from "./CourseCard";

export default function CourseRail({ courses }: { courses: Course[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    sync();
  }, [sync, courses]);

  function scrollBy(dir: 1 | -1) {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  if (courses.length === 0) {
    return (
      <p className="py-12 text-center font-semibold text-muted">
        Nenhum curso encontrado para essa área.
      </p>
    );
  }

  const scrollable = !atStart || !atEnd;

  return (
    <div className="relative">
      <div className="-mx-[var(--gutter)] px-[var(--gutter)] lg:mx-0 lg:px-0">
        <div ref={railRef} onScroll={sync} className="rail">
          {courses.map((course) => (
            <CourseCard key={`${course.nivel}-${course.slug}`} course={course} />
          ))}
        </div>
      </div>

      {scrollable && (
        <>
          <button
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Cursos anteriores"
            className="absolute -left-5 top-[124px] hidden h-11 w-11 items-center justify-center rounded-full bg-white text-navy-950 shadow-lg transition-opacity hover:bg-tint disabled:pointer-events-none disabled:opacity-0 xl:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Próximos cursos"
            className="absolute -right-5 top-[124px] hidden h-11 w-11 items-center justify-center rounded-full bg-white text-navy-950 shadow-lg transition-opacity hover:bg-tint disabled:pointer-events-none disabled:opacity-0 xl:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="mt-8 flex justify-center gap-2">
            <span className={`h-2 rounded-full transition-all ${atStart ? "w-6 bg-accent" : "w-2 bg-navy-950/20"}`} />
            <span className={`h-2 rounded-full transition-all ${!atStart ? "w-6 bg-accent" : "w-2 bg-navy-950/20"}`} />
          </div>
        </>
      )}
    </div>
  );
}
