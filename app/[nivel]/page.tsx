import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import CategoryHero from "@/components/CategoryHero";
import CoursesGrid from "@/components/CoursesGrid";
import { getCourseNiveis, getCourseNivelBySlug, getCoursesByNivelSlug } from "@/lib/data/courses";

export async function generateStaticParams() {
  const niveis = await getCourseNiveis();
  return niveis.map((n) => ({ nivel: n.slug }));
}

export const dynamicParams = true;

/* A hero das categorias usa um fundo único (matricula-hero.jpg) com a
   persona por cima; o texto é que muda por categoria. Para voltar a ter uma
   foto por nível, basta passar `backgroundUrl` ao CategoryHero. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nivel: string }>;
}): Promise<Metadata> {
  const { nivel } = await params;
  const nivelInfo = await getCourseNivelBySlug(nivel);
  if (!nivelInfo) return {};
  return { title: nivelInfo.nome, description: nivelInfo.descricao };
}

export default async function NivelPage({ params }: { params: Promise<{ nivel: string }> }) {
  const { nivel } = await params;
  const [nivelInfo, cursos] = await Promise.all([
    getCourseNivelBySlug(nivel),
    getCoursesByNivelSlug(nivel),
  ]);

  if (!nivelInfo) notFound();

  return (
    <>
      <CategoryHero title={nivelInfo.titulo} description={nivelInfo.descricao} />
      {/* A faixa azul já separa a hero da lista, então o respiro de cima é
          menor que o padrão do section-y. */}
      <section
        id="cursos"
        className="scroll-mt-[58px] bg-white pb-[clamp(3.5rem,7vw,6.5rem)] pt-8 sm:pt-10 lg:scroll-mt-[64px]"
      >
        <Container>
          <CoursesGrid courses={cursos} />
        </Container>
      </section>
    </>
  );
}
