import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

/* Sem estes overrides o OpenNext usa "dummy" em tudo: o cache nunca guarda
   nada e o Worker re-renderiza cada página do zero a cada visita — SSR
   completo mais as consultas ao Supabase. Era o que derrubava o site com
   "Error 1102 — Worker exceeded resource limits".

   - incrementalCache: HTML pré-renderizado no KV. (Era R2, mas o R2 exige
     cartão cadastrado na conta Cloudflare; o KV entra no plano gratuito do
     Workers e cumpre o mesmo papel.)
   - tagCache: registro de revalidações no D1, para o revalidatePath() das
     ações do admin invalidar de verdade o que está em cache.
   - queue: regenera a página vencida em segundo plano, num Durable Object,
     para o visitante receber a versão em cache na hora. */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
