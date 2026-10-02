/* Consulta pública de certificados no SULA e preparo dos dados para /validar.

   Lógica pura, sem dependência do Next — os testes chamam direto com um fetch
   falso, como em lib/turnstile.ts. Quem confere o Turnstile e o limite por IP
   é lib/protecaoEnvio.ts, chamado pela ação em app/validar/actions.ts.

   Tudo que sai daqui já é texto formatado: o componente renderiza como texto
   do React, nunca como HTML, então a resposta da API não pode injetar marcação.

   A consulta sai do servidor, e não do navegador, por dois motivos: o Turnstile
   só vale se for verificado aqui antes de chamar a API, e o connect-src do CSP
   (next.config.ts) libera apenas o próprio site e o Supabase. A API do SULA
   responde com "access-control-allow-origin: *" — ou seja, o CORS dela até
   permitiria o fetch direto —, mas aí a proteção seria só enfeite. */

/** Destino fixo da API do SULA. Não vem de variável de ambiente de propósito:
 *  nada que chegue do navegador escolhe o host que o Worker vai consultar. */
export const SULA_CERTIFICADOS = "https://admin.laeducacao.com.br/api/certificados";

/** Único host autorizado a servir a imagem do QR Code. Precisa casar com o
 *  img-src do CSP em next.config.ts, senão o navegador bloqueia a imagem. */
const QR_HOST = "admin.laeducacao.com.br";

/** Valor mostrado quando o campo não vem na resposta. */
const AUSENTE = "—";

/* Nome da ação conferido no siteverify do Turnstile: um token gerado em outro
   formulário do site não serve na consulta de certificado. O limite por IP
   (RL_FORMULARIOS) também é contado por ação, então as consultas têm cota
   própria e não gastam a dos formulários de matrícula.

   Fica aqui, e não na própria ação, porque um arquivo "use server" só pode
   exportar função assíncrona — o componente precisa deste nome para montar o
   widget com a mesma ação que o servidor vai conferir. */
export const ACAO_VALIDAR = "validar-certificado";

export const TOKEN_MAX = 64;

/* Formato do código: o do exemplo (CRT-ABCDE1234) e variações com ponto ou
   sublinhado. Barra, espaço, "?" e "#" ficam de fora porque mudariam a rota
   consultada — o token entra na URL já codificado, isto é só a primeira
   peneira, que evita gastar cota e token do Turnstile com erro de digitação. */
const TOKEN_FORMATO = /^[A-Za-z0-9._-]{1,64}$/;

export function tokenValido(token: string): boolean {
  return TOKEN_FORMATO.test(token);
}

// ====== CONSULTA ======

export type MotivoConsulta =
  /** a API respondeu 404: nenhum registro com esse código */
  | "nao-encontrado"
  /** a API respondeu erro, ou nem respondeu */
  | "indisponivel"
  /** estourou o tempo limite */
  | "tempo-esgotado"
  /** respondeu 200 com algo que não é um objeto JSON */
  | "resposta-invalida";

export type ResultadoConsulta =
  | { ok: true; dados: Record<string, unknown> }
  | { ok: false; motivo: MotivoConsulta; codigo?: string };

export async function consultarCertificado({
  token,
  fetcher = fetch,
  timeoutMs = 12_000,
  base = SULA_CERTIFICADOS,
}: {
  token: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  base?: string;
}): Promise<ResultadoConsulta> {
  let resposta: Response;
  try {
    resposta = await fetcher(`${base}/${encodeURIComponent(token)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      // A resposta traz nome, CPF e nascimento: nunca em cache compartilhado.
      cache: "no-store",
    });
  } catch (erro) {
    const nome = (erro as { name?: string } | null)?.name;
    const estourou = nome === "TimeoutError" || nome === "AbortError";
    return { ok: false, motivo: estourou ? "tempo-esgotado" : "indisponivel" };
  }

  /* O status é lido antes do corpo: o 404 do SULA volta como página HTML, e
     tentar interpretá-lo como JSON transformaria "não encontrado" em "resposta
     inesperada". Os outros erros HTTP também não são "não encontrado" — viram
     "indisponivel", com o status no log para quem for investigar. */
  if (resposta.status === 404) return { ok: false, motivo: "nao-encontrado" };
  if (!resposta.ok) return { ok: false, motivo: "indisponivel", codigo: `http-${resposta.status}` };

  const dados: unknown = await resposta.json().catch(() => null);
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { ok: false, motivo: "resposta-invalida" };
  }
  return { ok: true, dados: dados as Record<string, unknown> };
}

/** Texto para o visitante. Nenhum deles é beco sem saída: o código digitado
 *  continua no campo e o widget gera outro token para a nova tentativa. */
export function mensagemConsulta(motivo: MotivoConsulta): string {
  switch (motivo) {
    case "nao-encontrado":
      return "Não encontramos nenhum certificado com este código. Confira o código impresso no certificado e tente de novo.";
    case "tempo-esgotado":
      return "A consulta demorou mais do que o esperado e foi interrompida. Tente de novo em instantes.";
    case "indisponivel":
      return "O sistema acadêmico não respondeu agora. Tente de novo em instantes.";
    case "resposta-invalida":
      return "Recebemos uma resposta inesperada do sistema acadêmico. Tente de novo em instantes.";
  }
}

// ====== FORMATAÇÃO DOS CAMPOS ======

function objeto(valor: unknown): Record<string, unknown> {
  return valor && typeof valor === "object" && !Array.isArray(valor)
    ? (valor as Record<string, unknown>)
    : {};
}

/** Texto curto de um campo da resposta. Número vira texto; qualquer outro tipo
 *  (objeto, lista, booleano, null) conta como ausente — é o que mantém a
 *  página de pé quando o SULA muda a forma de um campo. */
function texto(valor: unknown, max = 200): string | null {
  if (typeof valor === "number" && Number.isFinite(valor)) return String(valor);
  if (typeof valor !== "string") return null;
  const limpo = valor.trim().replace(/\s+/g, " ").slice(0, max);
  return limpo === "" ? null : limpo;
}

function diasNoMes(ano: number, mes: number) {
  // Dia 0 do mês seguinte = último dia do mês pedido.
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}

function dataPlausivel(ano: number, mes: number, dia: number) {
  if (mes < 1 || mes > 12 || dia < 1) return false;
  if (ano < 1900 || ano > 2200) return false;
  return dia <= diasNoMes(ano, mes);
}

/** dd/mm/aaaa a partir do texto da API, sem passar por Date: uma data civil
 *  como "2024-05-10" é lida pelo construtor como meia-noite UTC e, no fuso de
 *  Brasília, volta um dia atrás (09/05/2024). Aqui os números são usados como
 *  vieram.
 *
 *  Aceita "2024-05-10", "2024-05-10T12:00:00Z" e "2024-05-10 12:00:00" (os
 *  formatos que uma API Laravel devolve) e deixa passar o que já chega em
 *  dd/mm/aaaa. Qualquer outro formato conta como ausente, em vez de virar
 *  "Invalid Date" na tela. */
export function formatarDataCivil(valor: unknown): string | null {
  const bruto = texto(valor, 40);
  if (!bruto) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[T ].*)?$/.exec(bruto);
  if (iso) {
    const [, ano, mes, dia] = iso;
    return dataPlausivel(Number(ano), Number(mes), Number(dia)) ? `${dia}/${mes}/${ano}` : null;
  }

  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(bruto);
  if (br) {
    const [, dia, mes, ano] = br;
    return dataPlausivel(Number(ano), Number(mes), Number(dia)) ? `${dia}/${mes}/${ano}` : null;
  }
  return null;
}

/** CPF parcial: só os seis dígitos do meio (***.456.789-**).
 *
 *  O HTML de referência mostrava o CPF inteiro, mas o site não tem política
 *  que autorize isso numa página pública — fora do painel autenticado
 *  (/admin/matriculas) o CPF nunca aparece completo, e /validar é aberta a
 *  qualquer pessoa que tenha o código. Os seis dígitos bastam para quem está
 *  com o certificado na mão confirmar que o registro é o seu, e não entregam o
 *  número a quem só tem o código. */
export function mascararCpf(valor: unknown): string | null {
  const bruto = texto(valor, 20);
  if (!bruto) return null;
  const digitos = bruto.replace(/\D/g, "");
  if (digitos.length !== 11) return null;
  return `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**`;
}

/** Carga horária com a unidade. Se o SULA já mandar a unidade no texto
 *  ("360 horas"), ela não é repetida. */
export function formatarCargaHoraria(valor: unknown): string | null {
  const bruto = texto(valor, 40);
  if (!bruto) return null;
  if (/hora/i.test(bruto)) return bruto;

  const numero = Number(bruto.replace(",", "."));
  if (!Number.isFinite(numero) || numero <= 0) return null;
  return `${numero.toLocaleString("pt-BR")} horas`;
}

/** Endereço que pode virar <img> e <a> na página. Passam só duas formas: um
 *  data: de imagem (sem SVG, que executa script) e uma URL https no host do
 *  SULA — que é o que o img-src do CSP libera. Outro host, "javascript:" ou
 *  texto solto viram "não disponível", em vez de uma imagem quebrada ou de um
 *  link para fora. */
export function qrCodeSeguro(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const bruto = valor.trim();
  if (bruto === "" || bruto.length > 200_000) return null;
  // Espaço, aspas e sinais de marcação não existem em URL nem em base64.
  if (/[\s"'<>\\]/.test(bruto)) return null;

  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(bruto)) return bruto;
  if (bruto.length > 2048) return null;

  let url: URL;
  try {
    url = new URL(bruto);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== QR_HOST) return null;
  return url.toString();
}

// ====== DADOS PARA A TELA ======

export type CampoCertificado = { rotulo: string; valor: string };
/** `id` é estável e serve para a tela escolher o ícone do bloco — o título é
 *  texto de interface e pode ser reescrito sem quebrar nada. */
export type BlocoCertificado = {
  id: "aluno" | "curso" | "datas" | "registro";
  titulo: string;
  campos: CampoCertificado[];
};
export type CertificadoView = { blocos: BlocoCertificado[]; qrCode: string | null };

function campo(rotulo: string, valor: string | null): CampoCertificado {
  return { rotulo, valor: valor ?? AUSENTE };
}

/** Achata a resposta do SULA nos blocos da tela. O mapeamento é o do HTML de
 *  referência; campo que não vier aparece como "—", para a tela mostrar a
 *  estrutura do certificado mesmo incompleta.
 *
 *  Note que nada aqui afirma que o certificado é válido: o contrato da API não
 *  tem campo de situação, então a tela só pode dizer que o registro foi
 *  localizado. */
export function montarCertificado(dados: Record<string, unknown>): CertificadoView {
  const aluno = objeto(dados.aluno);
  const curso = objeto(dados.curso);
  const datas = objeto(dados.datas);
  const registro = objeto(dados.registro);

  return {
    blocos: [
      {
        id: "aluno",
        titulo: "Aluno",
        campos: [
          campo("Nome", texto(aluno.nome)),
          campo("CPF", mascararCpf(aluno.cpf)),
          campo("Data de nascimento", formatarDataCivil(aluno.data_nascimento)),
        ],
      },
      {
        id: "curso",
        titulo: "Curso",
        campos: [
          // nome_manual tem precedência, como no HTML de referência.
          campo("Nome", texto(curso.nome_manual) ?? texto(curso.nome)),
          campo("Grau", texto(curso.grau)),
          campo("Carga horária", formatarCargaHoraria(curso.carga_horaria)),
        ],
      },
      {
        id: "datas",
        titulo: "Datas",
        campos: [
          campo("Início", formatarDataCivil(datas.inicio)),
          campo("Conclusão", formatarDataCivil(datas.conclusao)),
          campo("Expedição", formatarDataCivil(datas.emissao)),
        ],
      },
      {
        id: "registro",
        titulo: "Registro acadêmico",
        campos: [
          campo("Livro", texto(registro.livro)),
          campo("Folha", texto(registro.folha)),
          campo("Nº de registro", texto(registro.numero)),
          campo("Data do registro", formatarDataCivil(registro.data)),
          campo("IES expedidora", texto(registro.ies_expedidora)),
          campo("Código e-MEC (expedidora)", texto(registro.codigo_emec_expedidora)),
          campo("IES registradora", texto(registro.ies_registradora)),
          campo("Código e-MEC (registradora)", texto(registro.codigo_emec_registradora)),
        ],
      },
    ],
    qrCode: qrCodeSeguro(dados.qr_code),
  };
}
