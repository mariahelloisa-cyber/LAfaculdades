/* `npm test` — consulta de certificados no SULA e formatação dos campos da
   página /validar. A API é trocada por um fetch falso: nenhum código real é
   consultado aqui. */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  consultarCertificado,
  formatarCargaHoraria,
  formatarDataCivil,
  mascararCpf,
  montarCertificado,
  qrCodeSeguro,
  tokenValido,
} from "./certificados.ts";

function apiFalsa(corpo: unknown, status = 200, tipo = "application/json") {
  const urls: string[] = [];
  const fetcher = (async (url: string) => {
    urls.push(url);
    const texto = typeof corpo === "string" ? corpo : JSON.stringify(corpo);
    return new Response(texto, { status, headers: { "Content-Type": tipo } });
  }) as unknown as typeof fetch;
  return { fetcher, urls };
}

function valorDe(view: ReturnType<typeof montarCertificado>, bloco: string, rotulo: string) {
  const b = view.blocos.find((x) => x.titulo === bloco);
  assert.ok(b, `bloco ${bloco} não existe`);
  const campo = b.campos.find((c) => c.rotulo === rotulo);
  assert.ok(campo, `campo ${rotulo} não existe em ${bloco}`);
  return campo.valor;
}

describe("tokenValido", () => {
  test("aceita o formato do certificado", () => {
    for (const t of ["CRT-ABCDE1234", "abc123", "A_1.2-3", "a".repeat(64)]) {
      assert.equal(tokenValido(t), true, t);
    }
  });

  test("recusa o que mudaria a rota consultada ou estouraria o tamanho", () => {
    for (const t of ["", " ", "a b", "a/b", "../admin", "a?b=1", "a#b", "a".repeat(65)]) {
      assert.equal(tokenValido(t), false, JSON.stringify(t));
    }
  });
});

describe("consultarCertificado", () => {
  test("devolve os dados e codifica o token na URL", async () => {
    const { fetcher, urls } = apiFalsa({ aluno: { nome: "Maria" } });
    const r = await consultarCertificado({ token: "CRT-ABC.1", fetcher, base: "https://exemplo/api" });
    assert.deepEqual(r, { ok: true, dados: { aluno: { nome: "Maria" } } });
    assert.equal(urls[0], "https://exemplo/api/CRT-ABC.1");
  });

  test("404 é 'não encontrado' mesmo respondendo HTML, e não 'resposta inválida'", async () => {
    // É o que a API devolve hoje: 404 com Content-Type text/html.
    const { fetcher } = apiFalsa("<!DOCTYPE html><h1>404</h1>", 404, "text/html; charset=UTF-8");
    assert.deepEqual(await consultarCertificado({ token: "x", fetcher }), {
      ok: false,
      motivo: "nao-encontrado",
    });
  });

  test("outros erros HTTP não viram 'não encontrado'", async () => {
    for (const status of [401, 429, 500, 502]) {
      const { fetcher } = apiFalsa({ erro: "x" }, status);
      assert.deepEqual(await consultarCertificado({ token: "x", fetcher }), {
        ok: false,
        motivo: "indisponivel",
        codigo: `http-${status}`,
      });
    }
  });

  test("200 com corpo que não é objeto JSON: resposta inválida", async () => {
    for (const corpo of ["nao sou json", JSON.stringify([1, 2]), JSON.stringify(null)]) {
      const { fetcher } = apiFalsa(corpo);
      const r = await consultarCertificado({ token: "x", fetcher });
      assert.deepEqual(r, { ok: false, motivo: "resposta-invalida" });
    }
  });

  test("tempo esgotado e falha de conexão são motivos diferentes", async () => {
    const estourou = (async () => {
      throw Object.assign(new Error("tempo"), { name: "TimeoutError" });
    }) as unknown as typeof fetch;
    assert.deepEqual(await consultarCertificado({ token: "x", fetcher: estourou }), {
      ok: false,
      motivo: "tempo-esgotado",
    });

    const caiu = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;
    assert.deepEqual(await consultarCertificado({ token: "x", fetcher: caiu }), {
      ok: false,
      motivo: "indisponivel",
    });
  });
});

describe("formatarDataCivil", () => {
  test("não desloca a data por fuso horário", () => {
    // new Date("2024-05-10").toLocaleDateString("pt-BR") daria 09/05/2024.
    assert.equal(formatarDataCivil("2024-05-10"), "10/05/2024");
    assert.equal(formatarDataCivil("2024-01-01"), "01/01/2024");
    assert.equal(formatarDataCivil("2024-05-10T00:00:00.000000Z"), "10/05/2024");
    assert.equal(formatarDataCivil("2024-05-10 15:30:00"), "10/05/2024");
  });

  test("deixa passar o que já vem em dd/mm/aaaa", () => {
    assert.equal(formatarDataCivil("10/05/2024"), "10/05/2024");
  });

  test("ausente ou impossível não vira 'Invalid Date'", () => {
    for (const v of [null, undefined, "", "   ", "ontem", "2024-13-01", "2023-02-29", 42, {}, []]) {
      assert.equal(formatarDataCivil(v), null, JSON.stringify(v));
    }
    assert.equal(formatarDataCivil("2024-02-29"), "29/02/2024"); // ano bissexto existe
  });
});

describe("mascararCpf", () => {
  test("mostra só os seis dígitos do meio", () => {
    assert.equal(mascararCpf("12345678909"), "***.456.789-**");
    assert.equal(mascararCpf("123.456.789-09"), "***.456.789-**");
  });

  test("sem 11 dígitos, nada é mostrado", () => {
    for (const v of [null, undefined, "", "123", "1234567890123", {}]) {
      assert.equal(mascararCpf(v), null, JSON.stringify(v));
    }
  });
});

describe("formatarCargaHoraria", () => {
  test("acrescenta a unidade", () => {
    assert.equal(formatarCargaHoraria(360), "360 horas");
    assert.equal(formatarCargaHoraria("360"), "360 horas");
    assert.equal(formatarCargaHoraria(1200), "1.200 horas");
  });

  test("não repete a unidade que já veio no texto", () => {
    assert.equal(formatarCargaHoraria("360 horas"), "360 horas");
  });

  test("ausente ou não numérico", () => {
    for (const v of [null, undefined, "", 0, -10, "abc"]) {
      assert.equal(formatarCargaHoraria(v), null, JSON.stringify(v));
    }
  });
});

describe("qrCodeSeguro", () => {
  test("aceita imagem do host do SULA e data: de imagem", () => {
    assert.equal(
      qrCodeSeguro("https://admin.laeducacao.com.br/qr/abc.png"),
      "https://admin.laeducacao.com.br/qr/abc.png"
    );
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==";
    assert.equal(qrCodeSeguro(dataUri), dataUri);
  });

  test("recusa outro host, outro protocolo e texto solto", () => {
    for (const v of [
      "http://admin.laeducacao.com.br/qr.png", // sem TLS
      "https://evil.example/qr.png", // outro host, bloqueado pelo CSP
      "https://admin.laeducacao.com.br.evil.example/qr.png", // sufixo parecido
      "javascript:alert(1)",
      "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=", // SVG executa script
      "data:text/html;base64,PGgxPmE8L2gxPg==",
      '" onerror="alert(1)',
      "/qr/abc.png",
      "",
      null,
      undefined,
      42,
    ]) {
      assert.equal(qrCodeSeguro(v), null, JSON.stringify(v));
    }
  });
});

describe("montarCertificado", () => {
  const resposta = {
    aluno: { nome: "Maria Helloisa", cpf: "12345678909", data_nascimento: "1998-03-21" },
    curso: { nome: "Pedagogia", nome_manual: "Pedagogia (Licenciatura)", grau: "Licenciatura", carga_horaria: 3200 },
    datas: { inicio: "2021-02-01", conclusao: "2024-12-15", emissao: "2025-01-20" },
    registro: {
      livro: "A-12",
      folha: "45",
      numero: "2025/0001",
      data: "2025-01-22",
      ies_expedidora: "LA Faculdades",
      codigo_emec_expedidora: "26591",
      ies_registradora: "LA Faculdades",
      codigo_emec_registradora: "26591",
    },
    qr_code: "https://admin.laeducacao.com.br/qr/abc.png",
  };

  test("mapeia os campos do contrato da API", () => {
    const view = montarCertificado(resposta);
    assert.equal(valorDe(view, "Aluno", "Nome"), "Maria Helloisa");
    assert.equal(valorDe(view, "Aluno", "CPF"), "***.456.789-**");
    assert.equal(valorDe(view, "Aluno", "Data de nascimento"), "21/03/1998");
    // nome_manual tem precedência sobre nome.
    assert.equal(valorDe(view, "Curso", "Nome"), "Pedagogia (Licenciatura)");
    assert.equal(valorDe(view, "Curso", "Carga horária"), "3.200 horas");
    assert.equal(valorDe(view, "Datas", "Expedição"), "20/01/2025");
    assert.equal(valorDe(view, "Registro acadêmico", "Nº de registro"), "2025/0001");
    assert.equal(valorDe(view, "Registro acadêmico", "Código e-MEC (registradora)"), "26591");
    assert.equal(view.qrCode, "https://admin.laeducacao.com.br/qr/abc.png");
  });

  test("cai no curso.nome quando nome_manual não vem", () => {
    const view = montarCertificado({ ...resposta, curso: { ...resposta.curso, nome_manual: null } });
    assert.equal(valorDe(view, "Curso", "Nome"), "Pedagogia");
  });

  test("resposta vazia não quebra: todos os campos ficam ausentes", () => {
    const view = montarCertificado({});
    assert.equal(view.qrCode, null);
    assert.equal(view.blocos.length, 4);
    for (const bloco of view.blocos) {
      for (const campo of bloco.campos) assert.equal(campo.valor, "—", `${bloco.titulo}/${campo.rotulo}`);
    }
  });

  test("campos com tipo inesperado contam como ausentes", () => {
    const view = montarCertificado({
      aluno: "Maria", // devia ser objeto
      curso: { nome: { pt: "Pedagogia" }, carga_horaria: [] },
      registro: { livro: true, numero: 77 },
    });
    assert.equal(valorDe(view, "Aluno", "Nome"), "—");
    assert.equal(valorDe(view, "Curso", "Nome"), "—");
    assert.equal(valorDe(view, "Curso", "Carga horária"), "—");
    assert.equal(valorDe(view, "Registro acadêmico", "Livro"), "—");
    assert.equal(valorDe(view, "Registro acadêmico", "Nº de registro"), "77");
  });
});
