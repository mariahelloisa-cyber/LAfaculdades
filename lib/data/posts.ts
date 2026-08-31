import { supabasePublic } from "@/lib/supabase/publicClient";

export type Post = {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string[];
  imagemUrl: string;
  data: string; // ISO date
};

type PostRow = {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string[];
  imagem_url: string;
  data: string;
};

const POST_FIELDS = "id, slug, titulo, categoria, resumo, conteudo, imagem_url, data";

function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    categoria: row.categoria,
    resumo: row.resumo,
    conteudo: row.conteudo,
    imagemUrl: row.imagem_url,
    data: row.data,
  };
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabasePublic
    .from("blog_posts")
    .select(POST_FIELDS)
    .order("data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar posts do blog:", error.message);
    return [];
  }

  return (data as PostRow[]).map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabasePublic
    .from("blog_posts")
    .select(POST_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar post do blog:", error.message);
    return null;
  }

  return data ? mapPost(data as PostRow) : null;
}
