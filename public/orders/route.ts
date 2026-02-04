import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;

export async function POST(req: Request) {
  const body = await req.json();

  // preço fixo: R$ 40,00
  const priceCents = 4000;

  const order = await prisma.order.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      whatsapp: body.whatsapp,
      goal: body.goal,
      location: body.location,
      frequency: body.frequency,
      experience: body.experience,
      timePerDayMin: body.timePerDayMin,
      equipment: body.equipment,
      limitations: body.limitations,
      parqJson: body.parqJson,
      priceCents,
      status: "pending_payment",
      paymentProvider: "asaas",
    },
  });

  // ✅ Jeito mais simples: criar um LINK de pagamento no Asaas (checkout hospedado)
  // (endpoint exato/params dependem do recurso que você escolher no Asaas: paymentLinks/checkout/cobrança)
  // Use a doc do Asaas de Link de Pagamentos como base. :contentReference[oaicite:5]{index=5}

  const res = await fetch(`${ASAAS_BASE_URL}/v3/paymentLinks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify({
      name: "Treino personalizado (único)",
      description: `Pedido ${order.id}`,
      value: 40.0,
      billingType: "UNDEFINED",
      chargeType: "DETACHED",
      dueDateLimitDays: 2,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: 400 });
  }

  // normalmente vem uma URL do link/checkout
  const paymentUrl = data?.url || data?.paymentUrl;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentRef: data?.id,
      paymentUrl,
    },
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    checkoutUrl: paymentUrl,
  });
}
