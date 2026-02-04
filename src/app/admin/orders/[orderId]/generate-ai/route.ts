import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ CORREÇÃO 1: Tipagem correta do params como Promise (Exigência do Next.js novo)
export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params; // ✅ Aguardamos o params
    
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const parq = (order.parqJson as any) || {};
    
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA: Sente dores no peito (CUIDADO REDOBRADO)\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Tem tonturas/desmaios\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema ósseo/articular\n";
    if (parq.medication) parqAlerts += "- ALERTA: Toma medicação de pressão/coração\n";
    
    const promptSistema = `
      Você é o Felipe Ferreira, um Personal Trainer experiente e Criterioso (CREF 071550-RJ).
      Seu objetivo é montar um treino de musculação seguro e eficiente.
      
      DADOS DO ALUNO:
      - Objetivo: ${order.goal}
      - Experiência: ${order.experience}
      - Local: ${order.location}
      - Frequência: ${order.frequency}
      - Tempo: ${order.timePerDayMin} min
      - Equipamentos: ${order.equipment}
      - Limitações: ${order.limitations}
      
      ANÁLISE DE SAÚDE (PAR-Q):
      ${parqAlerts || "Nenhuma restrição grave reportada."}
      ${parq.notes ? `Obs do aluno: ${parq.notes}` : ""}

      REGRAS:
      1. Se houver alertas de saúde, adapte o treino para ser SEGURO.
      2. Crie uma divisão de treino (A, B, C...) adequada à frequência.
      3. Seja motivador mas técnico.
      4. Formate a resposta bonita para WhatsApp (use emojis, negrito *texto*).
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Monte o treino agora." },
      ],
    });

    // ✅ CORREÇÃO 2: Garantimos que nunca seja null (usa string vazia se falhar)
    const treinoGerado = completion.choices[0].message.content || "";

    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        // Se finalWorkoutJson for null, preenchemos. Se já tiver texto, mantemos o undefined para não sobrescrever.
        finalWorkoutJson: order.finalWorkoutJson ? undefined : treinoGerado,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}