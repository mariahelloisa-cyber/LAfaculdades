export type Post = {
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string[];
  data: string; // ISO date
};

// Posts de exemplo — substituir por conteúdo real do blog.
export const posts: Post[] = [
  {
    slug: "como-usar-a-nota-do-enem-em-2026",
    titulo: "Como usar a nota do ENEM para entrar na faculdade em 2026",
    categoria: "ENEM",
    resumo:
      "Já fez o ENEM em algum ano anterior? Veja como usar a sua nota para ingressar direto, sem precisar fazer vestibular.",
    conteudo: [
      "Se você já fez o ENEM em qualquer edição anterior, pode usar a sua nota para ingressar em um curso de graduação sem precisar fazer uma nova prova.",
      "Na LA Faculdades, o processo é simples: você informa o número de inscrição do ENEM, escolhe o curso desejado e a equipe de matrículas confirma o seu ingresso.",
      "Não existe nota mínima fixa — a nota é usada como critério de ingresso simplificado, e não como corte eliminatório.",
    ],
    data: "2026-02-10",
  },
  {
    slug: "como-funciona-o-vestibular-online",
    titulo: "Vestibular online: como funciona e como se preparar",
    categoria: "Vestibular",
    resumo:
      "Entenda como funciona o vestibular próprio da LA Faculdades, quanto tempo leva e o que estudar antes de fazer a prova.",
    conteudo: [
      "O vestibular da LA Faculdades pode ser feito totalmente online, no seu tempo, sem precisar se deslocar até um polo.",
      "A prova é composta por questões de interpretação de texto, redação e conhecimentos gerais, com foco em avaliar o potencial do candidato e não decorar conteúdo.",
      "Você recebe o resultado em poucos dias úteis e, sendo aprovado, já pode iniciar o processo de matrícula.",
    ],
    data: "2026-01-22",
  },
  {
    slug: "como-funciona-o-la-bank",
    titulo: "LA Bank: como funciona o financiamento estudantil da LA Faculdades",
    categoria: "Financiamento",
    resumo:
      "Conheça o LA Bank, o programa de financiamento próprio da instituição, sem burocracia de banco e sem fiador.",
    conteudo: [
      "O LA Bank é o financiamento estudantil oferecido pela própria LA Faculdades, pensado para quem quer estudar sem esperar aprovação de banco.",
      "Não é necessário apresentar fiador, e a análise é feita no momento da matrícula.",
      "As condições variam por curso e podem ser combinadas com bolsas e descontos — fale com a equipe de matrículas para simular o seu caso.",
    ],
    data: "2026-01-05",
  },
  {
    slug: "5-motivos-para-escolher-uma-graduacao-ead",
    titulo: "5 motivos para escolher uma graduação EAD",
    categoria: "Educação",
    resumo:
      "Flexibilidade de horário, mensalidade mais acessível e diploma com o mesmo valor legal do presencial. Veja outras vantagens.",
    conteudo: [
      "1. Flexibilidade: você estuda no horário que encaixa na sua rotina, sem depender de deslocamento.",
      "2. Mensalidade mais acessível: cursos EAD costumam custar menos que a mesma formação presencial.",
      "3. Diploma com o mesmo valor legal: um curso reconhecido pelo MEC tem validade nacional, EAD ou presencial.",
      "4. Tutoria disponível: dúvidas são respondidas por professores e tutores durante o curso.",
      "5. Você pode conciliar com o trabalho: dá para estudar sem precisar parar de trabalhar.",
    ],
    data: "2025-12-18",
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
