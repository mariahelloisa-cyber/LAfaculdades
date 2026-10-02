import type { BlocoCertificado, CertificadoView } from "@/lib/certificados";
import { ICONES_BLOCO, IconeInfo, IconeQr, IconeSelo } from "./certificadoIcons";

/* Apresentação do certificado localizado. Só recebe texto já formatado por
   lib/certificados.ts e renderiza como texto do React — a resposta da API
   nunca é interpretada como HTML.

   Separado do formulário para a tela do resultado poder ser montada e revista
   sozinha, sem depender de uma consulta real ao SULA. */

function Bloco({ bloco }: { bloco: BlocoCertificado }) {
  return (
    <div className="rounded-2xl border border-navy-950/6 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5 text-sky-600">
        {ICONES_BLOCO[bloco.id]}
        <h3 className="t-label uppercase">{bloco.titulo}</h3>
      </div>
      <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {bloco.campos.map((c) => (
          <div key={c.rotulo} className="min-w-0">
            <dt className="text-[12px] font-bold uppercase tracking-[0.03em] text-muted">{c.rotulo}</dt>
            <dd className="mt-1 break-words text-[15px] font-bold leading-snug text-navy-950">{c.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function CertificadoResultado({
  certificado,
  token,
  onNovaConsulta,
}: {
  certificado: CertificadoView;
  /** código consultado, repetido no cabeçalho para o aluno conferir */
  token: string;
  onNovaConsulta: () => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[28px] border border-navy-950/5 bg-white shadow-[0_24px_60px_rgba(6,21,35,0.10)]">
      {/* Faixa de cabeçalho: o azul escuro do site dá o tom "documento". */}
      <div className="bg-navy-950 px-6 py-7 sm:px-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-accent">
            <IconeSelo />
          </span>
          <div className="min-w-0">
            <h2 className="t-h3 text-white">Certificado localizado</h2>
            <p className="mt-1.5 text-[13px] font-semibold text-sky-300">
              Código consultado:{" "}
              <span className="break-all font-display font-bold tracking-[0.04em] text-white">{token}</span>
            </p>
          </div>
        </div>
      </div>

      {/* A API não devolve situação do certificado, então a página não pode
          afirmar que ele é válido — só que o registro existe. */}
      <div className="flex gap-3 border-b border-navy-950/8 bg-tint px-6 py-4 sm:px-8">
        <span className="mt-0.5 shrink-0 text-sky-600">
          <IconeInfo />
        </span>
        <p className="text-[13px] leading-relaxed text-navy-800">
          Estes são os dados que constam no registro acadêmico. Esta consulta{" "}
          <strong className="font-extrabold text-navy-950">não é uma declaração de validade</strong>: para
          confirmar validade, cancelamento ou revogação, fale com a secretaria acadêmica.
        </p>
      </div>

      <div className="grid gap-4 bg-surface p-5 sm:p-6">
        {certificado.blocos.map((bloco) => (
          <Bloco key={bloco.id} bloco={bloco} />
        ))}

        {certificado.qrCode && (
          <div className="rounded-2xl border border-navy-950/6 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2.5 text-sky-600">
              <IconeQr />
              <h3 className="t-label uppercase">QR Code</h3>
            </div>
            <a
              href={certificado.qrCode}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-2xl border border-navy-950/10 p-2.5 transition-colors hover:border-accent"
            >
              {/* next/image só aceita o host do Supabase (next.config.ts), e
                  esta imagem vem do SULA: <img> simples, com a URL já
                  conferida por qrCodeSeguro. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={certificado.qrCode}
                alt="QR Code do certificado"
                width={168}
                height={168}
                className="size-[168px] object-contain"
              />
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-navy-950/8 px-6 py-5 sm:px-8">
        <p className="max-w-md text-[12px] leading-relaxed text-muted">
          O CPF é mostrado em parte para proteger o dado pessoal — quem está com o certificado em mãos confere
          pelos dígitos do meio.
        </p>
        <button
          type="button"
          onClick={onNovaConsulta}
          className="rounded-full border border-navy-950/15 px-6 py-3 text-[14px] font-bold text-navy-950 transition-colors hover:border-navy-950/45"
        >
          Nova consulta
        </button>
      </div>
    </div>
  );
}
