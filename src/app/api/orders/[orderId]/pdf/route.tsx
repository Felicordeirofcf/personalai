import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToStream } from "@react-pdf/renderer";
// ✅ CORREÇÃO 1: Importamos o componente certo que criamos (WorkoutPdf)
import { WorkoutPdf } from "@/components/admin/WorkoutPdf";

export const dynamic = 'force-dynamic'; 

export async function GET(
  req: Request,
  // ✅ CORREÇÃO 2: Tipagem correta do Next.js 15 (Promise)
  props: { params: Promise<{ orderId: string }> }
) {
  try {
    const params = await props.params; // Aguardamos o params

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const finalWorkout = (order.finalWorkoutJson as string) || (order.aiDraftJson as string) || "Sem treino.";

    // ✅ CORREÇÃO 3: Usamos renderToStream que é mais leve e compatível
    const stream = await renderToStream(
      <WorkoutPdf order={order} finalWorkout={finalWorkout} />
    );

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Treino_${order.fullName.split(' ')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}