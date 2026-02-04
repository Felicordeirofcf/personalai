// src/app/api/public/orders/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCheckoutForOrder } from "@/lib/asaas";

const OrderSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  // ✅ Recebe o CPF do Frontend
  cpf: z.string().min(11),

  goal: z.string().min(2),
  location: z.string().min(2),
  frequency: z.string().min(1),
  experience: z.string().min(1),
  timePerDayMin: z.number().int().min(5).max(300),
  equipment: z.string().min(1),
  limitations: z.string().optional().default(""),

  parq: z.any(), 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = OrderSchema.parse(body);

    const priceCents = Number(process.env.PRODUCT_PRICE_CENTS ?? "4000");
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    // 1) cria order no seu banco (SEM salvar CPF para não quebrar o banco atual)
    const order = await prisma.order.create({
      data: {
        status: "pending_payment",
        priceCents, 

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

        parqJson: data.parq ?? {}, 
        
        paymentProvider: "asaas",
      },
    });

    // 2) cria checkout no Asaas enviando o CPF
    const checkout = await createCheckoutForOrder({
      orderId: order.id,
      fullName: order.fullName,
      email: order.email,
      whatsapp: order.whatsapp,
      // ✅ Passa o CPF para a função do Asaas
      cpfCnpj: data.cpf,
      valueBRL: Number(order.priceCents) / 100, 
      appBaseUrl,
    });

    // 3) salva referência do checkout
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: checkout.id,
        paymentUrl: checkout.checkoutUrl,
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