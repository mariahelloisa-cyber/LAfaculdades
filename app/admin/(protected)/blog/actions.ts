"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export type PostFormState = { error?: string } | undefined;

function parseForm(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim();
  const resumo = String(formData.get("resumo") ?? "").trim();
  const conteudoRaw = String(formData.get("conteudo") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();

  const slug = slugify(slugRaw || titulo);
  const conteudo = conteudoRaw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return { titulo, slug, categoria, resumo, conteudo, data };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const supabase = await requireUser();
  const post = parseForm(formData);

  if (!post.titulo || !post.categoria || !post.resumo || !post.data || post.conteudo.length === 0) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  const { error } = await supabase.from("blog_posts").insert({
    ...post,
    imagem_url: String(formData.get("imagem_url") ?? ""),
  });
  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um post com esse slug." : "Erro ao salvar o post.",
    };
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const supabase = await requireUser();
  const post = parseForm(formData);

  if (!post.titulo || !post.categoria || !post.resumo || !post.data || post.conteudo.length === 0) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  const imagemUrl = String(formData.get("imagem_url") ?? "");

  const updateData: Record<string, unknown> = { ...post };
  if (imagemUrl) updateData.imagem_url = imagemUrl;

  const { error } = await supabase.from("blog_posts").update(updateData).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505" ? "Já existe um post com esse slug." : "Erro ao salvar o post.",
    };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("blog_posts").delete().eq("id", id);

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
