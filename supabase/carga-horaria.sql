-- Carga horária do curso.
-- Rode este arquivo no SQL Editor do Supabase ANTES de publicar o site: sem a
-- coluna, a tela de edição de curso no admin não abre.

-- 1) A coluna. Segura de rodar mais de uma vez.
alter table courses add column if not exists carga_horaria text not null default '';

-- 2) (Opcional) Preenche as pós-graduações já cadastradas.
--    Nelas a "duração" foi cadastrada como carga horária mesmo ("570h", "420h"),
--    então o valor é copiado para o campo novo. Cursos cuja duração está em
--    semestres ("4 semestres") não são tocados — esses ficam para preencher no
--    admin, um a um.
update courses
   set carga_horaria = duracao
 where carga_horaria = ''
   and duracao ~ '^[0-9]+\s*h$';

-- Confere o resultado:
-- select nome, duracao, carga_horaria from courses order by carga_horaria desc;
