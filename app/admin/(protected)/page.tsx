import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminIcon } from "./adminIcons";
import { StatCard, badgeCores } from "./AdminUI";

const ACOES = [
  {
    href: "/admin/matriculas",
    titulo: "Matrículas recebidas",
    desc: "Contatos enviados pelo formulário do site",
    icon: "matriculas",
    cor: "rosa" as const,
  },
  {
    href: "/admin/cursos",
    titulo: "Gerenciar cursos",
    desc: "Adicionar, editar e destacar cursos",
    icon: "cursos",
    cor: "azul" as const,
  },
  {
    href: "/admin/cursos/niveis",
    titulo: "Catgorias",
    desc: "Graduação, pós-graduação e novos níveis",
    icon: "niveis",
    cor: "indigo" as const,
  },
  {
    href: "/admin/blog",
    titulo: "Gerenciar blog",
    desc: "Criar e editar artigos",
    icon: "blog",
    cor: "verde" as const,
  },
  {
    href: "/admin/midia/blog-hero",
    titulo: "Hero do Blog",
    desc: "Trocar a foto de fundo do topo do blog",
    icon: "imagem",
    cor: "amarelo" as const,
  },
  {
    href: "/admin/midia/home-video",
    titulo: "Vídeo da Home",
    desc: "Vídeo de fundo da página inicial",
    icon: "video",
    cor: "rosa" as const,
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [posts, cursos, niveis, destaques, matriculas, matriculasNovas] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("course_niveis").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("destaque_home", true),
    supabase.from("matriculas").select("*", { count: "exact", head: true }),
    supabase.from("matriculas").select("*", { count: "exact", head: true }).eq("status", "novo"),
  ]);

  const atualizadoEm = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold leading-tight text-navy-950">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Bem-vindo ao painel administrativo da LA Faculdades.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Última atualização</p>
          <p className="mt-0.5 text-sm font-semibold text-navy-950">{atualizadoEm}</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Matrículas recebidas"
          value={matriculas.count ?? 0}
          note={`${matriculasNovas.count ?? 0} aguardando contato`}
          icon="matriculas"
          cor="rosa"
        />
        <StatCard
          label="Cursos cadastrados"
          value={cursos.count ?? 0}
          note={`${destaques.count ?? 0} em destaque na home`}
          icon="cursos"
          cor="azul"
        />
        <StatCard
          label="Categorias"
          value={niveis.count ?? 0}
          note="Categorias do site"
          icon="niveis"
          cor="indigo"
        />
        <StatCard
          label="Posts no blog"
          value={posts.count ?? 0}
          note="Artigos publicados"
          icon="blog"
          cor="verde"
        />
      </div>

      <h2 className="mt-10 text-[11px] font-bold uppercase tracking-wider text-muted">Ações rápidas</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {ACOES.map((acao) => (
          <Link
            key={acao.href}
            href={acao.href}
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-navy-950/5 transition-shadow hover:shadow-[0_10px_30px_rgba(6,21,35,0.08)]"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${badgeCores[acao.cor]}`}
            >
              <AdminIcon name={acao.icon} size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-navy-950">{acao.titulo}</span>
              <span className="mt-0.5 block text-sm text-muted">{acao.desc}</span>
            </span>
            <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
