"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import UploadField from "../UploadField";
import type { PostFormState } from "./actions";

const CATEGORIAS_SUGERIDAS = [
  "Carreira",
  "Educação",
  "Mercado de Trabalho",
  "Tecnologia",
  "Dicas de Estudo",
  "Histórias que Inspiram",
];

type PostFormValues = {
  titulo: string;
  slug: string;
  categoria: string;
  resumo: string;
  conteudo: string[];
  imagemUrl: string;
  data: string;
};

export default function PostForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;
  defaultValues?: PostFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const [uploading, setUploading] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="titulo" className="text-sm font-semibold text-navy-950">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          defaultValue={defaultValues?.titulo}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-semibold text-navy-950">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
        <p className="mt-1 text-xs text-muted">Vai virar: /blog/{slug || "..."}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="categoria" className="text-sm font-semibold text-navy-950">
            Categoria
          </label>
          <input
            id="categoria"
            name="categoria"
            list="categorias-sugeridas"
            required
            defaultValue={defaultValues?.categoria}
            className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
          />
          <datalist id="categorias-sugeridas">
            {CATEGORIAS_SUGERIDAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="data" className="text-sm font-semibold text-navy-950">
            Data de publicação
          </label>
          <input
            id="data"
            name="data"
            type="date"
            required
            defaultValue={defaultValues?.data ?? today}
            className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="resumo" className="text-sm font-semibold text-navy-950">
          Resumo
        </label>
        <textarea
          id="resumo"
          name="resumo"
          required
          rows={3}
          defaultValue={defaultValues?.resumo}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <div>
        <label htmlFor="conteudo" className="text-sm font-semibold text-navy-950">
          Conteúdo
        </label>
        <p className="mt-0.5 text-xs text-muted">Separe os parágrafos com uma linha em branco.</p>
        <textarea
          id="conteudo"
          name="conteudo"
          required
          rows={12}
          defaultValue={defaultValues?.conteudo.join("\n\n")}
          className="mt-1.5 w-full rounded-xl border border-navy-950/12 bg-surface px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors focus:border-accent focus:bg-white"
        />
      </div>

      <UploadField
        name="imagem_url"
        folder="blog"
        tipo="imagem"
        currentUrl={defaultValues?.imagemUrl}
        label="Imagem da notícia"
        hint="Aparece no card do blog e no topo da notícia. Sem imagem, o site usa a arte padrão da categoria."
        onUploadingChange={setUploading}
      />

      {state?.error && <p className="text-sm font-semibold text-rose-dark">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Salvando..." : submitLabel}
        </button>
        <Link
          href="/admin/blog"
          className="rounded-full border-2 border-navy-950/15 px-6 py-3 text-sm font-bold text-navy-950 transition-colors hover:bg-white"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
