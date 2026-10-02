import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ValidarCertificadoForm from "@/components/ValidarCertificadoForm";
import { SITE } from "@/lib/constants";

/* /validar é o endereço gravado nos QR Codes dos certificados já emitidos:
   não pode mudar, e precisa abrir direto por URL (inclusive com ?token=) sem
   login. A casca da página é estática e não tem nenhum dado pessoal — a
   consulta sai por Server Action (POST), que nunca é cacheada. */
export const metadata: Metadata = {
  title: "Validação de certificado",
  description:
    "Consulte os dados de um certificado da LA Faculdades pelo código de validação impresso no documento.",
  alternates: { canonical: `${SITE.url}/validar` },
};

const passos = [
  {
    numero: "1",
    titulo: "Pegue o código",
    texto: "Está impresso no certificado, ao lado do QR Code.",
  },
  {
    numero: "2",
    titulo: "Informe no campo",
    texto: "Digite ou cole o código e confirme a verificação de segurança.",
  },
  {
    numero: "3",
    titulo: "Confira os dados",
    texto: "Aluno, curso, datas e registro aparecem como constam no sistema.",
  },
];

export default function ValidarPage() {
  return (
    <>
      <PageHero
        eyebrow="Certificados"
        title="Validação de certificado"
        description="Informe o código de validação impresso no certificado para consultar os dados do registro acadêmico: aluno, curso, datas e número de registro."
      >
        <p className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold text-sky-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3.5l7.5 3v5.1c0 4.2-3 7.2-7.5 8.9-4.5-1.7-7.5-4.7-7.5-8.9V6.5l7.5-3Z"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path d="m9.2 12 1.9 1.9 3.7-3.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Consulta gratuita • E-MEC {SITE.emec}
        </p>
      </PageHero>

      <section className="section-y bg-white">
        {/* A largura é limitada por este div, e não por uma classe max-w-* no
            Container: .container-x é definida fora das camadas do Tailwind no
            globals.css, então o max-width dela vence qualquer utilitário. */}
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* O formulário abre a seção: quem chega pelo QR Code já cai com o
                campo preenchido e não precisa ler nada antes. */}
            <ValidarCertificadoForm />

            {/* Como funciona, depois do formulário: serve a quem digitou o
                código à mão e ficou em dúvida ("que código é esse?"). */}
            <ol className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {passos.map((p) => (
                <li key={p.numero} className="rounded-2xl bg-surface p-5">
                  <span className="grid size-8 place-items-center rounded-full bg-navy-950 font-display text-[14px] font-extrabold text-white">
                    {p.numero}
                  </span>
                  <h2 className="mt-3.5 text-[15px] font-extrabold text-navy-950">{p.titulo}</h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.texto}</p>
                </li>
              ))}
            </ol>

            {/* Saída para quem não encontrou o certificado — sem isso a página
                termina num erro sem caminho. */}
            <div className="mt-8 rounded-[28px] bg-navy-950 p-6 sm:p-8">
              <h2 className="t-h3 text-white">Não encontrou o certificado?</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-sky-200">
                Confira se o código foi digitado exatamente como está no documento. Se continuar sem
                aparecer, ou se precisar de uma confirmação formal de validade, fale com a secretaria
                acadêmica.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-accent-hover"
                >
                  Falar com a secretaria
                </a>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:border-white/60"
                >
                  WhatsApp {SITE.whatsappDisplay}
                </a>
              </div>
              <p className="mt-6 border-t border-white/10 pt-5 text-[12px] leading-relaxed text-sky-300">
                {SITE.name} • E-MEC {SITE.emec} • Mantida por {SITE.mantenedora}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
