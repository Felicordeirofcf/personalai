import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToStream } from "@react-pdf/renderer";
import { WorkoutPdf } from "@/components/admin/WorkoutPdf";

// Garante que o PDF seja sempre gerado na hora (sem cache velho)
export const dynamic = 'force-dynamic'; 

export async function GET(
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

    // Pega o treino final (ou rascunho se não tiver final)
    const finalWorkout = (order.finalWorkoutJson as string) || (order.aiDraftJson as string) || "Sem treino definido.";

    // Renderiza o PDF no servidor
    const stream = await renderToStream(
      <WorkoutPdf order={order} finalWorkout={finalWorkout} />
    );

    // Devolve o arquivo pronto para o navegador baixar
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        // Isso força o download com o nome correto
        "Content-Disposition": `attachment; filename="Treino_${order.fullName.split(' ')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}