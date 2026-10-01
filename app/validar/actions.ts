"use server";

import { protegerEnvioPublico } from "@/lib/protecaoEnvio";
import {
  ACAO_VALIDAR,
  TOKEN_MAX,
  consultarCertificado,
  mensagemConsulta,
  montarCertificado,
  tokenValido,
  type CertificadoView,
} from "@/lib/certificados";

export type ValidarCertificadoState =
  | { token: string; certificado: CertificadoView; error?: undefined }
  | { token: string; error: string; certificado?: undefined }
  | undefined;

/* A consulta é um POST de Server Action: a resposta com os dados do aluno
   nunca entra no cache de página do Cloudflare, e o segredo do Turnstile fica
   só no Worker. */
export async function consultarCertificadoPublico(
  _prevState: ValidarCertificadoState,
  formData: FormData
): Promise<ValidarCertificadoState> {
  const token = String(formData.get("token") ?? "")
    .trim()
    .slice(0, TOKEN_MAX + 1);

  /* Os campos são conferidos antes da proteção, como nos outros formulários:
     erro de digitação não queima o token do Turnstile nem desconta da cota
     de consultas do IP. */
  if (!token) {
    return { token, error: "Informe o código do certificado." };
  }
  if (!tokenValido(token)) {
    return {
      token: token.slice(0, TOKEN_MAX),
      error: "Este código tem caracteres que não existem num código de certificado. Confira o código impresso no documento.",
    };
  }

  const bloqueio = await protegerEnvioPublico(formData, ACAO_VALIDAR);
  if (bloqueio) return { token, error: bloqueio };

  const resultado = await consultarCertificado({ token });

  if (!resultado.ok) {
    /* Só o motivo e o status HTTP. Nunca o token (é a chave de acesso aos
       dados) nem o corpo da resposta, que traz nome, CPF e nascimento. */
    const registro = `[certificado] ${resultado.motivo}${resultado.codigo ? ` ${resultado.codigo}` : ""}`;
    if (resultado.motivo === "nao-encontrado") console.warn(registro);
    else console.error(registro);
    return { token, error: mensagemConsulta(resultado.motivo) };
  }

  return { token, certificado: montarCertificado(resultado.dados) };
}
