import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { workoutToWhatsAppText } from "@/lib/workoutText";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const workoutJson = body?.workoutJson;

  // usa o workout recebido (do editor) sem precisar salvar antes
  const fakeOrder = { ...order, finalWorkoutJson: workoutJson, aiDraftJson: workoutJson };

  const text = workoutToWhatsAppText(fakeOrder);

  return NextResponse.json({ ok: true, text });
}
