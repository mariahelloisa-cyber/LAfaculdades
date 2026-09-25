-- Remove os 40 cursos de pós-graduação que não constam na lista oficial de
-- cargas horárias. Rode no SQL Editor do Supabase.

begin;

-- Confira antes de apagar: deve retornar 40 linhas.
-- select slug, nome from courses where slug in (...);

delete from courses
where slug in (
  -- MBAs (34)
  'mba-em-administracao-financeira-e-orcamentaria',
  'mba-em-arbitragem-conciliacao-e-mediacao',
  'mba-em-assessoria-de-comunicacao',
  'mba-em-coaching',
  'mba-em-compliance-e-gestao-de-riscos',
  'mba-em-comunicacao-eleitoral-e-marketing-politico',
  'mba-em-contabilidade-gerencial',
  'mba-em-controladoria-e-financas',
  'mba-em-e-commerce',
  'mba-em-educacao-financeira',
  'mba-em-gestao-ambiental-e-sustentavel',
  'mba-em-gestao-comercial-e-vendas',
  'mba-em-gestao-de-clinicas-e-consultorios-veterinarios',
  'mba-em-gestao-de-custo-e-financas',
  'mba-em-gestao-de-departamento-pessoal-e-relacoes-trabalhistas',
  'mba-em-gestao-de-drogaria-e-farmacia',
  'mba-em-gestao-de-eventos',
  'mba-em-gestao-de-marketing-digital',
  'mba-em-gestao-de-obras-qualidade-e-desempenho-das-construcoes',
  'mba-em-gestao-de-processos',
  'mba-em-gestao-de-projetos',
  'mba-em-gestao-de-seguros-e-previdencia-privada',
  'mba-em-gestao-de-supply-chain',
  'mba-em-gestao-estrategica-de-cooperativas',
  'mba-em-gestao-estrategica-em-compras',
  'mba-em-gestao-financeira-e-controladoria',
  'mba-em-gestao-fiscal-e-tributaria',
  'mba-em-gestao-da-saude-publica',
  'mba-em-jornalismo-digital',
  'mba-em-marketing-de-varejo-gestao-estrategias-e-negocios',
  'mba-em-marketing-digital-e-comunicacao-online',
  'mba-em-negocios-internacionais-e-comercio-exterior',
  'mba-em-planejamento-e-gestao-no-transito',
  'mba-em-startups-e-inovacao',

  -- Demais cursos (6)
  'avaliacao-psicologica-e-psicodiagnostico',
  'enfermagem-oncologica',
  'ensino-da-literatura-africana-e-indigena',
  'estatistica-aplicada',
  'metodologia-do-ensino-linguistico',
  'pericia-e-auditoria-contabil'
);

commit;
