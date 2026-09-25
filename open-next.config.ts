import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

/* Sem estes overrides o OpenNext usa "dummy" em tudo: o cache nunca guarda
   nada e o Worker re-renderiza cada página do zero a cada visita — SSR
   completo mais as consultas ao Supabase. Era o que derrubava o site com
   "Error 1102 — Worker exceeded resource limits".

   - incrementalCache: HTML pré-renderizado no bucket R2.
   - tagCache: registro de revalidações no D1, para o revalidatePath() das
     ações do admin invalidar de verdade o que está em cache.
   - queue: regenera a página vencida em segundo plano, num Durable Object,
     para o visitante receber a versão em cache na hora. */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
