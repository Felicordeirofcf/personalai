import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  // preço fixo (MVP) — depois você pode criar planos
  const priceCents = 9900; // R$ 99,00

  const order = await prisma.order.create({
    data: {
      status: "pending_payment",
      fullName: body.fullName,
      email: body.email,
      whatsapp: body.whatsapp,
      goal: body.goal,
      location: body.location,
      frequency: body.frequency,
      experience: body.experience,
      timePerDayMin: body.timePerDayMin,
      equipment: body.equipment,
      limitations: body.limitations ?? "",
      parqJson: body.parq ?? {},
      priceCents,
    },
  });

  return NextResponse.json({ orderId: order.id });
}
