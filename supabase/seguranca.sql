

begin;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

do $$
declare
  emails_admin text[] := array['adminlafacul@gmail.com'];
begin
  insert into public.admins (user_id)
  select id from auth.users
  where lower(email) = any (select lower(e) from unnest(emails_admin) as e)
  on conflict (user_id) do nothing;

  if not exists (select 1 from public.admins) then
    raise exception 'Nenhum admin encontrado. Edite emails_admin em supabase/seguranca.sql com um e-mail que exista em auth.users.';
  end if;
end $$;

-- ---------- Conteúdo do site: leitura pública, escrita só de admin ----------

drop policy if exists "Authenticated manage blog_posts" on blog_posts;
drop policy if exists "Admin manage blog_posts" on blog_posts;
create policy "Admin manage blog_posts" on blog_posts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Authenticated manage course_niveis" on course_niveis;
drop policy if exists "Admin manage course_niveis" on course_niveis;
create policy "Admin manage course_niveis" on course_niveis
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Authenticated manage courses" on courses;
drop policy if exists "Admin manage courses" on courses;
create policy "Admin manage courses" on courses
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Authenticated manage site_media" on site_media;
drop policy if exists "Admin manage site_media" on site_media;
create policy "Admin manage site_media" on site_media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------- Storage (bucket "media") ----------

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/quicktime'
]
where id = 'media';

drop policy if exists "Public read media bucket" on storage.objects;
drop policy if exists "Admin read media bucket" on storage.objects;
create policy "Admin read media bucket" on storage.objects
  for select to authenticated using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Authenticated upload media bucket" on storage.objects;
drop policy if exists "Admin upload media bucket" on storage.objects;
create policy "Admin upload media bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Authenticated update media bucket" on storage.objects;
drop policy if exists "Admin update media bucket" on storage.objects;
create policy "Admin update media bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Authenticated delete media bucket" on storage.objects;
drop policy if exists "Admin delete media bucket" on storage.objects;
create policy "Admin delete media bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select public.is_admin()));

-- ---------- Matrículas ----------
-- Na auditoria de 29/09/2026 esta tabela não existia no banco de produção
-- (a API respondia "Could not find the table 'public.matriculas'"), então os
-- formulários de matrícula e vestibular estavam falhando. Aqui ela é criada
-- já com as proteções.

create table if not exists matriculas (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  data_nascimento date not null,
  cpf text not null,
  email text not null,
  telefone text not null,
  curso_slug text not null default '',
  curso_nome text not null,
  status text not null default 'novo' check (status in ('novo', 'em_contato', 'matriculado', 'descartado')),
  observacoes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists matriculas_created_at_idx on matriculas (created_at desc);

alter table matriculas add column if not exists forma_ingresso text not null default 'Matrícula direta';
alter table matriculas add column if not exists modalidade text not null default '';
alter table matriculas add column if not exists polo text not null default '';
alter table matriculas add column if not exists tipo_ingresso text not null default '';

alter table matriculas drop constraint if exists matriculas_campos_validos;
alter table matriculas add constraint matriculas_campos_validos check (
  char_length(nome_completo) between 3 and 200
  and cpf ~ '^[0-9]{11}$'
  and char_length(email) <= 254
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and telefone ~ '^[0-9]{10,11}$'
  and char_length(curso_nome) between 1 and 200
  and char_length(curso_slug) <= 200
  and forma_ingresso in ('Matrícula direta', 'Vestibular', 'Nota do ENEM')
  and char_length(modalidade) <= 100
  and char_length(polo) <= 100
  and char_length(tipo_ingresso) <= 100
  and char_length(observacoes) <= 5000
  and data_nascimento >= date '1900-01-01'
);

alter table matriculas enable row level security;

/* Sem INSERT direto pela API (V-07): a gravação é só pela função
   registrar_matricula (supabase/seguranca-v07-parte1.sql), que exige a chave
   do servidor. Uma versão antiga deste arquivo devolvia o INSERT ao anon e
   recriava "Public insert matriculas" — rodá-la de novo desfazia a V-07. */
revoke all on matriculas from anon, authenticated;
grant select, delete on matriculas to authenticated;
grant update (status, observacoes, updated_at) on matriculas to authenticated;

drop policy if exists "Public insert matriculas" on matriculas;

drop policy if exists "Authenticated read matriculas" on matriculas;
drop policy if exists "Admin read matriculas" on matriculas;
create policy "Admin read matriculas" on matriculas
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Authenticated manage matriculas" on matriculas;
drop policy if exists "Admin update matriculas" on matriculas;
create policy "Admin update matriculas" on matriculas
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Authenticated delete matriculas" on matriculas;
drop policy if exists "Admin delete matriculas" on matriculas;
create policy "Admin delete matriculas" on matriculas
  for delete to authenticated using ((select public.is_admin()));

commit;

-- Conferência (rode depois; deve listar só as contas do painel):
--   select u.email from public.admins a join auth.users u on u.id = a.user_id;
