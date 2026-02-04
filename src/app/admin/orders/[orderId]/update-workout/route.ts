import { NextResponse } from "next/server";
import { PrismaClient, OrderStatus } from "@prisma/client";

// Prisma singleton (evita múltiplas conexões em dev/hot reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

type RouteProps = {
  params: Promise<{ orderId: string }>;
};

export async function POST(req: Request, props: RouteProps) {
  try {
    const params = await props.params;
    const { orderId } = params;

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Body JSON inválido." },
        { status: 400 }
      );
    }

    // Mantém compatível com body vindo como { workoutJson: ... } ou body direto
    const workoutJson = (body as any).workoutJson ?? body;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        aiDraftJson: workoutJson,
        // ✅ Enum válido do seu schema.prisma (não existe "completed")
        status: OrderStatus.coach_adjusted,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Erro interno." },
      { status: 500 }
    );
  }
}
