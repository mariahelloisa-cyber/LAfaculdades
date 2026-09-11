import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Matrícula",
  description: "Faça sua matrícula na LA Faculdade agora: escolha o curso, preencha seus dados e garanta sua vaga direto pelo site.",
};

const passos = [
  "Escolha o curso de graduação ou pós-graduação",
  "Preencha o formulário de inscrição com seus dados",
  "Finalize o pagamento da inscrição",
  "Receba a confirmação e os próximos passos por WhatsApp",
];

export default function MatriculaPage() {
  return (
    <>
      <PageHero
        eyebrow="Matrícula"
        title="Faça agora sua matrícula e comece já."
        description="A forma principal de ingresso hoje: preencha seus dados, escolha o curso e finalize a inscrição direto pelo site."
        art="campus"
      />

      <section className="section-y bg-white">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col rounded-2xl bg-navy-950 p-7 text-white">
            <span className="t-label w-fit rounded-full bg-rose px-3.5 py-1.5 uppercase text-white">
              Disponível agora
            </span>
            <ol className="mt-6 space-y-3 text-[15px]">
              {passos.map((passo, i) => (
                <li key={passo} className="flex gap-3">
                  <span className="font-display font-extrabold text-accent">{i + 1}.</span>
                  <span className="text-sky-100">{passo}</span>
                </li>
              ))}
            </ol>
            <Link
              href="/vestibular/inscricao"
              className="mt-8 rounded-full bg-accent py-3.5 text-center font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Iniciar inscrição
            </Link>
          </div>

          <div>
            <h2 className="t-h2 text-navy-950">Outras formas de ingressar</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Além da matrícula direta, você também pode ingressar pela nota do ENEM ou pelo nosso vestibular próprio.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/enem"
                className="rounded-2xl border border-navy-950/10 bg-surface p-5 font-bold text-navy-950 transition-colors hover:border-accent"
              >
                Ingressar pela nota do ENEM →
              </Link>
              <Link
                href="/vestibular"
                className="rounded-2xl border border-navy-950/10 bg-surface p-5 font-bold text-navy-950 transition-colors hover:border-accent"
              >
                Conhecer o vestibular próprio →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
