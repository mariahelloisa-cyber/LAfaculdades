import { SITE } from "@/lib/constants";
import type { FaqItem } from "@/components/FaqAccordion";

/* Dúvidas frequentes mostradas na página de todos os cursos. É uma lista só,
   igual para todo mundo — para mudar as perguntas, mexa aqui. */
export const FAQ_CURSOS: FaqItem[] = [
  {
    pergunta: "O diploma tem validade nacional?",
    resposta: `A LA Faculdades é credenciada pelo MEC (E-MEC ${SITE.emec}) e os diplomas emitidos têm validade em todo o território nacional.`,
  },
  {
    pergunta: "Como são as aulas?",
    resposta:
      "Suas aulas ficam no Ambiente Virtual de Aprendizagem (AVA) e ficam disponíveis 24 horas por dia, 7 dias por semana. Isso significa que você tem total liberdade para estudar no seu próprio ritmo, de onde quiser!",
  },
  {
    pergunta: "Quando posso começar?",
    resposta:
      "Imediatamente! Assim que você receber os seus dados de acesso ao AVA, aulas e materiais estarão prontos e liberados para você dar o próximo passo na sua carreira.",
  },
  
];
