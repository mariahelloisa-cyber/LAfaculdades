import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import TrustBadges from "@/components/TrustBadges";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Institucional",
  description: "Conheça a missão, a visão e o credenciamento MEC da LA Faculdade.",
};

export default function InstitucionalPage() {
  return (
    <>
      <PageHero
        eyebrow="Institucional"
        title="Educação acessível e de qualidade para todos"
        description="Acreditamos que todos têm o direito de sonhar grande. Conheça quem somos e como trabalhamos para tornar o ensino superior mais acessível."
        art="campus"
      />

      <section className="section-y bg-white">
        <Container className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-surface p-8 lg:p-10">
            <h2 className="t-h3 text-navy-950">Visão</h2>
            <p className="t-lead mt-4 text-navy-900">
              Ser uma Instituição de Ensino Superior comprometida com o impacto social, oferecendo uma educação
              de qualidade e acessível a todos, integrando modernidade e humanização para transformar a vida de
              jovens e adultos por meio da educação.
            </p>
          </div>
          <div className="rounded-2xl bg-navy-950 p-8 text-white lg:p-10">
            <h2 className="t-h3">Missão</h2>
            <p className="t-lead mt-4 text-sky-200">
              Integrar um dos maiores grupos educacionais do Brasil, mantendo o foco em tecnologias educacionais
              e sendo referência em novos modelos de ensino, sem perder a essência de acessibilidade e inclusão.
            </p>
          </div>
        </Container>
      </section>

      <section className="section-y bg-tint">
        <Container className="max-w-3xl">
          <h2 className="t-h2 text-navy-950">Nosso compromisso</h2>
          <p className="mt-8 font-display text-xl font-bold leading-relaxed text-navy-900 sm:text-2xl">
            &ldquo;Na LA Faculdade, acreditamos que todos têm o direito de sonhar grande! Com educação acessível
            e de qualidade, estamos aqui para apoiar você na realização dos seus objetivos. Junte-se a nós e
            comece sua jornada hoje mesmo!&rdquo;
          </p>
        </Container>
      </section>

      <section className="section-y bg-white">
        <Container>
          <h2 className="t-h2 text-navy-950">Credenciamento e reconhecimento</h2>
          <div className="mt-12">
            <TrustBadges />
          </div>
          <div className="mt-5 rounded-2xl bg-surface p-6 text-[14px] text-muted">
            <p>
              {SITE.name} · Código E-MEC {SITE.emec} · CNPJ {SITE.cnpj}
            </p>
            <p className="mt-1">{SITE.address}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
