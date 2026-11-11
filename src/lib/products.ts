import "server-only";
import { prisma } from "@/lib/db";

export async function getActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (err) {
    console.error("Erro ao buscar planilhas:", err);
    return [];
  }
}

export type ProductCardData = Awaited<ReturnType<typeof getActiveProducts>>[number];
