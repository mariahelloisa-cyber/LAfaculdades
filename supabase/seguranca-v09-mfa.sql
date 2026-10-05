-- ============================================================
-- V-09 — painel só com segundo fator (TOTP)
--
-- ORDEM (senão o painel fica sem dados até o passo 2):
--   1. publicar o site novo (npm run deploy) — ele tem as telas /admin/mfa;
--   2. entrar no painel e ativar o app autenticador;
--   3. só então rodar este arquivo.
--
-- Depois disto, a sessão que só passou pela senha (aal1) não lê nem altera
-- nada: a RLS exige aal2. public.is_admin() continua só "está em admins" —
-- o site usa para decidir entre login e tela do código.
--
-- Perdeu o celular? Pelo SQL Editor, apague o autenticador e cadastre de novo
-- no próximo login:
--   delete from auth.mfa_factors
--   where user_id = (select id from auth.users where email = 'EMAIL_DO_ADMIN');
-- ============================================================

begin;

create or replace function public.admin_com_mfa()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.admin_com_mfa() from public, anon;
grant execute on function public.admin_com_mfa() to authenticated;

-- ---------- Conteúdo do site: leitura pública, escrita só admin + MFA ----------

drop policy if exists "Admin manage blog_posts" on blog_posts;
create policy "Admin manage blog_posts" on blog_posts
  for all to authenticated using ((select public.admin_com_mfa())) with check ((select public.admin_com_mfa()));

drop policy if exists "Admin manage course_niveis" on course_niveis;
create policy "Admin manage course_niveis" on course_niveis
  for all to authenticated using ((select public.admin_com_mfa())) with check ((select public.admin_com_mfa()));

drop policy if exists "Admin manage courses" on courses;
create policy "Admin manage courses" on courses
  for all to authenticated using ((select public.admin_com_mfa())) with check ((select public.admin_com_mfa()));

drop policy if exists "Admin manage site_media" on site_media;
create policy "Admin manage site_media" on site_media
  for all to authenticated using ((select public.admin_com_mfa())) with check ((select public.admin_com_mfa()));

-- ---------- Matrículas (dados pessoais) ----------

drop policy if exists "Admin read matriculas" on matriculas;
create policy "Admin read matriculas" on matriculas
  for select to authenticated using ((select public.admin_com_mfa()));

drop policy if exists "Admin update matriculas" on matriculas;
create policy "Admin update matriculas" on matriculas
  for update to authenticated using ((select public.admin_com_mfa())) with check ((select public.admin_com_mfa()));

drop policy if exists "Admin delete matriculas" on matriculas;
create policy "Admin delete matriculas" on matriculas
  for delete to authenticated using ((select public.admin_com_mfa()));

-- ---------- Storage (bucket "media") ----------

drop policy if exists "Admin read media bucket" on storage.objects;
create policy "Admin read media bucket" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select public.admin_com_mfa()));

drop policy if exists "Admin upload media bucket" on storage.objects;
create policy "Admin upload media bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.admin_com_mfa()));

drop policy if exists "Admin update media bucket" on storage.objects;
create policy "Admin update media bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.admin_com_mfa()))
  with check (bucket_id = 'media' and (select public.admin_com_mfa()));

drop policy if exists "Admin delete media bucket" on storage.objects;
create policy "Admin delete media bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.admin_com_mfa()));

commit;

-- Confira com supabase/verificacao-v07.sql: linha 21 deve dar "(nenhuma)".
