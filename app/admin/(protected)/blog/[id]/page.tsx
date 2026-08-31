import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../AdminUI";
import PostForm from "../PostForm";
import { updatePost } from "../actions";

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("id, titulo, slug, categoria, resumo, conteudo, imagem_url, data")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const updatePostWithId = updatePost.bind(null, id);

  return (
    <div>
      <PageHeader icon="blog" title="Editar post" description={post.titulo} />
      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <PostForm
          action={updatePostWithId}
          submitLabel="Salvar alterações"
          defaultValues={{
            titulo: post.titulo,
            slug: post.slug,
            categoria: post.categoria,
            resumo: post.resumo,
            conteudo: post.conteudo,
            imagemUrl: post.imagem_url,
            data: post.data,
          }}
        />
      </div>
    </div>
  );
}
