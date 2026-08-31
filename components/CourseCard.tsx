import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/data/courses";

function money(v: number) {
  return v.toFixed(2).replace(".", ",");
}

export default function CourseCard({ course }: { course: Course }) {
  const [reais, centavos] = money(course.mensalidade).split(",");
  const nivelLabel = course.nivelNome;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(6,21,35,0.18)]">
      {/* Visual + identidade do curso */}
      <div className="relative isolate flex h-[252px] flex-col p-5">
        <Image
          src={course.capaUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 320px"
          className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/35" />

        <div className="flex items-start justify-between gap-3">
          <span className="text-[12px] font-bold text-white">{nivelLabel}</span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-200 text-navy-900">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <div className="flex min-h-0 flex-1 items-end">
          <h3 className="line-clamp-3 font-display text-[21px] font-bold leading-[1.15] tracking-tight text-white">
            {course.nome}
          </h3>
        </div>

        <div className="pt-5">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-sky-200 px-3 py-1.5 text-[12px] font-bold text-navy-900">
              {course.modalidade}
            </span>
          </div>
          <Link
            href={`/${course.nivelSlug}/${course.slug}`}
            className="mt-4 inline-block text-[13px] font-bold text-white underline underline-offset-4 hover:text-accent-soft"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Faixa de urgência */}
      <p className="truncate bg-rose px-5 py-2 text-[12px] font-semibold text-white">
        <b>R$ 49,90</b> no 1º mês · vagas limitadas
      </p>

      {/* Preço + CTA */}
      <div className="flex flex-1 flex-col justify-end px-5 pb-5 pt-4">
        <p className="text-right text-[12px] font-semibold text-muted">
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
          className="mt-4 flex items-center justify-center gap-3 rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-accent-hover"
        >
          Matricule-se
          <svg width="19" height="14" viewBox="0 0 20 14" fill="none" className="transition-transform group-hover:translate-x-0.5" aria-hidden>
            <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
