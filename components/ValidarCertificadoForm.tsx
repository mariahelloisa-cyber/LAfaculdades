"use client";

import { useActionState, useRef, useState, useSyncExternalStore } from "react";
import TurnstileWidget from "./TurnstileWidget";
import CertificadoResultado from "./CertificadoResultado";
import { IconeBusca, IconeInfo, IconeQr } from "./certificadoIcons";
import { consultarCertificadoPublico, type ValidarCertificadoState } from "@/app/validar/actions";
import { ACAO_VALIDAR } from "@/lib/certificados";

// A query string não muda sem navegação, então não há o que assinar.
const semAssinatura = () => () => {};

export default function ValidarCertificadoForm() {
  const [estado, formAction, consultando] = useActionState<ValidarCertificadoState, FormData>(
    consultarCertificadoPublico,
    undefined
  );

  /* /validar?token=CODIGO preenche o campo — é o endereço gravado nos QR Codes
     dos certificados. A query é lida só no navegador, e não com
     useSearchParams, para a página continuar estática (mesmo recurso do
     CourseCatalog): assim nenhum código consultado entra no HTML cacheado. */
  const busca = useSyncExternalStore(semAssinatura, () => window.location.search, () => "");
  const tokenDaUrl = new URLSearchParams(busca).get("token")?.trim() ?? "";

  // null = o aluno ainda não digitou nada, então vale o token da URL.
  const [tokenDigitado, setTokenDigitado] = useState<string | null>(null);
  const token = tokenDigitado ?? tokenDaUrl;

  const [tokenVerificacao, setTokenVerificacao] = useState<string | null>(null);
  const campoRef = useRef<HTMLInputElement>(null);

  /* "Nova consulta" não recarrega a página: guarda o resultado já visto e o
     esconde até a próxima resposta, que é outro objeto. Enquanto a consulta
     corre, o resultado anterior também sai da tela. */
  const [dispensado, setDispensado] = useState<ValidarCertificadoState>(undefined);
  const visivel = !consultando && estado !== undefined && estado !== dispensado;

  function novaConsulta() {
    setDispensado(estado);
    setTokenDigitado("");
    campoRef.current?.focus();
  }

  return (
    <>
      <form
        action={formAction}
        className="rounded-[28px] border border-navy-950/5 bg-white p-6 shadow-[0_24px_60px_rgba(6,21,35,0.10)] sm:p-8"
      >
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
            <IconeBusca />
          </span>
          <div>
            <h2 className="t-h3 text-navy-950">Consultar certificado</h2>
            <p className="mt-0.5 text-[13px] font-semibold text-muted">Leva alguns segundos</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[15px] font-bold text-navy-950" htmlFor="token">
            Código / Token do certificado
          </label>
          {/* font-display + tracking: o código fica com cara de número de
              documento e cada caractere é fácil de conferir. Sem `uppercase`
              de propósito — mostrar maiúscula sem mudar o valor enviado faria
              o aluno conferir uma coisa e consultar outra. */}
          <input
            ref={campoRef}
            id="token"
            name="token"
            type="text"
            required
            autoComplete="off"
            spellCheck={false}
            maxLength={64}
            placeholder="Ex.: CRT-ABCDE1234"
            value={token}
            onChange={(e) => setTokenDigitado(e.target.value)}
            aria-describedby="token-ajuda"
            className="mt-2.5 w-full rounded-2xl border border-navy-950/12 bg-white px-5 py-4 font-display text-[17px] font-bold tracking-[0.04em] text-navy-950 outline-none transition-colors placeholder:font-sans placeholder:text-[15px] placeholder:font-semibold placeholder:tracking-normal placeholder:text-navy-950/35 focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
        </div>

        {/* Onde achar o código: a dúvida mais provável de quem chega aqui sem
            ter lido o QR Code. */}
        <p
          id="token-ajuda"
          className="mt-3 flex gap-2.5 rounded-2xl bg-tint px-4 py-3 text-[13px] leading-relaxed text-navy-800"
        >
          <span className="mt-px shrink-0 text-sky-600">
            <IconeQr />
          </span>
          O código está impresso no certificado, ao lado do QR Code. Se você chegou aqui lendo o QR Code, o
          campo já vem preenchido.
        </p>

        {/* Token do Turnstile: some a cada envio (vale uma vez) e volta quando
            o widget é reiniciado — é o que permite tentar de novo. */}
        <TurnstileWidget
          action={ACAO_VALIDAR}
          resetKey={estado}
          onTokenChange={setTokenVerificacao}
          className="mt-5"
        />

        {/* Enter no campo também envia: é o submit nativo do formulário. */}
        <button
          type="submit"
          disabled={consultando || !tokenVerificacao}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-4.5 text-[16px] font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {consultando ? (
            <>
              <span
                aria-hidden
                className="size-4.5 animate-spin rounded-full border-2 border-white/35 border-t-white"
              />
              Consultando certificado...
            </>
          ) : (
            <>
              {tokenVerificacao ? "Consultar certificado" : "Verificando..."}
              {tokenVerificacao && (
                <svg width="18" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
                  <path
                    d="M1 7h17M12.5 1 18.5 7l-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </>
          )}
        </button>
      </form>

      {/* aria-live: quem usa leitor de tela ouve o resultado sem procurar. */}
      <div aria-live="polite">
        {visivel && estado?.error && (
          <>
            <div
              role="alert"
              className="mt-6 flex gap-3.5 rounded-[28px] border border-rose/25 bg-rose/8 p-5 sm:p-6"
            >
              <span className="mt-0.5 shrink-0 text-rose-dark">
                <IconeInfo />
              </span>
              <div className="min-w-0">
                <h2 className="text-[15px] font-extrabold text-navy-950">
                  Não foi possível mostrar o certificado
                </h2>
                <p className="mt-1 text-[14px] leading-relaxed text-navy-800">{estado.error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={novaConsulta}
              className="mt-5 w-full rounded-full border border-navy-950/15 px-7 py-3.5 text-[15px] font-bold text-navy-950 transition-colors hover:border-navy-950/45 sm:w-auto"
            >
              Nova consulta
            </button>
          </>
        )}

        {visivel && estado?.certificado && (
          <CertificadoResultado
            certificado={estado.certificado}
            token={estado.token}
            onNovaConsulta={novaConsulta}
          />
        )}
      </div>
    </>
  );
}
