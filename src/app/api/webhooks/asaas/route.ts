import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const secret = process.env.ASAAS_WEBHOOK_SECRET || "";
  const got = req.headers.get("x-webhook-secret") || "";

  if (!secret || got !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  // ⚠️ Ajuste de acordo com o formato real do evento do Asaas
  // Você vai mapear para o seu orderId via description (Pedido {id}) ou paymentRef
  const paymentId = payload?.payment?.id || payload?.paymentLink?.id || payload?.id;
  const status = payload?.payment?.status || payload?.status;

  if (!paymentId) return NextResponse.json({ ok: true });

  const order = await prisma.order.findFirst({ where: { paymentRef: paymentId } });
  if (!order) return NextResponse.json({ ok: true });

  // quando status indicar pago/confirmado
  const paid = ["RECEIVED", "CONFIRMED", "PAID"].includes(String(status || "").toUpperCase());
  if (paid) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid_pending_review", paidAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
