// Configuração central do site — edite aqui textos, contatos e depoimentos.

export const site = {
  name: "Felipe Ferreira",
  title: "Felipe Ferreira | Personal Trainer",
  cref: "CREF 071550-RJ",
  domain: "felipepersonal.com",
  url: process.env.APP_BASE_URL || "https://felipepersonal.com",
  // Apenas números, com DDI + DDD
  whatsapp: "5521987708652",
  instagram: "", // ex.: "https://instagram.com/seuusuario"
  // Troque por uma foto sua em /public (ex.: "/felipe.jpg") — foto real converte muito mais
  photo: "/logo.png",
  guaranteeDays: 7,
};

// Preço do treino 100% personalizado (anamnese + revisão do personal)
export function personalizedPriceCents() {
  return Number(process.env.PRODUCT_PRICE_CENTS ?? "4000");
}

// Vídeos do YouTube (vale Shorts). Use só o ID: em https://youtube.com/shorts/AbC123xyz o ID é "AbC123xyz".
// heroVideoId: vídeo de apresentação que aparece no topo do site no lugar da foto.
// videos: aparecem na seção "Veja como eu treino" (some automaticamente se a lista estiver vazia).
export const heroVideoId = "";
export const videos: { id: string; title: string }[] = [
  // { id: "AbC123xyz", title: "Agachamento: 3 erros que travam seu resultado" },
];

// Depoimentos REAIS de alunos. A seção só aparece no site quando houver pelo menos um.
// Peça autorização ao aluno antes de publicar.
export const testimonials: { name: string; text: string; result?: string }[] = [
  // { name: "Ana, 29", text: "Treinos objetivos e fáceis de seguir...", result: "-6 kg em 3 meses" },
];

export const faq: { q: string; a: string }[] = [
  {
    q: "Qual a diferença entre a planilha pronta e o treino personalizado?",
    a: "A planilha pronta é um programa completo, montado por mim para um objetivo e nível específicos, e você recebe na hora. O treino personalizado é feito do zero a partir da sua anamnese (objetivo, rotina, equipamentos, limitações e PAR-Q) e revisado por mim antes do envio.",
  },
  {
    q: "Como recebo a planilha depois de pagar?",
    a: "Assim que o pagamento é confirmado, você é levado para a página de acesso com o botão de download do PDF. Guarde o link: ele fica disponível para baixar novamente quando quiser.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Pix, cartão de crédito ou boleto, processados com segurança pelo Asaas.",
  },
  {
    q: "Sou iniciante, consigo seguir?",
    a: "Sim. Cada planilha indica o nível recomendado e traz séries, repetições, descanso e orientações de progressão. Se tiver dúvidas, chame no WhatsApp.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia. Se não ficar satisfeito, é só chamar no WhatsApp que devolvo o valor.",
  },
  {
    q: "Tenho dor, lesão ou condição de saúde. Posso comprar?",
    a: "Nesses casos, prefira o treino personalizado: o PAR-Q e a anamnese permitem adaptar os exercícios. Em alguns casos pode ser necessária liberação médica.",
  },
];

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
