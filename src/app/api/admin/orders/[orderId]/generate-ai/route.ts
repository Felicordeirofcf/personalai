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
    let parqAlerts = "";
    if (parq.chestPain) parqAlerts += "- ALERTA: Sente dores no peito\n";
    if (parq.dizziness) parqAlerts += "- ALERTA: Tonturas/desmaios\n";
    if (parq.jointProblem) parqAlerts += "- ALERTA: Problema articular\n";
    if (parq.medication) parqAlerts += "- ALERTA: Uso de medicação cardíaca\n";
    
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptSistema },
        { role: "user", content: "Gerar treino." },
      ],
    });

    const treinoGerado = completion.choices[0].message.content || "";

    // Salva o rascunho
    await prisma.order.update({
      where: { id: params.orderId },
      data: {
        aiDraftJson: treinoGerado, 
        // Força a atualização se o usuário clicou no botão
        finalWorkoutJson: treinoGerado, 
      },
    });

    // ✅ AQUI A MUDANÇA: Retornamos o texto gerado para o frontend usar
    return NextResponse.json({ ok: true, text: treinoGerado });

  } catch (error) {
    console.error("Erro na IA:", error);
    return NextResponse.json({ error: "Erro ao gerar treino" }, { status: 500 });
  }
}