import type { ReactElement } from "react";

// Ícones desenhados à mão (mesmo padrão do resto do site) — um por
// categoria do blog, compartilhado entre o card e a sidebar.
export const categoriaIcons: Record<string, ReactElement> = {
  Carreira: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  Educação: (
    <>
      <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "Mercado de Trabalho": (
    <>
      <path d="M3 17 9.5 10.5 13.5 14.5 21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Tecnologia: (
    <>
      <rect x="3" y="4.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 20h8M12 16.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  "Dicas de Estudo": (
    <path d="M6 3.5h12v17l-6-4-6 4v-17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  ),
  "Histórias que Inspiram": (
    <path
      d="M12 3 13.5 9 20 10.5 13.5 12 12 18.5 10.5 12 4 10.5 10.5 9 12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
};

export const categoriaIconFallback = (
  <>
    <path d="M6 4h9l3 3v13H6V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 10h6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </>
);
