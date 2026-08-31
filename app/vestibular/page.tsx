import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Vestibular",
  description: "Conheça as formas de ingresso na LA Faculdades: inscrição com pagamento direto, vestibular próprio online e ingresso pela nota do ENEM.",
};

const formas = [
  {
    titulo: "Inscreva-se e pague",
    ativo: true,
    descricao:
      "A forma principal de ingresso hoje: preencha seus dados, escolha o curso e a forma de ingresso e finalize a inscrição direto pelo site.",
    passos: [
      "Escolha o curso de graduação ou pós-graduação",
      "Preencha o formulário de inscrição com seus dados",
      "Finalize o pagamento da inscrição",
      "Receba a confirmação e os próximos passos por WhatsApp",
    ],
  },
  {
    titulo: "Vestibular próprio",
    ativo: false,
    descricao:
      "Prova online, feita no seu tempo, sem precisar se deslocar até uma unidade. Em breve disponível como forma de ingresso.",
    passos: [
      "Inscrição gratuita",
      "Prova 100% online",
      "Resultado em poucos dias úteis",
      "Matrícula após aprovação",
    ],
  },
  {
    titulo: "Nota do ENEM",
    ativo: false,
    descricao:
      "Use a nota do ENEM de qualquer edição anterior para ingressar sem precisar fazer uma nova prova. Em breve disponível como forma de ingresso.",
    passos: [
      "Informe o número de inscrição do ENEM",
      "Escolha o curso desejado",
      "Confirmação do ingresso pela equipe de matrículas",
      "Matrícula",
    ],
  },
];

const faqs = [
  {
    pergunta: "Qual é a forma de ingresso mais rápida?",
    resposta: "Hoje, a inscrição com pagamento direto pelo site é a via principal e mais rápida para garantir sua vaga.",
  },
  {
    pergunta: "O vestibular próprio e o ingresso pelo ENEM já estão disponíveis?",
    resposta:
      "Essas duas formas de ingresso fazem parte do planejamento da instituição e serão habilitadas em breve. Fale com a equipe de matrículas para saber a previsão.",
  },
  {
    pergunta: "Posso me inscrever para qualquer curso?",
    resposta: "Sim, tanto para cursos de graduação quanto de pós-graduação disponíveis no site.",
  },
];

export default function VestibularPage() {
  return (
    <>
      <PageHero
        eyebrow="Vestibular"
        title="Você escolhe como entrar. Nós cuidamos do resto."
        description="Três formas de ingressar na LA Faculdades — conheça cada uma e escolha a que faz mais sentido para você."
        art="campus"
      />

      <section className="section-y bg-white">
        <Container className="grid gap-5 lg:grid-cols-3">
          {formas.map((forma) => (
            <div
              key={forma.titulo}
              className={`flex flex-col rounded-2xl p-7 ${
                forma.ativo ? "bg-navy-950 text-white" : "bg-surface text-navy-950"
              }`}
            >
              <span
                className={`t-label w-fit rounded-full px-3.5 py-1.5 uppercase ${
                  forma.ativo ? "bg-rose text-white" : "bg-white text-muted"
                }`}
              >
                {forma.ativo ? "Disponível agora" : "Em breve"}
              </span>
              <h3 className="t-h3 mt-5">{forma.titulo}</h3>
              <p className={`mt-3 text-[15px] leading-relaxed ${forma.ativo ? "text-sky-200" : "text-muted"}`}>
                {forma.descricao}
              </p>
              <ol className="mt-6 space-y-3 text-[15px]">
                {forma.passos.map((passo, i) => (
                  <li key={passo} className="flex gap-3">
                    <span className={`font-display font-extrabold ${forma.ativo ? "text-accent" : "text-sky-600"}`}>
                      {i + 1}.
                    </span>
                    <span className={forma.ativo ? "text-sky-100" : "text-navy-900"}>{passo}</span>
                  </li>
                ))}
              </ol>
              {forma.ativo && (
                <Link
                  href="/vestibular/inscricao"
                  className="mt-8 rounded-full bg-accent py-3.5 text-center font-bold text-white transition-colors hover:bg-accent-hover"
                >
                  Iniciar inscrição
                </Link>
              )}
            </div>
          ))}
        </Container>
      </section>

      <section className="section-y bg-tint">
        <Container>
          <h2 className="t-h2 text-navy-950">Perguntas sobre o vestibular</h2>
          <div className="mt-12">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </section>
    </>
  );
}
