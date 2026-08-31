import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { posts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conteúdo sobre vestibular, ENEM, financiamento estudantil e vida acadêmica para você decidir com informação.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog LA"
        title="Para decidir com informação, não com achismo"
        description="Conteúdo sobre vestibular, ENEM, financiamento estudantil e vida acadêmica."
        art="tecnologia"
      />
      <section className="section-y bg-white">
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl bg-surface p-6 transition-shadow hover:shadow-[0_16px_38px_rgba(6,21,35,0.14)]"
            >
              <span className="t-label w-fit rounded-full bg-accent px-3 py-1.5 uppercase text-white">
                {post.categoria}
              </span>
              <h2 className="mt-5 text-[17px] font-bold leading-snug text-navy-950 group-hover:text-accent">
                {post.titulo}
              </h2>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted">{post.resumo}</p>
              <time className="mt-5 text-[12px] font-semibold text-muted" dateTime={post.data}>
                {new Date(post.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </time>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
