import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "LA Faculdades — Educação acessível e de qualidade para todos",
    template: "%s — LA Faculdades",
  },
  description:
    "LA Faculdades (E-MEC 18263): graduação e pós-graduação com diploma reconhecido pelo MEC, vestibular próprio, ingresso pela nota do ENEM e financiamento próprio pelo LA Bank.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${headingFont.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-ink">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
