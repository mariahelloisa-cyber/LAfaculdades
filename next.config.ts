import type { NextConfig } from "next";
import path from "path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const SUPABASE_HOST = "nfklgwtncdaoembrmiar.supabase.co";
const isDev = process.env.NODE_ENV === "development";

/* CSP: o Next injeta scripts inline na hidratação, e as páginas são estáticas
   (ISR) — nonce exigiria renderizar tudo por requisição. Por isso
   'unsafe-inline' em script-src; o ganho aqui está no resto: nada de
   <object>, <base> trocado, formulário postando para fora, o site dentro de
   iframe alheio ou fetch para domínio que não seja o Supabase.
   Em dev o React/HMR precisa de eval e websocket. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${SUPABASE_HOST}`,
  `media-src 'self' blob: https://${SUPABASE_HOST}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST}${isDev ? " ws: http://localhost:*" : ""}`,
  // Mapa do Google na página /contato.
  "frame-src https://www.google.com",
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
    /* No Next 16 o padrão passou a ser apenas [75]; qualquer outro valor de
       `quality` seria arredondado para 75. 95 libera a arte da seção "Por que a LA?". */
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
};

export default nextConfig;

// Habilita o acesso a bindings do Cloudflare (env vars, KV, R2, etc.) durante
// `next dev`, usando a mesma wrangler.jsonc do build/deploy.
initOpenNextCloudflareForDev();
