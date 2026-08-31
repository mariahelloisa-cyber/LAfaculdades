import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Chip, EditIconLink, EmptyState, ListCard, PageHeader, PrimaryButton, StatCard } from "../AdminUI";
import DeletePostButton from "./DeletePostButton";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, titulo, categoria, imagem_url, data")
    .order("data", { ascending: false });

  const lista = posts ?? [];
  const categorias = new Set(lista.map((p) => p.categoria as string));

  return (
    <div>
      <PageHeader
        icon="blog"
        title="Blog"
        description="Artigos publicados na página /blog do site."
        action={<PrimaryButton href="/admin/blog/novo">+ Novo post</PrimaryButton>}
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <StatCard label="Posts publicados" value={lista.length} icon="blog" cor="verde" />
        <StatCard label="Categorias em uso" value={categorias.size} icon="niveis" cor="indigo" />
      </div>

      <ListCard title="Lista">
        <div className="divide-y divide-navy-950/8">
          {lista.map((post) => (
            <div key={post.id} className="flex items-center gap-4 py-3.5">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                {post.imagem_url ? (
                  <Image src={post.imagem_url as string} alt="" fill className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted">
                    sem foto
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-navy-950">{post.titulo}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Chip cor="azul">{post.categoria}</Chip>
                  <span className="text-xs text-muted">
                    {new Date(post.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <EditIconLink href={`/admin/blog/${post.id}`} label={`Editar ${post.titulo}`} />
                <DeletePostButton id={post.id} titulo={post.titulo} />
              </div>
            </div>
          ))}
        </div>

        {lista.length === 0 && <EmptyState>Nenhum post cadastrado ainda.</EmptyState>}
      </ListCard>
    </div>
  );
}
