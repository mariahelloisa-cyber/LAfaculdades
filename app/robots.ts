import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/* /robots.txt. Libera todo o site público e aponta o sitemap; só o painel
   (/admin/*, inclusive o login) fica de fora. "/admin/" com a barra: sem ela
   o bloqueio pegaria por prefixo uma categoria como /administracao/... O
   /admin puro só redireciona para /admin/login. Se o "robots.txt gerenciado" da
   Cloudflare estiver ligado, ela acrescenta os sinais de conteúdo dela antes
   destas linhas — não conflita. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
