import { env } from "./env";

// Pagamento manual: exibimos instruções + chave pix + código do pedido.
// (Sem API Nubank/Inter. Você confirma manualmente no painel.)
export function getPaymentInstructions(orderId: string, priceCents: number) {
  const code = orderId.slice(-8).toUpperCase();
  return {
    methodLabel: env.PAYMENT_METHOD_LABEL,
    receiverName: env.PIX_RECEIVER_NAME,
    pixKey: env.PIX_KEY,
    amountBRL: (priceCents / 100).toFixed(2),
    reference: `PED-${code}`,
    instructions: env.BANK_INSTRUCTIONS || "Pague e envie o comprovante.",
  };
}
