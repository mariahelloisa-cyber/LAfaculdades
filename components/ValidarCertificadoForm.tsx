"use client";

import { useActionState, useRef, useState, useSyncExternalStore } from "react";
import TurnstileWidget from "./TurnstileWidget";
import { consultarCertificadoPublico, type ValidarCertificadoState } from "@/app/validar/actions";
import { SITE } from "@/lib/constants";
import { ACAO_VALIDAR, type BlocoCertificado } from "@/lib/certificados";

// A query string não muda sem navegação, então não há o que assinar.
const semAssinatura = () => () => {};

function Bloco({ bloco }: { bloco: BlocoCertificado }) {
  return (
    <div className="rounded-2xl border border-navy-950/8 bg-white p-5 sm:p-6">
      <h3 className="t-label uppercase text-sky-600">{bloco.titulo}</h3>
      <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {bloco.campos.map((c) => (
          <div key={c.rotulo} className="min-w-0">
            <dt className="text-[13px] font-semibold text-muted">{c.rotulo}</dt>
            {/* Texto do React: a resposta da API nunca é interpretada como HTML. */}
            <dd className="mt-0.5 break-words text-[15px] font-bold text-navy-950">{c.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

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
        className="rounded-[28px] border border-navy-950/5 bg-white p-5 shadow-[0_24px_60px_rgba(6,21,35,0.10)] sm:p-7"
      >
        <label className="text-[15px] font-bold text-navy-950" htmlFor="token">
          Código / Token do certificado
        </label>
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
          className="mt-2.5 w-full rounded-2xl border border-navy-950/12 bg-white px-5 py-4 text-[15px] tracking-[0.02em] text-navy-950 outline-none transition-colors placeholder:text-navy-950/35 focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        <p id="token-ajuda" className="mt-2 text-[13px] text-muted">
          O código está impresso no certificado, ao lado do QR Code.
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
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-4 text-[16px] font-bold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {consultando ? (
            <>
              <span
                aria-hidden
                className="size-4.5 animate-spin rounded-full border-2 border-white/35 border-t-white"
              />
              Consultando certificado...
            </>
          ) : tokenVerificacao ? (
            "Consultar certificado"
          ) : (
            "Verificando..."
          )}
        </button>
      </form>

      {/* aria-live: quem usa leitor de tela ouve o resultado sem procurar. */}
      <div aria-live="polite" className="mt-6">
        {visivel && estado?.error && (
          <div
            role="alert"
            className="rounded-2xl border border-rose/30 bg-rose/8 p-5 text-[15px] font-semibold text-navy-950"
          >
            {estado.error}
          </div>
        )}

        {visivel && estado?.certificado && (
          <div className="rounded-[28px] border border-navy-950/5 bg-surface p-5 shadow-[0_24px_60px_rgba(6,21,35,0.08)] sm:p-7">
            <h2 className="t-h3 text-navy-950">Certificado localizado</h2>
            {/* A API não devolve situação do certificado, então a página não
                pode afirmar que ele é válido — só que o registro existe. */}
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
              Encontramos este registro no sistema acadêmico, com os dados abaixo. Esta consulta{" "}
              <strong className="font-bold text-navy-950">não é uma declaração de validade</strong>: para
              confirmar validade, cancelamento ou revogação, fale com a secretaria acadêmica em{" "}
              <a href={`mailto:${SITE.email}`} className="font-bold text-sky-600 underline underline-offset-2">
                {SITE.email}
              </a>
              .
            </p>

            <div className="mt-6 grid gap-4">
              {estado.certificado.blocos.map((bloco) => (
                <Bloco key={bloco.titulo} bloco={bloco} />
              ))}

              {estado.certificado.qrCode && (
                <div className="rounded-2xl border border-navy-950/8 bg-white p-5 sm:p-6">
                  <h3 className="t-label uppercase text-sky-600">QR Code</h3>
                  <a
                    href={estado.certificado.qrCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-xl border border-navy-950/10 p-2"
                  >
                    {/* next/image só aceita o host do Supabase (next.config.ts),
                        e esta imagem vem do SULA: <img> simples, com a URL já
                        conferida por qrCodeSeguro. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={estado.certificado.qrCode}
                      alt="QR Code do certificado"
                      width={180}
                      height={180}
                      className="size-[180px] object-contain"
                    />
                  </a>
                </div>
              )}
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              O CPF é mostrado em parte para proteger o dado pessoal — quem está com o certificado em mãos
              pode conferir os dígitos do meio.
            </p>
          </div>
        )}

        {visivel && (
          <button
            type="button"
            onClick={novaConsulta}
            className="mt-5 w-full rounded-full border border-navy-950/15 px-7 py-3.5 text-[15px] font-bold text-navy-950 transition-colors hover:border-navy-950/40 sm:w-auto"
          >
            Nova consulta
          </button>
        )}
      </div>
    </>
  );
}
