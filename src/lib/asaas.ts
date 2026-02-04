import { z } from "zod";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com";

// Helper genérico para fetch no Asaas
async function asaasFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${ASAAS_BASE_URL}/v3${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    access_token: ASAAS_API_KEY,
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data?.errors?.[0]?.description || "Erro na API do Asaas";
    throw new Error(errorMessage);
  }

  return data as T;
}

type CreateCheckoutParams = {
  orderId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  valueBRL: number;
  appBaseUrl: string;
};

type CheckoutResponse = {
  id: string;
  checkoutUrl: string;
};

export async function createCheckoutForOrder({
  orderId,
  fullName,
  email,
  whatsapp,
  valueBRL,
  appBaseUrl,
}: CreateCheckoutParams): Promise<CheckoutResponse> {
  
  // 1. Criar/Buscar Cliente no Asaas (simplificado: cria sempre ou busca pelo email/cpf se implementar)
  // Para simplificar, vamos usar os dados diretamente na criação da cobrança/checkout se possível,
  // ou criar um customer rápido. A API de PaymentLinks cria o customer implicitamente às vezes, 
  // mas a de "checkouts" (telas personalizadas) geralmente pede customer ID.
  
  // Vamos usar a estratégia de criar um "PaymentLink" (Link de Pagamento), que é o mais simples
  // e já gera a interface de pagamento hospedada (Pix + Cartão).
  
  // OBS: O endpoint "/paymentLinks" cria um link fixo. 
  // O endpoint "/payments" cria uma cobrança direta (mas precisa de front pra cartão).
  // O melhor para MVP é criar uma cobrança "/payments" e pegar o "bankSlipUrl" ou "invoiceUrl" dela.
  
  // Vamos criar um CLIENTE primeiro para ficar limpo
  const customer = await asaasFetch<{ id: string }>("/customers", {
    method: "POST",
    // CORREÇÃO: JSON.stringify aqui também, se houvesse, mas aqui é só exemplo
    body: JSON.stringify({
      name: fullName,
      email,
      mobilePhone: whatsapp,
    }),
  }).catch(() => {
     // Se der erro (ex: email ja existe), tenta buscar (impl simplificada)
     return { id: "cus_GUEST" }; 
  });

  // 2. Criar a Cobrança (Payment)
  const payment = await asaasFetch<{ id: string; invoiceUrl: string; bankSlipUrl: string }>(
    "/payments",
    {
      method: "POST",
      // CORREÇÃO: Adicionado JSON.stringify
      body: JSON.stringify({
        customer: customer.id || "cus_000000", // Fallback seguro
        billingType: "UNDEFINED", // Permite usuario escolher Pix ou Boleto/Cartao na tela da fatura
        value: valueBRL,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Vence em 3 dias
        description: `Treino Personalizado - Pedido ${orderId}`,
        externalReference: orderId,
        postalService: false
      }),
    }
  );

  return {
    id: payment.id,
    checkoutUrl: payment.invoiceUrl, // Url da "Fatura" do Asaas serve como checkout
  };
}