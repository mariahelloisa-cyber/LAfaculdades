import Image from "next/image";
import persona from "@/app/assets/persona.png";

/* Cor de fundo da seção — o mesmo azul claro do "Como funciona". Fica numa
   constante porque o degradê que esconde o corte da foto usa a mesma cor. */
const FUNDO = "#b9d5ef";

function Balao({ children, className }: { children: string; className: string }) {
  return (
    <span
      className={`absolute z-10 hidden rounded-lg bg-sky-100 px-3.5 py-2 text-[15px] font-extrabold text-navy-950 shadow-[0_8px_20px_rgba(6,21,35,0.08)] sm:block lg:text-[18px] ${className}`}
    >
      {children}
      {/* Biquinho do balão de fala. */}
      <span aria-hidden className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-sky-100" />
    </span>
  );
}

function Seta({ className }: { className: string }) {
  return (
    <svg width="80" height="84" viewBox="0 0 80 84" fill="none" aria-hidden className={className}>
      <path
        d="M6 8.5c0-4.2 4.6-6.8 8.2-4.6l58 33.5c3.6 2.1 3.6 7.2 0 9.3l-58 33.5C10.6 82.3 6 79.7 6 75.5v-67Z"
        stroke="white"
        strokeWidth="2.5"
      />
    </svg>
  );
}

/** Chamada logo abaixo do hero do vestibular: foto recortada ao centro,
 *  balões de hashtag em volta e o botão para a inscrição. */
export default function VestibularChamada() {
  return (
    <section className="relative isolate overflow-hidden" style={{ backgroundColor: FUNDO }}>
      <div className="container-x flex flex-col items-center pb-14 pt-10 text-center lg:pb-20 lg:pt-12">
        <div className="relative">
          <Balao className="-left-40 top-[30%] lg:-left-52">#vestibularonline</Balao>
          <Balao className="-left-16 top-[12%] lg:-left-24">#tônaLA</Balao>
          <Balao className="-right-40 top-[24%] lg:-right-48">#provanocelular</Balao>

          <div className="pointer-events-none absolute -right-[300px] top-[42%] hidden items-center gap-4 lg:flex">
            <Seta className="opacity-40" />
            <Seta className="opacity-70" />
            <Seta className="" />
          </div>

          <Image
            src={persona}
            alt="Estudante sorrindo com a mochila no ombro"
            sizes="(min-width: 1024px) 340px, 260px"
            className="relative h-auto w-[240px] sm:w-[290px] lg:w-[340px]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[65%]"
            style={{ background: `linear-gradient(to top, ${FUNDO} 38%, transparent)` }}
          />
        </div>

        <h2 className="t-h2 relative z-10 -mt-24 max-w-4xl text-navy-950 sm:-mt-28 lg:-mt-36">
          Sua vaga começa
          <br />
          com uma{" "}
          <span className="mt-2 inline-block rounded-lg bg-white px-3 pb-1.5 text-accent">prova online!</span>
        </h2>

      </div>
    </section>
  );
}
