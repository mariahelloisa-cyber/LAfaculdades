import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import CourseCard from "./CourseCard";
import FaqAccordion, { type FaqItem } from "./FaqAccordion";
import TrustBadges from "./TrustBadges";
import Reveal from "./Reveal";
import CourseStickyBar from "./CourseStickyBar";
import { SITE } from "@/lib/constants";
import type { Course } from "@/lib/data/courses";

function money(v: number) {
  return v.toFixed(2).replace(".", ",");
}

/* Perguntas gerais usadas quando o curso ainda não tem FAQ próprio no admin. */
const FAQ_PADRAO: FaqItem[] = [
  {
    pergunta: "O diploma tem validade nacional?",
    resposta: `A LA Faculdade é credenciada pelo MEC (E-MEC ${SITE.emec}) e os diplomas emitidos têm validade em todo o território nacional.`,
  },
  {
    pergunta: "Como são as aulas e as provas?",
    resposta:
      "As aulas ficam gravadas no Ambiente Virtual de Aprendizagem (AVA), disponíveis 24h. Você estuda no seu ritmo e faz as avaliações dentro dos prazos de cada disciplina.",
  },
  {
    pergunta: "Quando posso começar?",
    resposta:
      "As turmas têm entradas contínuas. Concluindo a inscrição e a matrícula pelo site, o acesso ao AVA é liberado e você já começa a estudar.",
  },
  {
    pergunta: "Existe financiamento?",
    resposta:
      "Sim. O LA Bank é o financiamento estudantil da própria LA Faculdade, sem banco no meio do caminho e sem necessidade de fiador.",
  },
];

const passos = [
  {
    n: "1",
    titulo: "Faça sua inscrição",
    texto: "Preencha seus dados e escolha o curso direto pelo site, em poucos minutos.",
  },
  {
    n: "2",
    titulo: "Confirme a matrícula",
    texto: "Envie os documentos e garanta o 1º mês por R$ 49,90 enquanto houver vagas.",
  },
  {
    n: "3",
    titulo: "Comece a estudar",
    texto: "O acesso ao AVA é liberado e você já assiste às primeiras aulas do curso.",
  },
];

export default function CourseDetail({
  course,
  relacionados = [],
}: {
  course: Course;
  relacionados?: Course[];
}) {
  const [reais, centavos] = money(course.mensalidade).split(",");
  const inscricaoHref = `/vestibular/inscricao?curso=${course.slug}`;
  const faqs = course.faq.length > 0 ? course.faq : FAQ_PADRAO;

  const desconto =
    course.mensalidadeDe > course.mensalidade
      ? Math.round((1 - course.mensalidade / course.mensalidadeDe) * 100)
      : 0;

  const fatos = [
    {
      label: "Duração",
      valor: course.duracao,
      icone: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Modalidade",
      valor: course.modalidade,
      icone: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M8 20h8M12 16.5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Nível",
      valor: course.nivelNome,
      icone: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Área",
      valor: course.area,
      icone: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <path d="M3.5 12h17M12 3.5c4 4.5 4 12.5 0 17M12 3.5c-4 4.5-4 12.5 0 17" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ---------- Hero ----------
          No desktop a coluna da direita fica livre: é onde o card de
          matrícula sobe por cima da foto. */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        <Image
          src={course.capaUrl || "/images/art/campus.svg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/92 to-navy-950/35" />

        <Container className="py-12 lg:min-h-[440px] lg:py-20 lg:pr-[440px]">
          <nav aria-label="Você está em" className="text-[12px] font-semibold text-sky-300">
            <Link href="/" className="hover:text-white">
              Início
            </Link>
            <span className="px-1.5 text-sky-300/60">/</span>
            <Link href={`/${course.nivelSlug}`} className="hover:text-white">
              {course.nivelNome}
            </Link>
            <span className="px-1.5 text-sky-300/60">/</span>
            <span className="uppercase text-white">{course.nome}</span>
          </nav>

          <h1 className="t-h2 mt-5 max-w-3xl uppercase text-white">{course.nome}</h1>
          <p className="t-lead mt-5 max-w-xl text-sky-200">{course.resumo}</p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {fatos.map((f) => (
              <li
                key={f.label}
                className="flex h-[46px] items-center gap-2.5 rounded-full border border-white/25 px-5 text-[14px] font-bold text-white"
              >
                <span className="text-sky-300" aria-hidden>
                  {f.icone}
                </span>
                <span className="sr-only">{f.label}: </span>
                {f.valor}
              </li>
            ))}
          </ul>

          {/* No desktop a chamada mora no card; aqui ela serve o mobile. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:hidden">
            <Link
              href={inscricaoHref}
              className="flex h-[54px] items-center justify-center gap-3 rounded-full bg-[#FFD600] px-8 font-bold text-black"
            >
              Matricule-se agora
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
                <path
                  d="M1 8h19M14 1.5 20.5 8 14 14.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[54px] items-center justify-center rounded-full border-2 border-white/30 px-8 font-bold text-white"
            >
              Tirar dúvidas no WhatsApp
            </a>
          </div>
        </Container>
      </section>

      {/* ---------- Conteúdo + card de matrícula ---------- */}
      <section className="section-y bg-white">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 id="sobre" className="t-h3 scroll-mt-32 text-navy-950">
              Sobre o curso
            </h2>
            <p className="t-lead mt-5 text-navy-900">{course.descricao}</p>

            {course.destaques.length > 0 && (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {course.destaques.map((d) => (
                  <li key={d} className="flex items-start gap-3 rounded-2xl bg-surface p-5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="m5 12.5 4.5 4.5L19 7.5"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[15px] font-semibold text-navy-950">{d}</span>
                  </li>
                ))}
              </ul>
            )}

            {course.paraQuem.length > 0 && (
              <div className="mt-14">
                <h2 id="para-quem" className="t-h3 scroll-mt-32 text-navy-950">
                  Para quem é este curso
                </h2>
                <ul className="mt-6 space-y-3">
                  {course.paraQuem.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 border-b border-navy-950/10 pb-3 text-[15px] font-semibold text-navy-900"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.grade.length > 0 && (
              <div className="mt-14">
                <h2 id="grade" className="t-h3 scroll-mt-32 text-navy-950">
                  Grade curricular
                </h2>
                <p className="mt-3 text-[14px] font-semibold text-muted">
                  Conteúdo programático sujeito a atualização a cada nova turma.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-navy-950/10">
                  {course.grade.map((modulo, i) => (
                    <details
                      key={modulo.titulo}
                      open={i === 0}
                      className="group border-b border-navy-950/10 last:border-b-0"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 bg-surface px-5 py-4 text-[15px] font-bold text-navy-950">
                        {modulo.titulo}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                          aria-hidden
                        >
                          <path
                            d="m5 9 7 7 7-7"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </summary>
                      <ul className="grid gap-x-8 gap-y-2 bg-white px-5 py-4 sm:grid-cols-2">
                        {modulo.disciplinas.map((d) => (
                          <li key={d} className="text-[14px] font-semibold text-navy-900">
                            • {d}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {(course.mercado || course.atuacao.length > 0) && (
              <div className="mt-14">
                <h2 id="mercado" className="t-h3 scroll-mt-32 text-navy-950">
                  Mercado de trabalho
                </h2>
                {course.mercado && <p className="t-lead mt-5 text-navy-900">{course.mercado}</p>}
                {course.atuacao.length > 0 && (
                  <>
                    <h3 className="mt-8 text-[13px] font-bold uppercase tracking-wide text-muted">
                      Onde você pode atuar
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {course.atuacao.map((a) => (
                        <span
                          key={a}
                          className="flex h-10 items-center rounded-full bg-tint px-5 text-[14px] font-bold text-navy-950"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card de matrícula — sobe por cima do hero e acompanha a rolagem
              até o fim do conteúdo. Depois disso quem assume é a
              CourseStickyBar. No mobile ele não aparece: lá só existe a
              barra. */}
          <aside
            id="card-matricula"
            className="hidden h-fit overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgba(6,21,35,0.28)] lg:sticky lg:top-28 lg:-mt-[400px] lg:block"
          >
            <div className="relative isolate flex h-[190px] flex-col justify-between overflow-hidden p-4">
              <Image
                src={course.capaUrl || "/images/art/campus.svg"}
                alt=""
                fill
                sizes="380px"
                className="-z-10 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-navy-950/40" />

              <span className="flex h-7 w-fit items-center gap-1.5 rounded-full bg-white px-3 text-[11px] font-bold text-navy-950">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#FFD600]" aria-hidden>
                  <path d="m12 2.5 2.9 5.9 6.6.9-4.8 4.6 1.2 6.5L12 17.3 6.1 20.4l1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
                </svg>
                Reconhecido pelo MEC
              </span>

              <div>
                <p className="font-display text-[26px] font-extrabold uppercase leading-none tracking-tight text-white">
                  {course.nivelNome}
                </p>
                <p className="mt-1.5 text-[12px] font-bold text-sky-200">
                  {course.modalidade} · {course.duracao}
                </p>
              </div>
            </div>

            <div className="p-6">
              {desconto > 0 && (
                <span className="flex h-7 w-fit items-center rounded-full bg-[#FFD600] px-3.5 text-[12px] font-bold text-black">
                  {desconto}% de desconto
                </span>
              )}

              <h2 className="mt-4 font-display text-[22px] font-extrabold uppercase leading-tight tracking-tight text-navy-950">
                {course.nome}
              </h2>

              {course.mensalidadeDe > course.mensalidade && (
                <p className="mt-4 text-[13px] font-semibold text-muted">
                  De <s>R$ {money(course.mensalidadeDe)}</s> por
                </p>
              )}
              <p className="mt-1 flex items-baseline gap-1 text-navy-950">
                <span className="text-lg font-bold">R$</span>
                <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">
                  {reais}
                </span>
                <span className="text-xl font-bold">,{centavos}</span>
                <span className="ml-1 text-[13px] font-semibold text-muted">/mês</span>
              </p>

              <p className="mt-3 flex h-8 w-fit items-center rounded-full bg-[#F23883] px-4 text-[12px] font-bold text-white">
                R$ 49,90 no 1º mês · vagas limitadas
              </p>

              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-[54px] items-center justify-center gap-3 rounded-full bg-[#FFD600] font-bold uppercase text-black transition-[filter] hover:brightness-95"
              >
                Matricule-se
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
                  <path
                    d="M1 8h19M14 1.5 20.5 8 14 14.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </aside>
        </Container>
      </section>

      {/* ---------- Como ingressar ---------- */}
      <section id="ingresso" className="section-y scroll-mt-32 bg-surface">
        <Container>
          <h2 className="t-h2 text-navy-950">Como ingressar</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
                <div className="h-full rounded-[25px] bg-white p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 font-display text-lg font-extrabold text-white">
                    {p.n}
                  </span>
                  <h3 className="t-h3 mt-5 text-navy-950">{p.titulo}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <TrustBadges />
          </div>
        </Container>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="section-y scroll-mt-32 bg-white">
        <Container>
          <h2 className="t-h2 text-navy-950">Dúvidas frequentes</h2>
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="bg-navy-950 py-[clamp(3rem,5.5vw,5rem)]">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="t-h2 max-w-2xl text-white">Comece {course.nome} ainda este mês</h2>
            <p className="t-lead mt-4 max-w-xl text-sky-200">
              Mensalidade de R$ {money(course.mensalidade)} e o 1º mês por R$ 49,90 enquanto houver
              vagas.
            </p>
          </div>
          <Link
            href={inscricaoHref}
            className="flex h-[58px] shrink-0 items-center gap-3 rounded-full bg-[#FFD600] px-9 font-bold text-black transition-[filter] hover:brightness-95"
          >
            Fazer minha inscrição
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
              <path
                d="M1 8h19M14 1.5 20.5 8 14 14.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Container>
      </section>

      {/* ---------- Cursos relacionados ---------- */}
      {relacionados.length > 0 && (
        <section className="section-y bg-white">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <h2 className="t-h2 text-navy-950">Cursos relacionados</h2>
              <Link
                href={`/${course.nivelSlug}`}
                className="text-sm font-bold text-navy-950 underline underline-offset-4 hover:opacity-70"
              >
                Ver todos de {course.nivelNome}
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[10px]">
              {relacionados.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Barra de matrícula ----------
          Entra quando o card lateral sai da tela e acompanha o resto da
          página. O espaçador evita que ela cubra o fim do conteúdo. */}
      <div className="h-[90px]" aria-hidden />
      <CourseStickyBar
        nome={course.nome}
        nivelNome={course.nivelNome}
        area={course.area}
        mensalidade={course.mensalidade}
        mensalidadeDe={course.mensalidadeDe}
        href={inscricaoHref}
      />
    </>
  );
}
