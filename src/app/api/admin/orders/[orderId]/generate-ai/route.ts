import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params;
    
    // Busca o pedido no banco
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const parq = (order.parqJson as any) || {};
    
    // Tratamento dos alertas de saúde (PAR-Q)
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA CRÍTICO: Sente dores no peito (Evitar alta intensidade)\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Histórico de tonturas/desmaios (Cuidado com mudanças bruscas de nível)\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema ósseo/articular (Evitar impacto, priorizar máquinas)\n";
    if (parq.medication) parqAlerts += "- ALERTA: Usa medicação contínua (Monitorar esforço)\n";
    
    // --- O PROMPT "PERFEITO" 4.0 (COM METODOLOGIAS E LÓGICA DE ELITE) ---
    const promptSistema = `
      Você é o Felipe Ferreira, um Personal Trainer de Elite (CREF 071550-RJ), especialista em periodização, biomecânica e fisiologia.
      Sua missão é criar o "Treino Perfeito", superando a expectativa do aluno com uma metodologia clara.

      --- DADOS DO ALUNO ---
      Nome: ${order.fullName}
      Objetivo Principal: ${order.goal}
      Nível de Experiência: ${order.experience}
      Local de Treino: ${order.location}
      Frequência Semanal: ${order.frequency}
      Tempo Disponível: ${order.timePerDayMin} min
      
      --- RESTRIÇÕES E SAÚDE ---
      Limitações/Lesões: ${order.limitations || "Nenhuma"}
      Alertas do PAR-Q: ${parqAlerts || "Sem restrições graves."}
      ${parq.notes ? `Obs do aluno: ${parq.notes}` : ""}

      --- SUA BASE DE CONHECIMENTO (METODOLOGIAS) ---
      Use estas definições para escolher a estratégia do aluno:

      [INICIANTE - 0 a 6 meses]
      1. Full Body (3x): Corpo todo todo dia. Foco em frequência motora.
      2. Linear Progression: Foco em criar base de força (aumento gradual de carga).
      3. Hypertrophy Basic: 2-4 séries, 8-12 reps, foco em controle e amplitude. RIR 2-3 (2 reps na reserva).

      [INTERMEDIÁRIO - 6 a 24 meses]
      1. Upper/Lower (AB 2x): Separação Superior/Inferior. Ótimo para força+hipertrofia.
      2. PPL (Push/Pull/Legs): Empurrar/Puxar/Pernas. Flexível (3x a 6x).
      3. PHUL: Mistura dias de Força (baixas reps) com Hipertrofia (altas reps).
      4. DUP (Ondulatória): Varia intensidade (Pesado/Médio/Leve) na semana.

      [AVANÇADO - 2 anos+]
      1. Block Periodization: Foco em blocos (Acumulação -> Intensificação).
      2. GVT (German Volume Training): 10 séries de 10 (Apenas se o objetivo for volume extremo e articulações 100%).
      3. Rest-Pause / Drop-Sets: Técnicas de alta intensidade para quebrar platôs.
      4. Cluster Sets: Séries quebradas com pausas curtas para manter carga alta.

      --- DIRETRIZES DE CRIAÇÃO ---
      
      PASSO 1: ESCOLHA A METODOLOGIA E O SPLIT
      - Analise o Nível (${order.experience}) e Frequência (${order.frequency}).
      - Escolha 1 metodologia da lista acima.
      - Adapte ao SEXO provável (Pelo nome "${order.fullName}"):
        * Feminino: Ênfase natural em inferiores/glúteos (salvo se o objetivo for outro).
        * Masculino: Distribuição equilibrada ou ênfase em tronco.
      - Adapte ao LOCAL (${order.location}):
        * "Em casa": PROIBIDO citar máquinas. Use halteres, elásticos e peso do corpo. Foco em volume metabólico.
        * "Academia": Use o arsenal completo.

      PASSO 2: ESTRUTURE O TREINO
      - Crie a divisão (Treino A, B, C...) conforme a metodologia.
      - Inclua Aquecimento específico e Cardio/Abd ao final.

      PASSO 3: REGRAS DE FORMATAÇÃO (RIGOROSO PARA O PDF)
      1. Inicie com: "Olá ${order.fullName.split(' ')[0]}! Preparei seu treino usando a metodologia [NOME DA METODOLOGIA]."
      2. Explique em 1 frase o porquê dessa escolha (Ex: "...para focar no aumento de força base").
      3. Liste os treinos no padrão EXATO:
         
         ### Treino A - [Foco Muscular]
         *Aquecimento:* [Instrução breve]
         
         1. [Nome Exercício] - [Séries]x[Reps]
         [Obs: Cadência, RIR ou Técnica Específica na linha de baixo]

         2. [Nome Exercício] - [Séries]x[Reps] + [Técnica se houver]
         [Obs...]
         
         *Final:* [Cardio/Abd]

      OBSERVAÇÃO FINAL: Seja técnico mas acessível. Se usar termos como "RIR" ou "Falha", explique brevemente.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Analise o perfil, escolha a metodologia e monte o treino." },
      ],
      temperature: 0.7,
    });

    const treinoGerado = completion.choices[0].message.content || "";

    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        finalWorkoutJson: order.finalWorkoutJson ? undefined : treinoGerado,
      },
    });

    return NextResponse.json({ ok: true, text: treinoGerado });
  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}