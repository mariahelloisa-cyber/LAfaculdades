-- ============================================================
-- V-07 — parte 1 de 2: entrada protegida das matrículas
-- Rodar ANTES de publicar o site novo. Só ACRESCENTA: o site que está no ar
-- continua gravando do jeito antigo até a parte 2.
--
-- Depois desta parte: rode supabase/seguranca-v07-chave.sql uma vez para
-- gerar a chave de gravação.
-- ============================================================

begin;

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

commit;
