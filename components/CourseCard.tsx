import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/data/courses";

function money(v: number) {
  return v.toFixed(2).replace(".", ",");
}

export default function CourseCard({ course }: { course: Course }) {
  const [reais, centavos] = money(course.mensalidade).split(",");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[25px] bg-[#E9E9E9]">
      {/* Área da foto — categoria/ícone no topo, nome + modalidade + link na base */}
      <div className="relative isolate flex h-[228px] flex-col p-[13px]">
        <Image
          src={course.capaUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 290px"
          className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />

        <div className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-bold leading-tight text-white">
            {course.nivelNome} | {course.area}
          </span>
          <span className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full bg-sky-200 text-navy-900">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M6.5 11.7V16c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        <div className="flex-1" />

        <h3 className="line-clamp-2 font-display text-[22px] font-bold leading-[1.15] tracking-tight text-white">
          {course.nome}
        </h3>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="flex h-[26px] items-center rounded-full bg-white px-2.5 text-[10px] font-semibold text-black">
            {course.modalidade}
          </span>
        </div>

        <Link
          href={`/${course.nivelSlug}/${course.slug}`}
          className="mt-2 w-fit text-[12px] font-bold text-white underline underline-offset-4 hover:text-accent-soft"
        >
          Saiba mais
        </Link>
      </div>

      {/* Faixa rosa de urgência */}
      <p className="flex h-7 items-center justify-center truncate bg-[#F23883] px-3 text-[10.5px] font-bold text-white">
        R$ 49,90 no 1º mês · vagas limitadas
      </p>

      {/* Preço alinhado à direita + CTA */}
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-3">
        <div>
          <p className="text-right text-[11px] font-semibold text-black/60">
            De <s>R$ {money(course.mensalidadeDe)}</s> por
          </p>
          <p className="flex items-baseline justify-end gap-1 text-black">
            <span className="text-lg font-bold">R$</span>
            <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">{reais}</span>
            <span className="text-xl font-bold">,{centavos}</span>
          </p>
          <p className="text-right text-[12px] font-semibold text-black/60">/mês</p>
        </div>

        <Link
          href={`/vestibular/inscricao?curso=${course.slug}`}
          className="mx-auto mt-3 flex h-[50px] w-full max-w-[202px] items-center justify-between rounded-[28px] bg-[#FFD600] pl-6 pr-5 text-[15px] font-bold text-black transition-[filter] hover:brightness-95"
        >
          Matricule-se
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
            <path d="M1 8h19M14 1.5 20.5 8 14 14.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
