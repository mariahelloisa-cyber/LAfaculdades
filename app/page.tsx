import Link from "next/link";
import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CourseFinder from "@/components/CourseFinder";
import IngressoCards from "@/components/IngressoCards";
import SplitFeature from "@/components/SplitFeature";
import VerticalTestimonials from "@/components/VerticalTestimonials";
import FaqAccordion from "@/components/FaqAccordion";
import { getPosts } from "@/lib/data/posts";
import { getFeaturedCourses } from "@/lib/data/courses";
import { getSiteMediaUrl } from "@/lib/data/siteMedia";

const faqs = [
  {
    pergunta: "O diploma da LA Faculdade tem validade nacional?",
    resposta:
      "Sim. A LA Faculdade é credenciada pelo MEC (E-MEC 18263) e os diplomas emitidos têm validade em todo o território nacional.",
  },
  {
    pergunta: "Qual é a forma de ingresso mais rápida?",
    resposta:
      "A inscrição com pagamento direto pelo site é a via principal hoje. Vestibular próprio e ingresso pela nota do ENEM entram em breve.",
  },
  {
    pergunta: "Como funciona o financiamento LA Bank?",
    resposta:
      "O LA Bank é o financiamento estudantil da própria LA Faculdade, sem banco no meio do caminho e sem necessidade de fiador.",
  },
  {
    pergunta: "Existe área do aluno?",
    resposta:
      "Sim. O Ambiente Virtual de Aprendizagem (AVA) é acessado pelo botão “Já sou aluno” no topo do site.",
  },
  {
    pergunta: "Qual a diferença entre bacharelado, licenciatura e tecnólogo?",
    resposta:
      "O bacharelado é a formação mais ampla; a licenciatura habilita para a docência; o tecnólogo é mais curto e focado numa área específica do mercado.",
  },
  {
    pergunta: "Preciso ir até uma unidade para estudar?",
    resposta:
      "Nos cursos EAD, não. Nos cursos semipresenciais há encontros presenciais para práticas de laboratório e estágio supervisionado.",
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
        art="/images/sobre1.png"
        eyebrow="Por que a LA?"
        title="Uma faculdade que cabe na rotina de quem já trabalha."
        body="Você estuda no horário que der, com tutoria que responde de verdade, mensalidade que não aperta o orçamento e um diploma reconhecido pelo MEC que vale em todo o país."
        linkHref="/institucional"
        linkLabel="Conheça a instituição"
        badge={{ top: "Credenciada pelo", big: "MEC" }}
        cards={[
          { art: "/images/imagem1.png", label: "Tutoria ativa" },
          { art: "/images/imagem2.png", label: "100% online" },
          { art: "/images/imagem3.png", label: "Mensalidade justa" },
        ]}
      />

      {/* 4 — Depoimentos em marquee vertical (ocupa o lugar da antiga seção LA Bank).
             No desktop: texto à esquerda, esteira à direita e centralizada verticalmente.
             No mobile: empilha. */}
      {/* Padding vertical mínimo: a esteira quase encosta nas bordas da seção. */}
      <section className="bg-white pt-12 pb-4 lg:py-6">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[38%_1fr] lg:gap-14">
            <Reveal>
              <SectionHeading
                title="Quem já estuda na LA"
                description="Histórias de alunos que voltaram a estudar e mudaram de patamar profissional."
              />
            </Reveal>

            <VerticalTestimonials />
          </div>
        </Container>
      </section>
      
      {/* 7 — FAQ em duas colunas */}
      <section className="section-y bg-tint">
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

      {/* 8 — CTA de fechamento */}
      <section className="bg-navy-950">
        <Container className="py-16 lg:py-20">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="t-h2 max-w-2xl text-white">
              Você não precisa ter tudo pronto. Só precisa começar.
            </h2>
            <Link
              href="/vestibular/inscricao"
              className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-accent px-9 py-5 text-lg font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Quero me inscrever
              <svg width="20" height="15" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
