// src/app/api/asaas/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // ✅ valida token do webhook (se você configurar no painel do Asaas)
    const expected = process.env.ASAAS_WEBHOOK_TOKEN;
    if (expected) {
      const got = req.headers.get("asaas-access-token");
      if (!got || got !== expected) {
        return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = await req.json();

    // payload padrão:
    // { id, event: "PAYMENT_RECEIVED", payment: { id, ... } } :contentReference[oaicite:8]{index=8}
    const event = payload?.event as string | undefined;
    const payment = payload?.payment;

    if (!event || !payment?.id) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // externalReference no checkout: usamos o order.id
    // Ele costuma aparecer em payment.externalReference dependendo do fluxo
    // Então tentamos achar por asaasExternalRef e também por asaasCheckoutId, quando possível.
    const externalRef: string | undefined =
      payment?.externalReference || payment?.description || payment?.subscription;

    // você pode logar pra ver o payload real que chega:
    // console.log("ASAAS WEBHOOK:", JSON.stringify(payload, null, 2));

    // ✅ eventos que interessam pra liberar revisão IA
    const paidEvents = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);

    if (paidEvents.has(event)) {
      // 1) tenta achar por externalReference (ideal)
      let order =
        (externalRef
          ? await prisma.order.findUnique({ where: { id: externalRef } })
          : null);

      // 2) fallback: se você preferir, dá pra procurar por asaasCheckoutId em campos do payment (quando vier)
      if (!order) {
        const checkoutId = payment?.checkoutSessionId || payment?.checkout?.id;
        if (checkoutId) {
          order = await prisma.order.findFirst({ where: { asaasCheckoutId: checkoutId } });
        }
      }

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "paid_pending_review",
            asaasPaymentId: payment.id,
          },
        });
      }
    }

    // ✅ sempre responda 200 (webhook é "at least once"; pode repetir) :contentReference[oaicite:9]{index=9}
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // IMPORTANTE: responder 200 mesmo em erro evita fila travada; mas aqui vamos responder 200 com ok=false
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
