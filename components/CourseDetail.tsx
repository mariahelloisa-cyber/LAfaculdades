import Link from "next/link";
import Container from "./Container";
import PageHero from "./PageHero";
import { Course } from "@/lib/data/courses";

function money(v: number) {
  return v.toFixed(2).replace(".", ",");
}

export default function CourseDetail({ course }: { course: Course }) {
  const nivelLabel = course.nivelNome;
  const [reais, centavos] = money(course.mensalidade).split(",");

  return (
    <>
      <PageHero
        eyebrow={nivelLabel}
        title={course.nome}
        description={course.resumo}
        imageUrl={course.capaUrl}
      />

      <section className="section-y bg-white">
        <Container className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="t-h2 text-navy-950">Sobre o curso</h2>
            <p className="t-lead mt-6 text-navy-900">{course.descricao}</p>

            <h2 className="t-h2 mt-16 text-navy-950">Destaques</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {course.destaques.map((d) => (
                <li key={d} className="flex items-start gap-3 rounded-2xl bg-surface p-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-semibold text-navy-950">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit overflow-hidden rounded-2xl bg-surface lg:sticky lg:top-28">
            <div className="bg-navy-950 p-6">
              <span className="t-label uppercase text-sky-300">{nivelLabel}</span>
              <h3 className="t-h3 mt-2 text-white">{course.nome}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-200 px-3 py-1.5 text-[12px] font-bold text-navy-900">
                  {course.modalidade}
                </span>
              </div>
            </div>

            <p className="bg-rose px-6 py-2.5 text-[12px] font-semibold text-white">
              <b>R$ 49,90</b> no 1º mês · vagas limitadas
            </p>

            <div className="p-6">
              <dl className="space-y-3 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Duração</dt>
                  <dd className="font-bold text-navy-950">{course.duracao}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Área</dt>
                  <dd className="font-bold text-navy-950">{course.area}</dd>
                </div>
              </dl>

              <p className="mt-5 text-right text-[12px] font-semibold text-muted">
                De <s>R$ {money(course.mensalidadeDe)}</s> por
              </p>
              <p className="mt-1 flex items-baseline justify-end gap-1 text-navy-950">
                <span className="text-lg font-bold">R$</span>
                <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">{reais}</span>
                <span className="text-xl font-bold">,{centavos}</span>
              </p>
              <p className="text-right text-[12px] font-semibold text-muted">/mês</p>

              <Link
                href={`/vestibular/inscricao?curso=${course.slug}`}
                className="mt-5 flex items-center justify-center gap-3 rounded-full bg-accent py-4 font-bold text-white transition-colors hover:bg-accent-hover"
              >
                Matricule-se
                <svg width="19" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                  <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href={`/${course.nivelSlug}`}
                className="mt-3 block rounded-full border border-navy-950/20 py-3.5 text-center text-[15px] font-bold text-navy-950 transition-colors hover:border-navy-950"
              >
                Ver outros cursos
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
