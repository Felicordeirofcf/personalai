import { z } from "zod";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY!;
const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com";

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
  // ✅ NOVO: CPF obrigatório
  cpfCnpj: string;
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
  cpfCnpj,
  valueBRL,
  appBaseUrl,
}: CreateCheckoutParams): Promise<CheckoutResponse> {
  
  // 1. Criar/Buscar Cliente no Asaas com CPF
  const customer = await asaasFetch<{ id: string }>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: fullName,
      email,
      mobilePhone: whatsapp,
      // ✅ Envia o CPF para o Asaas
      cpfCnpj: cpfCnpj,
    }),
  }).catch((err) => {
     // Se der erro (ex: email ja existe), o ideal seria buscar o cliente.
     // Para simplificar no MVP, se falhar, tentamos buscar pelo email ou seguimos erro.
     // Uma estratégia segura é não falhar totalmente se o cliente já existe, mas o Asaas retorna o ID no erro as vezes.
     // Aqui vamos deixar o erro explodir para você ver se o CPF for inválido.
     throw err; 
  });

  // 2. Criar a Cobrança (Payment)
  const payment = await asaasFetch<{ id: string; invoiceUrl: string; bankSlipUrl: string }>(
    "/payments",
    {
      method: "POST",
      body: JSON.stringify({
        customer: customer.id,
        billingType: "UNDEFINED",
        value: valueBRL,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: `Treino Personalizado - Pedido ${orderId}`,
        externalReference: orderId,
        postalService: false
      }),
    }
  );

  return {
    id: payment.id,
    checkoutUrl: payment.invoiceUrl,
  };
}