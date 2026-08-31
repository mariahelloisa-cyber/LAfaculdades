import Link from "next/link";
import Container from "@/components/Container";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CourseFinder from "@/components/CourseFinder";
import SplitFeature from "@/components/SplitFeature";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import FaqAccordion from "@/components/FaqAccordion";
import { getPosts } from "@/lib/data/posts";
import { getFeaturedCourses } from "@/lib/data/courses";
import { getSiteMediaUrl } from "@/lib/data/siteMedia";

const ingresso = [
  {
    titulo: "Inscreva-se e pague",
    tag: "Disponível agora",
    ativo: true,
    descricao:
      "A via mais rápida: preencha seus dados, escolha o curso e finalize a inscrição direto pelo site.",
  },
  {
    titulo: "Vestibular próprio",
    tag: "Em breve",
    ativo: false,
    descricao: "Prova online, feita no seu tempo, com resultado em poucos dias úteis.",
  },
  {
    titulo: "Nota do ENEM",
    tag: "Em breve",
    ativo: false,
    descricao: "Use a nota de qualquer edição anterior e pule a prova inteira.",
  },
];

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

      {/* 2 — Formas de ingresso, em faixa tonal */}
      <section className="section-y bg-tint">
        <Container>
          <Reveal>
            <SectionHeading
              title="Você escolhe como entrar."
              description="Três formas de ingressar na LA Faculdade — hoje a inscrição com pagamento direto é a via principal e mais rápida."
              linkHref="/vestibular"
              linkLabel="Ver detalhes do vestibular"
            />
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {ingresso.map((item, i) => (
              <Reveal key={item.titulo} delay={i * 90}>
                <div
                  className={`flex h-full flex-col rounded-2xl p-7 ${
                    item.ativo ? "bg-navy-950 text-white" : "bg-white text-navy-950"
                  }`}
                >
                  <span
                    className={`t-label w-fit rounded-full px-3.5 py-1.5 uppercase ${
                      item.ativo ? "bg-rose text-white" : "bg-surface text-muted"
                    }`}
                  >
                    {item.tag}
                  </span>
                  <h3 className="t-h3 mt-5">{item.titulo}</h3>
                  <p className={`mt-3 text-[15px] leading-relaxed ${item.ativo ? "text-sky-200" : "text-muted"}`}>
                    {item.descricao}
                  </p>
                  {item.ativo && (
                    <Link
                      href="/vestibular/inscricao"
                      className="mt-7 rounded-full bg-accent py-3.5 text-center font-bold text-white transition-colors hover:bg-accent-hover"
                    >
                      Iniciar inscrição
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3 — Split assimétrico full-bleed: por que a LA */}
      <SplitFeature
        art="campus.svg"
        eyebrow="Por que a LA?"
        title="Uma faculdade que cabe na rotina de quem já trabalha."
        body="Você estuda no horário que der, com tutoria que responde de verdade, mensalidade que não aperta o orçamento e um diploma reconhecido pelo MEC que vale em todo o país."
        linkHref="/institucional"
        linkLabel="Conheça a instituição"
        badge={{ top: "Credenciada pelo", big: "MEC" }}
        cards={[
          { art: "beneficio-1.svg", label: "Tutoria ativa" },
          { art: "beneficio-2.svg", label: "100% online" },
          { art: "beneficio-3.svg", label: "Mensalidade justa" },
        ]}
      />

      {/* 4 — Seção escura: LA Bank */}
      <section className="section-y bg-navy-950">
        <Container>
          <Reveal>
            <SectionHeading
              dark
              title="LA Bank"
              description="O financiamento estudantil da própria instituição. Sem banco no meio do caminho, sem fiador e com aprovação na hora da matrícula."
              linkHref="/financiamento-la-bank"
              linkLabel="Conhecer o LA Bank"
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Sem banco", d: "Financiamento direto com a instituição, sem análise de terceiros." },
              { t: "Sem fiador", d: "Você não precisa apresentar ninguém como garantia." },
              { t: "Aprovação na hora", d: "A análise acontece no momento da matrícula, sem espera." },
              { t: "Soma com bolsas", d: "As condições podem ser combinadas com bolsas e descontos." },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/12 bg-white/5 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{item.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-sky-200">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12">
              <TrustBadges dark />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 5 — Depoimentos em faixa tonal */}
      <section className="section-y bg-tint">
        <Container>
          <Reveal>
            <SectionHeading
              title="Quem já estuda na LA"
              description="Histórias de alunos que voltaram a estudar e mudaram de patamar profissional."
            />
          </Reveal>
          <Reveal>
            <div className="mt-12">
              <Testimonials />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 6 — Blog */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <SectionHeading
              title="Blog LA"
              description="Conhecimento que inspira e transforma."
              linkHref="/blog"
              linkLabel="Ver todos os posts"
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-surface p-6 transition-shadow hover:shadow-[0_16px_38px_rgba(6,21,35,0.14)]"
                >
                  <span className="t-label w-fit rounded-full bg-accent px-3 py-1.5 uppercase text-white">
                    {post.categoria}
                  </span>
                  <h3 className="mt-5 text-[17px] font-bold leading-snug text-navy-950 group-hover:text-accent">
                    {post.titulo}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{post.resumo}</p>
                  <span className="mt-5 text-[13px] font-bold text-navy-950 underline underline-offset-4">
                    Ler post
                  </span>
                </Link>
              </Reveal>
            ))}
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
