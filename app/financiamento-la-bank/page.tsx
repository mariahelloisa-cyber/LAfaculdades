import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Financiamento LA Bank",
  description:
    "O LA Bank é o banco oficial da educação e o financiamento estudantil da LA Faculdade: sem banco externo, sem fiador e com aprovação na matrícula.",
};

const vantagens = [
  {
    titulo: "Taxas competitivas",
    descricao: "As menores taxas do mercado para o setor educacional, sem tarifas escondidas.",
    icon: (
      <>
        <circle cx="7.5" cy="7.5" r="2.6" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.5" cy="16.5" r="2.6" stroke="currentColor" strokeWidth="2" />
        <path d="M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Sem banco externo",
    descricao: "O financiamento é feito direto com a instituição, sem análise de terceiros.",
    icon: (
      <>
        <path d="M3 10 12 4l9 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M5 10v9M12 10v9M19 10v9M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Sem fiador",
    descricao: "Você não precisa apresentar ninguém como garantia para financiar seus estudos.",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="2" />
        <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    titulo: "Aprovação na hora",
    descricao: "A análise acontece no momento da matrícula — você não fica esperando resposta.",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    titulo: "Soma com bolsas",
    descricao: "As condições do LA Bank podem ser combinadas com bolsas e descontos do seu curso.",
    icon: (
      <>
        <rect x="3" y="7.5" width="18" height="13" rx="2.2" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7.5v13M7 7.5c-2 0-2.6-3.5 0-3.5 1.9 0 4 1.6 5 3.5 1-1.9 3.1-3.5 5-3.5 2.6 0 2 3.5 0 3.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
  },
  {
    titulo: "Ecossistema integrado",
    descricao: "Sistema conectado a todo o ecossistema do Grupo LA Educação, do aceite ao pagamento.",
    icon: (
      <>
        <circle cx="6.5" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="17.5" r="2.8" stroke="currentColor" strokeWidth="2" />
        <path d="M9 7.5h5.5a3 3 0 0 1 3 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
];

const passos = [
  { n: "1", t: "Escolha seu curso", d: "Selecione a graduação ou pós-graduação que você quer cursar." },
  { n: "2", t: "Faça sua inscrição", d: "Preencha o formulário de matrícula com os seus dados." },
  { n: "3", t: "Solicite o LA Bank", d: "Informe à equipe de matrículas que quer financiar pelo LA Bank." },
  { n: "4", t: "Aprovação na matrícula", d: "A análise sai na hora e você já começa a estudar." },
];

const principios = [
  {
    titulo: "Missão",
    texto:
      "Facilitar as transações financeiras no setor educacional com soluções acessíveis, seguras e integradas, conectando instituições, alunos e empresários.",
  },
  {
    titulo: "Visão",
    texto:
      "Ser o banco de referência para todo o ecossistema educacional, reconhecido como a solução financeira mais voltada para estudantes e instituições de ensino.",
  },
  {
    titulo: "Valores",
    texto:
      "Transparência, acessibilidade, segurança e inovação como os pilares que orientam todas as nossas ações e decisões.",
  },
];

const faqs = [
  {
    pergunta: "Quem pode usar o LA Bank?",
    resposta:
      "Qualquer aluno matriculado em um curso de graduação ou pós-graduação da LA Faculdade pode solicitar o financiamento LA Bank.",
  },
  {
    pergunta: "Quanto custa o financiamento?",
    resposta:
      "As condições variam por curso e duração. Fale com a equipe de matrículas pelo WhatsApp para simular o valor das parcelas para o seu caso.",
  },
  {
    pergunta: "O LA Bank substitui o FIES ou o financiamento bancário?",
    resposta:
      "O LA Bank é uma alternativa própria do grupo, pensada para quem quer evitar a burocracia de bancos e financeiras externas.",
  },
  {
    pergunta: "Preciso ter conta em algum banco específico?",
    resposta:
      "Não. O LA Bank é o banco oficial da educação do Grupo LA Educação e cuida do processo de ponta a ponta junto com a instituição.",
  },
  {
    pergunta: "Posso combinar o LA Bank com uma bolsa?",
    resposta:
      "Sim. As condições do financiamento podem ser somadas às bolsas e descontos disponíveis para o seu curso.",
  },
  {
    pergunta: "Em quanto tempo sai a aprovação?",
    resposta:
      "A análise é feita no momento da matrícula, então você recebe a resposta na hora, sem espera.",
  },
];

export default function LaBankPage() {
  return (
    <div className="theme-bank">
      {/* Hero co-branded — cartões LA Bank sangrando na borda direita */}
      <section className="relative isolate flex min-h-[560px] flex-col justify-center overflow-hidden bg-[#0C0208] lg:min-h-[640px]">
        {/* No desktop, a composição gira levemente no sentido horário (em vez
            de só deslocar para a direita) para reduzir sua altura projetada
            — assim ela encosta na borda direita sem cortar as pontas de
            cima/baixo. Ajuste fino de rotate/translate/scale conforme o
            resultado visual. */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full lg:w-[58%]">
          <Image
            src="/images/cartao.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-contain object-right lg:origin-center lg:-rotate-[6deg] lg:translate-x-[4%] lg:scale-[1.1]"
          />
          {/* no mobile a arte fica atrás do texto: scrim forte para manter contraste */}
          <div className="absolute inset-0 bg-[#0C0208]/72 lg:hidden" />
          {/* no desktop a arte fica ao lado: esvanece para a esquerda */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#0C0208] via-[#0C0208]/25 to-transparent lg:block" />
        </div>
        {/* brilho magenta da marca */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#DB1069]/25 blur-3xl"
        />

        <Container className="py-16 lg:py-20">
          {/* Lockup: LA Faculdade + LA Bank */}
          <div className="flex flex-wrap items-center gap-5">
            <Image
              src="/images/logo-horizontal.png"
              alt="LA Faculdade"
              width={2561}
              height={895}
              className="h-8 w-auto brightness-0 invert sm:h-9"
            />
            <span className="h-8 w-px bg-white/40" aria-hidden />
            <span className="flex items-center rounded-xl bg-white px-4 py-2.5">
              <Image
                src="/images/logo-labank.png"
                alt="LA Bank"
                width={1133}
                height={743}
                className="h-8 w-auto sm:h-9"
              />
            </span>
          </div>

          <h1 className="t-h2 mt-9 max-w-[16ch] text-white">
            O banco oficial da educação.
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-white/90 sm:text-xl">
            Na LA Faculdade, o LA Bank vira o seu financiamento estudantil: sem banco externo, sem
            fiador e com aprovação na hora da matrícula.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vestibular/inscricao"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-[#DB1069] transition-transform hover:scale-[1.02]"
            >
              Simular minha matrícula
              <svg width="19" height="14" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 font-bold text-white transition-colors hover:bg-white/15"
            >
              Falar com a equipe
            </a>
          </div>
        </Container>
      </section>

      {/* Vantagens — cards com badge circular rosa */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <h2 className="t-h2 text-navy-950">
                Vantagens do <span className="text-accent">LA Bank</span>
              </h2>
              <p className="t-lead mt-5 text-muted">
                Os benefícios de financiar seus estudos dentro do ecossistema financeiro educacional do
                Grupo LA Educação.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vantagens.map((v, i) => (
              <Reveal key={v.titulo} delay={i * 70}>
                <div className="h-full rounded-2xl bg-surface p-7 transition-shadow hover:shadow-[0_16px_38px_rgba(219,16,105,0.12)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                      {v.icon}
                    </svg>
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-navy-950">{v.titulo}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{v.descricao}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Como funciona — passos numerados */}
      <section className="section-y bg-sky-100">
        <Container>
          <Reveal>
            <h2 className="t-h2 max-w-2xl text-navy-950">Como contratar em 4 passos</h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="h-full rounded-2xl border-t-4 border-accent bg-white p-7">
                  <span className="font-display text-4xl font-extrabold text-accent">{p.n}</span>
                  <h3 className="mt-4 text-lg font-bold text-navy-950">{p.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Quem somos — celular do app encostado na borda esquerda da viewport,
          texto à direita. O bloco da imagem fica fora do Container de
          propósito: só assim ele alcança left:0 sem alargar o container
          inteiro. No mobile a imagem some daqui e reaparece no fluxo normal,
          acima do texto. */}
      <section className="relative section-y overflow-hidden bg-white lg:min-h-[560px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[44%] lg:block"
        >
          <Image
            src="/images/celular3.png"
            alt=""
            fill
            sizes="44vw"
            className="object-contain object-left"
          />
        </div>

        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Celular no mobile/tablet — dentro do fluxo, sem bleed */}
            <div className="lg:hidden">
              <Image
                src="/images/celular3.png"
                alt="Aplicativo do LA Bank"
                width={1293}
                height={973}
                className="mx-auto h-auto w-full max-w-md"
              />
            </div>

            {/* Reserva a coluna esquerda no desktop; o visual real é o bloco absolute acima */}
            <div aria-hidden className="hidden lg:block" />

            <Reveal>
              <h2 className="t-h2 text-navy-950">
                Quem é o <span className="text-accent">LA Bank</span>
              </h2>
              <div className="mt-7 space-y-5 text-[16px] leading-relaxed text-muted">
                <p>
                  O LA Bank é uma solução financeira inovadora, criada para atender às necessidades do
                  ecossistema do Grupo LA Educação — o mesmo grupo do qual a LA Faculdade faz parte.
                </p>
                <p>
                  Sua missão é resolver o problema das altas tarifas e taxas de outras plataformas
                  financeiras, integrando todo o processo de compra e venda em um único sistema.
                </p>
                <p>
                  Na prática, isso significa que o seu financiamento estudantil não passa por um banco de
                  fora: ele acontece dentro de casa, com transparência e menos burocracia.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>


      {/* Faixa CTA — mesma cor de fundo do header do site (não usar
          bg-navy-950 aqui: dentro de .theme-bank essa variável é
          sobrescrita para um tom diferente do navy usado no header) */}
      <section className="bg-[#061523]">
        <Container className="py-16 text-center lg:py-20">
          <Reveal>
            <h2 className="t-h2 mx-auto max-w-3xl text-white">
              Pronto para começar sem travar no orçamento?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/90">
              Faça sua inscrição na LA Faculdade e peça o financiamento LA Bank na hora da matrícula.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/vestibular/inscricao"
                className="inline-flex items-center justify-center rounded-full bg-white px-9 py-4 font-bold text-[#061523] transition-transform hover:scale-[1.02]"
              >
                Quero me inscrever
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-9 py-4 font-bold text-white transition-colors hover:bg-white/15"
              >
                Tirar dúvidas no WhatsApp
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
      {/* FAQ */}
      <section className="section-y bg-white">
        <Container>
          <Reveal>
            <h2 className="t-h2 text-navy-950">Perguntas sobre o <span className="text-accent">LA Bank</span></h2>
          </Reveal>
          <Reveal>
            <div className="mt-12">
              <FaqAccordion items={faqs} />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
