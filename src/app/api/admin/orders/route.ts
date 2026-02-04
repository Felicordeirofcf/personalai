import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!requireAdmin()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, status: true, fullName: true, goal: true },
    take: 100,
  });

  return NextResponse.json(
    orders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
    }))
  );
}
