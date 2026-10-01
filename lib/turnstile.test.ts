/* `npm test` — verificação do Turnstile no servidor. O siteverify é trocado
   por um fetch falso que devolve as respostas documentadas pela Cloudflare. */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { verificarTurnstile } from "./turnstile.ts";

const HOSTS = "lafaculdades.com.br,www.lafaculdades.com.br";

function siteverifyFalso(corpo: unknown, status = 200) {
  const chamadas: URLSearchParams[] = [];
  const fetcher = (async (_url: string, init: RequestInit) => {
    chamadas.push(init.body as URLSearchParams);
    return new Response(JSON.stringify(corpo), { status });
  }) as unknown as typeof fetch;
  return { fetcher, chamadas };
}

const base = { acao: "matricula", segredo: "segredo-de-teste", hostnames: HOSTS, ip: "203.0.113.7" };

describe("verificarTurnstile", () => {
  test("aceita token válido, da ação e do domínio esperados", async () => {
    const { fetcher, chamadas } = siteverifyFalso({
      success: true,
      action: "matricula",
      hostname: "www.lafaculdades.com.br",
      "error-codes": [],
    });
    assert.deepEqual(await verificarTurnstile({ ...base, token: "tok", fetcher }), { ok: true });
    assert.equal(chamadas.length, 1);
    assert.equal(chamadas[0].get("secret"), "segredo-de-teste");
    assert.equal(chamadas[0].get("response"), "tok");
    assert.equal(chamadas[0].get("remoteip"), "203.0.113.7");
  });

  test("token ausente ou vazio: recusa sem chamar o siteverify", async () => {
    for (const token of [null, undefined, "", 42]) {
      const { fetcher, chamadas } = siteverifyFalso({ success: true });
      const r = await verificarTurnstile({ ...base, token, fetcher });
      assert.deepEqual(r, { ok: false, motivo: "ausente" });
      assert.equal(chamadas.length, 0);
    }
  });

  test("token acima de 2048 caracteres: recusa sem chamar o siteverify", async () => {
    const { fetcher, chamadas } = siteverifyFalso({ success: true });
    const r = await verificarTurnstile({ ...base, token: "x".repeat(2049), fetcher });
    assert.equal(r.ok, false);
    assert.equal(chamadas.length, 0);
  });

  test("token inválido", async () => {
    const { fetcher } = siteverifyFalso({ success: false, "error-codes": ["invalid-input-response"] });
    const r = await verificarTurnstile({ ...base, token: "forjado", fetcher });
    assert.deepEqual(r, { ok: false, motivo: "invalido", codigos: ["invalid-input-response"] });
  });

  test("token reutilizado ou expirado", async () => {
    const { fetcher } = siteverifyFalso({ success: false, "error-codes": ["timeout-or-duplicate"] });
    const r = await verificarTurnstile({ ...base, token: "ja-usado", fetcher });
    assert.deepEqual(r, { ok: false, motivo: "expirado", codigos: ["timeout-or-duplicate"] });
  });

  test("token de outra ação (ex.: do login) não vale para a matrícula", async () => {
    const { fetcher } = siteverifyFalso({ success: true, action: "login", hostname: "lafaculdades.com.br" });
    const r = await verificarTurnstile({ ...base, token: "tok", fetcher });
    assert.equal(r.ok, false);
  });

  test("resposta sem action (chave de teste) é recusada", async () => {
    const { fetcher } = siteverifyFalso({ success: true, hostname: "lafaculdades.com.br" });
    assert.equal((await verificarTurnstile({ ...base, token: "tok", fetcher })).ok, false);
  });

  test("recusa por hostname informa o hostname recebido (para o log)", async () => {
    const { fetcher } = siteverifyFalso({ success: true, action: "matricula", hostname: "facla.edu.br" });
    const r = await verificarTurnstile({ ...base, token: "tok", fetcher });
    assert.deepEqual(r, { ok: false, motivo: "invalido", codigos: ["hostname-mismatch", "hostname=facla.edu.br"] });
  });

  test("token gerado em outro domínio é recusado", async () => {
    for (const hostname of ["evil.example", "localhost", "lafaculdades.com.br.evil.example", undefined]) {
      const { fetcher } = siteverifyFalso({ success: true, action: "matricula", hostname });
      assert.equal((await verificarTurnstile({ ...base, token: "tok", fetcher })).ok, false, String(hostname));
    }
  });

  test("sem segredo ou sem lista de domínios: falha fechada, sem chamar o siteverify", async () => {
    for (const cfg of [{ segredo: undefined }, { segredo: "" }, { hostnames: undefined }, { hostnames: " , " }]) {
      const { fetcher, chamadas } = siteverifyFalso({ success: true, action: "matricula", hostname: "lafaculdades.com.br" });
      const r = await verificarTurnstile({ ...base, ...cfg, token: "tok", fetcher });
      assert.deepEqual(r, { ok: false, motivo: "configuracao" });
      assert.equal(chamadas.length, 0);
    }
  });

  test("segredo recusado pela Cloudflare (HTTP 400) é tratado como erro de configuração", async () => {
    const { fetcher } = siteverifyFalso({ success: false, "error-codes": ["invalid-input-secret"] }, 400);
    const r = await verificarTurnstile({ ...base, token: "tok", fetcher });
    assert.equal(r.ok === false && r.motivo, "configuracao");
  });

  test("resposta HTTP de erro nunca aprova, mesmo com success: true no corpo", async () => {
    const { fetcher } = siteverifyFalso(
      { success: true, action: "matricula", hostname: "lafaculdades.com.br", "error-codes": [] },
      500
    );
    const r = await verificarTurnstile({ ...base, token: "tok", fetcher });
    assert.equal(r.ok, false);
  });

  test("siteverify fora do ar, com erro HTTP ou resposta que não é JSON: falha fechada", async () => {
    const rede = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    const naoJson = (async () => new Response("<html>", { status: 200 })) as unknown as typeof fetch;
    const nulo = (async () => new Response("null", { status: 200 })) as unknown as typeof fetch;
    for (const fetcher of [rede, siteverifyFalso({}, 500).fetcher, naoJson, nulo]) {
      const r = await verificarTurnstile({ ...base, token: "tok", fetcher });
      assert.equal(r.ok === false && r.motivo, "indisponivel");
    }
  });

  test("siteverify lento: desiste no timeout", async () => {
    const lento = ((_u: string, init: RequestInit) =>
      new Promise((_, rej) => init.signal?.addEventListener("abort", () => rej(init.signal?.reason)))) as unknown as typeof fetch;
    const r = await verificarTurnstile({ ...base, token: "tok", fetcher: lento, timeoutMs: 50 });
    assert.equal(r.ok === false && r.motivo, "indisponivel");
  });
});
