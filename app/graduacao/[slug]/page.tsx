import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/CourseDetail";
import { getCourseBySlug, getCoursesByLevel } from "@/lib/data/courses";

export function generateStaticParams() {
  return getCoursesByLevel("graduacao").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug("graduacao", slug);
  if (!course) return {};
  return { title: course.nome, description: course.resumo };
}

export default async function CursoGraduacaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug("graduacao", slug);
  if (!course) notFound();

  return <CourseDetail course={course} />;
}
