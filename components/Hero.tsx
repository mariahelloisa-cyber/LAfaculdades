import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[620px] flex-col justify-center overflow-hidden bg-navy-950 lg:min-h-[800px]">
      <Image
        src="/images/art/hero.svg"
        alt=""
        fill
        priority
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30" />

      <div className="container-x py-20 lg:py-24">
        <h1 className="t-display max-w-[15ch] text-white">
          Educação que
          <br />
          cabe na sua vida
        </h1>

        <p className="mt-7 max-w-lg text-base font-semibold leading-relaxed text-sky-200 sm:text-lg">
          Graduação e pós-graduação com diploma reconhecido pelo MEC, mensalidade acessível e
          financiamento próprio pelo LA Bank.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/graduacao"
            className="group inline-flex items-center justify-between gap-6 rounded-full bg-accent py-4 pl-8 pr-4 text-lg font-bold text-white transition-colors hover:bg-accent-hover sm:py-5 sm:pl-10 sm:text-xl"
          >
            Encontre seu curso
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
              <svg width="20" height="16" viewBox="0 0 20 14" fill="none" aria-hidden>
                <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <Link
            href="/vestibular"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:py-5"
          >
            Como ingressar
          </Link>
        </div>
      </div>
    </section>
  );
}
 