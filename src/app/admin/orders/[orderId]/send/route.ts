import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  props: { params: Promise<{ orderId: string }> }
) {
  // Aguarda a resolução dos parâmetros
  const params = await props.params;

  if (!requireAdmin()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await prisma.order.update({
    where: { id: params.orderId },
    data: { status: "sent", sentAt: new Date() },
  });

  return NextResponse.redirect(
    new URL(`/admin/orders/${params.orderId}`, req.url)
  );
}