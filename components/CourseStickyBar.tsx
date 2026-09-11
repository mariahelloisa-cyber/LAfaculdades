"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function money(v: number) {
  return v.toFixed(2).replace(".", ",");
}

/** Barra de matrícula que entra quando o card lateral sai da tela — no
 *  desktop, quando a coluna de conteúdo acaba; no mobile, onde o card nem
 *  chega a aparecer, logo depois do hero. */
export default function CourseStickyBar({
  nome,
  nivelNome,
  area,
  mensalidade,
  mensalidadeDe,
  href,
  watchSelector = "#card-matricula",
  hideSelector = "footer",
}: {
  nome: string;
  nivelNome: string;
  area: string;
  mensalidade: number;
  mensalidadeDe: number;
  href: string;
  watchSelector?: string;
  /** Ao encostar neste elemento (o rodapé), a barra sai de cena. */
  hideSelector?: string;
}) {
  const [visivel, setVisivel] = useState(false);
  const [reais, centavos] = money(mensalidade).split(",");

  useEffect(() => {
    const card = document.querySelector(watchSelector);
    const rodape = document.querySelector(hideSelector);
    let cardNaTela = false;
    let rodapeNaTela = false;

    const atualizar = () => setVisivel(window.scrollY > 420 && !cardNaTela && !rodapeNaTela);

    const observar = (alvo: Element | null, ao: (visivel: boolean) => void) => {
      if (!alvo) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ao(entry.isIntersecting);
          atualizar();
        },
        { threshold: 0 }
      );
      obs.observe(alvo);
      return obs;
    };

    const ioCard = observar(card, (v) => (cardNaTela = v));
    const ioRodape = observar(rodape, (v) => (rodapeNaTela = v));

    window.addEventListener("scroll", atualizar, { passive: true });
    atualizar();

    return () => {
      ioCard?.disconnect();
      ioRodape?.disconnect();
      window.removeEventListener("scroll", atualizar);
    };
  }, [watchSelector, hideSelector]);

  return (
    <div
      aria-hidden={!visivel}
      className={`fixed bottom-0 left-1/2 z-40 w-[min(980px,calc(100%-2rem))] -translate-x-1/2 transition-all duration-300 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      {/* Encostado no rodapé da tela: cantos arredondados só em cima, base
          cortada pela borda. O pr extra reserva o canto do botão do WhatsApp. */}
      <div className="flex items-center gap-4 rounded-t-[32px] bg-white py-7 pl-6 pr-[76px] shadow-[0_10px_40px_rgba(6,21,35,0.18)] ring-1 ring-navy-950/5 sm:gap-8 sm:py-9 sm:pl-9 xl:pr-9">
        <div className="min-w-0 flex-1">
          <span className="hidden items-center gap-2 text-[12px] font-bold text-navy-950 sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-200 text-navy-900">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path
                  d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {nivelNome} | {area}
          </span>
          <p className="truncate font-display text-[17px] font-extrabold leading-tight tracking-tight text-navy-950 sm:mt-1 sm:text-[22px]">
            {nome}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-6 border-l border-navy-950/10 pl-6 lg:flex">
          <span className="flex h-7 items-center rounded-full bg-[#F23883] px-4 text-[12px] font-bold text-white">
            R$ 49,90 no 1º mês
          </span>
        </div>

        <div className="shrink-0 text-right">
          {mensalidadeDe > mensalidade && (
            <p className="hidden text-[11px] font-semibold text-muted sm:block">
              De <s>R$ {money(mensalidadeDe)}</s> por
            </p>
          )}
          <p className="flex items-baseline justify-end gap-1 text-navy-950">
            <span className="text-[13px] font-bold">R$</span>
            <span className="font-display text-[26px] font-extrabold leading-none tracking-tight sm:text-[34px]">
              {reais}
            </span>
            <span className="text-[13px] font-bold">,{centavos}</span>
            <span className="text-[11px] font-semibold text-muted">/mês</span>
          </p>
        </div>

        <Link
          href={href}
          // A matrícula é feita por um consultor no WhatsApp: link externo abre fora.
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          tabIndex={visivel ? undefined : -1}
          className="flex h-[46px] shrink-0 items-center gap-3 rounded-full bg-[#FFD600] px-5 text-[14px] font-bold text-black transition-[filter] hover:brightness-95 sm:h-[54px] sm:px-8 sm:text-[15px]"
        >
          <span className="hidden sm:inline">Matricule-se</span>
          <span className="sm:hidden">Matrícula</span>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
            <path
              d="M1 8h19M14 1.5 20.5 8 14 14.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
