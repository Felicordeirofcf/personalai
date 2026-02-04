import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateWorkoutDraft } from "@/lib/openai";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });

  const draft = await generateWorkoutDraft({
    fullName: order.fullName,
    goal: order.goal,
    location: order.location,
    frequency: order.frequency,
    experience: order.experience,
    timePerDayMin: order.timePerDayMin,
    equipment: order.equipment,
    limitations: order.limitations,
    parq: order.parqJson,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { aiDraftJson: draft, status: "ai_draft_ready" },
  });

  return NextResponse.redirect(new URL(`/admin/orders/${params.orderId}`, req.url));
}
