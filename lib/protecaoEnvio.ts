import "server-only";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { TURNSTILE_CAMPO, mensagemFalha, verificarTurnstile } from "./turnstile";

/* Proteção contra abuso dos envios públicos (V-07 da auditoria):
   1. limite por IP no Rate Limiting do Cloudflare (contador da plataforma,
      não memória do Worker — cada isolate teria o seu e zeraria a cada deploy);
   2. Turnstile validado aqui no servidor antes de qualquer gravação.
   Segredos só em variáveis de ambiente do Worker (wrangler secret). */

type Limitador = { limit(opcoes: { key: string }): Promise<{ success: boolean }> };

/** Bindings de wrangler.jsonc > ratelimits. */
export type NomeLimite = "RL_FORMULARIOS" | "RL_LOGIN";

export const MENSAGEM_LIMITE = "Muitas tentativas seguidas. Aguarde um minuto e tente de novo.";

/** IP real do visitante. O Cloudflare sobrescreve este cabeçalho na borda —
 *  quem chama o site não consegue forjá-lo. Fora do Cloudflare (next dev) não existe. */
export async function ipDoVisitante(): Promise<string | null> {
  return (await headers()).get("cf-connecting-ip");
}

function limitador(nome: NomeLimite): Limitador | undefined {
  try {
    const env = getCloudflareContext().env as unknown as Record<string, unknown>;
    const binding = env[nome] as Limitador | undefined;
    return typeof binding?.limit === "function" ? binding : undefined;
  } catch {
    return undefined;
  }
}

/** true = pode seguir. Sem o binding, só o `next dev` passa; em produção a
 *  falta dele é erro de configuração e bloqueia (falha fechada). */
export async function dentroDoLimite(nome: NomeLimite, escopo: string, ip: string | null): Promise<boolean> {
  const rl = limitador(nome);
  if (!rl) {
    if (process.env.NODE_ENV === "production") {
      console.error(`[abuso] binding ${nome} ausente — envio bloqueado`);
      return false;
    }
    return true;
  }
  try {
    const { success } = await rl.limit({ key: `${escopo}:${ip ?? "sem-ip"}` });
    return success;
  } catch {
    console.error(`[abuso] falha ao consultar ${nome} — envio bloqueado`);
    return false;
  }
}

/** Para os formulários públicos: limite por IP e Turnstile. Devolve a
 *  mensagem de erro para o visitante, ou null se o envio pode ser gravado.
 *  Chame DEPOIS de validar os campos (erro de digitação não gasta o token nem
 *  a cota) e ANTES de gravar. */
export async function protegerEnvioPublico(formData: FormData, acao: string): Promise<string | null> {
  const ip = await ipDoVisitante();

  if (!(await dentroDoLimite("RL_FORMULARIOS", acao, ip))) return MENSAGEM_LIMITE;

  const resultado = await verificarTurnstile({
    token: formData.get(TURNSTILE_CAMPO),
    acao,
    segredo: process.env.TURNSTILE_SECRET,
    hostnames: process.env.TURNSTILE_HOSTNAMES,
    ip,
  });
  if (resultado.ok) return null;

  // Só o motivo e os códigos — nunca token nem segredo.
  const registro = `[turnstile] ${acao}: ${resultado.motivo} ${(resultado.codigos ?? []).join(" ")}`.trim();
  if (resultado.motivo === "configuracao" || resultado.motivo === "indisponivel") console.error(registro);
  else console.warn(registro);
  return mensagemFalha(resultado.motivo);
}
