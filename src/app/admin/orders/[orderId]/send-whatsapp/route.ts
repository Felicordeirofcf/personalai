import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendWhatsAppText } from "@/lib/whatsapp";
import { workoutToWhatsAppText } from "@/lib/workoutText";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { orderId } = await ctx.params;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const message = workoutToWhatsAppText(order);

  await sendWhatsAppText(order.whatsapp, message);

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "sent", sentAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
