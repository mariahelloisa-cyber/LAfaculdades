import { SITE } from "@/lib/constants";
import type { FaqItem } from "@/components/FaqAccordion";

/* Dúvidas frequentes mostradas na página de todos os cursos. É uma lista só,
   igual para todo mundo — para mudar as perguntas, mexa aqui. */
export const FAQ_CURSOS: FaqItem[] = [
  {
    pergunta: "O diploma tem validade nacional?",
    resposta: `A LA Faculdade é credenciada pelo MEC (E-MEC ${SITE.emec}) e os diplomas emitidos têm validade em todo o território nacional.`,
  },
  {
    pergunta: "Como são as aulas e as provas?",
    resposta:
      "As aulas ficam gravadas no Ambiente Virtual de Aprendizagem (AVA), disponíveis 24h. Você estuda no seu ritmo e faz as avaliações dentro dos prazos de cada disciplina.",
  },
  {
    pergunta: "Quando posso começar?",
    resposta:
      "As turmas têm entradas contínuas. Concluindo a matrícula, o acesso ao AVA é liberado e você já começa a estudar.",
  },
  {
    pergunta: "Existe financiamento?",
    resposta:
      "Sim. O LA Bank é o financiamento estudantil da própria LA Faculdade, sem banco no meio do caminho e sem necessidade de fiador.",
  },
];
