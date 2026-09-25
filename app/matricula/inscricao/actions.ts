"use server";

import { createClient } from "@/lib/supabase/server";
import { cpfValido } from "@/lib/cpf";

export type MatriculaFormState = { ok?: boolean; error?: string } | undefined;

/** As três portas de entrada do site. O formulário é o mesmo; muda só o que
 *  o candidato marca aqui, para o gestor saber como ele quer ingressar. */
export const FORMAS_INGRESSO = ["Matrícula direta", "Vestibular", "Nota do ENEM"] as const;

export async function criarMatricula(
  _prevState: MatriculaFormState,
  formData: FormData
): Promise<MatriculaFormState> {
  const nomeCompleto = String(formData.get("nome_completo") ?? "").trim();
  const dataNascimento = String(formData.get("data_nascimento") ?? "").trim();
  const cpf = String(formData.get("cpf") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const telefone = String(formData.get("telefone") ?? "").replace(/\D/g, "");
  const cursoNome = String(formData.get("curso_nome") ?? "").trim();
  const cursoSlug = String(formData.get("curso_slug") ?? "").trim();
  const formaIngressoRaw = String(formData.get("forma_ingresso") ?? "").trim();
  const formaIngresso = (FORMAS_INGRESSO as readonly string[]).includes(formaIngressoRaw)
    ? formaIngressoRaw
    : FORMAS_INGRESSO[0];

  if (!nomeCompleto || !dataNascimento || !cpf || !email || !telefone || !cursoNome) {
    return { error: "Preencha todos os campos." };
  }
  if (!nomeCompleto.includes(" ")) {
    return { error: "Informe o nome completo." };
  }
  if (!cpfValido(cpf)) {
    return { error: "CPF inválido. Confira os números digitados." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "E-mail inválido." };
  }
  if (telefone.length < 10 || telefone.length > 11) {
    return { error: "Telefone inválido. Informe o DDD e o número." };
  }

  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  const hoje = new Date();
  if (Number.isNaN(nascimento.getTime()) || nascimento > hoje || nascimento.getFullYear() < 1900) {
    return { error: "Data de nascimento inválida." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("matriculas").insert({
    nome_completo: nomeCompleto,
    data_nascimento: dataNascimento,
    cpf,
    email,
    telefone,
    curso_slug: cursoSlug,
    curso_nome: cursoNome,
    forma_ingresso: formaIngresso,
  });

  if (error) {
    console.error("Erro ao salvar matrícula:", error.message);
    return { error: "Não conseguimos registrar seus dados agora. Tente novamente em instantes." };
  }

  return { ok: true };
}
