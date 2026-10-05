-- ============================================================
-- Verificação de segurança — SOMENTE LEITURA.
-- Não altera nada e não mostra segredos (nem o hash da chave).
-- Rode no SQL Editor do Supabase e confira a coluna "ok".
-- Linhas com ok = 'REVISAR' pedem olhar humano, não são erro por si.
-- ============================================================

with checks(ordem, verificacao, resultado, esperado) as (
  -- Tabela matriculas: só a função grava
  select 1, 'anon tem INSERT em matriculas (tabela ou coluna)',
    has_any_column_privilege('anon', 'public.matriculas', 'INSERT')::text, 'false'
  union all select 2, 'authenticated tem INSERT em matriculas (tabela ou coluna)',
    has_any_column_privilege('authenticated', 'public.matriculas', 'INSERT')::text, 'false'
  union all select 3, 'anon tem SELECT/UPDATE/DELETE em matriculas',
    (has_any_column_privilege('anon', 'public.matriculas', 'SELECT')
      or has_any_column_privilege('anon', 'public.matriculas', 'UPDATE')
      or has_table_privilege('anon', 'public.matriculas', 'DELETE'))::text, 'false'
  union all select 4, 'policies em matriculas',
    coalesce((select string_agg(format('%s [%s → %s]', policyname, cmd, array_to_string(roles, ',')), '; ' order by policyname)
              from pg_policies where schemaname = 'public' and tablename = 'matriculas'), '(nenhuma)'),
    'só "Admin read/update/delete matriculas", todas para authenticated'

  -- Função registrar_matricula
  union all select 5, 'anon pode executar registrar_matricula',
    has_function_privilege('anon', 'public.registrar_matricula(text,text,date,text,text,text,text,text,text,text)', 'EXECUTE')::text, 'true'
  union all select 6, 'authenticated pode executar registrar_matricula',
    has_function_privilege('authenticated', 'public.registrar_matricula(text,text,date,text,text,text,text,text,text,text)', 'EXECUTE')::text, 'false'
  union all select 7, 'registrar_matricula: security definer + search_path fixo',
    (select format('secdef=%s config=%s', prosecdef, proconfig) from pg_proc
      where oid = 'public.registrar_matricula(text,text,date,text,text,text,text,text,text,text)'::regprocedure),
    'secdef=t config={"search_path=\"\""}'
  union all select 8, 'versões de registrar_matricula (sobrecargas)',
    (select count(*)::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'registrar_matricula'), '1'

  -- Schema privado
  union all select 9, 'anon/authenticated usam o schema privado',
    (has_schema_privilege('anon', 'privado', 'USAGE') or has_schema_privilege('authenticated', 'privado', 'USAGE'))::text, 'false'
  union all select 10, 'chaves cadastradas (só nome e data)',
    coalesce((select string_agg(format('%s em %s', nome, to_char(criada_em, 'YYYY-MM-DD HH24:MI')), '; ') from privado.chaves_servidor), '(nenhuma)'),
    '1 chave "matriculas"'

  -- Objetos fora do schema.sql
  union all select 11, 'tabelas em public SEM RLS',
    coalesce((select string_agg(c.relname, ', ') from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity), '(nenhuma)'), '(nenhuma)'
  union all select 12, 'views em public (podem ignorar RLS)',
    coalesce((select string_agg(format('%s%s', c.relname, case when c.reloptions::text ilike '%security_invoker=true%' then ' (invoker)' else '' end), ', ')
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind in ('v', 'm')), '(nenhuma)'), '(nenhuma)'
  union all select 13, 'funções SECURITY DEFINER em public executáveis por anon',
    coalesce((select string_agg(p.proname, ', ' order by p.proname) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prosecdef and has_function_privilege('anon', p.oid, 'EXECUTE')), '(nenhuma)'),
    'is_admin, registrar_matricula'
  union all select 14, 'funções SECURITY DEFINER em public sem search_path fixo',
    coalesce((select string_agg(p.proname, ', ') from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.prosecdef and not coalesce(array_to_string(p.proconfig, ',') ilike '%search_path=%', false)), '(nenhuma)'),
    '(nenhuma)'

  -- Storage
  union all select 15, 'bucket media (public / tipos / tamanho)',
    (select format('public=%s mime=%s limite=%s', public, allowed_mime_types, file_size_limit) from storage.buckets where id = 'media'),
    'public=t, só tipos de imagem/vídeo, limite preenchido'
  union all select 16, 'policies em storage.objects',
    coalesce((select string_agg(format('%s [%s]', policyname, cmd), '; ' order by policyname)
              from pg_policies where schemaname = 'storage' and tablename = 'objects'), '(nenhuma)'),
    'só "Admin ... media bucket"'

  -- Contas
  union all select 17, 'admins (e-mail · último login)',
    coalesce((select string_agg(format('%s · %s', u.email, coalesce(to_char(u.last_sign_in_at, 'YYYY-MM-DD'), 'nunca')), '; ')
      from public.admins a join auth.users u on u.id = a.user_id), '(nenhum)'),
    'só contas que você reconhece'
  union all select 18, 'contas em auth.users que NÃO são admin',
    coalesce((select string_agg(u.email, ', ') from auth.users u where not exists (select 1 from public.admins a where a.user_id = u.id)), '(nenhuma)'),
    '(nenhuma) — ou contas que você reconhece'
  union all select 19, 'admins com MFA (TOTP) verificado',
    (select format('%s de %s', count(distinct f.user_id), (select count(*) from public.admins))
      from auth.mfa_factors f join public.admins a on a.user_id = f.user_id where f.status = 'verified'),
    'todos'

  -- Rastro dos testes da auditoria
  union all select 20, 'matrículas "TESTE AUDITORIA" gravadas',
    (select count(*)::text from public.matriculas where nome_completo ilike 'TESTE AUDITORIA%'), '0'

  -- Segundo fator (supabase/seguranca-v09-mfa.sql)
  union all select 21, 'policies que liberam admin SEM exigir MFA (is_admin)',
    coalesce((select string_agg(format('%s.%s', tablename, policyname), ', ' order by tablename, policyname)
      from pg_policies where schemaname in ('public', 'storage')
        and (coalesce(qual, '') ilike '%is_admin()%' or coalesce(with_check, '') ilike '%is_admin()%')), '(nenhuma)'),
    '(nenhuma)'
)
select ordem, verificacao, resultado, esperado,
  case
    when esperado in ('true', 'false', '0', '1', '(nenhuma)') then case when resultado = esperado then 'ok' else 'FALHOU' end
    else 'REVISAR'
  end as ok
from checks
order by ordem;
