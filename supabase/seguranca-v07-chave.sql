-- ============================================================
-- V-07 — chave de gravação das matrículas
-- Gera uma chave aleatória de 256 bits, grava SÓ o hash no banco e mostra a
-- chave uma única vez no resultado da consulta.
--
-- Copie o valor da coluna copie_para_o_cloudflare e cadastre como secret do
-- Worker, no terminal do projeto (o comando pede o valor, sem ecoar):
--   npx wrangler secret put CHAVE_GRAVACAO_MATRICULAS
-- Não salve a chave em arquivo, chat ou Git.
--
-- Rodar de novo troca a chave: a antiga para de funcionar na hora e os
-- formulários falham até o secret do Worker ser atualizado. Para trocar sem
-- interrupção, rode este arquivo e faça o `secret put` logo em seguida.
-- ============================================================

with nova as (
  select encode(extensions.gen_random_bytes(32), 'hex') as chave
),
gravada as (
  insert into privado.chaves_servidor (nome, hash)
  select 'matriculas', sha256(convert_to(chave, 'UTF8')) from nova
  on conflict (nome) do update set hash = excluded.hash, criada_em = now()
  returning 1
)
select chave as copie_para_o_cloudflare from nova, gravada;
