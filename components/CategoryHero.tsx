import Image from "next/image";
import type { CSSProperties } from "react";

/** Hero das páginas de categoria: foto de fundo com véu azul da marca e o
 *  texto à esquerda, centralizado na vertical. Todo o conteúdo vem por
 *  props — é o mesmo componente para toda categoria. */
export default function CategoryHero({
  title,
  description,
  backgroundUrl = "/images/matricula-hero.jpg",
}: {
  title: string;
  description?: string;
  backgroundUrl?: string;
}) {
  const atraso = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

  /* O fecho do título sai no azul da marca, como a linha de destaque da
     referência. Com quebras de linha digitadas no admin, o fecho é a última
     linha; sem quebras, são as duas últimas palavras. O espaço de dentro do
     fecho é inseparável, então ele nunca fica partido ao meio. */
  const linhas = title.split(/\r?\n/);
  const [inicio, fecho] =
    linhas.length > 1
      ? [linhas.slice(0, -1).join("\n"), linhas[linhas.length - 1].trim()]
      : (() => {
          const m = title.trim().match(/^(.*?)\s*(\S+\s+\S+)$/);
          return m ? [m[1], m[2]] : ["", title.trim()];
        })();
  const fechoUnido = fecho.replace(/\s+/g, " ");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950">
        <Image
          src={backgroundUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        {/* Overlay no azul da marca: forte no lado do texto e mais aberto à
            direita, para a foto de fundo ainda aparecer sem atrapalhar a
            leitura. No mobile o degradê vira vertical. */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/95 via-navy-900/90 to-navy-950/95 lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-900/92 lg:to-navy-700/55" />

        <div className="container-x">
          <div className="flex min-h-[260px] flex-col justify-center py-12 sm:py-14 lg:min-h-[440px] lg:py-16">
            <h1
              className="hero-in-left max-w-[38rem] whitespace-pre-line font-display text-[clamp(1.75rem,2.8vw,2.75rem)] font-extrabold uppercase leading-[1.06] tracking-tight text-white"
              style={atraso(0)}
            >
              {inicio && `${inicio}\n`}
              <span className="text-accent">{fechoUnido}</span>
            </h1>

            {description && (
              <p
                className="hero-in-left mt-5 max-w-[58ch] text-[clamp(0.95rem,1.1vw,1.25rem)] font-medium leading-relaxed text-white/90"
                style={atraso(320)}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Faixa que fecha a hero — a mesma ideia da faixa de selos da página
          de matrícula, aqui só como barra de cor. */}
      <div className="h-11 w-full bg-accent sm:h-14" />
    </>
  );
}
