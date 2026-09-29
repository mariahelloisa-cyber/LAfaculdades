"use server";

import { registrarMatricula } from "@/lib/supabase/registrarMatricula";
import { protegerEnvioPublico } from "@/lib/protecaoEnvio";
import { MENSAGEM_LIMITE_CPF } from "@/lib/matriculas";
import { cpfValido, emailValido } from "@/lib/cpf";
import { VESTIBULAR } from "@/lib/constants";

export type VestibularFormState = { ok?: boolean; error?: string } | undefined;

/* A inscrição do vestibular entra na mesma tabela das matrículas, marcada
   como "Vestibular": o gestor acompanha tudo em /admin/matriculas. */
export async function inscreverVestibular(
  _prevState: VestibularFormState,
  formData: FormData
): Promise<VestibularFormState> {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const nomeCompleto = texto("nome_completo");
  const dataNascimento = texto("data_nascimento");
  const cpf = texto("cpf").replace(/\D/g, "");
  const telefone = texto("telefone").replace(/\D/g, "");
  const email = texto("email").toLowerCase();
  const cursoSlug = texto("curso_slug");
  const cursoNome = texto("curso_nome");
  const tipoIngresso = texto("tipo_ingresso");

  if (!nomeCompleto || !dataNascimento || !cpf || !telefone || !email || !cursoNome || !tipoIngresso) {
    return { error: "Preencha todos os campos obrigatórios." };
  }
  if (!nomeCompleto.includes(" ")) {
    return { error: "Informe o nome completo." };
  }
  if (nomeCompleto.length > 200) {
    return { error: "Nome muito longo." };
  }
  if (cursoNome.length > 200 || cursoSlug.length > 200) {
    return { error: "Curso inválido." };
  }
  if (!cpfValido(cpf)) {
    return { error: "CPF inválido. Confira os números digitados." };
  }
  if (telefone.length < 10 || telefone.length > 11) {
    return { error: "Celular inválido. Informe o DDD e o número." };
  }
  if (!emailValido(email)) {
    return { error: "E-mail inválido." };
  }
  if (!VESTIBULAR.tiposIngresso.includes(tipoIngresso)) {
    return { error: "Selecione um tipo de ingresso da lista." };
  }

  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  if (Number.isNaN(nascimento.getTime()) || nascimento > new Date() || nascimento.getFullYear() < 1900) {
    return { error: "Data de nascimento inválida." };
  }

  const bloqueio = await protegerEnvioPublico(formData, "vestibular");
  if (bloqueio) return { error: bloqueio };

  const resultado = await registrarMatricula({
    nome_completo: nomeCompleto,
    data_nascimento: dataNascimento,
    cpf,
    email,
    telefone,
    curso_slug: cursoSlug,
    curso_nome: cursoNome,
    forma_ingresso: "Vestibular",
    tipo_ingresso: tipoIngresso,
  });

  if (resultado === "limite") return { error: MENSAGEM_LIMITE_CPF };
  if (resultado === "erro") {
    return { error: "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes." };
  }

  return { ok: true };
}
