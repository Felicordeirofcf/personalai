import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (expected) {
      const got = req.headers.get("asaas-access-token");
      if (!got || got !== expected) {
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    const payload = await req.json();

    const event = String(payload?.event || "");
    const payment = payload?.payment;
    const paymentId = payment?.id;
    const externalRef = payment?.externalReference;

    const paidEvents = new Set(["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"]);

    if (paidEvents.has(event) && paymentId) {
      // ideal: externalReference = order.id
      let order = externalRef
        ? await prisma.order.findUnique({ where: { id: String(externalRef) } })
        : null;

      // fallback: achar pelo checkoutId (se vier)
      if (!order) {
        const checkoutId = payment?.checkoutSessionId;
        if (checkoutId) {
          order = await prisma.order.findFirst({ where: { asaasCheckoutId: String(checkoutId) } });
        }
      }

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "paid_pending_review",
            asaasPaymentId: String(paymentId),
            paidAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // webhook pode tentar novamente; responder 200 evita loop
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
