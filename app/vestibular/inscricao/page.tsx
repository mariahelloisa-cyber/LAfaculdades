import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import InscricaoForm from "@/components/InscricaoForm";
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
        description="Preencha os dados abaixo para iniciar sua inscrição. É rápido e você recebe um protocolo na hora."
        art="campus"
      />
      <section className="section-y bg-white">
        <Container className="max-w-2xl">
          <Suspense>
            <InscricaoForm niveis={niveis} cursos={cursos} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
