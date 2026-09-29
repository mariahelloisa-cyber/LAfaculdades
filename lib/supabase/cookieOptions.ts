/* Cookie da sessão só trafega em HTTPS. Em `next dev` (http://localhost) fica
   de fora — o navegador descartaria o cookie. O resto (SameSite=Lax, sem
   HttpOnly) é o padrão do @supabase/ssr: o upload do painel lê a sessão no
   navegador (UploadField). */
export const cookieOptions = { secure: process.env.NODE_ENV === "production" };
