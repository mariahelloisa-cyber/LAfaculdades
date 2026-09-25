import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getCourseNiveis } from "@/lib/data/courses";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

/* ISR: as páginas públicas são servidas do cache (R2) e regeneradas em segundo
   plano a cada 5 minutos, então o que você altera no admin aparece sozinho
   nesse prazo — ou na hora, pelo revalidatePath() das ações do admin.
   Fica no layout raiz porque o menu de categorias acima também vem do banco.
   As telas de /admin leem cookies, são dinâmicas e ignoram isto. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    default: "LA Faculdade — Educação acessível e de qualidade para todos",
    template: "%s — LA Faculdade",
  },
  description:
    "LA Faculdade (E-MEC 26591): graduação e pós-graduação com diploma reconhecido pelo MEC, vestibular próprio, ingresso pela nota do ENEM e financiamento próprio pelo LA Bank.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const courseNiveis = await getCourseNiveis();

  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${headingFont.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-ink">
        <SiteChrome courseNiveis={courseNiveis}>{children}</SiteChrome>
      </body>
    </html>
  );
}
