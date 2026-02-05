"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
// ✅ Importamos os Status oficiais do banco para não errar o nome
import { OrderStatus } from "@prisma/client"; 

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false, error: "Erro ao deletar" };
  }
}

export async function approvePayment(id: string) {
  try {
    await prisma.order.update({
      where: { id },
      // ✅ CORREÇÃO: Usamos o Enum do Prisma. 
      // Se 'paid' não aparecer, o VS Code vai sugerir o correto (provavelmente 'paid_pending_review')
      data: { status: OrderStatus.paid_pending_review || "paid" }, 
    });
    
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao aprovar:", error);
    return { success: false, error: "Erro ao atualizar status" };
  }
}