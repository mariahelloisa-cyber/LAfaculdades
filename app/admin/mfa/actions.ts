"use server";

import { estadoMfa, requireAdminSemMfa } from "@/lib/supabase/admin";
import { MENSAGEM_LIMITE, dentroDoLimite, ipDoVisitante } from "@/lib/protecaoEnvio";

/* Segundo fator (TOTP) do painel. Todas as ações exigem admin já logado com a
   senha; o código vale no Supabase Auth, que devolve a sessão aal2 nos
   cookies. A RLS do banco (admin_com_mfa) só libera dados com aal2, então
   pular estas telas não dá acesso a nada. */

export type MfaState = { error?: string; ok?: boolean } | undefined;
export type CadastroMfa = { factorId: string; qrCode: string; segredo: string } | { error: string };

const CODIGO = /^\d{6}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODIGO_INVALIDO = "Código inválido ou vencido. Confira o app autenticador e tente de novo.";

function lerCodigo(formData: FormData) {
  return String(formData.get("codigo") ?? "").replace(/\s/g, "");
}

/** Login com autenticador já cadastrado: confere o código de 6 dígitos. */
export async function verificarCodigo(_prev: MfaState, formData: FormData): Promise<MfaState> {
  const { supabase, user } = await requireAdminSemMfa();
  const codigo = lerCodigo(formData);
  if (!CODIGO.test(codigo)) return { error: "Digite os 6 números do app autenticador." };

  if (!(await dentroDoLimite("RL_LOGIN", "mfa", await ipDoVisitante()))) {
    return { error: MENSAGEM_LIMITE };
  }

  // Fatores do getUser() (validado no servidor), não do cookie.
  const fator = (user.factors ?? []).find((f) => f.factor_type === "totp" && f.status === "verified");
  if (!fator) return { error: "Nenhum autenticador cadastrado nesta conta." };

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: fator.id, code: codigo });
  if (error) {
    if (error.code === "over_request_rate_limit") return { error: MENSAGEM_LIMITE };
    return { error: CODIGO_INVALIDO };
  }
  return { ok: true };
}

/** Primeiro acesso: cria o autenticador (ainda não confirmado) e devolve o
 *  QR Code. Só para conta SEM autenticador confirmado — com um já ativo, o
 *  caminho é digitar o código, nunca cadastrar outro com a senha apenas. */
export async function iniciarCadastro(): Promise<CadastroMfa> {
  const { supabase, user } = await requireAdminSemMfa();
  if ((await estadoMfa(supabase, user)) !== "cadastrar") {
    return { error: "Esta conta já tem autenticador. Use o código do app." };
  }
  if (!(await dentroDoLimite("RL_LOGIN", "mfa-cadastro", await ipDoVisitante()))) {
    return { error: MENSAGEM_LIMITE };
  }

  // Tentativas abandonadas (QR gerado e nunca confirmado) saem antes da nova.
  const { data: fatores } = await supabase.auth.mfa.listFactors();
  for (const f of fatores?.all ?? []) {
    if (f.factor_type === "totp" && f.status === "unverified") {
      await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    issuer: "LA Faculdades",
    friendlyName: `Painel ${new Date().toISOString()}`,
  });
  if (error || !data) {
    console.error("[mfa] falha ao cadastrar:", error?.code, error?.message);
    return { error: "Não foi possível gerar o QR Code agora. Tente de novo." };
  }

  /* O Supabase manda o SVG cru depois da vírgula. Recodificado aqui, ele vira
     um data: URI seguro para <img> (SVG em <img> não executa script). */
  const bruto = data.totp.qr_code;
  const svg = bruto.startsWith("data:image/svg+xml") ? bruto.slice(bruto.indexOf(",") + 1) : "";
  if (!svg.trimStart().startsWith("<svg")) {
    return { error: "Não foi possível gerar o QR Code agora. Tente de novo." };
  }
  return {
    factorId: data.id,
    qrCode: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    segredo: data.totp.secret,
  };
}

/** Confirma o autenticador recém-criado com o primeiro código do app. */
export async function confirmarCadastro(_prev: MfaState, formData: FormData): Promise<MfaState> {
  const { supabase, user } = await requireAdminSemMfa();
  if ((await estadoMfa(supabase, user)) !== "cadastrar") {
    return { error: "Esta conta já tem autenticador. Use o código do app." };
  }

  const factorId = String(formData.get("factor_id") ?? "");
  const codigo = lerCodigo(formData);
  if (!UUID.test(factorId)) return { error: "Gere o QR Code de novo." };
  if (!CODIGO.test(codigo)) return { error: "Digite os 6 números do app autenticador." };

  if (!(await dentroDoLimite("RL_LOGIN", "mfa", await ipDoVisitante()))) {
    return { error: MENSAGEM_LIMITE };
  }

  // O Supabase só aceita fator da própria conta da sessão.
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: codigo });
  if (error) {
    if (error.code === "over_request_rate_limit") return { error: MENSAGEM_LIMITE };
    return { error: CODIGO_INVALIDO };
  }
  return { ok: true };
}
