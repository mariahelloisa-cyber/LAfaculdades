import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import BlogExplorer from "@/components/BlogExplorer";
import { getPosts } from "@/lib/data/posts";
import { getSiteMediaUrl } from "@/lib/data/siteMedia";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conteúdo sobre vestibular, ENEM, financiamento estudantil e vida acadêmica para você decidir com informação.",
};

export default async function BlogPage() {
  const [posts, heroUrl] = await Promise.all([getPosts(), getSiteMediaUrl("blog_hero")]);

  return (
    <>
      {/* Hero — fundo escuro com grade de pontos e brilho decorativos,
          selo "Blog LA", título com sublinhado desenhado e coluna de
          ícones flutuantes no desktop. */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        <Image
          src={heroUrl || "/images/blog.png"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-navy-950/80" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-6 hidden h-28 w-28 opacity-25 lg:block"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />

        <Container className="relative py-10 lg:py-14">
          <div className="max-w-xl">
            <span className="t-label inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 uppercase text-sky-300 ring-1 ring-white/15">
              Blog LA
            </span>
            <h1 className="t-h2 mt-5 text-white">Conhecimento que inspira e transforma.</h1>
            <svg aria-hidden viewBox="0 0 220 16" className="mt-2 h-2.5 w-32 text-accent">
              <path
                d="M2 12C40 2 80 2 110 8C140 14 180 14 218 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <p className="t-lead mt-5 text-sky-200">
              Conteúdo sobre vestibular, ENEM, financiamento estudantil e vida acadêmica.
            </p>
          </div>

          {/* coluna de ícones decorativos — só desktop */}
          <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
            {[
              <g key="cap">
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6" />
                <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
              </g>,
              <g key="book">
                <path d="M12 7v14" />
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
              </g>,
              <path key="chat" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
            ].map((el, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/80"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {el}
                </svg>
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Artigos + sidebar (busca, categorias, newsletter) */}
      <BlogExplorer posts={posts} />
    </>
  );
}
