import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import InscricaoForm from "@/components/InscricaoForm";

export const metadata: Metadata = {
  title: "Inscrição",
  description: "Faça sua inscrição na LA Faculdades: escolha o curso, preencha seus dados e garanta sua vaga.",
};

export default function InscricaoPage() {
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
            <InscricaoForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
