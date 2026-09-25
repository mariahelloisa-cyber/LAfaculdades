-- Alinha a carga horária dos 9 cursos que divergiam da lista oficial
-- (PDF "cargas horarias"). O PDF é tratado como fonte correta.
-- Atualiza duracao e carga_horaria, e também o texto de resumo/descrição,
-- que trazem a carga horária escrita por extenso.
-- Rode no SQL Editor do Supabase.

begin;

-- Antes de rodar, confira o estado atual:
-- select slug, nome, duracao, carga_horaria from courses
--  where slug in (select slug from (values ...) as v(slug));

with novas as (
  select * from (values
    ('fisioterapia-aplicada-as-atividades-fisicas',          '420h', '480h'),
    ('mba-em-gestao-de-negocios-imobiliarios',               '510h', '400h'),
    ('mba-em-gestao-de-pessoas-e-lideranca',                 '570h', '360h'),
    ('neuroeducacao',                                        '390h', '360h'),
    ('orientacao-educacional',                               '360h', '450h'),
    ('psicopedagogia-escolar',                               '390h', '360h'),
    ('seguranca-da-informacao',                              '570h', '540h'),
    ('supervisao-e-orientacao-escolar',                      '390h', '360h'),
    ('supervisao-orientacao-e-inspecao-escolar',             '360h', '480h')
  ) as v(slug, antiga, nova)
)
update courses c
   set duracao       = n.nova,
       carga_horaria = n.nova,
       resumo        = replace(c.resumo,    n.antiga, n.nova),
       descricao     = replace(c.descricao, n.antiga, n.nova)
  from novas n
 where c.slug = n.slug;

-- Deve retornar 9 linhas, cada uma com a carga nova:
-- select slug, nome, duracao, carga_horaria from courses
--  where slug in ('fisioterapia-aplicada-as-atividades-fisicas',
--    'mba-em-gestao-de-negocios-imobiliarios','mba-em-gestao-de-pessoas-e-lideranca',
--    'neuroeducacao','orientacao-educacional','psicopedagogia-escolar',
--    'seguranca-da-informacao','supervisao-e-orientacao-escolar',
--    'supervisao-orientacao-e-inspecao-escolar');

commit;
