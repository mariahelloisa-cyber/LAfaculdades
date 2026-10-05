"use server";

import { registrarMatricula } from "@/lib/supabase/registrarMatricula";
import { protegerEnvioPublico } from "@/lib/protecaoEnvio";
import { cpfValido, emailValido } from "@/lib/cpf";
import { getCourseNomeBySlug } from "@/lib/data/courses";
import { FORMAS_INGRESSO, MENSAGEM_LIMITE_CPF } from "@/lib/matriculas";

export type MatriculaFormState = { ok?: boolean; error?: string } | undefined;

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
  const formaIngresso = FORMAS_INGRESSO.find((f) => f === formaIngressoRaw) ?? FORMAS_INGRESSO[0];

  if (!nomeCompleto || !dataNascimento || !cpf || !email || !telefone || !cursoNome) {
    return { error: "Preencha todos os campos." };
  }
  if (!nomeCompleto.includes(" ")) {
    return { error: "Informe o nome completo." };
  }
  if (nomeCompleto.length > 200) {
    return { error: "Nome muito longo." };
  }
  if (!cursoSlug || cursoNome.length > 200 || cursoSlug.length > 200) {
    return { error: "Curso inválido." };
  }
  if (!cpfValido(cpf)) {
    return { error: "CPF inválido. Confira os números digitados." };
  }
  if (!emailValido(email)) {
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

  const bloqueio = await protegerEnvioPublico(formData, "matricula");
  if (bloqueio) return { error: bloqueio };

  /* curso_slug e curso_nome vêm de campos escondidos: o nome gravado é o do
     banco, e um slug que não existe é recusado. */
  const cursoOficial = await getCourseNomeBySlug(cursoSlug);
  if (cursoOficial === "erro") {
    return { error: "Não conseguimos registrar seus dados agora. Tente novamente em instantes." };
  }
  if (!cursoOficial) return { error: "Curso inválido. Selecione um curso da lista." };

  const resultado = await registrarMatricula({
    nome_completo: nomeCompleto,
    data_nascimento: dataNascimento,
    cpf,
    email,
    telefone,
    curso_slug: cursoSlug,
    curso_nome: cursoOficial,
    forma_ingresso: formaIngresso,
  });

  if (resultado === "limite") return { error: MENSAGEM_LIMITE_CPF };
  if (resultado === "erro") {
    return { error: "Não conseguimos registrar seus dados agora. Tente novamente em instantes." };
  }

  return { ok: true };
}
