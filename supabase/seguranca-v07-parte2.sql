-- ============================================================
-- V-07 — parte 2 de 2: fecha o INSERT público em matriculas
-- Rodar SÓ DEPOIS de publicar o site novo e confirmar que um envio de
-- matrícula de verdade aparece no painel. A partir daqui a única forma de
-- gravar é public.registrar_matricula (com a chave do servidor).
--
-- Para desfazer (volta ao estado anterior, com INSERT público):
--   grant insert (nome_completo, data_nascimento, cpf, email, telefone, curso_slug,
--     curso_nome, forma_ingresso, modalidade, polo, tipo_ingresso)
--     on matriculas to anon, authenticated;
--   create policy "Public insert matriculas" on matriculas
--     for insert to anon, authenticated with check (status = 'novo' and observacoes = '');
-- ============================================================

begin;

drop policy if exists "Public insert matriculas" on matriculas;
revoke insert on matriculas from anon, authenticated;

commit;

-- Conferência: deve voltar false nas duas linhas.
--   select has_table_privilege('anon', 'public.matriculas', 'INSERT'),
--          has_table_privilege('authenticated', 'public.matriculas', 'INSERT');
-- has_table_privilege só olha o grant da tabela inteira; para as colunas:
--   select grantee, column_name from information_schema.column_privileges
--   where table_name = 'matriculas' and privilege_type = 'INSERT'
--     and grantee in ('anon', 'authenticated');   -- deve voltar vazio
