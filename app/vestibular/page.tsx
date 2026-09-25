import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import Reveal from "@/components/Reveal";
import VestibularForm from "@/components/VestibularForm";
import VestibularChamada from "@/components/VestibularChamada";
import vestibularFoto from "@/app/assets/vestibular.png";
import { SITE } from "@/lib/constants";
import { getAllCourses, getCoursesByNivelSlug } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Vestibular online",
  description:
    "Inscrições abertas para o vestibular online da LA Faculdade: faça sua inscrição, receba a prova e faça tudo pela internet, no seu tempo.",
};

const passos = [
  {
    n: "1",
    t: "Faça sua inscrição",
    d: "Preencha o formulário desta página com seus dados, o curso e a forma de ingresso.",
  },
  {
    n: "2",
    t: "Receba a prova",
    d: "O link da prova online chega no seu e-mail e no seu WhatsApp.",
  },
  {
    n: "3",
    t: "Faça a prova online",
    d: "Responda pelo celular ou computador, de onde estiver, sem ir até um polo.",
  },
  {
    n: "4",
    t: "Resultado e matrícula",
    d: "Em poucos dias úteis você recebe o resultado e, aprovado, já garante sua vaga.",
  },
];

const destaques = [
  {
    titulo: "100% online",
    texto: "Sem sair de casa.",
    icone: (
      <>
        <rect
          x="3"
          y="4.5"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8.5 20h7M12 16.5V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "No seu tempo",
    texto: "Faça quando quiser.",
    icone: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7.5V12l3 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    titulo: "Resultado rápido",
    texto: "Em poucos dias úteis.",
    icone: (
      <path
        d="M13.2 2.5 5 13.2h5.6l-.8 8.3 8.2-10.7h-5.6l.8-8.3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
  },
];

const conteudoProva = [
  {
    titulo: "Redação",
    texto:
      "Um texto dissertativo sobre um tema atual. Avaliamos clareza, organização das ideias e argumentação.",
  },
  {
    titulo: "Interpretação de texto",
    texto:
      "Questões para entender o que o texto diz e o que ele quer dizer — sem pegadinhas.",
  },
  {
    titulo: "Conhecimentos gerais",
    texto:
      "Assuntos do dia a dia e do Ensino Médio, com foco no seu potencial e não em decorar conteúdo.",
  },
];

const faqs = [
  {
    pergunta: "Como recebo a prova?",
    resposta:
      "Depois de enviar o formulário de inscrição, o link da prova chega no e-mail e no WhatsApp que você informou. Se não encontrar, confira a caixa de spam ou chame a equipe no WhatsApp.",
  },
  {
    pergunta: "Preciso ir até um polo para fazer a prova?",
    resposta:
      "Não. A prova é 100% online: você faz pelo celular ou pelo computador, de onde estiver.",
  },
  {
    pergunta: "Em quanto tempo sai o resultado?",
    resposta:
      "Em poucos dias úteis. Sendo aprovado, a equipe de matrículas entra em contato para você garantir a sua vaga.",
  },
  {
    pergunta: "Já fiz o ENEM. Preciso fazer o vestibular?",
    resposta:
      "Não é obrigatório. Você pode usar a nota de qualquer edição do ENEM para ingressar e ainda ganhar desconto na mensalidade.",
  },
  {
    pergunta: "Posso financiar a mensalidade depois de aprovado?",
    resposta:
      "Sim. Na hora da matrícula, peça o financiamento LA Bank: é o financiamento da própria instituição, sem banco externo e sem fiador.",
  },
];

export default async function VestibularPage() {
  /* O vestibular é a porta de entrada da graduação; se o nível ainda não
     tiver cursos cadastrados, o formulário mostra o catálogo inteiro. */
  const graduacao = await getCoursesByNivelSlug("graduacao");
  const cursos = graduacao.length > 0 ? graduacao : await getAllCourses();

  return (
    <>
      <PageHero
        eyebrow="Vestibular online · Inscrições abertas"
        title="O vestibular da LA Faculdade está aberto."
        description="Faça sua inscrição, receba a prova e faça tudo pela internet, no seu tempo. O resultado sai em poucos dias úteis."
        imageUrl={vestibularFoto.src}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#inscricao"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Quero me inscrever
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
            href="#como-funciona"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 font-bold text-white transition-colors hover:bg-white/15"
          >
            Como funciona
          </a>
        </div>
      </PageHero>

      {/* Faixa de selos — a mesma das páginas do ENEM e da matrícula. */}
      <div className="bg-accent">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-4 sm:gap-x-20">
          <Image
            src="/images/logobranca-corte.png"
            alt="LA Faculdade"
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

      <VestibularChamada />

      {/* Inscrição — card escuro arredondado, no mesmo visual do card do
          formulário, com o texto à esquerda e o formulário à direita. */}
      <section
        id="inscricao"
        className="section-y scroll-mt-[58px] bg-white lg:scroll-mt-[64px]"
      >
        <Container>
          {/* O brilho fica numa camada própria, recortada nas bordas arredondadas:
              assim o card não corta a sombra do formulário nem o sticky. */}
          <div className="relative isolate grid items-start gap-12 rounded-[28px] border border-accent/20 bg-navy-950 p-6 shadow-[0_30px_80px_rgba(6,21,35,0.18)] sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-14 lg:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[28px]"
            >
              <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-accent/15 blur-[120px]" />
            </div>
            <Reveal className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4">
                <span
                  className="h-[3px] w-10 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-sky-300">
                  Processo seletivo
                </span>
              </div>

              <h2 className="t-h2 mt-6 max-w-[14ch] text-white">
                Faça sua inscrição agora
              </h2>

              <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-sky-200">
                Preencha seus dados, escolha o curso e envie. Você recebe a
                prova online no e-mail e no WhatsApp informados e pode fazê-la
                quando quiser.
              </p>

              <div className="mt-10 grid gap-7 sm:grid-cols-3 sm:gap-0">
                {destaques.map((d, i) => (
                  <div
                    key={d.titulo}
                    className={`sm:px-4 sm:text-center ${i > 0 ? "sm:border-l sm:border-white/10" : ""}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent sm:mx-auto">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        {d.icone}
                      </svg>
                    </span>
                    <h3 className="mt-4 text-[15px] font-extrabold leading-snug text-white">
                      {d.titulo}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-sky-200/80">
                      {d.texto}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={90}>
              <VestibularForm cursos={cursos} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Como funciona — mesmo azul do "Como funciona" da página do ENEM. */}
      <section
        id="como-funciona"
        className="section-y scroll-mt-[58px] bg-[#b9d5ef] lg:scroll-mt-[64px]"
      >
        <Container>
          <Reveal>
            <h2 className="t-h2 max-w-2xl text-navy-950">
              Do cadastro à aprovação em{" "}
              <span className="text-accent">4 passos</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="h-full rounded-2xl border-t-4 border-accent bg-white p-7">
                  <span className="font-display text-4xl font-extrabold text-accent">
                    {p.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-950">
                    {p.t}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      

      {/* FAQ */}
      <section className="section-y bg-tint">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">
              Perguntas sobre o <span className="text-accent">vestibular</span>
            </h2>
          </Reveal>
          <Reveal>
            <div className="mt-12">
              <FaqAccordion items={faqs} />
            </div>
          </Reveal>
          <p className="mt-10 text-[15px] text-muted">
            Ficou com alguma dúvida?{" "}
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              Fale com a equipe no WhatsApp
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
