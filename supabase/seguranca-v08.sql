-- ============================================================
-- V-08 — ajustes apontados pela verificacao-v07.sql (05/10/2026)
-- Rodar uma vez no SQL Editor do Supabase. Pode rodar de novo sem efeito.
-- ============================================================

begin;

-- ---------- Linha 13: rls_auto_enable executável por anon ----------
-- Não vem deste repositório: é a função que o Supabase cria para a opção de
-- ligar RLS automaticamente em tabelas novas, disparada por event trigger.
-- O event trigger não depende de EXECUTE para rodar, então tirar o EXECUTE
-- de anon/authenticated não muda o comportamento — só fecha a porta.
-- Se a função NÃO for de event trigger, nada é alterado e o script para,
-- pedindo revisão manual.
do $$
declare
  f regprocedure;
begin
  for f in
    select p.oid::regprocedure
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  loop
    if (select prorettype from pg_proc where oid = f) <> 'event_trigger'::regtype then
      raise exception 'public.% não é função de event trigger — revise antes de mexer.', f;
    end if;
    execute format('revoke execute on function %s from public, anon, authenticated', f);
  end loop;
end $$;

-- ---------- Linha 15: bucket media sem limite de tamanho ----------
-- O painel orienta vídeo de até ~10 MB; 50 MB deixa folga para foto de
-- celular e vídeo curto sem permitir arquivo gigante (custo de storage e
-- banda, e vídeo pesado na home).
update storage.buckets
set file_size_limit = 52428800  -- 50 MB
where id = 'media';

commit;

-- Depois, rode supabase/verificacao-v07.sql de novo:
--   linha 13 deve mostrar só "is_admin, registrar_matricula"
--   linha 15 deve mostrar limite=52428800
