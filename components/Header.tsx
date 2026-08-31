"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import type { CourseNivel } from "@/lib/data/courses";

const mainLinks = [
  { label: "Por que a LA?", href: "/institucional" },
  { label: "Vestibular", href: "/vestibular" },
  { label: "Financiamento", href: "/financiamento-la-bank" },
  { label: "Blog", href: "/blog" },
];

export default function Header({ courseNiveis }: { courseNiveis: CourseNivel[] }) {
  const courseLinks = courseNiveis.map((n) => ({ label: n.nome, href: `/${n.slug}` }));
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  /* Realce do dropdown: guarda a posição/altura do item sob o cursor, medidas
     do próprio DOM, para a pílula deslizar de uma opção para a outra. */
  const panelRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [pill, setPill] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`relative bg-navy-950 text-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_28px_rgba(0,0,0,0.32)]" : ""
      }`}
    >
      <div className="container-x">
        <div className="flex h-[58px] items-center justify-between gap-6 lg:h-[64px]">
          {/* Mobile: hamburger */}
          <button
            className="-ml-1 p-2 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 6.5h18M3 12h18M3 17.5h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link href="/" className="shrink-0" aria-label="LA Faculdade — página inicial">
            <Image
              src="/images/logo-horizontal.png"
              alt="LA Faculdade"
              width={2561}
              height={895}
              priority
              className="h-6 w-auto brightness-0 invert sm:h-8 lg:h-9"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setCoursesOpen(true)}
              onMouseLeave={() => {
                setCoursesOpen(false);
                setPill(null);
              }}
            >
              <button
                aria-expanded={coursesOpen}
                className={`flex items-center gap-1.5 py-5 text-[15px] font-bold transition-colors duration-200 ${
                  coursesOpen ? "text-accent" : "text-white hover:text-accent"
                }`}
              >
                Cursos
                <svg
                  width="11"
                  height="7"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={`transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    coursesOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              {/* O pt-1.5 é a ponte de hover: o cursor nunca atravessa um vão
                  entre o botão e o painel, então o menu não pisca no caminho. */}
              <div
                className="absolute left-1/2 top-full -translate-x-1/2 pt-1.5"
                style={{
                  visibility: coursesOpen ? "visible" : "hidden",
                  /* A visibilidade só comuta no fim do fechamento, para o fade
                     de saída não ser cortado. */
                  transition: coursesOpen ? "visibility 0s" : "visibility 0s 180ms",
                }}
              >
                {/* A animação fica no painel, e não no wrapper, para o translate
                    da abertura não brigar com o -translate-x-1/2 que centraliza. */}
                <div
                  ref={panelRef}
                  onMouseLeave={() => setPill(null)}
                  className={`relative w-[186px] rounded-2xl border border-navy-950/5 bg-white p-2 text-navy-950 shadow-[0_10px_30px_rgba(6,21,35,0.13)] ${
                    coursesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-[5px] opacity-0"
                  }`}
                  style={{
                    /* Fecha um pouco mais rápido do que abre. */
                    transition: coursesOpen
                      ? "opacity 200ms cubic-bezier(0.22,1,0.36,1), transform 200ms cubic-bezier(0.22,1,0.36,1)"
                      : "opacity 180ms cubic-bezier(0.22,1,0.36,1), transform 180ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {/* Camada única de realce: desliza e se redimensiona para
                      abraçar exatamente a palavra sob o cursor. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 rounded-full bg-tint"
                    style={{
                      width: pill?.width ?? 0,
                      height: pill?.height ?? 0,
                      opacity: pill ? 1 : 0,
                      transform: `translate(${pill?.left ?? 0}px, ${pill?.top ?? 0}px)`,
                      transition:
                        "transform 200ms cubic-bezier(0.22,1,0.36,1), width 200ms cubic-bezier(0.22,1,0.36,1), height 200ms cubic-bezier(0.22,1,0.36,1), opacity 160ms ease",
                    }}
                  />

                  {/* A área de hover é o <a> inteiro; a pílula acompanha só o
                      <span>, que é quem tem a largura do texto. */}
                  {courseLinks.map((c, i) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onMouseEnter={() => {
                        const label = labelsRef.current[i];
                        const painel = panelRef.current;
                        if (!label || !painel) return;
                        const l = label.getBoundingClientRect();
                        const p = painel.getBoundingClientRect();
                        /* getBoundingClientRect parte da borda do painel, mas o
                           realce é posicionado a partir do padding box: descontar
                           a borda mantém os dois exatamente alinhados. */
                        setPill({
                          left: l.left - p.left - painel.clientLeft,
                          top: l.top - p.top - painel.clientTop,
                          width: l.width,
                          height: l.height,
                        });
                      }}
                      className="block px-1 py-1"
                    >
                      <span
                        ref={(el) => {
                          labelsRef.current[i] = el;
                        }}
                        className="relative inline-block rounded-full px-3 py-1.5 text-[14px] font-bold"
                      >
                        {c.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {mainLinks.map((l) => (
              <Link key={l.href} href={l.href} className="py-5 text-[15px] font-bold hover:text-accent">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/vestibular/inscricao"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-accent-hover sm:gap-2.5 sm:px-6 sm:text-[15px]"
            >
              Matricule-se
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <a
              href={SITE.ava}
              target="_blank"
              rel="noopener noreferrer"
              title="Já sou aluno — acessar o AVA"
              className="hidden items-center gap-2 rounded-full border border-white/25 px-4 py-2.5 text-[14px] font-bold hover:border-white/60 xl:inline-flex"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.9" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
              Já sou aluno
            </a>

            <a
              href={SITE.ava}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Já sou aluno — acessar o AVA"
              className="p-2 hover:text-accent xl:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.9" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-[58px] z-40 overflow-y-auto bg-navy-950 lg:hidden">
          <nav className="container-x flex flex-col py-6">
            <span className="t-label mb-1 text-sky-400 uppercase">Cursos</span>
            {courseLinks.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 text-lg font-bold"
              >
                {c.label}
              </Link>
            ))}
            {mainLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 text-lg font-bold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contato"
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-4 text-lg font-bold"
            >
              Contato
            </Link>
            <a
              href={SITE.ava}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 rounded-full border border-white/30 py-3.5 text-center font-bold"
            >
              Já sou aluno (AVA)
            </a>
            <Link
              href="/vestibular/inscricao"
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-full bg-accent py-3.5 text-center font-bold text-white"
            >
              Matricule-se
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
