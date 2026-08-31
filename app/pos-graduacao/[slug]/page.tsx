import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/components/CourseDetail";
import { getCourseBySlug, getCoursesByLevel } from "@/lib/data/courses";

export function generateStaticParams() {
  return getCoursesByLevel("pos-graduacao").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug("pos-graduacao", slug);
  if (!course) return {};
  return { title: course.nome, description: course.resumo };
}

export default async function CursoPosGraduacaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug("pos-graduacao", slug);
  if (!course) notFound();

  return <CourseDetail course={course} />;
}
