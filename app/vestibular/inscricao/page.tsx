import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import MatriculaForm from "@/components/MatriculaForm";
import { getAllCourses, getCourseNiveis } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Inscrição",
  description: "Faça sua inscrição na LA Faculdade: escolha o curso, preencha seus dados e garanta sua vaga.",
};

export default async function InscricaoPage() {
  const [niveis, cursos] = await Promise.all([getCourseNiveis(), getAllCourses()]);

  return (
    <>
      <PageHero
        eyebrow="Inscrição"
        title="Garanta sua vaga"
        description="Preencha os dados abaixo para iniciar sua inscrição. A equipe de matrículas entra em contato para concluir o processo com você."
        art="campus"
      />
      <section className="section-y bg-white">
        <Container className="max-w-2xl">
          <Suspense>
            {/* Mesmo formulário da matrícula: aqui o candidato também diz por
                qual porta quer entrar (vestibular, ENEM ou matrícula direta). */}
            <MatriculaForm
              niveis={niveis}
              cursos={cursos}
              mostrarFormaIngresso
              textoBotao="Finalizar inscrição"
            />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
