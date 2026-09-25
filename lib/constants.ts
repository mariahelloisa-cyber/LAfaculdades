export const SITE = {
  name: "LA Faculdades",
  slogan: "Educação acessível e de qualidade para todos.",
  emec: "26591",
  mantenedora: "Centro Educacional Fortaleza Ltda",
  cnpj: "48.351.151/0001-10",
  address: "Rua Conde do Pinhal, 78 - Centro - São Paulo/SP - CEP 01049-000",
  email: "coordenacao.academica@facla.edu.br",
  instagram: "https://www.instagram.com/la.faculdadesoficial/",
  // Links dos cards "Acompanhe" da página institucional. Vazio = card sem link.
  facebook: "",
  youtube: "",
  reclameAqui: "",
  googleMeuNegocio: "",
  ava: "https://laFaculdadeava.simpleacademy.tech/login",
  whatsapp: "https://wa.me/5511969033012",
  whatsappDisplay: "(11) 96903-3012",
};

export const NAV_LINKS = [
  { label: "Vestibular", href: "/vestibular" },
  { label: "LA Bank", href: "/financiamento-la-bank" },
  { label: "Blog", href: "/blog" },
  { label: "Institucional", href: "/institucional" },
  { label: "Contato", href: "/contato" },
];

/* Vestibular online (/vestibular). Edite à vontade:
   - provaUrl: link da prova online. Preenchido, o candidato vê o botão
     "Começar minha prova" logo após se inscrever. Vazio, a tela de sucesso
     avisa que o link chega pelo e-mail e pelo WhatsApp informados.
   - tiposIngresso: opções do campo "Tipo de ingresso" do formulário. */
export const VESTIBULAR = {
  provaUrl: "",
  tiposIngresso: [
    "Primeira graduação",
    "Segunda graduação (já tenho diploma)",
    "Transferência de outra faculdade",
    "Retorno aos estudos",
  ],
};
