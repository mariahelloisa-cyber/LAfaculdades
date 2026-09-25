import type { Metadata } from "next";
import Container from "@/components/Container";
import CategoryHero from "@/components/CategoryHero";
import CourseCatalog from "@/components/CourseCatalog";
import { getAllCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Cursos",
  description:
    "Todos os cursos da LA Faculdades em um só lugar: graduação e pós-graduação EAD, com certificado reconhecido pelo MEC.",
};

export default async function CursosPage() {
  const cursos = await getAllCourses();

  return (
    <>
      <CategoryHero
        title={"Todos os cursos\nem um só lugar"}
        description="Graduação e pós-graduação EAD, com certificado reconhecido pelo MEC. Use os filtros para chegar no curso certo pra você."
      />
      {/* A faixa azul da hero já faz a separação, então o respiro de cima é
          menor que o padrão do section-y — mesma medida das páginas de nível. */}
      <section className="bg-white pb-[clamp(3.5rem,7vw,6.5rem)] pt-8 sm:pt-10">
        <Container>
          <CourseCatalog courses={cursos} />
        </Container>
      </section>
    </>
  );
}
