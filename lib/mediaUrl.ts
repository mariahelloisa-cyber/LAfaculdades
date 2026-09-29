export const MIDIA_INVALIDA = "Arquivo de mídia inválido. Envie o arquivo pelo campo de upload.";

/** URLs de mídia que o painel aceita gravar: vazio, um arquivo do próprio site
 *  (/images/...) ou um arquivo enviado ao bucket "media" do Supabase.
 *
 *  O UploadField só produz esses formatos, mas o campo chega pelo formulário
 *  e pode ser trocado por qualquer texto. Um host externo quebraria a página
 *  (o next/image só aceita o host do Supabase) e serviria conteúdo de
 *  terceiros no site. */
export function midiaValida(
  url: string,
  supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL
): boolean {
  if (url === "") return true;
  if (url.length > 2048 || /[\s"'<>\\]/.test(url)) return false;
  if (/^\/images\/[\w./-]+$/.test(url) && !url.includes("..")) return true;
  if (!supabaseUrl) return false;
  const prefixo = `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/media/`;
  return url.startsWith(prefixo) && !url.includes("..") && url.length > prefixo.length;
}
