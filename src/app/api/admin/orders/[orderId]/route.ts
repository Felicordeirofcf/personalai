import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Busca os dados de um pedido específico
export async function GET(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params; // Next.js 15 exige await aqui
    
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE: Apaga um pedido do banco de dados (Nova função)
export async function DELETE(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params;

    // Tenta deletar o pedido pelo ID
    await prisma.order.delete({
      where: { id: params.orderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return NextResponse.json({ error: "Erro ao deletar pedido" }, { status: 500 });
  }
}