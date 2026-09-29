import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { FORMAS_INGRESSO } from "@/lib/matriculas";

/* Única porta de gravação das matrículas. A tabela não aceita mais INSERT
   pela API pública: só a função registrar_matricula, e só com a chave de
   gravação que existe apenas como secret do Worker (CHAVE_GRAVACAO_MATRICULAS)
   — o banco guarda o hash dela. Assim quem chama a API do Supabase direto
   não pula a validação, o Turnstile nem o limite por IP daqui do servidor.

   A chave só serve para isto: vazando, dá para inserir matrículas (o mesmo
   que o formulário faz), mas não ler nem alterar nada. Por isso não se usa a
   service_role aqui. */

export type NovaMatricula = {
  nome_completo: string;
  data_nascimento: string;
  cpf: string;
  email: string;
  telefone: string;
  curso_slug: string;
  curso_nome: string;
  forma_ingresso: (typeof FORMAS_INGRESSO)[number];
  tipo_ingresso?: string;
};

export type ResultadoGravacao = "ok" | "limite" | "erro";

export async function registrarMatricula(dados: NovaMatricula): Promise<ResultadoGravacao> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const chave = process.env.CHAVE_GRAVACAO_MATRICULAS;
  if (!url || !anon || !chave) {
    console.error("[matriculas] CHAVE_GRAVACAO_MATRICULAS ou Supabase não configurados");
    return "erro";
  }

  // Cliente descartável, sem sessão: roda como anon, que só pode chamar a função.
  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const { error } = await supabase.rpc("registrar_matricula", {
    p_chave: chave,
    p_nome_completo: dados.nome_completo,
    p_data_nascimento: dados.data_nascimento,
    p_cpf: dados.cpf,
    p_email: dados.email,
    p_telefone: dados.telefone,
    p_curso_slug: dados.curso_slug,
    p_curso_nome: dados.curso_nome,
    p_forma_ingresso: dados.forma_ingresso,
    p_tipo_ingresso: dados.tipo_ingresso ?? "",
  });

  if (!error) return "ok";
  if (error.message === "limite_cpf") return "limite";
  // error.message nunca contém a chave (ela vai no corpo, não volta na resposta).
  console.error("[matriculas] erro ao gravar:", error.code, error.message);
  return "erro";
}
