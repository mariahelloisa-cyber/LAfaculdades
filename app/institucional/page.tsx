import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Container from "@/components/Container";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import CourseBannerCta from "@/components/CourseBannerCta";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/constants";
import { getSiteMediaUrls, type SiteMediaKey } from "@/lib/data/siteMedia";

export const metadata: Metadata = {
  title: "Institucional",
  description: "Conheça a missão, a visão e o credenciamento MEC da LA Faculdade.",
};

const iconProps = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const destaques: { icon: ReactNode; texto: string }[] = [
  {
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m8.8 12 2.2 2.2 4.2-4.4" />
      </svg>
    ),
    texto: `Credenciada pelo MEC — E-MEC ${SITE.emec}.`,
  },
  {
    icon: (
      <svg {...iconProps}>
        <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9L12 3.5Z" />
      </svg>
    ),
    texto: "Nota 5,0 na avaliação do Google.",
  },
  {
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="9" r="5.5" />
        <path d="m8.8 13.6-1.3 7 4.5-2.4 4.5 2.4-1.3-7" />
      </svg>
    ),
    texto: "Selo RA1000 no ReclameAQUI.",
  },
  {
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
        <path d="M2 19h20" />
      </svg>
    ),
    texto: "Ensino Flexível: estude de onde estiver.",
  },
];

/* Imagens enviadas pelo admin em /admin/midia/redes-sociais. */
const redes: { chave: SiteMediaKey; nome: string; href: string }[] = [
  { chave: "social_facebook", nome: "Facebook", href: SITE.facebook },
  { chave: "social_instagram", nome: "Instagram", href: SITE.instagram },
  { chave: "social_youtube", nome: "YouTube", href: SITE.youtube },
  { chave: "social_reclameaqui", nome: "Reclame Aqui", href: SITE.reclameAqui },
  { chave: "social_google", nome: "Google Meu Negócio", href: SITE.googleMeuNegocio },
];

export default async function InstitucionalPage() {
  const redesImg = await getSiteMediaUrls(redes.map((r) => r.chave));

  return (
    <>
      {/* Hero com a fachada ao fundo. O pb extra reserva o espaço de onde os
          cards "saem" — eles sobem por cima da base da foto. */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        <Image
          src="/images/fachada.png"
          alt="Fachada da LA Faculdades"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/70 to-navy-950/40" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950/80 to-transparent" />

        <Container className="pb-40 pt-16 lg:pb-48 lg:pt-24">
          <Reveal>
            <span className="t-label mb-5 inline-block rounded-full bg-white/12 px-4 py-1.5 uppercase text-sky-300">
              Institucional
            </span>
            <h1 className="t-h2 max-w-4xl text-white">Educação acessível e de qualidade para todos</h1>
            <p className="t-lead mt-5 max-w-2xl text-sky-200">
              Acreditamos que todos têm o direito de sonhar grande. Conheça quem somos e como
              trabalhamos para tornar o ensino superior mais acessível.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cards sobrepostos à base do hero. */}
      <div className="bg-white">
        <Container className="relative z-10 -mt-28 lg:-mt-32">
          <ul className="mx-auto grid max-w-[1000px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {destaques.map((d, i) => (
              <li key={d.texto}>
                <Reveal delay={i * 70} className="h-full">
                  <div className="flex h-full flex-col gap-5 bg-navy-950 p-6 text-white shadow-[0_18px_40px_rgba(6,21,35,0.25)] lg:min-h-[180px]">
                    <span className="text-sky-200">{d.icon}</span>
                    <p className="text-[16px] font-bold leading-snug">{d.texto}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <section className="bg-white pt-10 lg:pt-14">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-black">
                Aqui você aprende de verdade
              </h2>
              <p className="mt-5 max-w-[46ch] text-[16px] font-semibold leading-relaxed text-black">
                A LA Faculdades é credenciada pelo MEC e nasceu para tornar o ensino superior
                acessível sem abrir mão da qualidade acadêmica. Com aulas EAD, você estuda
                no seu ritmo, de onde estiver, com o acompanhamento de uma equipe comprometida com
                a sua formação do primeiro dia até o diploma.
              </p>
              <p className="mt-6 border-l-4 border-accent pl-6 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-bold leading-[1.15] text-black">
                Educação de qualidade ao alcance de todos
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="relative aspect-square overflow-hidden rounded-[28px] sm:aspect-[16/10] lg:aspect-[4/2.9]">
                <Image
                  src="/images/historia.png"
                  alt="Alunos da LA Faculdades sorrindo juntos"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover object-[center_30%]"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>


      {/* Plataforma de aprendizagem: vídeo à esquerda, texto e celulares à direita. */}
      <section className="bg-white pt-10 lg:pt-14">
        <Container>
          <Reveal>
            <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-black">
              Sua jornada em um só lugar
            </h2>
          </Reveal>

          <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-10">
            <Reveal>
              <div className="relative aspect-video overflow-hidden rounded-[24px] bg-navy-950">
                <video
                  className="h-full w-full object-cover"
                  src="/images/videos/institucional.mp4"
                  poster="/images/fachada.png"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </Reveal>

            <Reveal delay={90} className="flex flex-col">
              <p className="font-display text-[clamp(1.2rem,1.6vw,1.45rem)] font-semibold leading-snug text-black">
                O AVA reúne recursos que fazem parte da sua experiência
                de aprendizagem.
              </p>
              <div className="relative mx-auto mt-4 aspect-[1080/1190] w-full max-w-[340px]">
                <Image
                  src="/images/celularla.png"
                  alt="Plataforma de aprendizagem da LA Faculdades no celular"
                  fill
                  sizes="(min-width: 1024px) 26vw, 340px"
                  className="object-contain"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* "Acompanhe" — prints das redes sociais, enviados pelo admin. */}
      <section className="relative mt-10 overflow-hidden bg-tint py-14 lg:mt-14 lg:py-20">
        <BlobDepoimentos fill="#b9d5ef" manterProporcao deslocamentoX={-60} />

        <Container className="relative z-10">
          <Reveal>
            <h2 className="text-center font-display text-[clamp(2rem,3.6vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-black">
              Acompanhe a <span className="text-navy-800">LA Faculdades</span>
            </h2>
          </Reveal>

          <ul className="mx-auto mt-10 grid max-w-[1240px] grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-6">
            {redes.map((rede, i) => {
              const img = redesImg[rede.chave];
              const card = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white ring-1 ring-navy-950/5 transition-transform duration-300 group-hover:-translate-y-1">
                    {img ? (
                      <Image
                        src={img}
                        alt={`Página da LA Faculdades no ${rede.nome}`}
                        fill
                        sizes="(min-width: 1024px) 230px, (min-width: 640px) 33vw, 50vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center bg-navy-850 px-4 text-center text-sm font-bold text-sky-300">
                        {rede.nome}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-center font-display text-[15px] font-extrabold uppercase text-navy-950 lg:text-[17px]">
                    {rede.nome}
                  </p>
                </>
              );

              return (
                <li key={rede.chave}>
                  <Reveal delay={i * 70}>
                    {rede.href ? (
                      <a href={rede.href} target="_blank" rel="noopener noreferrer" className="group block">
                        {card}
                      </a>
                    ) : (
                      <div className="group">{card}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Sem pt: o topo do card de vídeo encosta no fim da seção "Acompanhe". */}
      <section className="bg-white">
        <Container>
          <div className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden rounded-[28px] bg-navy-950 px-6 py-12 text-center lg:-mx-12 lg:min-h-[460px] xl:-mx-20">
            <video
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              src="/images/videos/institucional.mp4"
              poster="/images/fachada.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <div className="absolute inset-0 -z-10 bg-navy-950/55" />

            <Reveal>
              <p className="text-[15px] font-semibold text-sky-200">Vamos conversar?</p>
              <h2 className="t-h2 mx-auto mt-5 max-w-4xl text-white">
                Uma conversa pode mudar o rumo da sua carreira.
              </h2>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-navy-950 transition-colors hover:bg-sky-100"
              >
                Falar com um consultor
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <CourseBannerCta href="/matricula#cursos" />
    </>
  );
}
