import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(_req: Request, ctx: { params: Promise<{ orderId: string }> }) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid_pending_review", paidAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
