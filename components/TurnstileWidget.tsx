"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { TURNSTILE_CAMPO } from "@/lib/turnstile";

type TurnstileApi = {
  render: (el: HTMLElement, opcoes: Record<string, unknown>) => string | undefined;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/**
 * Cloudflare Turnstile. O widget grava o token num input escondido
 * (cf-turnstile-response) dentro do <form>, e o servidor valida.
 *
 * O token vale uma vez só: a cada resposta do servidor (`resetKey` muda) o
 * widget é reiniciado e gera outro — é o que permite tentar de novo depois de
 * um erro. `appearance: interaction-only` deixa o widget invisível para quase
 * todo mundo; ele só aparece quando a Cloudflare pede interação.
 */
export default function TurnstileWidget({
  action,
  resetKey,
  onTokenChange,
  tema = "light",
  className,
}: {
  /** conferida no servidor (siteverify) — um token de outro formulário não vale */
  action: string;
  resetKey: unknown;
  onTokenChange: (token: string | null) => void;
  tema?: "light" | "dark";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const ultimoResetKey = useRef(resetKey);
  const [scriptPronto, setScriptPronto] = useState(false);
  const [falhou, setFalhou] = useState(false);

  const avisarToken = useEffectEvent((token: string | null) => onTokenChange(token));

  useEffect(() => {
    const el = containerRef.current;
    if (!scriptPronto || !el || !window.turnstile || !SITE_KEY) return;

    const id = window.turnstile.render(el, {
      sitekey: SITE_KEY,
      action,
      theme: tema,
      language: "pt-br",
      size: "flexible",
      appearance: "interaction-only",
      "response-field-name": TURNSTILE_CAMPO,
      callback: (token: string) => {
        setFalhou(false);
        avisarToken(token);
      },
      "expired-callback": () => avisarToken(null),
      "timeout-callback": () => avisarToken(null),
      "error-callback": () => {
        setFalhou(true);
        avisarToken(null);
      },
    });
    widgetId.current = id ?? null;

    return () => {
      if (id) window.turnstile?.remove(id);
      widgetId.current = null;
    };
  }, [scriptPronto, action, tema]);

  useEffect(() => {
    if (ultimoResetKey.current === resetKey) return;
    ultimoResetKey.current = resetKey;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return (
    <div className={className}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptPronto(true)}
        onError={() => setFalhou(true)}
      />
      <div ref={containerRef} />
      {(falhou || !SITE_KEY) && (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-rose">
          Não foi possível carregar a verificação de segurança. Recarregue a página e tente de novo.
        </p>
      )}
    </div>
  );
}
