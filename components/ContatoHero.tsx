import Container from "./Container";
import BlobDepoimentos from "./BlobDepoimentos";

/** Hero da página de contato: azul, com a chamada à direita. Sem botão — o
 *  formulário e os canais vêm logo abaixo. */
export default function ContatoHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <BlobDepoimentos fill="#1b7fb5" manterProporcao />

      <Container className="relative z-10 grid items-center gap-8 py-12 lg:min-h-[480px] lg:grid-cols-[46%_1fr] lg:gap-4 lg:py-0">
        {/* Coluna da esquerda vazia no desktop: mantém a chamada no mesmo
            lugar, sobre a parte azul do fundo. */}
        <div className="hidden lg:block" aria-hidden />

        <div className="lg:py-16">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-[#FFD600]">
            Fale com a gente
          </span>
          <h1 className="mt-4 font-display text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
            Tem alguma dúvida?
            <br />
            Estamos aqui para ajudar!
          </h1>
          <p className="mt-5 max-w-[52ch] text-[15px] font-semibold leading-relaxed text-white/90">
            Nossa equipe está pronta para atender você e tirar todas as suas dúvidas
            sobre os cursos, matrículas, formas de pagamento e tudo o que você precisa
            saber para dar início à sua jornada conosco.
          </p>
        </div>
      </Container>
    </section>
  );
}
