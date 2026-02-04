import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderWorkoutPdfBuffer } from "@/lib/pdf";

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  const workout = order.finalWorkoutJson ?? order.aiDraftJson;
  if (!workout) return NextResponse.json({ error: "workout not ready" }, { status: 400 });

  const buf = await renderWorkoutPdfBuffer(workout, { fullName: order.fullName });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="treino-${order.id.slice(-8).toUpperCase()}.pdf"`,
    },
  });
}
