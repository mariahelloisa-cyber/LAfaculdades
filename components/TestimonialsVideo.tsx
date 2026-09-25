"use client";

import { useState } from "react";
import Image from "next/image";


export default function TestimonialsVideo({
  src,
  poster = "/images/imagem1.jpg",
  alt = "Alunos da LA Faculdades em aula prática",
}: {
  src?: string;
  poster?: string;
  alt?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-navy-950 shadow-[0_24px_60px_-30px_rgba(6,21,35,0.55)]">
      {playing && src ? (
        <video
          src={src}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <Image src={poster} alt={alt} fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent" />

          {src ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Assistir ao depoimento em vídeo"
              className="group absolute inset-0 grid place-items-center focus:outline-none"
            >
              <PlayBadge />
            </button>
          ) : (
            <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
              <PlayBadge />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlayBadge() {
  return (
    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/20 backdrop-blur-[2px] ring-1 ring-white/40 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 sm:h-20 sm:w-20">
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden>
        <path d="M2 2.6v20.8a1 1 0 0 0 1.53.85l16.6-10.4a1 1 0 0 0 0-1.7L3.53 1.75A1 1 0 0 0 2 2.6Z" fill="#ffffff" />
      </svg>
    </span>
  );
}
