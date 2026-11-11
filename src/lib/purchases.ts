import "server-only";
import { prisma } from "@/lib/db";
import { ASAAS_PAID_STATUSES, getPaymentStatus } from "@/lib/asaas";
import { sendWhatsAppText } from "@/lib/whatsapp";

export function purchaseAccessUrl(purchase: { id: string; accessToken: string }) {
  const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  return `${appBaseUrl}/planilhas/acesso/${purchase.id}?t=${purchase.accessToken}`;
}

/**
 * Muda a compra para "paga" de forma atômica. Só quem efetivamente fez a transição
 * dispara a entrega — evita mandar WhatsApp duplicado (webhook + página de acesso).
 */
async function transitionToPaid(purchaseId: string, paymentId?: string) {
  const { count } = await prisma.productPurchase.updateMany({
    where: { id: purchaseId, status: "pending_payment" },
    data: {
      status: "paid",
      paidAt: new Date(),
      ...(paymentId ? { asaasPaymentId: paymentId } : {}),
    },
  });
  if (count === 1) await deliverPurchase(purchaseId);
}

/** Envia o link de download no WhatsApp do comprador (se a Evolution API estiver configurada). */
async function deliverPurchase(purchaseId: string) {
  if (!process.env.EVOLUTION_API_URL || !process.env.EVOLUTION_API_KEY || !process.env.EVOLUTION_INSTANCE) return;

  try {
    const purchase = await prisma.productPurchase.findUnique({
      where: { id: purchaseId },
      include: { product: true },
    });
    if (!purchase) return;

    const firstName = purchase.fullName.split(" ")[0];
    const message =
      `Olá, ${firstName}! 💪 Pagamento confirmado.\n\n` +
      `Sua planilha *${purchase.product.title}* já está liberada. Baixe o PDF aqui:\n` +
      `${purchaseAccessUrl(purchase)}\n\n` +
      `Guarde esta mensagem para baixar novamente quando quiser. Qualquer dúvida, é só responder aqui. Bons treinos!`;

    await sendWhatsAppText(purchase.whatsapp, message);
  } catch (err) {
    // A entrega pela página de acesso continua funcionando mesmo se o WhatsApp falhar
    console.error("Falha ao enviar planilha no WhatsApp:", err);
  }
}

/**
 * Marca como paga uma compra de planilha, se o externalReference for de uma compra.
 * Retorna true se encontrou e tratou a compra.
 */
export async function markPurchasePaidByRef(externalRef: string, paymentId?: string) {
  const purchase = await prisma.productPurchase.findUnique({ where: { id: externalRef } });
  if (!purchase) return false;

  await transitionToPaid(purchase.id, paymentId);
  return true;
}

/** Se a compra ainda está pendente, confere direto no Asaas (caso o webhook não tenha chegado). */
export async function refreshPurchaseStatus(purchaseId: string) {
  const purchase = await prisma.productPurchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.status !== "pending_payment" || !purchase.asaasPaymentId) return purchase;

  const status = await getPaymentStatus(purchase.asaasPaymentId);
  if (status && ASAAS_PAID_STATUSES.has(status)) {
    await transitionToPaid(purchase.id);
    return prisma.productPurchase.findUnique({ where: { id: purchaseId } });
  }
  return purchase;
}
