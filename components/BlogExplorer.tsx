"use client";

import { useMemo, useState } from "react";
import Container from "./Container";
import BlogCard from "./BlogCard";
import type { Post } from "@/lib/data/posts";
import { categoriaIcons, categoriaIconFallback } from "@/lib/blogCategorias";

const PAGE_SIZE = 4;

export default function BlogExplorer({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [activeCategoria, setActiveCategoria] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [email, setEmail] = useState("");
  const [inscrito, setInscrito] = useState(false);

  const categorias = useMemo(
    () => Array.from(new Set(posts.map((p) => p.categoria))),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchQuery = !q || p.titulo.toLowerCase().includes(q) || p.resumo.toLowerCase().includes(q);
      const matchCategoria = !activeCategoria || p.categoria === activeCategoria;
      return matchQuery && matchCategoria;
    });
  }, [posts, query, activeCategoria]);

  const paginated = filtered.slice(0, visible);

  function handleCategoriaClick(categoria: string) {
    setVisible(PAGE_SIZE);
    setActiveCategoria((atual) => (atual === categoria ? null : categoria));
  }

  function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    // Sem backend configurado ainda: apenas confirma o cadastro no cliente.
    setInscrito(true);
    setEmail("");
  }

  return (
    <section className="section-y bg-white">
      <Container className="grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Artigos */}
        <div>
          <h2 className="t-h3 text-[26px] text-navy-950 sm:text-[30px]">
            {activeCategoria ? `Artigos sobre ${activeCategoria}` : "Últimos artigos"}
          </h2>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-navy-950/15 bg-surface p-10 text-center">
              <p className="t-h3 text-navy-950">Nenhum artigo encontrado</p>
              <p className="mt-2 text-[15px] text-muted">
                Tente ajustar a busca ou escolher outra categoria.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {paginated.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-full border-2 border-navy-950 px-7 py-3.5 text-[15px] font-bold text-navy-950 transition-colors hover:bg-navy-950 hover:text-white"
                  >
                    Ver mais artigos
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          {/* Buscar no blog */}
          <div className="rounded-2xl bg-surface p-5">
            <h3 className="text-[16px] font-bold text-navy-950">Buscar no blog</h3>
            <label className="mt-3 flex items-center gap-2.5 rounded-full border-2 border-navy-950/15 bg-white px-4 py-3 transition-colors focus-within:border-accent">
              <span className="sr-only">Buscar no blog</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
                <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquise por temas..."
                className="w-full bg-transparent text-[14px] text-navy-950 outline-none placeholder:text-muted"
              />
            </label>
          </div>

          {/* Categorias */}
          <div className="rounded-2xl bg-tint p-5">
            <h3 className="text-[16px] font-bold text-navy-950">Categorias</h3>
            <ul className="mt-3 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setVisible(PAGE_SIZE);
                    setActiveCategoria(null);
                  }}
                  aria-pressed={activeCategoria === null}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[14px] font-bold transition-colors ${
                    activeCategoria === null ? "bg-accent-soft text-accent" : "text-navy-950 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-accent" aria-hidden>
                      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Todas
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted" aria-hidden>
                    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
              {categorias.map((categoria) => {
                const active = activeCategoria === categoria;
                return (
                  <li key={categoria}>
                    <button
                      type="button"
                      onClick={() => handleCategoriaClick(categoria)}
                      aria-pressed={active}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[14px] font-bold transition-colors ${
                        active ? "bg-accent-soft text-accent" : "text-navy-950 hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-accent" aria-hidden>
                          {categoriaIcons[categoria] ?? categoriaIconFallback}
                        </svg>
                        {categoria}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-muted" aria-hidden>
                        <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl bg-navy-950 p-6 text-white">
            {inscrito ? (
              <>
                <h3 className="t-h3 text-white">Inscrição recebida!</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-sky-200">
                  Você vai receber nossos próximos conteúdos por e-mail.
                </p>
              </>
            ) : (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="2" />
                    <path d="m4 6.5 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-4 text-[17px] font-bold leading-snug text-white">
                  Receba conteúdos exclusivos no seu e-mail
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-sky-200">
                  Cadastre-se e receba nossos melhores artigos e novidades.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-4 space-y-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    aria-label="Seu melhor e-mail"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-white outline-none transition-colors placeholder:text-white/50 focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-accent py-3 text-[14px] font-bold text-white transition-colors hover:bg-accent-hover"
                  >
                    Quero receber
                  </button>
                </form>
              </>
            )}
          </div>
        </aside>
      </Container>
    </section>
  );
}
