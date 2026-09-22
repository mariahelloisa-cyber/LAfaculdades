import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Vestibular",
  description: "O vestibular próprio da LA Faculdade está em andamento. Enquanto isso, garanta sua vaga com matrícula direta ou pela nota do ENEM.",
};

const faqs = [
  {
    pergunta: "Qual é a forma de ingresso mais rápida?",
    resposta: "Hoje, a inscrição com pagamento, após preencher o formulário é a via principal e mais rápida para garantir sua vaga.",
  },
  {
    pergunta: "Quando o vestibular próprio estará disponível?",
    resposta:
      "O vestibular próprio está em andamento e faz parte do planejamento da instituição. Fale com a equipe de matrículas para saber a previsão de lançamento.",
  },
  {
    pergunta: "Posso me inscrever para qualquer curso?",
    resposta: "Sim, tanto para cursos de graduação quanto de pós-graduação disponíveis no site.",
  },
];

export default function VestibularPage() {
  return (
    <>
      <PageHero
        eyebrow="Vestibular"
        title="Nosso vestibular próprio está em andamento."
        description="Estamos finalizando essa forma de ingresso. Enquanto isso, você já pode garantir sua vaga por outro caminho."
        art="campus"
      />

      <section className="section-y bg-white">
        <Container className="flex flex-col items-center rounded-2xl bg-surface p-10 text-center lg:p-16">
          <span className="t-label w-fit rounded-full bg-white px-3.5 py-1.5 uppercase text-muted">
            Em andamento
          </span>
          <h2 className="t-h2 mt-5 max-w-2xl text-navy-950">
            O vestibular próprio está sendo desenvolvido e em breve estará disponível.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            Fique de olho: assim que o vestibular for lançado, você será avisado por aqui. Enquanto isso, faça sua
            matrícula direta pelo site ou ingresse com a nota do ENEM.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/matricula"
              className="rounded-full bg-accent px-6 py-3.5 text-center font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Fazer matrícula direta
            </Link>
            <Link
              href="/enem"
              className="rounded-full border border-navy-950/15 px-6 py-3.5 text-center font-bold text-navy-950 transition-colors hover:border-accent"
            >
              Ingressar pela nota do ENEM
            </Link>
          </div>
        </Container>
      </section>

      <section className="section-y bg-tint">
        <Container>
          <h2 className="t-h2 text-navy-950">Perguntas sobre o vestibular</h2>
          <div className="mt-12">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
