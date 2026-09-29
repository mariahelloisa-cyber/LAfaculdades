/* Constantes das matrículas. Ficam fora dos arquivos "use server": esses só
   podem exportar funções async — exportar um array faz o Next recusar a
   Server Action inteira em runtime. */

/** As três portas de entrada do site. O formulário é o mesmo; muda só o que
 *  o candidato marca aqui, para o gestor saber como ele quer ingressar.
 *  Mesma lista da constraint matriculas_campos_validos (supabase/schema.sql). */
export const FORMAS_INGRESSO = ["Matrícula direta", "Vestibular", "Nota do ENEM"] as const;

/** Resposta quando o mesmo CPF passa do limite de envios por hora
 *  (função registrar_matricula em supabase/schema.sql). */
export const MENSAGEM_LIMITE_CPF =
  "Já recebemos seus dados há pouco. Nossa equipe vai entrar em contato — se precisar, fale com a gente pelo WhatsApp.";

export const STATUS_MATRICULA = ["novo", "em_contato", "matriculado", "descartado"] as const;
export type StatusMatricula = (typeof STATUS_MATRICULA)[number];
