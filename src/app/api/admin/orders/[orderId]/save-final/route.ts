import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { finalWorkout } = body; // Removemos o 'forceStatus'

    // Atualiza APENAS o texto do treino e a data de envio
    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        finalWorkoutJson: finalWorkout, 
        // status: forceStatus, <--- COMENTADO PARA NÃO DAR ERRO
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, order: updatedOrder });
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}