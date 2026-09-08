/**
 * Marca decorativa em L (canto superior esquerdo) que emoldura o bloco de
 * título: a perna vertical desce à esquerda do texto e a barra horizontal
 * corre por cima dele. Puramente decorativa — escondida dos leitores de tela.
 * A cor acompanha o azul escuro do header (navy-950).
 *
 * Duas barras retas, sem contorno: assim a espessura não muda quando o SVG é
 * redimensionado, e o canto fica perfeitamente reto.
 */
export default function StrokeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 78 112"
      fill="#061523"
      aria-hidden
      focusable="false"
      className={className}
      preserveAspectRatio="xMinYMin meet"
    >
      {/* perna vertical */}
      <rect x="0" y="0" width="14" height="112" />
      {/* barra horizontal */}
      <rect x="0" y="0" width="78" height="14" />
    </svg>
  );
}
