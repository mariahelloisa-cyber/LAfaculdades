export const SITE = {
  name: "LA Faculdade",
  slogan: "Educação acessível e de qualidade para todos.",
  emec: "26591",
  cnpj: "42.935.217/0001-33",
  address: "R. Formosa, 75 - São Paulo/SP - CEP 01049-000",
  email: "diretoria@laeducacao.com.br",
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
