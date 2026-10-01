/* URL do site antigo. A categoria "Extensão universitária" não existe mais e
   não tem substituta, então responde 410 (removido de vez) para o Google tirar
   do índice, em vez de redirecionar para uma página que não é equivalente.
   force-dynamic: não é pré-renderizada, então não ocupa entrada no KV. */
export const dynamic = "force-dynamic";

const HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Página removida — LA Faculdades</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.5">
<h1>Esta página foi removida</h1>
<p>A LA Faculdades não oferece mais cursos de extensão universitária.</p>
<p><a href="/cursos">Ver todos os cursos</a></p>
</body>
</html>`;

export function GET() {
  return new Response(HTML, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
