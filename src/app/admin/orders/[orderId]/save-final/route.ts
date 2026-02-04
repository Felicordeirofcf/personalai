import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;
  const body = await req.json().catch(() => null);

  if (!body?.finalWorkoutJson) {
    return NextResponse.json({ error: "finalWorkoutJson ausente" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { finalWorkoutJson: body.finalWorkoutJson, status: "coach_adjusted" },
  });

  return NextResponse.json({ ok: true });
}
