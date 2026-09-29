/* `npm test` — URLs de mídia aceitas pelas ações do painel. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { midiaValida } from "./mediaUrl.ts";

const SUPABASE = "https://nfklgwtncdaoembrmiar.supabase.co";
const valida = (url: string) => midiaValida(url, SUPABASE);

test("aceita vazio, arquivos do site e do bucket media", () => {
  assert.equal(valida(""), true);
  assert.equal(valida("/images/blog.jpg"), true);
  assert.equal(valida("/images/art/administracao.svg"), true);
  assert.equal(valida(`${SUPABASE}/storage/v1/object/public/media/cursos/6c9d70da-3aa6-4bac-8ced-c4d708635b5d.png`), true);
  assert.equal(valida(`${SUPABASE}/storage/v1/object/public/media/site/2d69f20d.mp4`), true);
});

test("recusa hosts externos, esquemas perigosos e caminhos fora do bucket", () => {
  for (const url of [
    "https://evil.example/x.png",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//evil.example/x.png",
    "/admin",
    "/images/../admin",
    `${SUPABASE}.evil.example/storage/v1/object/public/media/x.png`,
    `${SUPABASE}/storage/v1/object/public/outro-bucket/x.png`,
    `${SUPABASE}/storage/v1/object/public/media/`,
    `${SUPABASE}/storage/v1/object/public/media/../../x`,
    `${SUPABASE}/storage/v1/object/public/media/x.png" onerror="alert(1)`,
  ]) {
    assert.equal(valida(url), false, url);
  }
});

test("sem a URL do Supabase configurada, só aceita arquivos do site", () => {
  assert.equal(midiaValida("/images/blog.jpg", undefined), true);
  assert.equal(midiaValida(`${SUPABASE}/storage/v1/object/public/media/x.png`, undefined), false);
});
