import Image from "next/image";
import type { Testimonial } from "@/lib/data/testimonials";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, role, comment, avatar } = testimonial;

  return (
    <figure className="rounded-[18px] border border-navy-950/[0.06] bg-white/95 px-5 py-[18px] shadow-[0_14px_34px_-22px_rgba(6,21,35,0.45)] backdrop-blur-[2px]">
      <div className="flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-sky-100 text-[13px] font-bold text-sky-600">
            {iniciais(name)}
          </span>
        )}

        <div className="min-w-0">
          <figcaption className="truncate text-[14px] font-bold tracking-[-0.01em] text-navy-950">
            {name}
          </figcaption>
          <p className="truncate text-[12px] text-muted">{role}</p>
        </div>
      </div>

      <blockquote className="mt-3 text-[13.5px] leading-[1.62] text-navy-900/90">
        &ldquo;{comment}&rdquo;
      </blockquote>
    </figure>
  );
}
