
create extension if not exists pgcrypto;

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
-- Só usuários autenticados (login do admin) podem criar/editar/apagar.
create policy "Authenticated manage blog_posts" on blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Migração dos posts que já existiam em lib/data/posts.ts.
insert into blog_posts (slug, titulo, categoria, resumo, conteudo, data) values
(
  'como-usar-a-nota-do-enem-em-2026',
  'Como usar a nota do ENEM para entrar na faculdade em 2026',
  'Educação',
  'Já fez o ENEM em algum ano anterior? Veja como usar a sua nota para ingressar direto, sem precisar fazer vestibular.',
  ARRAY[
    'Se você já fez o ENEM em qualquer edição anterior, pode usar a sua nota para ingressar em um curso de graduação sem precisar fazer uma nova prova.',
    'Na LA Faculdade, o processo é simples: você informa o número de inscrição do ENEM, escolhe o curso desejado e a equipe de matrículas confirma o seu ingresso.',
    'Não existe nota mínima fixa — a nota é usada como critério de ingresso simplificado, e não como corte eliminatório.'
  ],
  '2026-02-10'
),
(
  'como-funciona-o-vestibular-online',
  'Vestibular online: como funciona e como se preparar',
  'Dicas de Estudo',
  'Entenda como funciona o vestibular próprio da LA Faculdade, quanto tempo leva e o que estudar antes de fazer a prova.',
  ARRAY[
    'O vestibular da LA Faculdade pode ser feito totalmente online, no seu tempo, sem precisar se deslocar até um polo.',
    'A prova é composta por questões de interpretação de texto, redação e conhecimentos gerais, com foco em avaliar o potencial do candidato e não decorar conteúdo.',
    'Você recebe o resultado em poucos dias úteis e, sendo aprovado, já pode iniciar o processo de matrícula.'
  ],
  '2026-01-22'
),
(
  'como-funciona-o-la-bank',
  'LA Bank: como funciona o financiamento estudantil da LA Faculdade',
  'Carreira',
  'Conheça o LA Bank, o programa de financiamento próprio da instituição, sem burocracia de banco e sem fiador.',
  ARRAY[
    'O LA Bank é o financiamento estudantil oferecido pela própria LA Faculdade, pensado para quem quer estudar sem esperar aprovação de banco.',
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
create policy "Authenticated manage course_niveis" on course_niveis
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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
create policy "Authenticated manage courses" on courses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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
create policy "Authenticated manage site_media" on site_media
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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

drop policy if exists "Public read media bucket" on storage.objects;
create policy "Public read media bucket" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Authenticated upload media bucket" on storage.objects;
create policy "Authenticated upload media bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "Authenticated update media bucket" on storage.objects;
create policy "Authenticated update media bucket" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "Authenticated delete media bucket" on storage.objects;
create policy "Authenticated delete media bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

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

alter table matriculas enable row level security;

-- O formulário é público: o visitante (anon) só pode inserir. Ler, editar e
-- apagar fica restrito a quem está logado no painel.
grant insert on matriculas to anon, authenticated;
grant select, update, delete on matriculas to authenticated;

drop policy if exists "Public insert matriculas" on matriculas;
create policy "Public insert matriculas" on matriculas
  for insert with check (true);

drop policy if exists "Authenticated read matriculas" on matriculas;
create policy "Authenticated read matriculas" on matriculas
  for select using (auth.role() = 'authenticated');

drop policy if exists "Authenticated manage matriculas" on matriculas;
create policy "Authenticated manage matriculas" on matriculas
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated delete matriculas" on matriculas;
create policy "Authenticated delete matriculas" on matriculas
  for delete using (auth.role() = 'authenticated');

-- Forma de ingresso escolhida pelo candidato (matrícula direta, vestibular
-- ou nota do ENEM) — o mesmo formulário atende as três portas de entrada.
alter table matriculas add column if not exists forma_ingresso text not null default 'Matrícula direta';
