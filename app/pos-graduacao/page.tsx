import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CoursesGrid from "@/components/CoursesGrid";
import { getCoursesByLevel } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Pós-Graduação",
  description: "Cursos de pós-graduação lato sensu da LA Faculdades, 100% EAD, com certificado reconhecido pelo MEC.",
};

export default function PosGraduacaoPage() {
  const cursos = getCoursesByLevel("pos-graduacao");

  return (
    <>
      <PageHero
        eyebrow="Pós-Graduação"
        title="Especialize-se sem parar sua rotina"
        description="MBAs e pós-graduações lato sensu 100% EAD, com certificado reconhecido pelo MEC e conteúdo aplicado ao mercado."
        art="pos"
      />
      <section className="section-y bg-white">
        <Container>
          <CoursesGrid courses={cursos} />
        </Container>
      </section>
    </>
  );
}
