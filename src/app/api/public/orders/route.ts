// src/app/api/public/orders/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCheckoutForOrder } from "@/lib/asaas";

const OrderSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(8),

  goal: z.string().min(2),
  location: z.string().min(2),
  frequency: z.string().min(1),
  experience: z.string().min(1),
  timePerDayMin: z.number().int().min(5).max(300),
  equipment: z.string().min(1),
  limitations: z.string().optional().default(""),

  parqJson: z.any(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = OrderSchema.parse(body);

    const priceCents = Number(process.env.PRODUCT_PRICE_CENTS ?? "4000");
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    // 1) cria order no seu banco
    const order = await prisma.order.create({
      data: {
        status: "pending_payment",
        priceCents, // Salva em centavos no banco (ex: 4000)

        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,

        goal: data.goal,
        location: data.location,
        frequency: data.frequency,
        experience: data.experience,
        timePerDayMin: data.timePerDayMin,
        equipment: data.equipment,
        limitations: data.limitations ?? "",

        parqJson: data.parqJson,
        paymentProvider: "asaas", // Opcional: marca que foi Asaas
      },
    });

    // 2) cria checkout no Asaas (PIX + cartão)
    const checkout = await createCheckoutForOrder({
      orderId: order.id,
      fullName: order.fullName,
      email: order.email,
      whatsapp: order.whatsapp,
      // ⚠️ CORREÇÃO CRUCIAL AQUI:
      // A função espera 'valueBRL' (reais), mas o banco tem 'priceCents' (centavos).
      valueBRL: Number(order.priceCents) / 100, 
      appBaseUrl,
    });

    // 3) salva referência do checkout no pedido
    // Ajustei para usar os campos padrões (paymentRef/paymentUrl) para evitar erro de schema
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: checkout.id,           // ID do pagamento no Asaas
        paymentUrl: checkout.checkoutUrl,  // Link para pagar
      },
    });

    return NextResponse.json(
      { ok: true, orderId: order.id, checkoutUrl: checkout.checkoutUrl },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Erro ao criar pedido:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Erro ao criar pedido" },
      { status: 400 },
    );
  }
}