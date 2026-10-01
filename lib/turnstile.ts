/* Verificação do Cloudflare Turnstile no servidor (siteverify).
   Lógica pura, sem dependência do Next — os testes chamam direto com um
   fetch falso. Quem lê segredo e cabeçalhos é lib/protecaoEnvio.ts. */

/** Nome do campo que o widget injeta no formulário. */
export const TURNSTILE_CAMPO = "cf-turnstile-response";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type MotivoFalha =
  /** o formulário chegou sem token */
  | "ausente"
  /** token recusado, de outra ação ou de outro domínio */
  | "invalido"
  /** token vencido (5 min) ou já usado uma vez */
  | "expirado"
  /** siteverify fora do ar, lento ou respondendo lixo */
  | "indisponivel"
  /** segredo ou lista de domínios não configurados no servidor */
  | "configuracao";

export type ResultadoTurnstile = { ok: true } | { ok: false; motivo: MotivoFalha; codigos?: string[] };

type RespostaSiteverify = {
  success?: unknown;
  action?: unknown;
  hostname?: unknown;
  "error-codes"?: unknown;
};

export function hostnamesPermitidos(valor: string | undefined): Set<string> {
  return new Set(
    (valor ?? "")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  );
}

/** Decide sobre a resposta do siteverify: sucesso só com a ação esperada e um
 *  hostname da lista — um token válido gerado em outro formulário ou em outro
 *  site com o mesmo widget não serve. */
export function avaliarSiteverify(
  resposta: RespostaSiteverify,
  acao: string,
  hostnames: Set<string>
): ResultadoTurnstile {
  const codigos = Array.isArray(resposta["error-codes"])
    ? resposta["error-codes"].filter((c): c is string => typeof c === "string")
    : [];

  if (resposta.success !== true) {
    if (codigos.includes("invalid-input-secret") || codigos.includes("missing-input-secret")) {
      return { ok: false, motivo: "configuracao", codigos };
    }
    if (codigos.includes("timeout-or-duplicate")) return { ok: false, motivo: "expirado", codigos };
    return { ok: false, motivo: "invalido", codigos };
  }
  // action e hostname recebidos vão para o log: não são segredos e dizem na hora o que ajustar.
  if (resposta.action !== acao) {
    return { ok: false, motivo: "invalido", codigos: ["action-mismatch", `action=${String(resposta.action).slice(0, 64)}`] };
  }
  if (typeof resposta.hostname !== "string" || !hostnames.has(resposta.hostname.toLowerCase())) {
    return { ok: false, motivo: "invalido", codigos: ["hostname-mismatch", `hostname=${String(resposta.hostname).slice(0, 253)}`] };
  }
  return { ok: true };
}

export async function verificarTurnstile({
  token,
  acao,
  segredo,
  hostnames,
  ip,
  fetcher = fetch,
  timeoutMs = 10_000,
}: {
  token: unknown;
  acao: string;
  segredo: string | undefined;
  hostnames: string | undefined;
  ip?: string | null;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}): Promise<ResultadoTurnstile> {
  if (typeof token !== "string" || token.length === 0) return { ok: false, motivo: "ausente" };
  if (token.length > 2048) return { ok: false, motivo: "invalido" };

  const permitidos = hostnamesPermitidos(hostnames);
  if (!segredo || permitidos.size === 0) return { ok: false, motivo: "configuracao" };

  const corpo = new URLSearchParams({ secret: segredo, response: token });
  if (ip) corpo.set("remoteip", ip);

  let resposta: RespostaSiteverify | null;
  let httpOk: boolean;
  try {
    const r = await fetcher(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: corpo,
      signal: AbortSignal.timeout(timeoutMs),
    });
    httpOk = r.ok;
    resposta = (await r.json().catch(() => null)) as RespostaSiteverify | null;
    /* Segredo inválido volta como HTTP 400 com error-codes no corpo — vale
       ler para o log dizer "configuracao". Sem corpo reconhecível, é pane. */
    if (!httpOk && !Array.isArray(resposta?.["error-codes"])) {
      return { ok: false, motivo: "indisponivel", codigos: [`http-${r.status}`] };
    }
  } catch {
    return { ok: false, motivo: "indisponivel" };
  }
  if (!resposta || typeof resposta !== "object") return { ok: false, motivo: "indisponivel" };

  const resultado = avaliarSiteverify(resposta, acao, permitidos);
  // Resposta HTTP de erro nunca aprova, diga o corpo o que disser.
  if (!httpOk && resultado.ok) return { ok: false, motivo: "indisponivel" };
  return resultado;
}

/** Texto para o visitante. Todos pedem nova tentativa: o widget é reiniciado
 *  depois de cada envio e gera um token novo. */
export function mensagemFalha(motivo: MotivoFalha): string {
  switch (motivo) {
    case "ausente":
      return "Aguarde a verificação de segurança terminar e envie de novo.";
    case "expirado":
      return "A verificação de segurança expirou. Envie de novo, por favor.";
    case "invalido":
      return "Não conseguimos confirmar a verificação de segurança. Envie de novo, por favor.";
    case "indisponivel":
    case "configuracao":
      return "Não conseguimos confirmar a verificação de segurança agora. Tente de novo em instantes.";
  }
}
