import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CoursesGrid from "@/components/CoursesGrid";
import { getCourseNiveis, getCourseNivelBySlug, getCoursesByNivelSlug } from "@/lib/data/courses";

export async function generateStaticParams() {
  const niveis = await getCourseNiveis();
  return niveis.map((n) => ({ nivel: n.slug }));
}

export const dynamicParams = true;

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
      <PageHero
        eyebrow={nivelInfo.nome}
        title={nivelInfo.titulo}
        description={nivelInfo.descricao}
        imageUrl={nivelInfo.imagemUrl}
      />
      <section className="section-y bg-white">
        <Container>
          <CoursesGrid courses={cursos} />
        </Container>
      </section>
    </>
  );
}
