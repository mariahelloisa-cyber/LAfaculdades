import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getCoursePaths } from "@/lib/data/courses";
import { getPostSlugs } from "@/lib/data/posts";

/* /sitemap.xml para o Google Search Console. Gerado no build e regenerado em
   segundo plano a cada hora, então cursos e posts novos entram sozinhos.
   Sem lastModified: o updated_at do banco não muda quando o curso ou post é
   editado, e uma data errada faz o Google ignorar o campo. */
export const revalidate = 3600;

// Páginas públicas fixas. Fora daqui: /admin (painel e login) e /graduacao,
// /pos-graduacao sozinhos, que não têm página (só /{nivel}/{curso}).
const PAGINAS = [
  "/",
  "/cursos",
  "/vestibular",
  "/vestibular/inscricao",
  "/matricula",
  "/matricula/inscricao",
  "/enem",
  "/financiamento-la-bank",
  "/teste-vocacional",
  "/blog",
  "/institucional",
  "/contato",
  "/validar",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cursos, posts] = await Promise.all([getCoursePaths(), getPostSlugs()]);

  const caminhos = [
    ...PAGINAS,
    ...cursos.map((c) => `/${c.nivel}/${c.slug}`),
    ...posts.map((slug) => `/blog/${slug}`),
  ];

  return [...new Set(caminhos)].map((caminho) => ({
    url: caminho === "/" ? SITE.url : `${SITE.url}${encodeURI(caminho)}`,
  }));
}
