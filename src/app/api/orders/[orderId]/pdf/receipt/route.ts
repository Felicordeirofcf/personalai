import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Endpoint público para processar recebimento/comprovante
export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> } // Correção: params agora é uma Promise
) {
  // 1. Aguarda a resolução dos parâmetros (Obrigatório no Next.js 15)
  const params = await props.params;

  try {
    // 2. Busca o pedido no banco de dados para garantir que existe
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // 3. (Opcional) Ler dados enviados no corpo da requisição (ex: link do comprovante)
    // const body = await req.json();

    // 4. Lógica de negócio (ex: atualizar status para 'verificando_pagamento')
    /*
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "verifying_payment" }
    });
    */

    // Retorna sucesso para o cliente
    return NextResponse.json({
      success: true,
      message: "Recebido com sucesso",
      orderId: params.orderId
    });

  } catch (error) {
    console.error("Erro ao processar receipt:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}