import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { finalWorkout, forceStatus } = body;

    // Atualiza o pedido com o treino final editado por você
    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        finalWorkoutJson: finalWorkout, // Salva o texto final
        status: forceStatus || undefined, // Se pediu para mudar status, muda
        sentAt: new Date(), // Marca a data de envio
      },
    });

    return NextResponse.json({ ok: true, order: updatedOrder });
  } catch (error) {
    console.error("Erro ao salvar treino:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}