import type { NextConfig } from "next";
import path from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const SUPABASE_HOST = "nfklgwtncdaoembrmiar.supabase.co";

/* A site key do Turnstile entra no JavaScript do navegador na hora do build.
   Sem ela, os formulários e o login ficariam travados em "Verificando..." —
   melhor o build falhar do que publicar o site assim. */
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
  throw new Error(
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY não definida. Coloque a site key (pública) do widget Turnstile no .env.local antes do build."
  );
}
const isDev = process.env.NODE_ENV === "development";
// Turnstile: script e iframe do desafio (formulários públicos e login do painel).
const TURNSTILE = "https://challenges.cloudflare.com";
/* API de certificados do SULA (página /validar). Quem a consulta é o Worker,
   por isso ela NÃO entra no connect-src: o navegador nunca fala com ela
   direto. Da resposta, só a imagem do QR Code vira elemento da página — daí
   a liberação no img-src. */
const SULA = "https://admin.laeducacao.com.br";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${TURNSTILE}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${SUPABASE_HOST} ${SULA}`,
  `media-src 'self' blob: https://${SUPABASE_HOST}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST}${isDev ? " ws: http://localhost:*" : ""}`,
  // Mapa do Google na página /contato e o desafio do Turnstile.
  `frame-src https://www.google.com ${TURNSTILE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  devIndicators: false,
  poweredByHeader: false,
  images: {
        qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /* URLs do site antigo (WordPress/WooCommerce) que ainda aparecem no Google.
     permanent: true = 308. Com barra final, o Next primeiro tira a barra
     (308) e depois aplica a regra abaixo. As categorias caem no catálogo já
     filtrado pela formação (?formacao=<slug do nível>, lido pelo
     CourseCatalog). Extensão universitária não existe mais: responde 410 em
     app/categoria-produto/extensao-universitaria/route.ts. */
  async redirects() {
    return [
      { source: "/sobre-nos", destination: "/institucional", permanent: true },
      {
        source: "/categoria-produto/graduacao",
        destination: "/cursos?formacao=graduacao",
        permanent: true,
      },
      {
        source: "/categoria-produto/pos-graduacao",
        destination: "/cursos?formacao=pos-graduacao",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
