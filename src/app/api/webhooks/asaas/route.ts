import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createAsaasCheckout } from "@/lib/asaas";

const Schema = z.object({
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
    const data = Schema.parse(body);

    const priceCents = Number(process.env.PRODUCT_PRICE_CENTS ?? "4000");
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
    const valueBRL = priceCents / 100;

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

        parqJson: data.parqJson,
      },
    });

    const checkout = await createAsaasCheckout({
      orderId: order.id,
      fullName: order.fullName,
      email: order.email,
      whatsapp: order.whatsapp,
      valueBRL,
      appBaseUrl,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        asaasCheckoutId: checkout.id,
        asaasCheckoutUrl: checkout.checkoutUrl,
        asaasExternalRef: order.id,
      },
    });

    return NextResponse.json({ ok: true, orderId: order.id, checkoutUrl: checkout.checkoutUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Erro" }, { status: 400 });
  }
}
