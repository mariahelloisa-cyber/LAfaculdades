"use client";

import { useEffect, useRef, type RefObject } from "react";
import { testimonials, type Testimonial } from "@/lib/data/testimonials";
import TestimonialCard from "./TestimonialCard";

// ============================================================
// Ajustes rápidos da animação
// ============================================================
/** Velocidade da coluna 1, em pixels por segundo. Suba para acelerar. */
const MARQUEE_SPEED = 25;
/** A coluna 2 anda um pouco mais rápido, pra não ficar sincronizada. */
const SPEED_VARIATION = 1.18;
/** Altura do fade nas bordas de cima e de baixo, em pixels. */
const FADE_SIZE = 100;
/** Espaço vertical entre os cards, em pixels (precisa bater com o `gap-4`). */
const GAP = 16;
/** Quanto maior, mais rápido freia/retoma no hover. */
const EASE = 3.5;

type Item = { testimonial: Testimonial; hideOnDesktop: boolean };

function MarqueeColumn({
  items,
  direction,
  speed,
  pausedRef,
  className = "",
}: {
  items: Item[];
  direction: "up" | "down";
  speed: number;
  pausedRef: RefObject<boolean>;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy) return;

    // Acessibilidade: com movimento reduzido, nada se mexe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let factor = 1; // 1 = velocidade normal, 0 = parado
    // O período é a altura de UMA cópia + o gap: é exatamente o quanto
    // precisa andar pra segunda cópia ocupar o lugar da primeira, sem pulo.
    let offset = direction === "down" ? -(copy.offsetHeight + GAP) : 0;

    const tick = (now: number) => {
      // Clamp evita um salto gigante quando a aba volta do segundo plano.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const target = pausedRef.current ? 0 : 1;
      factor += (target - factor) * Math.min(1, dt * EASE);

      const period = copy.offsetHeight + GAP;
      offset += (direction === "down" ? 1 : -1) * speed * factor * dt;
      if (offset <= -period) offset += period;
      if (offset >= 0) offset -= period;

      track.style.transform = `translate3d(0, ${offset}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, speed, pausedRef]);

  // Altura fixa e recorte só valem quando há animação (motion-safe): com
  // movimento reduzido a coluna cresce naturalmente e mostra tudo.
  return (
    <div
      className={`marquee-fade motion-safe:h-[520px] motion-safe:overflow-hidden lg:motion-safe:h-[600px] ${className}`}
      style={{ ["--fade" as string]: `${FADE_SIZE}px` }}
    >
      <div ref={trackRef} className="flex flex-col gap-4 will-change-transform">
        <div ref={copyRef} className="flex flex-col gap-4">
          {items.map(({ testimonial, hideOnDesktop }) => (
            <div key={testimonial.id} className={hideOnDesktop ? "md:hidden" : undefined}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Segunda cópia: é ela que dá o loop infinito sem espaço vazio. */}
        <div className="flex flex-col gap-4 motion-reduce:hidden" aria-hidden>
          {items.map(({ testimonial, hideOnDesktop }) => (
            <div key={testimonial.id} className={hideOnDesktop ? "md:hidden" : undefined}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VerticalTestimonials() {
  const pausedRef = useRef(false);

  // Coluna 1 carrega todos os depoimentos; no desktop os ímpares somem
  // (eles aparecem na coluna 2). No mobile, a coluna 2 fica oculta e a
  // coluna 1 mostra a lista inteira.
  const colunaA: Item[] = testimonials.map((t, i) => ({
    testimonial: t,
    hideOnDesktop: i % 2 === 1,
  }));
  const colunaB: Item[] = testimonials
    .filter((_, i) => i % 2 === 1)
    .map((t) => ({ testimonial: t, hideOnDesktop: false }));

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <MarqueeColumn items={colunaA} direction="up" speed={MARQUEE_SPEED} pausedRef={pausedRef} />
      <MarqueeColumn
        items={colunaB}
        direction="down"
        speed={MARQUEE_SPEED * SPEED_VARIATION}
        pausedRef={pausedRef}
        className="hidden md:block"
      />
    </div>
  );
}
