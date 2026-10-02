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
//
// Os depoimentos seguem o catálogo real do site: uma graduação
// (Gestão em T.I) e as pós-graduações EAD das quatro áreas
// (Educação, Saúde, Negócios e Tecnologia). Como tudo é a
// distância, nada aqui cita aula presencial ou laboratório — e
// vestibular/nota do ENEM aparecem só em graduação, que é onde
// valem. Troque pelos comentários reais quando tiver.
//
// Obs.: o campo "role" é truncado em uma linha no card, então
// mantenha os nomes de curso curtos.
// ============================================================
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Camila R.",
    role: "Aluna de Gestão em T.I",
    comment:
      "Entrei com a nota do ENEM de anos atrás, que eu nem lembrava mais que tinha. Não paguei nada pra me inscrever e a matrícula saiu no mesmo dia.",
  },
  {
    id: 2,
    name: "Diego S.",
    role: "Pós em Segurança da Informação",
    comment:
      "O que me segurava era o dinheiro. Com o LA Bank a parcela coube no meu orçamento e eu consegui terminar a pós trabalhando.",
  },
  {
    id: 3,
    name: "Fernanda A.",
    role: "Pós em Psicopedagogia Clínica",
    comment:
      "Fiz a inscrição em menos de uma hora, direto do celular, só com o diploma da graduação. A tutoria sempre respondeu rápido quando eu tinha dúvida.",
  },
  {
    id: 4,
    name: "Rafael M.",
    role: "Pós em Gestão de Recursos Humanos",
    comment:
      "Precisava de um título pra crescer onde eu já trabalhava. Terminei as 570 horas em menos de um ano e mudei de cargo.",
  },
  {
    id: 5,
    name: "Juliana P.",
    role: "Pós em Urgência e Emergência",
    comment:
      "Os estudos de caso são tirados do plantão mesmo. Voltei pro pronto-socorro enxergando a classificação de risco de outro jeito.",
  },
  {
    id: 6,
    name: "Marcos T.",
    role: "Pós em Engenharia de Segurança",
    comment:
      "Estudo de madrugada, depois do turno. Como o conteúdo fica gravado, nunca perdi uma aula por causa do horário.",
  },
  {
    id: 7,
    name: "Patrícia L.",
    role: "Egressa de Educação Inclusiva e TEA",
    comment:
      "Me formei ano passado e o certificado reconhecido pelo MEC foi aceito sem nenhum problema no concurso que prestei.",
  },
  {
    id: 8,
    name: "André C.",
    role: "MBA em Gestão de Pessoas e Liderança",
    comment:
      "Conteúdo direto ao ponto e professores que realmente atuam no mercado. Apliquei no trabalho o que aprendi na mesma semana.",
  },
];
