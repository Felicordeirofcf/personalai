// Cria 3 planilhas de exemplo como RASCUNHO (active: false).
// Revise o conteúdo no painel (/admin/planilhas) e marque "À venda" quando estiver pronto.
// Uso: DATABASE_URL=... node scripts/seed-planilhas.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COMMON_GUIDE = `
COMO USAR ESTA PLANILHA
- Aqueça 5–10 min (bike/esteira leve + 1 série leve do 1º exercício).
- Carga: escolha um peso em que as últimas 2 repetições sejam difíceis, mas com boa técnica.
- Progressão: quando completar todas as séries no topo da faixa de repetições, aumente a carga (2–5%).
- Descanso: respeite o tempo indicado entre as séries.
- Dor articular (diferente de cansaço muscular)? Pare o exercício e fale comigo no WhatsApp.
`;

const products = [
  {
    slug: "hipertrofia-iniciante-academia",
    title: "Hipertrofia Iniciante — Academia",
    subtitle: "12 semanas para ganhar massa muscular com segurança, mesmo começando do zero.",
    level: "Iniciante",
    location: "Academia",
    durationWeeks: 12,
    priceCents: 2700,
    compareAtCents: 4700,
    sortOrder: 1,
    highlights: [
      "3 treinos por semana (Full Body A/B)",
      "Progressão de carga semana a semana",
      "Séries, repetições e descanso definidos",
      "Guia de aquecimento e execução",
    ],
    description:
      "Ideal para quem está começando ou voltando a treinar. Você treina o corpo todo 3x por semana, com foco em aprender os movimentos básicos e aumentar a carga de forma progressiva.",
    content: `${COMMON_GUIDE}
ESTRUTURA: 3x por semana alternando A e B (ex.: Seg A / Qua B / Sex A — na semana seguinte B / A / B).

SEMANAS 1–4: 2 séries por exercício | SEMANAS 5–12: 3 séries por exercício

TREINO A
1. Leg press 45º ............ 10–12 reps | 90s
2. Supino máquina ............ 10–12 reps | 90s
3. Puxada frontal ............ 10–12 reps | 90s
4. Cadeira extensora ......... 12–15 reps | 60s
5. Elevação lateral .......... 12–15 reps | 60s
6. Prancha ................... 20–40s     | 45s

TREINO B
1. Agachamento no smith ...... 10–12 reps | 90s
2. Remada baixa .............. 10–12 reps | 90s
3. Desenvolvimento máquina ... 10–12 reps | 90s
4. Mesa flexora .............. 12–15 reps | 60s
5. Rosca direta .............. 12–15 reps | 60s
6. Tríceps na polia .......... 12–15 reps | 60s
7. Panturrilha em pé ......... 15–20 reps | 45s
`,
  },
  {
    slug: "hipertrofia-intermediario-academia",
    title: "Hipertrofia Intermediário — Academia",
    subtitle: "10 semanas de treino completo para quem já treina e quer voltar a evoluir.",
    level: "Intermediário",
    location: "Academia",
    durationWeeks: 10,
    priceCents: 3700,
    compareAtCents: 5700,
    sortOrder: 2,
    highlights: [
      "4 treinos por semana (Superior / Inferior)",
      "Corpo todo trabalhado 2x por semana, de forma equilibrada",
      "Progressão de volume e carga ao longo das 10 semanas",
      "Semana de recuperação programada (deload)",
    ],
    description:
      "Para quem já treina há alguns meses e estagnou. Programa completo e equilibrado: cada grupo muscular é treinado duas vezes por semana, alternando dias de membros superiores e inferiores, com aumento de volume e carga planejado.",
    content: `${COMMON_GUIDE}
ESTRUTURA: 4x por semana — Seg A / Ter B / Qui C / Sex D
(A e C = superiores | B e D = inferiores + core)

SEMANAS 1–4: 3 séries por exercício
SEMANAS 5–8: 4 séries nos 2 primeiros exercícios de cada treino
SEMANA 9: DELOAD — mesmas cargas, metade das séries
SEMANA 10: 3 séries, tente bater suas melhores cargas

TREINO A — SUPERIORES (foco força)
1. Supino reto com barra ......... 6–8 reps   | 2min
2. Remada curvada ................ 6–8 reps   | 2min
3. Desenvolvimento halteres ...... 8–10 reps  | 90s
4. Puxada frontal ................ 8–10 reps  | 90s
5. Rosca direta .................. 10–12 reps | 60s
6. Tríceps testa ................. 10–12 reps | 60s

TREINO B — INFERIORES (foco força) + CORE
1. Agachamento livre/smith ....... 6–8 reps   | 2min
2. Stiff com barra ............... 8–10 reps  | 2min
3. Leg press 45º ................. 10–12 reps | 90s
4. Mesa flexora .................. 10–12 reps | 60s
5. Panturrilha em pé ............. 12–15 reps | 45s
6. Prancha ....................... 30–45s     | 45s

TREINO C — SUPERIORES (foco volume)
1. Supino inclinado halteres ..... 10–12 reps | 90s
2. Remada baixa .................. 10–12 reps | 90s
3. Crucifixo máquina ............. 12–15 reps | 60s
4. Pulldown braços estendidos .... 12–15 reps | 60s
5. Elevação lateral .............. 12–15 reps | 60s
6. Rosca martelo + tríceps corda . 12–15 reps | 60s (bi-set)

TREINO D — INFERIORES (foco volume) + CORE
1. Passada/afundo com halteres ... 10–12 reps cada perna | 90s
2. Elevação pélvica .............. 10–12 reps | 90s
3. Cadeira extensora ............. 12–15 reps | 60s
4. Cadeira flexora ............... 12–15 reps | 60s
5. Panturrilha sentada ........... 15–20 reps | 45s
6. Abdominal na polia ............ 12–15 reps | 45s
`,
  },
  {
    slug: "emagrecimento-em-casa",
    title: "Emagrecimento em Casa — Sem Equipamentos",
    subtitle: "6 semanas de treinos de 30 minutos para fazer na sala de casa.",
    level: "Iniciante",
    location: "Casa",
    durationWeeks: 6,
    priceCents: 1900,
    compareAtCents: 3700,
    sortOrder: 3,
    highlights: [
      "Treinos de 30 minutos",
      "Zero equipamento — só peso corporal",
      "3 a 4 treinos por semana em circuito",
      "Fica mais desafiador a cada 2 semanas",
    ],
    description:
      "Para quem tem pouco tempo ou não quer ir à academia. Circuitos com peso corporal que aumentam o gasto calórico e o condicionamento.",
    content: `${COMMON_GUIDE}
ESTRUTURA: 3–4x por semana alternando Circuito 1 e Circuito 2.
Faça os exercícios em sequência, descanse 90s ao final e repita.

SEMANAS 1–2: 3 voltas, 30s de exercício / 30s de pausa
SEMANAS 3–4: 4 voltas, 35s de exercício / 25s de pausa
SEMANAS 5–6: 4 voltas, 40s de exercício / 20s de pausa

CIRCUITO 1
1. Agachamento livre
2. Flexão de braço (joelhos apoiados se necessário)
3. Polichinelo
4. Afundo alternado
5. Prancha
6. Corrida estacionária

CIRCUITO 2
1. Ponte de glúteo
2. Remada com toalha na porta (ou "superman" no chão)
3. Agachamento + elevação na ponta dos pés
4. Mountain climber
5. Tríceps no banco/cadeira
6. Abdominal bicicleta

FINALIZAÇÃO (todos os treinos): 5 min de alongamento leve.
`,
  },
];

for (const p of products) {
  await prisma.product.upsert({
    where: { slug: p.slug },
    update: {},
    create: { ...p, active: false },
  });
  console.log(`✓ ${p.title} (rascunho)`);
}

await prisma.$disconnect();
