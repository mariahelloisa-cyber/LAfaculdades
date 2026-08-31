import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/data/posts";
import { categoriaIcons, categoriaIconFallback } from "@/lib/blogCategorias";

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(6,21,35,0.14)]"
    >
      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-navy-950 to-navy-800">
        {post.imagemUrl ? (
          <>
            <Image
              src={post.imagemUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-navy-950/35" />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-sky-300 transition-transform duration-500 group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                {categoriaIcons[post.categoria] ?? categoriaIconFallback}
              </svg>
            </span>
          </>
        )}
        <span className="t-label absolute left-4 top-4 rounded-full bg-accent px-3 py-1.5 uppercase text-white">
          {post.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[17px] font-bold leading-snug text-navy-950 group-hover:text-accent">
          {post.titulo}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-relaxed text-muted">{post.resumo}</p>
        <div className="mt-5 flex items-center justify-between border-t border-navy-950/10 pt-4">
          <time className="text-[12px] font-semibold text-muted" dateTime={post.data}>
            {new Date(post.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </time>
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Ler mais
            <svg width="14" height="11" viewBox="0 0 20 14" fill="none" aria-hidden>
              <path d="M1 7h17M12.5 1 18.5 7l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
