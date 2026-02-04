import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// Importamos a função do arquivo que você já corrigiu (src/lib/pdf.tsx)
import { renderWorkoutPdfBuffer } from "@/lib/pdf"; 

export async function GET(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  const params = await props.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order || !order.aiDraftJson) {
      return NextResponse.json({ error: "Pedido ou treino não encontrado" }, { status: 404 });
    }

    // Usamos a função auxiliar que já cria o PDF
    const buffer = await renderWorkoutPdfBuffer(order.aiDraftJson, {
      fullName: order.fullName,
    });

    // O helper já retorna um Buffer, só precisamos garantir o cast para enviar na resposta
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="treino-${order.fullName}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Falha na geração do PDF" }, { status: 500 });
  }
}