import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import MatriculaForm from "@/components/MatriculaForm";
import { getAllCourses, getCourseNiveis } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Matricule-se",
  description:
    "Preencha seus dados e escolha o curso: a equipe de matrículas da LA Faculdade entra em contato para concluir a sua matrícula.",
};

export default async function MatriculaInscricaoPage() {
  const [niveis, cursos] = await Promise.all([getCourseNiveis(), getAllCourses()]);

  return (
    <>
      <PageHero
        eyebrow="Matrícula"
        title="Preencha seus dados"
        description="Leva menos de um minuto. Depois de enviar, a equipe de matrículas entra em contato pelo telefone e pelo e-mail informados."
        art="campus"
      />
      <section className="section-y bg-white">
        <Container className="max-w-2xl">
          <Suspense>
            <MatriculaForm niveis={niveis} cursos={cursos} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
