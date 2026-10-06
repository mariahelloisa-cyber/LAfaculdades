import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CourseFinder from "@/components/CourseFinder";
import CourseBannerCta from "@/components/CourseBannerCta";
import BlobDepoimentos from "@/components/BlobDepoimentos";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import TrustBadges from "@/components/TrustBadges";
import { SITE } from "@/lib/constants";
import { getCourseNiveis, getFeaturedCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Matrícula",
  description:
    "A matrícula na LA Faculdades é simples: escolha o curso, clique em Saiba mais e depois em Matricule-se — um consultor finaliza tudo com você pelo WhatsApp.",
};

/* A matrícula não tem formulário no site: o aluno escolhe o curso, entra na
   página dele e o botão "Matricule-se" abre o WhatsApp da equipe já com o nome
   do curso na mensagem. Os passos abaixo descrevem esse caminho. */
const passos = [
  {
    n: "1",
    t: "Escolha o seu curso",
    d: "Navegue pelos cursos de graduação e pós-graduação e encontre o que combina com você.",
  },
  {
    n: "2",
    t: "Clique em “Saiba mais”",
    d: "Na página do curso você vê a grade curricular, a duração e a modalidade. O valor da mensalidade você consulta com um consultor.",
  },
  {
    n: "3",
    t: "Clique em “Matricule-se”",
    d: "O botão abre o WhatsApp da equipe de matrículas já com o nome do curso escrito na mensagem.",
  },
  {
    n: "4",
    t: "Finalize pelo WhatsApp",
    d: "Um consultor confere seus documentos, envia o pagamento e libera o seu acesso ao AVA.",
  },
];

const documentos = [
  {
    titulo: "Documento com foto",
    texto: "RG ou CNH, frente e verso — pode ser uma foto tirada pelo celular.",
    icone: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="9" cy="10.5" r="2.1" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5.8 16.5c.7-1.6 1.9-2.4 3.2-2.4s2.5.8 3.2 2.4M15 9.5h4M15 13h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "CPF",
    texto: "Basta informar o número ao consultor, sem precisar de cópia impressa.",
    icone: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <path d="M7 10.5h4M7 14h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Histórico ou diploma",
    texto: "Certificado do Ensino Médio para a graduação; diploma de graduação para a pós.",
    icone: (
      <>
        <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path
          d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "Comprovante de endereço",
    texto: "Uma conta recente no seu nome ou no nome de alguém da sua família.",
    icone: (
      <>
        <path d="M3 10.5 12 4l9 6.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5.5 10.5V20h13v-9.5M10 20v-5h4v5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
  },
];

const faqs = [
  {
    pergunta: "Preciso fazer prova para me matricular?",
    resposta:
      "Graduação: Sim, através do vestibular simplificado ou nota do ENEM.\nPós-Graduação: Não! Matrícula direta apenas com a sua documentação.",
  },
  {
    pergunta: "Onde fica o formulário de matrícula?",
    resposta:
      "Aqui no site, nós facilitamos tudo: todo o seu cadastro é feito diretamente por um de nossos consultores no WhatsApp. Dessa forma, você valida seus dados com total segurança e aproveita para tirar todas as suas dúvidas na mesma conversa.",
  },
  {
    pergunta: "Quanto tempo leva para a matrícula ficar pronta?",
    resposta:
      "É tudo muito rápido e direto. Nós validamos seus documentos e confirmamos o pagamento em geral no mesmo dia. Com isso feito, seu login no AVA é liberado e você já poderá assistir às primeiras aulas.",
  },
  {
    pergunta: "Quanto custa a primeira mensalidade?",
    resposta:
      "Apenas R$ 49,90! Esse é um valor promocional, válido apenas enquanto durarem as vagas da turma. Para saber o valor das mensalidades seguintes para o curso que você escolheu, converse com um de nossos consultores no WhatsApp e garanta uma condição exclusiva!",
  },
  {
    pergunta: "Dá para financiar a mensalidade?",
    resposta:
      "Com certeza! Através do LA Bank, nosso financiamento próprio, você parcela suas mensalidades direto com a gente. Como não exigimos fiador, o processo é muito mais rápido. Peça ao seu consultor para conhecer essa opção via WhatsApp!",
  },
];

export default async function MatriculaPage() {
  const [cursos, niveis] = await Promise.all([getFeaturedCourses(), getCourseNiveis()]);

  /* Mesmo padrão dos botões da página de curso: a conversa já abre com a
     intenção escrita, só que aqui sem o nome do curso. */
  const whatsappHref = `${SITE.whatsapp}?text=${encodeURIComponent(
    "Olá! Quero fazer minha matrícula na LA Faculdades."
  )}`;

  return (
    <>
      <PageHero
        eyebrow="Matrícula"
        title="Sua transformação profissional começa aqui."
        description="Escolha o curso ideal para os seus objetivos e faça sua inscrição. O resto é com a gente! Um consultor entrará em contato via WhatsApp para finalizar tudo com você de forma rápida e humanizada."
        imageUrl="/images/matricula-hero.jpg"
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#cursos"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Escolher meu curso
            <svg
              width="19"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path
                d="M1 7h17M12.5 1 18.5 7l-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 font-bold text-white transition-colors hover:bg-white/15"
          >
            Falar com um consultor
          </a>
        </div>
      </PageHero>

      {/* Faixa de selos — a mesma da página do ENEM. As versões "-corte" não
          têm a margem transparente embutida nos arquivos originais. */}
      <div className="bg-accent">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-4 sm:gap-x-20">
          <Image
            src="/images/logobranca-corte.png"
            alt="LA Faculdades"
            width={160}
            height={56}
            className="h-10 w-auto sm:h-14"
          />
          <Image
            src="/images/mecbranca-corte.png"
            alt="Reconhecido pelo MEC"
            width={179}
            height={44}
            className="h-8 w-auto sm:h-11"
          />
        </Container>
      </div>

      
      {/* Passo 1 na prática — o mesmo buscador da home, para a escolha do curso
          acontecer aqui mesmo em vez de mandar o visitante voltar ao menu. */}
      <section id="cursos" className="section-y scroll-mt-[58px] bg-white lg:scroll-mt-[64px]">
        <Container>
          <Reveal>
            <CourseFinder courses={cursos} titulo="Escolha o seu curso" />
          </Reveal>

          {niveis.length > 0 && (
            <Reveal delay={90}>
              <div className="mx-auto mt-14 max-w-[1180px] border-t border-navy-950/10 pt-8">

              </div>
            </Reveal>
          )}
        </Container>
      </section>

    
      {/* Faixa escura de CTA — atalho para quem já sabe o curso e quer ir direto
          ao WhatsApp, sem passar pela página do curso. */}
      <section className="relative overflow-hidden bg-navy-950">
        <Image
          src="/images/fachada.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-navy-950/80" />
        <Container className="relative py-16 text-center lg:py-20">
          <Reveal>
            <h2 className="t-h2 mx-auto max-w-3xl text-white">Já sabe o que vai cursar?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-sky-200">
              Chame nosso time de matrículas no WhatsApp e informe o nome do curso. Um consultor 
              faz o seu cadastro e tira suas dúvidas de forma rápida e simplificada. Clique e comece hoje!
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/matricula/inscricao"
                className="inline-flex items-center justify-center rounded-full bg-accent px-9 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Matricule-se agora
              </Link>
              <a
                href="#cursos"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-9 py-4 font-bold text-white transition-colors hover:bg-white/15"
              >
                Conhecer Cursos
              </a>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-14">
              <TrustBadges dark />
            </div>
          </Reveal>
        </Container>
      </section>


      {/* Outras formas de ingressar — mesma composição da página do ENEM: os
          cards na coluna estreita da esquerda e a foto ancorada na base à
          direita, onde a coluna fica vazia de propósito. */}
      <section className="relative overflow-hidden bg-surface py-10 lg:py-12">
        <BlobDepoimentos fill="#b9d5ef" manterProporcao />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[3%] hidden w-[460px] lg:block xl:w-[560px]"
        >
          <Image
            src="/images/ingresso-corte.png"
            alt=""
            fill
            sizes="560px"
            className="object-contain object-bottom"
          />
        </div>

        <Container className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Reveal delay={70}>
                <Link
                  href="/enem"
                  className="flex h-full flex-col rounded-2xl bg-navy-950 p-6 text-white transition-transform hover:-translate-y-1 sm:min-h-[270px]"
                >
                  <h3 className="t-h3">Use a sua nota do ENEM</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-sky-200">
                    A nota de qualquer edição anterior vira desconto na mensalidade, sem precisar
                    fazer uma prova nova.
                  </p>
                  <span className="mt-auto pt-6 font-bold text-accent">Simular meu desconto →</span>
                </Link>
              </Reveal>
              <Reveal delay={140}>
                <Link
                  href="/financiamento-la-bank"
                  className="flex h-full flex-col rounded-2xl bg-surface p-6 text-navy-950 transition-transform hover:-translate-y-1 sm:min-h-[270px]"
                >
                  <h3 className="t-h3">Financie com o LA Bank</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    O financiamento estudantil da própria instituição: sem banco externo, sem fiador e
                    com aprovação na hora da matrícula.
                  </p>
                  <span className="mt-auto pt-6 font-bold text-accent">Ver as condições →</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>


    {/* FAQ */}
      {/* Mesmo azul da forma orgânica da seção acima, como no "Como funciona"
          da página do ENEM. */}
      <section className="section-y bg-[#b9d5ef]">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">
              Perguntas sobre a <span className="text-accent">matrícula</span>
            </h2>
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
