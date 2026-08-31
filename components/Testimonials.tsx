const testimonials = [
  {
    nome: "Camila R.",
    curso: "Administração",
    texto:
      "Entrei com a nota do ENEM de anos atrás, que eu nem lembrava mais que tinha. Não paguei nada pra me inscrever e a matrícula saiu no mesmo dia.",
  },
  {
    nome: "Diego S.",
    curso: "Análise e Desenvolvimento de Sistemas",
    texto:
      "O que me segurava era o dinheiro. Com o LA Bank a parcela coube no meu orçamento e eu consegui terminar o curso trabalhando.",
  },
  {
    nome: "Fernanda A.",
    curso: "Pedagogia",
    texto:
      "Fiz o vestibular online em menos de uma hora, direto do celular. A tutoria sempre respondeu rápido quando eu tinha dúvida.",
  },
  {
    nome: "Rafael M.",
    curso: "Gestão de Recursos Humanos",
    texto:
      "Precisava de um diploma pra crescer onde eu já trabalhava. Em dois anos eu terminei o tecnólogo e mudei de cargo.",
  },
];

export default function Testimonials() {
  return (
    <div className="-mx-[var(--gutter)] px-[var(--gutter)] lg:mx-0 lg:px-0">
      <div className="rail">
        {testimonials.map((t) => (
          <figure
            key={t.nome}
            className="flex h-full flex-col rounded-2xl bg-navy-950 p-7 text-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            </span>
            <blockquote className="mt-6 flex-1 text-[15px] leading-relaxed text-sky-100">
              {t.texto}
            </blockquote>
            <figcaption className="mt-7 border-t border-white/15 pt-4">
              <span className="block font-bold">{t.nome}</span>
              <span className="text-[13px] text-sky-300">{t.curso}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
