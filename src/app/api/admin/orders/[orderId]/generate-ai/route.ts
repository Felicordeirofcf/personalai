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
    
    // 1. Busca o pedido
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // 2. Prepara dados do PAR-Q
    const parq = (order.parqJson as any) || {};
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA: Sente dores no peito\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Tonturas/desmaios\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema articular\n";
    if (parq.medication) parqAlerts += "- ALERTA: Uso de medicação cardíaca\n";
    
    // 3. Prompt para a IA
    const promptSistema = `
      Você é o Felipe Ferreira Personal (CREF 071550-RJ).
      Crie um treino seguro e eficiente.
      
      ALUNO:
      - Objetivo: ${order.goal}
      - Experiência: ${order.experience}
      - Local: ${order.location}
      - Frequência: ${order.frequency}
      - Tempo: ${order.timePerDayMin} min
      - Equipamentos: ${order.equipment}
      - Limitações: ${order.limitations}
      
      SAÚDE:
      ${parqAlerts || "Sem restrições graves."}
      ${parq.notes ? `Obs: ${parq.notes}` : ""}

      REGRAS:
      1. Se houver alerta de saúde, adapte a intensidade.
      2. Use emojis e formatação para WhatsApp.
    `;

    // 4. Chama a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Se der erro de modelo, troque por "gpt-3.5-turbo"
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Gerar treino." },
      ],
    });

    const treinoGerado = completion.choices[0].message.content || "";

    // 5. Salva no banco (SEM ALTERAR STATUS para não dar erro de Enum)
    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        // Se ainda não tem treino final, usa o da IA
        finalWorkoutJson: order.finalWorkoutJson ? undefined : treinoGerado,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}