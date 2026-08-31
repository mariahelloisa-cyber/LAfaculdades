import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CoursesGrid from "@/components/CoursesGrid";
import { getCoursesByLevel } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Graduação",
  description: "Cursos de graduação da LA Faculdades: bacharelado, licenciatura e tecnólogo, com diploma reconhecido pelo MEC.",
};

export default function GraduacaoPage() {
  const cursos = getCoursesByLevel("graduacao");

  return (
    <>
      <PageHero
        eyebrow="Graduação"
        title="Cursos de graduação com diploma reconhecido pelo MEC"
        description="Bacharelado, licenciatura e tecnólogo em modalidade EAD e semipresencial, pensados para quem já tem uma rotina cheia."
        art="administracao"
      />
      <section className="section-y bg-white">
        <Container>
          <CoursesGrid courses={cursos} />
        </Container>
      </section>
    </>
  );
}
