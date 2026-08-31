import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { getPostBySlug, getPosts } from "@/lib/data/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.titulo, description: post.resumo };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        eyebrow={post.categoria}
        title={post.titulo}
        description={new Date(post.data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        art="tecnologia"
        imageUrl={post.imagemUrl}
      />
      <section className="section-y bg-white">
        <Container className="max-w-2xl">
          <div className="space-y-6 text-[17px] leading-relaxed text-navy-900">
            {post.conteudo.map((paragrafo, i) => (
              <p key={i}>{paragrafo}</p>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-navy-950 p-8 text-center">
            <p className="t-h3 text-white">Pronto para dar o próximo passo?</p>
            <Link
              href="/vestibular/inscricao"
              className="mt-6 inline-block rounded-full bg-accent px-8 py-4 font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Quero me inscrever
            </Link>
          </div>

          <Link href="/blog" className="mt-10 inline-block font-bold text-navy-950 underline underline-offset-4 hover:opacity-70">
            ← Voltar para o blog
          </Link>
        </Container>
      </section>
    </>
  );
}
