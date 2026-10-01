import type { Metadata } from "next";
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

export default function ValidarPage() {
  return (
    <>
      <PageHero
        eyebrow="Certificados"
        title="Validação de certificado"
        description="Informe o código de validação impresso no certificado para consultar os dados do registro acadêmico: aluno, curso, datas e número de registro."
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <ValidarCertificadoForm />
          </div>
        </div>
      </section>
    </>
  );
}
