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
    
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const parq = (order.parqJson as any) || {};
    
    // Tratamento dos alertas de saúde
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA CRÍTICO: Sente dores no peito (Evitar alta intensidade)\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Histórico de tonturas/desmaios (Cuidado com mudanças bruscas de nível)\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema ósseo/articular (Evitar impacto)\n";
    if (parq.medication) parqAlerts += "- ALERTA: Usa medicação contínua (Monitorar esforço)\n";
    
    // --- O PROMPT "PERFEITO" PARA O PDF ---
    const promptSistema = `
      Você é o Felipe Ferreira, um Personal Trainer experiente e técnico (CREF 071550-RJ).
      Seu objetivo é montar um treino de musculação focado em ACADEMIA (Máquinas e Halteres), direto e eficiente.
      
      DADOS DO ALUNO:
      - Objetivo: ${order.goal}
      - Experiência: ${order.experience}
      - Local: ${order.location} (Priorize máquinas se for academia)
      - Frequência: ${order.frequency}
      - Tempo disponível: ${order.timePerDayMin} min
      - Limitações Físicas: ${order.limitations || "Nenhuma"}
      
      ANÁLISE DE SAÚDE (PAR-Q - MUITA ATENÇÃO):
      ${parqAlerts || "Nenhuma restrição grave reportada."}
      ${parq.notes ? `Obs do aluno: ${parq.notes}` : ""}

      REGRAS DE FORMATAÇÃO (RIGOROSO PARA GERAR PDF):
      1. NÃO faça introduções longas. Comece direto pelo treino.
      2. AQUECIMENTO: Cite apenas 1 ou 2 exercícios rápidos no início.
      3. AERÓBICO: Coloque apenas no FINAL do treino (tempo e intensidade).
      
      4. *** FORMATO DOS EXERCÍCIOS (OBRIGATÓRIO) ***:
         - Use lista numerada (1., 2., 3...).
         - Na MESMA LINHA do nome do exercício, coloque as SÉRIES e REPETIÇÕES separadas por hífen ou traço.
         - Se tiver observação técnica (ex: "segurar 2s", "drop-set"), coloque na linha DEBAIXO.
      
      EXEMPLO DE COMO VOCÊ DEVE RESPONDER:
      ### Treino A - Superiores
      1. Manguito Rotador na Polia - 2x15
      2. Supino Reto com Halteres - 4 séries de 8 a 10 reps
      Cadência controlada na descida.
      3. Puxada Alta Aberta - 4 séries de 10 a 12 reps
      4. Tríceps Corda - 3x15 (Falha)
      ...
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Monte o treino seguindo estritamente as regras de formatação." },
      ],
      temperature: 0.7, // Um pouco de criatividade, mas mantendo a estrutura
    });

    const treinoGerado = completion.choices[0].message.content || "";

    // Retornamos o texto gerado para o front (para você ver na hora)
    // E também salvamos no banco caso queira persistir
    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        // Se ainda não tem treino final salvo, usa esse rascunho como base
        finalWorkoutJson: order.finalWorkoutJson ? undefined : treinoGerado,
      },
    });

    return NextResponse.json({ ok: true, text: treinoGerado });
  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}