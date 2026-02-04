import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { workoutToWhatsAppText } from "@/lib/workoutText";

export async function GET(_req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const text = workoutToWhatsAppText(order);
  return NextResponse.json({ ok: true, text });
}
