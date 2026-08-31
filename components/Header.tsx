"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

const courseLinks = [
  { label: "Graduação", href: "/graduacao", desc: "Bacharelado, licenciatura e tecnólogo" },
  { label: "Pós-Graduação", href: "/pos-graduacao", desc: "MBAs e especializações lato sensu" },
];

const mainLinks = [
  { label: "Por que a LA?", href: "/institucional" },
  { label: "Vestibular", href: "/vestibular" },
  { label: "Financiamento", href: "/financiamento-la-bank" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
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
      className={`sticky top-0 z-50 bg-navy-950 text-white transition-shadow duration-300 ${
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

          <Link href="/" className="shrink-0" aria-label="LA Faculdades — página inicial">
            <Image
              src="/images/logo-horizontal.png"
              alt="LA Faculdades"
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
              onMouseLeave={() => setCoursesOpen(false)}
            >
              <button className="flex items-center gap-1.5 py-5 text-[15px] font-bold text-white hover:text-accent">
                Cursos
                <svg
                  width="11"
                  height="7"
                  viewBox="0 0 10 6"
                  fill="none"
                  className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              {coursesOpen && (
                <div className="absolute left-0 top-full w-72 overflow-hidden rounded-2xl bg-white py-2 text-navy-950 shadow-2xl">
                  {courseLinks.map((c) => (
                    <Link key={c.href} href={c.href} className="block px-5 py-3.5 hover:bg-tint">
                      <span className="block text-[15px] font-bold">{c.label}</span>
                      <span className="mt-0.5 block text-[13px] text-muted">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
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
