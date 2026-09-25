import Link from "next/link";
import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CourseFinder from "@/components/CourseFinder";
import IngressoCards from "@/components/IngressoCards";
import SplitFeature from "@/components/SplitFeature";
import VerticalTestimonials from "@/components/VerticalTestimonials";
import StrokeMark from "@/components/StrokeMark";
import TestimonialsVideo from "@/components/TestimonialsVideo";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import FaqAccordion from "@/components/FaqAccordion";
import QuizIntro from "@/components/vocational-quiz/QuizIntro";
import { getPosts } from "@/lib/data/posts";
import { getFeaturedCourses } from "@/lib/data/courses";
import { getSiteMediaUrl } from "@/lib/data/siteMedia";

const faqs = [
  {
    pergunta: "O diploma da LA Faculdades tem validade nacional?",
    resposta:
      "Sim. A LA Faculdades é credenciada pelo MEC (E-MEC 26591) e os diplomas emitidos têm validade em todo o território nacional.",
  },
  {
    pergunta: "Como funciona o financiamento LA Bank?",
    resposta:
      "O LA Bank é o financiamento estudantil da própria LA Faculdades, sem banco no meio do caminho e sem necessidade de fiador.",
  },
  {
    pergunta: "Onde consigo acessar a área do aluno?",
    resposta:
      "O seu Ambiente Virtual de Aprendizagem (AVA) está a um clique de distância. Basta acessar o botão “Já sou aluno”, localizado no topo do nosso site, para entrar com seus dados.",
  },
];

export default async function HomePage() {
  const [posts, cursosDestaque, heroVideoUrl] = await Promise.all([
    getPosts().then((p) => p.slice(0, 4)),
    getFeaturedCourses(),
    getSiteMediaUrl("home_hero_video"),
  ]);

  return (
    <>
      <Hero videoUrl={heroVideoUrl} />

      {/* 1 — Oferta principal: busca + filtros + carrossel de cursos */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <CourseFinder courses={cursosDestaque} />
          </Reveal>
        </Container>
      </section>

      {/* 2 — Formas de ingresso: três cards editoriais com entrada em cascata */}
      <section className="relative isolate bg-surface pt-[clamp(2rem,3.9vw,3.5rem)] pb-[clamp(3rem,5.95vw,5.5rem)]">
        <Container>
          <IngressoCards />
        </Container>
      </section>

      {/* 3 — Split assimétrico full-bleed: por que a LA */}
      <SplitFeature
        art="/images/sobre1.jpg"
        eyebrow="Por que a LA?"
        title="Uma faculdade que cabe na rotina de quem já trabalha."
        body="Estude nos horários que preferir, conte com suporte e tutoria humanizada de verdade, pague mensalidades acessíveis e conquiste um diploma reconhecido pelo MEC."
        linkHref="/institucional"
        linkLabel="Conheça a instituição"
        badge={{ top: "Credenciada pelo", big: "MEC" }}
        cards={[
          { art: "/images/imagem1.jpg", label: "Tutoria ativa" },
          { art: "/images/imagem2.jpg", label: "Ensino a Distãncia" },
          { art: "/images/imagem3.jpg", label: "Mensalidade justa" },
        ]}
      />

      {/* 4 — Depoimentos em marquee vertical (ocupa o lugar da antiga seção LA Bank).
             No desktop: texto à esquerda, esteira à direita e centralizada verticalmente.
             No mobile: empilha. */}
      {/* Padding vertical mínimo: a esteira quase encosta nas bordas da seção. */}
      <section className="relative overflow-hidden bg-white pt-12 pb-8 lg:py-14">
        {/* Forma azul centralizada na página, atrás de todo o conteúdo da seção. */}
        <BlobDepoimentos />

        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[41%_1fr] lg:gap-14">
            <Reveal>
              {/* Bloco editorial: traço + título + subtítulo + vídeo. */}
              <div>
                {/* O L fica atrás do texto: a perna vertical à esquerda e a
                    barra horizontal correndo por cima do título. O padding do
                    bloco abre exatamente o espaço dele, sem estourar a margem. */}
                <div className="relative pl-6 pt-5 sm:pl-8 sm:pt-6">
                  <StrokeMark className="absolute left-0 top-0 h-[104px] w-[72px] sm:h-[124px] sm:w-[86px]" />

                  <div className="relative min-w-0">
                    <h2 className="font-display text-[clamp(2.85rem,4.5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-navy-950">
                      Quem já
                      <br />
                      estuda na LA
                    </h2>
                    <p className="mt-4 max-w-[32ch] text-[18px] font-semibold leading-[1.5] text-navy-800">
                      Histórias de alunos que voltaram a estudar e mudaram de patamar profissional.
                    </p>
                  </div>
                </div>

                {/* Vídeo fora da coluna do traço: ocupa a largura inteira do bloco. */}
                <div className="mt-8 -mx-3 sm:mx-0">
                  <TestimonialsVideo />
                </div>
              </div>
            </Reveal>

            <VerticalTestimonials />
          </div>
        </Container>
      </section>

      {/* 5 — Teste vocacional: só a chamada; as perguntas ficam em /teste-vocacional */}
      <QuizIntro />

      {/* 7 — FAQ em duas colunas */}
      <section className="section-y bg-tint-deep">
        <Container>
          <Reveal>
            <SectionHeading title="Perguntas frequentes" />
          </Reveal>
          <Reveal>
            <div className="mt-12">
              <FaqAccordion items={faqs} />
            </div>
          </Reveal>
        </Container>
      </section>

    
    </>
  );
}
