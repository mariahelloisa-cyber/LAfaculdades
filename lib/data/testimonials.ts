export type Testimonial = {
  id: number;
  name: string;
  role: string;
  comment: string;
  /** Opcional. Coloque a foto em /public/images e aponte aqui (ex.: "/images/avatar-1.jpg").
   *  Sem foto, o card mostra as iniciais do nome. */
  avatar?: string;
};

// ============================================================
// >>> EDITE OS DEPOIMENTOS AQUI <<<
//
// É só alterar/adicionar/remover itens desta lista: o carrossel
// se redistribui sozinho entre as duas colunas.
// Os quatro primeiros vieram da seção de depoimentos antiga; os
// demais são exemplos — troque pelos comentários reais.
// ============================================================
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Camila R.",
    role: "Aluna de Administração",
    comment:
      "Entrei com a nota do ENEM de anos atrás, que eu nem lembrava mais que tinha. Não paguei nada pra me inscrever e a matrícula saiu no mesmo dia.",
  },
  {
    id: 2,
    name: "Diego S.",
    role: "Aluno de Análise e Desenvolvimento de Sistemas",
    comment:
      "O que me segurava era o dinheiro. Com o LA Bank a parcela coube no meu orçamento e eu consegui terminar o curso trabalhando.",
  },
  {
    id: 3,
    name: "Fernanda A.",
    role: "Aluna de Pedagogia",
    comment:
      "Fiz o vestibular online em menos de uma hora, direto do celular. A tutoria sempre respondeu rápido quando eu tinha dúvida.",
  },
  {
    id: 4,
    name: "Rafael M.",
    role: "Aluno de Gestão de Recursos Humanos",
    comment:
      "Precisava de um diploma pra crescer onde eu já trabalhava. Em dois anos eu terminei o tecnólogo e mudei de cargo.",
  },
  {
    id: 5,
    name: "Juliana P.",
    role: "Aluna de Enfermagem",
    comment:
      "As aulas práticas em laboratório fizeram toda a diferença. Cheguei no estágio me sentindo preparada de verdade.",
  },
  {
    id: 6,
    name: "Marcos T.",
    role: "Aluno de Administração",
    comment:
      "Estudo de madrugada, depois do turno. Como o conteúdo fica gravado, nunca perdi uma aula por causa do horário.",
  },
  {
    id: 7,
    name: "Patrícia L.",
    role: "Egressa de Pedagogia",
    comment:
      "Me formei ano passado e o diploma reconhecido pelo MEC foi aceito sem nenhum problema no concurso que prestei.",
  },
  {
    id: 8,
    name: "André C.",
    role: "Aluno de MBA em Gestão de Pessoas",
    comment:
      "Conteúdo direto ao ponto e professores que realmente atuam no mercado. Apliquei no trabalho o que aprendi na mesma semana.",
  },
];
