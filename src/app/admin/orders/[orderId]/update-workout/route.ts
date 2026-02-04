import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

// MUDANÇA AQUI: props com Promise
export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  const params = await props.params; // AWAIT AQUI

  if (!requireAdmin()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { workoutJson } = body;

    await prisma.order.update({
      where: { id: params.orderId },
      data: { aiDraftJson: workoutJson, status: "completed" }, // Ajuste o status conforme sua lógica
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "failed to update" }, { status: 500 });
  }
}