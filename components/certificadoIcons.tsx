import type { ReactNode } from "react";
import type { BlocoCertificado } from "@/lib/certificados";

/* Ícones da página /validar, no mesmo traço dos outros do site: viewBox 24,
   espessura 1.9, pontas e junções arredondadas, cor herdada do texto.
   Separados num módulo próprio porque o formulário e o resultado usam os
   mesmos — mesma ideia de components/AreaIcons.tsx. */

export function IconeBusca() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="1.9" />
      <path d="m15.8 15.8 4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** Selo com visto: cabeçalho do resultado. */
export function IconeSelo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9.5" r="5.6" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="m9.7 9.6 1.7 1.7 3-3.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.6 14.6 7.4 21l4.6-2.4 4.6 2.4-1.2-6.4" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeInfo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 11v5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="7.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function IconeQr({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.9" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.9" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.9" />
      <path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18z" fill="currentColor" />
    </svg>
  );
}

/** Um ícone por bloco do resultado, pelo `id` do bloco. */
export const ICONES_BLOCO: Record<BlocoCertificado["id"], ReactNode> = {
  aluno: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.9" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  curso: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 9.2 12 5l9 4.2-9 4.2-9-4.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M7 11.6V16c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  datas: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  registro: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5.6A1.6 1.6 0 0 1 6.6 4H18a1 1 0 0 1 1 1v14.4H6.6A1.6 1.6 0 0 1 5 17.8V5.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M8.6 8.4h6.8M8.6 12h4.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
};
