import Link from "next/link";
import Image from "next/image";

export default function SplitFeature({
  art,
  eyebrow,
  title,
  body,
  linkHref,
  linkLabel,
  badge,
  cards,
}: {
  art: string;
  eyebrow?: string;
  title: string;
  body: string;
  linkHref?: string;
  linkLabel?: string;
  badge?: { top: string; big: string };
  cards?: { art: string; label: string }[];
}) {
  return (
    <section className="relative bg-tint-deep lg:grid lg:grid-cols-2">
      {/* Metade visual — sangra até a borda da viewport */}
      <div className="relative min-h-[280px] lg:min-h-[620px]">
        <Image src={`/images/art/${art}`} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        {badge && (
          <div className="absolute right-6 top-1/2 hidden h-32 w-32 -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center rounded-full bg-accent text-center text-white shadow-xl lg:flex">
            <span className="px-4 text-[11px] font-bold leading-tight">{badge.top}</span>
            <span className="font-display text-4xl font-extrabold leading-none">{badge.big}</span>
          </div>
        )}
      </div>

      {/* Metade conteúdo */}
      <div className="px-[var(--gutter)] py-14 lg:py-20 lg:pl-24 lg:pr-[max(var(--gutter),calc((100vw-var(--container))/2))]">
        <div className="max-w-xl">
          {eyebrow && (
            <span className="t-label mb-4 inline-block rounded-full bg-white px-4 py-1.5 uppercase text-navy-800">
              {eyebrow}
            </span>
          )}
          <h2 className="t-h2 text-navy-950">{title}</h2>
          <p className="t-lead mt-6 text-navy-900">{body}</p>

          {linkHref && linkLabel && (
            <Link
              href={linkHref}
              className="mt-7 inline-block text-sm font-bold text-navy-950 underline underline-offset-4 hover:opacity-70"
            >
              {linkLabel}
            </Link>
          )}

          {cards && (
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {cards.map((c) => (
                <div key={c.label} className="overflow-hidden rounded-2xl bg-white">
                  <div className="relative h-24 sm:h-28">
                    <Image src={`/images/art/${c.art}`} alt="" fill className="object-cover" sizes="180px" />
                  </div>
                  <p className="bg-accent px-3 py-3 text-center text-[13px] font-bold leading-tight text-white">
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
