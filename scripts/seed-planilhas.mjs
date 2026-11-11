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
    slug: "gluteos-e-pernas-academia",
    title: "Glúteos & Pernas — Academia",
    subtitle: "8 semanas com ênfase em glúteos e posteriores, sem abandonar o resto do corpo.",
    level: "Intermediário",
    location: "Academia",
    durationWeeks: 8,
    priceCents: 3700,
    compareAtCents: 5700,
    sortOrder: 2,
    highlights: [
      "4 treinos por semana (2 de inferiores)",
      "Ênfase em glúteo máximo e médio",
      "Progressão de volume ao longo das 8 semanas",
      "Superiores mantidos para um físico equilibrado",
    ],
    description:
      "Para quem já treina há alguns meses e quer priorizar glúteos e pernas. Dois dias de inferiores com focos diferentes e dois dias de superiores.",
    content: `${COMMON_GUIDE}
ESTRUTURA: 4x por semana — Seg A / Ter B / Qui C / Sex D

SEMANAS 1–4: 3 séries | SEMANAS 5–8: 4 séries nos 3 primeiros exercícios de A e C

TREINO A — GLÚTEOS (foco quadril)
1. Elevação pélvica com barra .... 8–12 reps  | 2min
2. Stiff com halteres ............ 8–12 reps  | 2min
3. Búlgaro (passada parada) ...... 10–12 reps | 90s
4. Abdução na máquina ............ 15–20 reps | 60s
5. Coice na polia ................ 12–15 reps | 60s

TREINO B — SUPERIORES
1. Puxada frontal ................ 10–12 reps | 90s
2. Supino inclinado halteres ..... 10–12 reps | 90s
3. Remada curvada ................ 10–12 reps | 90s
4. Elevação lateral .............. 12–15 reps | 60s
5. Tríceps corda ................. 12–15 reps | 60s

TREINO C — PERNAS (foco joelho + glúteo)
1. Agachamento livre/smith ....... 8–10 reps  | 2min
2. Leg press pés altos ........... 10–12 reps | 90s
3. Cadeira extensora ............. 12–15 reps | 60s
4. Mesa flexora .................. 12–15 reps | 60s
5. Abdução em pé na polia ........ 15 reps    | 45s
6. Panturrilha sentada ........... 15–20 reps | 45s

TREINO D — SUPERIORES + CORE
1. Remada baixa .................. 10–12 reps | 90s
2. Desenvolvimento halteres ...... 10–12 reps | 90s
3. Crucifixo máquina ............. 12–15 reps | 60s
4. Rosca alternada ............... 12–15 reps | 60s
5. Prancha lateral ............... 30s cada   | 45s
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
