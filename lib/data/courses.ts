export type CourseLevel = "graduacao" | "pos-graduacao";

export type Course = {
  slug: string;
  nome: string;
  nivel: CourseLevel;
  tipo: string; // Bacharelado, Licenciatura, Tecnólogo, MBA, Pós-graduação lato sensu
  area: string;
  modalidade: "EAD" | "Semipresencial";
  modalidades: string[]; // chips exibidos no card
  duracao: string;
  mensalidade: number; // valor de exemplo, em reais
  mensalidadeDe: number; // valor cheio, para o "De R$ X por"
  art: string; // arte de fundo do card — trocar por foto real em /public/images/art
  resumo: string;
  descricao: string;
  destaques: string[];
};

// Cursos de exemplo — substituir pelos cursos reais e valores oficiais da instituição.
export const courses: Course[] = [
  {
    slug: "administracao",
    nome: "Administração",
    nivel: "graduacao",
    tipo: "Bacharelado",
    area: "Negócios",
    modalidade: "EAD",
    modalidades: ["EAD","Semipresencial"],
    duracao: "8 semestres",
    mensalidade: 299.9,
    mensalidadeDe: 499.9,
    art: "administracao",
    resumo: "Formação completa em gestão, finanças, marketing e liderança para empreender ou crescer dentro de empresas.",
    descricao:
      "O curso de Administração prepara você para atuar em gestão de pessoas, finanças, marketing e processos, com uma grade flexível 100% EAD e tutoria disponível para tirar dúvidas durante toda a formação.",
    destaques: ["Diploma reconhecido pelo MEC", "Aulas 100% online", "Estágio supervisionado orientado"],
  },
  {
    slug: "pedagogia",
    nome: "Pedagogia",
    nivel: "graduacao",
    tipo: "Licenciatura",
    area: "Educação",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "8 semestres",
    mensalidade: 279.9,
    mensalidadeDe: 459.9,
    art: "pedagogia",
    resumo: "Licenciatura para atuar na educação infantil, anos iniciais e gestão escolar.",
    descricao:
      "Formação voltada para quem quer lecionar na educação infantil e nos anos iniciais do ensino fundamental, além de atuar em coordenação e gestão de escolas.",
    destaques: ["Habilita para docência", "Estágio em escolas parceiras", "Material didático incluso"],
  },
  {
    slug: "enfermagem",
    nome: "Enfermagem",
    nivel: "graduacao",
    tipo: "Bacharelado",
    area: "Saúde",
    modalidade: "Semipresencial",
    modalidades: ["Semipresencial"],
    duracao: "10 semestres",
    mensalidade: 499.9,
    mensalidadeDe: 799.9,
    art: "enfermagem",
    resumo: "Bacharelado com prática em laboratórios e estágio supervisionado em unidades de saúde parceiras.",
    descricao:
      "Curso semipresencial que combina teoria online com aulas práticas em laboratório e estágio em unidades de saúde, preparando você para atuar em hospitais, clínicas e UBS.",
    destaques: ["Laboratórios equipados", "Estágio em unidades parceiras", "Corpo docente especializado"],
  },
  {
    slug: "analise-e-desenvolvimento-de-sistemas",
    nome: "Análise e Desenvolvimento de Sistemas",
    nivel: "graduacao",
    tipo: "Tecnólogo",
    area: "Tecnologia",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "4 semestres",
    mensalidade: 329.9,
    mensalidadeDe: 549.9,
    art: "tecnologia",
    resumo: "Formação rápida em programação, banco de dados e desenvolvimento de software.",
    descricao:
      "Tecnólogo focado no mercado de tecnologia, com programação, banco de dados, engenharia de software e projetos práticos para você já sair com portfólio.",
    destaques: ["Curso mais curto (2 anos)", "Foco em prática de mercado", "Projetos para portfólio"],
  },
  {
    slug: "gestao-de-recursos-humanos",
    nome: "Gestão de Recursos Humanos",
    nivel: "graduacao",
    tipo: "Tecnólogo",
    area: "Negócios",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "4 semestres",
    mensalidade: 289.9,
    mensalidadeDe: 479.9,
    art: "rh",
    resumo: "Recrutamento, seleção, treinamento e gestão de pessoas nas organizações.",
    descricao:
      "Curso voltado para quem quer atuar em departamentos de gente e gestão, recrutamento e seleção, treinamento e desenvolvimento organizacional.",
    destaques: ["Curso mais curto (2 anos)", "Cases reais de RH", "Certificado reconhecido pelo MEC"],
  },
  {
    slug: "mba-gestao-de-pessoas",
    nome: "MBA em Gestão de Pessoas",
    nivel: "pos-graduacao",
    tipo: "Pós-graduação lato sensu",
    area: "Negócios",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "12 meses",
    mensalidade: 249.9,
    mensalidadeDe: 399.9,
    art: "pos",
    resumo: "Especialização em liderança, cultura organizacional e gestão estratégica de pessoas.",
    descricao:
      "MBA voltado para profissionais que já atuam ou querem atuar com liderança e gestão de pessoas, com conteúdo aplicado e certificado de pós-graduação lato sensu.",
    destaques: ["Certificado de pós-graduação", "Conteúdo 100% online", "Professores com vivência de mercado"],
  },
  {
    slug: "pos-psicopedagogia",
    nome: "Psicopedagogia",
    nivel: "pos-graduacao",
    tipo: "Pós-graduação lato sensu",
    area: "Educação",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "12 meses",
    mensalidade: 229.9,
    mensalidadeDe: 379.9,
    art: "pedagogia",
    resumo: "Especialização em dificuldades de aprendizagem e intervenção psicopedagógica.",
    descricao:
      "Pós-graduação para pedagogos, psicólogos e professores que querem se especializar em diagnóstico e intervenção nas dificuldades de aprendizagem.",
    destaques: ["Certificado de pós-graduação", "Estudos de caso práticos", "Conteúdo 100% online"],
  },
  {
    slug: "mba-gestao-escolar",
    nome: "MBA em Gestão Escolar",
    nivel: "pos-graduacao",
    tipo: "Pós-graduação lato sensu",
    area: "Educação",
    modalidade: "EAD",
    modalidades: ["EAD"],
    duracao: "12 meses",
    mensalidade: 249.9,
    mensalidadeDe: 399.9,
    art: "administracao",
    resumo: "Gestão pedagógica, financeira e de pessoas para diretores e coordenadores de escolas.",
    descricao:
      "Formação para quem atua ou quer atuar na direção e coordenação de instituições de ensino, com foco em gestão pedagógica, financeira e de equipes.",
    destaques: ["Certificado de pós-graduação", "Foco em gestão escolar", "Conteúdo 100% online"],
  },
];

export const AREAS = Array.from(new Set(courses.map((c) => c.area))).sort();

export function getCoursesByLevel(nivel: CourseLevel) {
  return courses.filter((c) => c.nivel === nivel);
}

export function getCourseBySlug(nivel: CourseLevel, slug: string) {
  return courses.find((c) => c.nivel === nivel && c.slug === slug);
}
