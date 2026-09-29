
create extension if not exists pgcrypto;

-- ============================================================
-- Administradores do painel
-- Estar logado NÃO basta: o Supabase Auth aceita cadastro público
-- (/auth/v1/signup) com a chave anon, que é pública. Toda escrita e toda
-- leitura de dados pessoais exige que o usuário esteja nesta tabela.
-- Ela não é exposta pela API (sem grants); gerencie pelo SQL Editor:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'admin@exemplo.com';
-- ============================================================

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

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  categoria text not null,
  resumo text not null,
  conteudo text[] not null default '{}',
  imagem_url text not null default '',
  data date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Imagem da notícia (para bancos criados antes desse campo existir).
alter table blog_posts add column if not exists imagem_url text not null default '';

alter table blog_posts enable row level security;

grant select on blog_posts to anon, authenticated;
grant insert, update, delete on blog_posts to authenticated;

drop policy if exists "Public read blog_posts" on blog_posts;
-- Qualquer visitante pode ler os posts (site público).
create policy "Public read blog_posts" on blog_posts
  for select using (true);

drop policy if exists "Authenticated manage blog_posts" on blog_posts;
drop policy if exists "Admin manage blog_posts" on blog_posts;
-- Só administradores (tabela admins) podem criar/editar/apagar.
create policy "Admin manage blog_posts" on blog_posts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Migração dos posts que já existiam em lib/data/posts.ts.
insert into blog_posts (slug, titulo, categoria, resumo, conteudo, data) values
(
  'como-usar-a-nota-do-enem-em-2026',
  'Como usar a nota do ENEM para entrar na faculdade em 2026',
  'Educação',
  'Já fez o ENEM em algum ano anterior? Veja como usar a sua nota para ingressar direto, sem precisar fazer vestibular.',
  ARRAY[
    'Se você já fez o ENEM em qualquer edição anterior, pode usar a sua nota para ingressar em um curso de graduação sem precisar fazer uma nova prova.',
    'Na LA Faculdades, o processo é simples: você informa o número de inscrição do ENEM, escolhe o curso desejado e a equipe de matrículas confirma o seu ingresso.',
    'Não existe nota mínima fixa — a nota é usada como critério de ingresso simplificado, e não como corte eliminatório.'
  ],
  '2026-02-10'
),
(
  'como-funciona-o-vestibular-online',
  'Vestibular online: como funciona e como se preparar',
  'Dicas de Estudo',
  'Entenda como funciona o vestibular próprio da LA Faculdades, quanto tempo leva e o que estudar antes de fazer a prova.',
  ARRAY[
    'O vestibular da LA Faculdades pode ser feito totalmente online, no seu tempo, sem precisar se deslocar até um polo.',
    'A prova é composta por questões de interpretação de texto, redação e conhecimentos gerais, com foco em avaliar o potencial do candidato e não decorar conteúdo.',
    'Você recebe o resultado em poucos dias úteis e, sendo aprovado, já pode iniciar o processo de matrícula.'
  ],
  '2026-01-22'
),
(
  'como-funciona-o-la-bank',
  'LA Bank: como funciona o financiamento estudantil da LA Faculdades',
  'Carreira',
  'Conheça o LA Bank, o programa de financiamento próprio da instituição, sem burocracia de banco e sem fiador.',
  ARRAY[
    'O LA Bank é o financiamento estudantil oferecido pela própria LA Faculdades, pensado para quem quer estudar sem esperar aprovação de banco.',
    'Não é necessário apresentar fiador, e a análise é feita no momento da matrícula.',
    'As condições variam por curso e podem ser combinadas com bolsas e descontos — fale com a equipe de matrículas para simular o seu caso.'
  ],
  '2026-01-05'
),
(
  '5-motivos-para-escolher-uma-graduacao-ead',
  '5 motivos para escolher uma graduação EAD',
  'Mercado de Trabalho',
  'Flexibilidade de horário, mensalidade mais acessível e diploma com o mesmo valor legal do presencial. Veja outras vantagens.',
  ARRAY[
    '1. Flexibilidade: você estuda no horário que encaixa na sua rotina, sem depender de deslocamento.',
    '2. Mensalidade mais acessível: cursos EAD costumam custar menos que a mesma formação presencial.',
    '3. Diploma com o mesmo valor legal: um curso reconhecido pelo MEC tem validade nacional, EAD ou presencial.',
    '4. Tutoria disponível: dúvidas são respondidas por professores e tutores durante o curso.',
    '5. Você pode conciliar com o trabalho: dá para estudar sem precisar parar de trabalhar.'
  ],
  '2025-12-18'
)
on conflict (slug) do nothing;

-- ============================================================
-- Cursos (graduação e pós-graduação)
-- ============================================================

-- "Nível" de curso — o cliente quer isso 100% editável: adicionar um nível
-- novo (ex.: "Cursos Técnicos"), editar ou excluir um existente. Cada nível
-- vira uma página de verdade no site em /{slug} (app/[nivel]/page.tsx),
-- com sua própria foto de hero, título e descrição.
create table if not exists course_niveis (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  titulo text not null,
  descricao text not null default '',
  imagem_url text not null default '',
  ordem int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table course_niveis enable row level security;

grant select on course_niveis to anon, authenticated;
grant insert, update, delete on course_niveis to authenticated;

drop policy if exists "Public read course_niveis" on course_niveis;
create policy "Public read course_niveis" on course_niveis
  for select using (true);

drop policy if exists "Authenticated manage course_niveis" on course_niveis;
drop policy if exists "Admin manage course_niveis" on course_niveis;
create policy "Admin manage course_niveis" on course_niveis
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ATENÇÃO: excluir ou renomear o slug de um nível muda a URL daquela
-- seção do site (ex.: /graduacao deixaria de existir) — afeta SEO e
-- links já compartilhados. Editar nome/título/descrição/foto é seguro.
insert into course_niveis (slug, nome, titulo, descricao, imagem_url, ordem) values
(
  'graduacao', 'Graduação',
  'Cursos de graduação com diploma reconhecido pelo MEC',
  'Bacharelado, licenciatura e tecnólogo em modalidade EAD e semipresencial, pensados para quem já tem uma rotina cheia.',
  '/images/art/administracao.svg', 1
),
(
  'pos-graduacao', 'Pós-Graduação',
  'Especialize-se sem parar sua rotina',
  'Pós-graduações EAD, com certificado reconhecido pelo MEC e conteúdo aplicado ao mercado.',
  '/images/art/pos.svg', 2
)
on conflict (slug) do nothing;

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  nivel_id uuid not null references course_niveis(id),
  area text not null,
  modalidade text not null,
  duracao text not null,
  mensalidade numeric(10,2) not null,
  mensalidade_de numeric(10,2) not null,
  capa_url text not null default '',
  resumo text not null,
  descricao text not null,
  destaques text[] not null default '{}',
  destaque_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Campos que saíram do formulário do admin (em bancos já criados antes):
-- "tipo" (Bacharelado/Licenciatura/...) e "modalidades" (selos do card,
-- redundantes com "modalidade").
alter table courses drop column if exists tipo;
alter table courses drop column if exists modalidades;

-- Carga horária total do curso ("570h"). Fica ao lado da duração: a duração diz
-- quanto tempo leva ("4 semestres") e a carga horária, quantas horas tem.
alter table courses add column if not exists carga_horaria text not null default '';

-- Conteúdo da página "Saiba mais" do curso. Todos opcionais: cada bloco só
-- aparece no site quando o curso tem conteúdo preenchido no admin.
alter table courses add column if not exists para_quem text[] not null default '{}';
alter table courses add column if not exists mercado text not null default '';
alter table courses add column if not exists atuacao text[] not null default '{}';
-- grade: [{ "titulo": "1º semestre", "disciplinas": ["...", "..."] }]
alter table courses add column if not exists grade jsonb not null default '[]'::jsonb;
-- faq: [{ "pergunta": "...", "resposta": "..." }]
alter table courses add column if not exists faq jsonb not null default '[]'::jsonb;

alter table courses enable row level security;

grant select on courses to anon, authenticated;
grant insert, update, delete on courses to authenticated;

drop policy if exists "Public read courses" on courses;
create policy "Public read courses" on courses
  for select using (true);

drop policy if exists "Authenticated manage courses" on courses;
drop policy if exists "Admin manage courses" on courses;
create policy "Admin manage courses" on courses
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Sem cursos de exemplo: os cursos reais da LA são cadastrados pelo admin
-- (/admin/cursos). Os 8 cursos de teste que existiam aqui foram removidos
-- para não voltarem ao banco se este arquivo for executado de novo.

-- ============================================================
-- Mídia do site (fotos de hero, vídeo da home) — tabela chave/valor,
-- fácil de estender com novos "slots" conforme o site crescer.
-- ============================================================

create table if not exists site_media (
  chave text primary key,
  url text not null default '',
  tipo text not null check (tipo in ('imagem', 'video')),
  updated_at timestamptz not null default now()
);

alter table site_media enable row level security;

grant select on site_media to anon, authenticated;
grant insert, update, delete on site_media to authenticated;

drop policy if exists "Public read site_media" on site_media;
create policy "Public read site_media" on site_media
  for select using (true);

drop policy if exists "Authenticated manage site_media" on site_media;
drop policy if exists "Admin manage site_media" on site_media;
create policy "Admin manage site_media" on site_media
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Valores padrão = o que já está no ar hoje, pra nada mudar visualmente
-- até o admin trocar por uma mídia de verdade. (As fotos de hero de
-- graduação/pós-graduação ficam na própria tabela course_niveis, já que
-- cada nível agora é editável.)
insert into site_media (chave, url, tipo) values
  ('blog_hero', '/images/blog.jpg', 'imagem'),
  ('home_hero_video', '', 'video'),
  -- Cards "Acompanhe" da página institucional.
  ('social_facebook', '', 'imagem'),
  ('social_instagram', '', 'imagem'),
  ('social_youtube', '', 'imagem'),
  ('social_reclameaqui', '', 'imagem'),
  ('social_google', '', 'imagem')
on conflict (chave) do nothing;

-- ============================================================
-- Storage: bucket público para as mídias enviadas pelo admin
-- (fotos de curso, fotos de hero, vídeo da home).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Só imagem e vídeo. Sem SVG nem HTML: servidos pelo domínio do Supabase,
-- eles executariam script no navegador de quem abrisse o link.
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/quicktime'
]
where id = 'media';

-- Sem policy de leitura pública: bucket público já entrega os arquivos pela
-- URL /object/public/...; a policy só servia para listar o bucket inteiro
-- pela API (qualquer visitante enumerava todos os arquivos).
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

-- ============================================================
-- Matrículas (leads do botão "Matricule-se")
-- O visitante preenche o formulário do site e os dados caem aqui, para a
-- equipe de matrículas entrar em contato pelo painel (/admin/matriculas).
-- ============================================================

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

-- Forma de ingresso escolhida pelo candidato (matrícula direta, vestibular
-- ou nota do ENEM) — o mesmo formulário atende as três portas de entrada.
alter table matriculas add column if not exists forma_ingresso text not null default 'Matrícula direta';

-- Inscrição do vestibular online (/vestibular): além da forma de ingresso,
-- o candidato informa modalidade, polo e tipo de ingresso. Ficam vazios nas
-- matrículas que chegam pelos outros formulários.
alter table matriculas add column if not exists modalidade text not null default '';
alter table matriculas add column if not exists polo text not null default '';
alter table matriculas add column if not exists tipo_ingresso text not null default '';

-- O INSERT vem direto da API pública (chave anon), não só do formulário do
-- site — então as mesmas regras do formulário valem aqui no banco, com
-- limite de tamanho para ninguém gravar megabytes num campo.
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

-- Ninguém insere direto pela API — nem anon nem usuário logado. O formulário
-- do site grava pela função registrar_matricula (abaixo), chamada pelo
-- servidor depois de validar os campos, o Turnstile e o limite por IP. Ler,
-- editar e apagar é só para administradores.
revoke all on matriculas from anon, authenticated;
grant select, delete on matriculas to authenticated;
grant update (status, observacoes, updated_at) on matriculas to authenticated;

drop policy if exists "Public insert matriculas" on matriculas;

-- Schema fora da API: o PostgREST só expõe "public" (e graphql_public).
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

-- Hash (SHA-256) das chaves que o servidor apresenta. A chave em si só
-- existe como secret do Worker.
create table if not exists privado.chaves_servidor (
  nome text primary key,
  hash bytea not null,
  criada_em timestamptz not null default now()
);
revoke all on privado.chaves_servidor from public, anon, authenticated;

create index if not exists matriculas_cpf_created_at_idx on public.matriculas (cpf, created_at desc);

-- Única porta de gravação das matrículas pela API. Exige a chave do servidor
-- (o Worker só chega aqui depois de validar os campos, o Turnstile e o limite
-- por IP) e limita a 3 envios por CPF por hora.
create or replace function public.registrar_matricula(
  p_chave text,
  p_nome_completo text,
  p_data_nascimento date,
  p_cpf text,
  p_email text,
  p_telefone text,
  p_curso_slug text,
  p_curso_nome text,
  p_forma_ingresso text,
  p_tipo_ingresso text default ''
)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_hash bytea;
begin
  select hash into v_hash from privado.chaves_servidor where nome = 'matriculas';
  -- Sem chave cadastrada, ninguém grava (falha fechada).
  if v_hash is null or p_chave is null
     or sha256(convert_to(p_chave, 'UTF8')) is distinct from v_hash then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  -- Serializa envios do mesmo CPF: sem isso, dois envios simultâneos
  -- passariam juntos pela contagem abaixo.
  perform pg_advisory_xact_lock(hashtextextended('matriculas:' || coalesce(p_cpf, ''), 0));

  if (
    select count(*) from public.matriculas
    where cpf = p_cpf and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'limite_cpf' using errcode = 'P0001';
  end if;

  -- status, observações, id e datas ficam sempre com o default.
  insert into public.matriculas (
    nome_completo, data_nascimento, cpf, email, telefone,
    curso_slug, curso_nome, forma_ingresso, tipo_ingresso
  ) values (
    p_nome_completo, p_data_nascimento, p_cpf, p_email, p_telefone,
    coalesce(p_curso_slug, ''), p_curso_nome, p_forma_ingresso, coalesce(p_tipo_ingresso, '')
  );
end;
$$;

revoke execute on function public.registrar_matricula(text, text, date, text, text, text, text, text, text, text)
  from public, anon, authenticated;
-- O Worker chama como anon (sem sessão); o que autoriza é a chave.
grant execute on function public.registrar_matricula(text, text, date, text, text, text, text, text, text, text)
  to anon;

-- A chave de gravação é gerada à parte (supabase/seguranca-v07-chave.sql) e
-- cadastrada como secret do Worker; sem ela, registrar_matricula recusa tudo.

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
