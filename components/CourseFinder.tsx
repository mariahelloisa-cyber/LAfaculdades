"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Course } from "@/lib/data/courses";
import FilterPills from "./FilterPills";
import CourseCard from "./CourseCard";
import SearchInput from "./SearchInput";

export default function CourseFinder({
  courses,
  titulo = "Cursos mais procurados",
}: {
  courses: Course[];
  /** Título da seção — a home usa o padrão; outras páginas trocam o texto. */
  titulo?: string;
}) {
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

  /* A esteira esconde a barra de rolagem (ver .rail), então sem as setas não
     haveria como rolar com o mouse. Elas só aparecem quando há o que rolar —
     com 4 cursos ou menos a fileira cabe inteira e some. */
  const railRef = useRef<HTMLDivElement>(null);
  const [rolagem, setRolagem] = useState({ inicio: false, fim: false });

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const medir = () => {
      const max = el.scrollWidth - el.clientWidth;
      setRolagem({
        // A folga de 1px absorve o arredondamento de subpixel do layout.
        inicio: el.scrollLeft > 1,
        fim: el.scrollLeft < max - 1,
      });
    };

    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
    // Refaz a medição quando a lista muda (troca de aba ou busca).
  }, [list]);

  const rolar = (sentido: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Rola de "página" em página, respeitando o snap de cada card.
    el.scrollBy({ left: sentido * el.clientWidth, behavior: "smooth" });
  };

  /* Arrastar com o mouse. Só para mouse: no touch o próprio navegador já
     rola, e sequestrar o gesto ali quebraria a rolagem vertical da página. */
  const arrasto = useRef({ ativo: false, moveu: false, x: 0, scroll: 0 });
  const [arrastando, setArrastando] = useState(false);

  const aoPressionar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = railRef.current;
    if (!el) return;
    arrasto.current = { ativo: true, moveu: false, x: e.clientX, scroll: el.scrollLeft };
    setArrastando(true);
  };

  const aoMover = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = railRef.current;
    if (!el || !arrasto.current.ativo) return;
    const dx = e.clientX - arrasto.current.x;

    /* Só vira arrasto depois de 4px: abaixo disso ainda é um clique, e o
       link do card precisa continuar funcionando. */
    if (!arrasto.current.moveu) {
      if (Math.abs(dx) < 4) return;
      arrasto.current.moveu = true;
      el.setPointerCapture(e.pointerId);
      /* O snap puxaria o trilho de volta a cada quadro enquanto o dedo
         ainda está arrastando; ele volta a valer ao soltar. */
      el.style.scrollSnapType = "none";
    }
    el.scrollLeft = arrasto.current.scroll - dx;
  };

  const aoSoltar = () => {
    const el = railRef.current;
    if (el) el.style.scrollSnapType = "";
    arrasto.current.ativo = false;
    setArrastando(false);
  };

  /* Sem isto, soltar o mouse em cima de um card abriria a página daquele
     curso no fim de cada arrasto. `moveu` só é zerado aqui, depois do
     clique, porque o clique chega sempre após o pointerup. */
  const aoClicar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!arrasto.current.moveu) return;
    e.preventDefault();
    e.stopPropagation();
    arrasto.current.moveu = false;
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      {/* Linha 1 — título à esquerda, busca à direita.
          No mobile a busca vem antes do título, como já era. */}
      <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <h2 className="text-[2.25rem] font-extrabold leading-[1.02] tracking-tight text-black lg:text-[52px]">
          {titulo}
        </h2>

        <SearchInput value={query} onChange={setQuery} />
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

      {/* Esteira — uma fileira só, 4 cursos por vez no desktop. Passando
          disso, rola para o lado em vez de empilhar em novas linhas. */}
      {list.length === 0 ? (
        <p className="py-12 text-center font-semibold text-muted">
          Nenhum curso encontrado para essa busca.
        </p>
      ) : (
        <div className="relative mt-12">
          <div
            ref={railRef}
            className={`rail ${arrastando ? "cursor-grabbing select-none" : "cursor-grab"}`}
            onPointerDown={aoPressionar}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerCancel={aoSoltar}
            onClickCapture={aoClicar}
            /* A imagem do card é arrastável por padrão no navegador, e esse
               gesto nativo roubaria o nosso no meio do caminho. */
            onDragStart={(e) => e.preventDefault()}
          >
            {list.map((course) => (
              <CourseCard key={`${course.nivelSlug}-${course.slug}`} course={course} />
            ))}
          </div>

          {rolagem.inicio && <SetaEsteira sentido={-1} onClick={() => rolar(-1)} />}
          {rolagem.fim && <SetaEsteira sentido={1} onClick={() => rolar(1)} />}
        </div>
      )}
    </div>
  );
}

/* Seta da esteira: fica por cima das bordas do trilho, meia altura do card. */
function SetaEsteira({ sentido, onClick }: { sentido: 1 | -1; onClick: () => void }) {
  const anterior = sentido === -1;
  return (
    <button
      onClick={onClick}
      aria-label={anterior ? "Cursos anteriores" : "Próximos cursos"}
      className={`absolute top-[114px] z-10 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_4px_16px_rgba(6,21,35,0.18)] transition-colors hover:bg-tint ${
        anterior ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <svg
        width="18"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        className={anterior ? "rotate-180" : ""}
        aria-hidden
      >
        <path
          d="M1 7h17M12.5 1 18.5 7l-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
