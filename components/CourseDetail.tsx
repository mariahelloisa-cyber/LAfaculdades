import Link from "next/link";
import Image from "next/image";
import AnimatedText from "./AnimatedText";
import Container from "./Container";
import BlobDepoimentos from "./BlobDepoimentos";
import CourseBannerCta from "./CourseBannerCta";
import CourseCard from "./CourseCard";
import FaqAccordion from "./FaqAccordion";
import TrustBadges from "./TrustBadges";
import Reveal from "./Reveal";
import CourseStickyBar from "./CourseStickyBar";
import { SITE } from "@/lib/constants";
import { FAQ_CURSOS } from "@/lib/faq";
import type { Course } from "@/lib/data/courses";

const passos = [
  {
    n: "1",
    titulo: "Fale com um consultor",
    texto:
      "Clique em matricule-se e preencha o formulário com seus dados e o curso desejado. A equipe comercial entrará em contato para esclarecimentos de dúvidas e conclusão da matrícula.",
  },
  {
    n: "2",
    titulo: "Confirme a matrícula",
    texto:
      "Após confirmação, serão solicitados alguns documentos para a formalização e conclusão da matrícula. Primeira parcela por apenas R$ 49,90, garanta já sua vaga. Oferta limitada.",
  },
  {
    n: "3",
    titulo: "Comece a estudar",
    texto: "Ao receber o acesso do AVA (Ambiente Virtual de Aprendizagem), poderá estudar de imediato. Aulas já estarão liberadas.",
  },
];

export default function CourseDetail({
  course,
  relacionados = [],
}: {
  course: Course;
  relacionados?: Course[];
}) {
  /* Os botões de matrícula levam ao formulário do site já com o curso
     escolhido — os dados caem no painel para a equipe entrar em contato. */
  const inscricaoHref = `/matricula/inscricao?curso=${encodeURIComponent(course.slug)}`;

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

          <AnimatedText as="h1" variant="titulo" className="t-h2 mt-5 max-w-3xl uppercase text-white">
            {course.nome}
          </AnimatedText>
          <AnimatedText as="p" delay={0.12} className="t-lead mt-5 max-w-xl text-sky-200">
            {course.resumo}
          </AnimatedText>

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
      <section className="bg-white pb-[clamp(3.5rem,7vw,6.5rem)] pt-8 lg:pt-10">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <AnimatedText as="h2" id="sobre" variant="titulo" className="t-h3 scroll-mt-32 text-navy-950">
              Sobre o curso
            </AnimatedText>
            <AnimatedText as="p" delay={0.08} className="t-lead mt-5 text-navy-900">
              {course.descricao}
            </AnimatedText>

            {course.destaques.length > 0 && (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <AnimatedText
                  as="h2"
                  id="para-quem"
                  variant="titulo"
                  className="t-h3 scroll-mt-32 text-navy-950"
                >
                  Para quem é este curso
                </AnimatedText>
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
                <AnimatedText as="h2" id="grade" variant="titulo" className="t-h3 scroll-mt-32 text-navy-950">
                  Grade curricular
                </AnimatedText>
                <AnimatedText as="p" delay={0.08} className="mt-3 text-[14px] font-semibold text-muted">
                  Conteúdo programático sujeito a atualização a cada nova turma.
                </AnimatedText>
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
                          <li
                            key={d.nome}
                            className="flex items-baseline justify-between gap-3 text-[14px] font-semibold text-navy-900"
                          >
                            <span>• {d.nome}</span>
                            {d.horas && <span className="shrink-0 text-[13px] text-muted">{d.horas}h</span>}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {course.atuacao.length > 0 && (
              <div className="mt-14">
                <AnimatedText as="h2" id="mercado" variant="titulo" className="t-h3 scroll-mt-32 text-navy-950">
                  Mercado de trabalho
                </AnimatedText>
                <h3 className="mt-5 text-[13px] font-bold uppercase tracking-wide text-muted">
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
              </div>
            )}
          </div>

          {/* Card de matrícula — sobe por cima do hero e acompanha a rolagem
              até o fim do conteúdo. Depois disso quem assume é a
              CourseStickyBar. No mobile ele não aparece: lá só existe a
              barra. */}
          <aside
            id="card-matricula"
            className="hidden h-fit overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgba(6,21,35,0.28)] lg:sticky lg:top-28 lg:-mt-[336px] lg:block"
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
              <h2 className="font-display text-[22px] font-extrabold uppercase leading-tight tracking-tight text-navy-950">
                {course.nome}
              </h2>

              {/* Valor da mensalidade sob consulta com o consultor. */}
              <p className="mt-4 text-[13px] font-semibold text-muted">Mensalidade</p>
              <p className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-navy-950">
                Consultar
              </p>

              <p className="mt-3 flex h-8 w-fit items-center rounded-full bg-[#F23883] px-4 text-[12px] font-bold text-white">
                R$ 49,90 no 1º mês · vagas limitadas
              </p>

              <Link
                href={inscricaoHref}
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
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      {/* ---------- Como ingressar ----------
          A mesma forma orgânica da home: fundo azul claro e a forma num azul
          um degrau mais escuro. */}
      <section id="ingresso" className="section-y relative scroll-mt-32 overflow-hidden bg-tint">
        <BlobDepoimentos fill="#b9d5ef" manterProporcao />

        <Container className="relative z-10">
          <AnimatedText as="h2" variant="titulo" className="t-h2 text-navy-950">
            Como ingressar
          </AnimatedText>
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
          <AnimatedText as="h2" variant="titulo" className="t-h2 text-navy-950">
            Dúvidas frequentes
          </AnimatedText>
          <div className="mt-10">
            <FaqAccordion items={FAQ_CURSOS} />
          </div>
        </Container>
      </section>

      {/* ---------- Cursos relacionados ---------- */}
      {relacionados.length > 0 && (
        <section className="section-y bg-white">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <AnimatedText as="h2" variant="titulo" className="t-h2 text-navy-950">
                Cursos relacionados
              </AnimatedText>
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

      {/* ---------- Banner de fechamento ---------- */}
      <CourseBannerCta href={`/${course.nivelSlug}`} />

      {/* ---------- Barra de matrícula ----------
          Entra quando o card lateral sai da tela e acompanha o resto da
          página. O espaçador evita que ela cubra o fim do conteúdo. */}
      <div className="h-[140px]" aria-hidden />
      <CourseStickyBar
        nome={course.nome}
        nivelNome={course.nivelNome}
        area={course.area}
        href={inscricaoHref}
      />
    </>
  );
}
