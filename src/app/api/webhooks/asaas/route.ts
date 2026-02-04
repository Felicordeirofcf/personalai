import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Endpoint que o Asaas chama automaticamente quando um pagamento muda de status
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // O Asaas envia um objeto com "event" e "payment"
    const { event, payment } = body;

    console.log(`Webhook Asaas recebido: Evento=${event}, ID=${payment.id}`);

    // Lista de eventos que indicam pagamento confirmado
    const confirmedEvents = ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"];

    if (confirmedEvents.includes(event)) {
      // Atualiza o status do pedido no banco de dados
      // Usamos o 'externalReference' (que é o ID do nosso pedido)
      if (payment.externalReference) {
        await prisma.order.update({
          where: { id: payment.externalReference },
          data: {
            status: "paid_pending_review", // Status que libera o pedido para você revisar
            paymentRef: payment.id,        // Garante que o ID do pagamento está salvo
          },
        });
        console.log(`Pedido ${payment.externalReference} atualizado para PAGO.`);
      }
    }

    // Retorna 200 OK para o Asaas não ficar reenviando o webhook
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Erro ao processar webhook do Asaas:", error);
    // Mesmo com erro interno, as vezes é bom retornar 200 pro Asaas não travar a fila, 
    // mas aqui retornaremos 500 para você ver o erro nos logs se precisar.
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}