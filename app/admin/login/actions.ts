"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/admin";
import { MENSAGEM_LIMITE, dentroDoLimite, ipDoVisitante } from "@/lib/protecaoEnvio";
import { TURNSTILE_CAMPO, mensagemFalha } from "@/lib/turnstile";

export type LoginState = { error?: string; ok?: boolean } | undefined;

const CREDENCIAIS_INVALIDAS = "E-mail ou senha inválidos.";

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }
  if (email.length > 254 || password.length > 256) {
    return { error: CREDENCIAIS_INVALIDAS };
  }

  if (!(await dentroDoLimite("RL_LOGIN", "login", await ipDoVisitante()))) {
    return { error: MENSAGEM_LIMITE };
  }

  /* O token do Turnstile vai para o Supabase Auth, que o valida com o CAPTCHA
     nativo (Authentication > Attack Protection). Não chamamos o siteverify
     aqui: o token só pode ser usado uma vez, e quem precisa dele é o Auth —
     é o que protege também quem chama /auth/v1/token direto. */
  const captchaToken = formData.get(TURNSTILE_CAMPO);
  if (typeof captchaToken !== "string" || !captchaToken || captchaToken.length > 2048) {
    return { error: mensagemFalha("ausente") };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    if (error.code === "captcha_failed") return { error: mensagemFalha("invalido") };
    if (error.code === "over_request_rate_limit") return { error: MENSAGEM_LIMITE };
    return { error: CREDENCIAIS_INVALIDAS };
  }

  /* Conta válida mas fora de public.admins (ex.: criada pela API pública de
     cadastro): encerra a sessão e responde igual a senha errada, para não
     revelar quais e-mails têm conta. */
  if (!(await isAdmin(supabase))) {
    await supabase.auth.signOut();
    return { error: CREDENCIAIS_INVALIDAS };
  }

  /* Sem redirect() aqui: a navegação suave que ele dispara logo após gravar
     o cookie da sessão ficava presa em "Entrando...". O formulário faz uma
     navegação completa para /admin — o mesmo que recarregar a página. */
  return { ok: true };
}
