"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { CourseNivel } from "@/lib/data/courses";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

// O painel /admin tem seu próprio chrome (sidebar) — sem header/footer/
// anúncio do site institucional.
export default function SiteChrome({
  children,
  courseNiveis,
}: {
  children: ReactNode;
  courseNiveis: CourseNivel[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Sem wrapper flex aqui: as páginas de /admin controlam sua própria
    // altura (h-screen) e não podem depender de um ancestral flex-grow,
    // que não conta como altura "definida" para filhos com height em %.
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header courseNiveis={courseNiveis} />
      <main className="flex-1">{children}</main>
      <Footer courseNiveis={courseNiveis} />
      <WhatsAppButton />
    </>
  );
}
