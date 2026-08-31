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
    <figure className="rounded-2xl border border-navy-950/10 bg-surface px-5 py-4">
      <div className="flex items-center gap-2.5">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white">
            {iniciais(name)}
          </span>
        )}

        <div className="min-w-0">
          <figcaption className="truncate text-[14px] font-bold text-navy-950">{name}</figcaption>
          <p className="truncate text-[12px] text-muted">{role}</p>
        </div>
      </div>

      <blockquote className="mt-3 text-[14px] leading-relaxed text-navy-900">
        &ldquo;{comment}&rdquo;
      </blockquote>
    </figure>
  );
}
