import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// ✅ IMPORTANTE: Usamos o helper que já existe em src/lib/pdf
import { renderWorkoutPdfBuffer } from "@/lib/pdf"; 

export async function GET(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  // 1. Next.js 15: Aguarda os parâmetros
  const params = await props.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order || !order.aiDraftJson) {
      return NextResponse.json({ error: "Pedido ou treino não encontrado" }, { status: 404 });
    }

    // 2. Gera o PDF usando a função do arquivo lib/pdf.tsx
    const buffer = await renderWorkoutPdfBuffer(order.aiDraftJson, {
      fullName: order.fullName,
    });

    // 3. Retorna o PDF
    // O 'as any' aqui evita o erro de tipagem do Buffer que vimos antes
    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="treino-${order.fullName}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Falha interna na geração do PDF" }, { status: 500 });
  }
}