import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  if (!requireAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { finalWorkoutJson } = await req.json();

  await prisma.order.update({
    where: { id: params.orderId },
    data: { finalWorkoutJson, status: "coach_adjusted" },
  });

  return NextResponse.json({ ok: true });
}
