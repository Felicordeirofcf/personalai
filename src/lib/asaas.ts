// src/lib/asaas.ts
import "server-only";

function getEnv(name: string, fallback?: string) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getAsaasBaseUrl() {
  const env = (process.env.ASAAS_ENV ?? "sandbox").toLowerCase();
  return env === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";
}

export async function asaasFetch<T>(
  path: string,
  init?: RequestInit & { body?: any },
): Promise<T> {
  const apiKey = getEnv("ASAAS_API_KEY");
  const url = `${getAsaasBaseUrl()}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      // Asaas usa access_token no header Authorization (padrão da doc OpenAPI)
      Authorization: `Bearer ${apiKey}`,
      ...(init?.headers ?? {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      `Asaas error ${res.status} ${res.statusText}: ${
        typeof data === "string" ? data : JSON.stringify(data)
      }`,
    );
  }

  return data as T;
}

// 1x1 png (placeholder) - o Asaas exige imageBase64 no item do checkout (required no schema)
const ONE_BY_ONE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO6W6fYAAAAASUVORK5CYII=";

export type CreateCheckoutResult = {
  id: string;
  checkoutUrl: string;
};

export async function createCheckoutForOrder(input: {
  orderId: string;
  fullName: string;
  email: string;
  whatsapp: string;
  priceCents: number;
  appBaseUrl: string;
}) : Promise<CreateCheckoutResult> {
  const value = Number((input.priceCents / 100).toFixed(2));

  // Criar checkout (PIX + CREDIT_CARD)
  // billingTypes enum: CREDIT_CARD | PIX
  // chargeTypes enum: DETACHED (venda única)
  // callback success/cancel/expired
  // externalReference: id do pedido no seu sistema
  // Schema oficial do endpoint /v3/checkouts :contentReference[oaicite:4]{index=4}
  const body = {
    billingTypes: ["PIX", "CREDIT_CARD"],
    chargeTypes: ["DETACHED"],
    minutesToExpire: 60,
    externalReference: input.orderId,
    callback: {
      successUrl: `${input.appBaseUrl}/status/${input.orderId}`,
      cancelUrl: `${input.appBaseUrl}/checkout/cancel?orderId=${input.orderId}`,
      expiredUrl: `${input.appBaseUrl}/checkout/expired?orderId=${input.orderId}`,
    },
    items: [
      {
        name: "Treino Único",
        description: "Treino personalizado gerado com base no seu questionário (PAR-Q) + objetivos.",
        quantity: 1,
        value,
        imageBase64: ONE_BY_ONE_PNG_BASE64,
        externalReference: `item_${input.orderId}`,
      },
    ],
    // Opcional: pré-preencher dados do cliente no checkout
    customerData: {
      name: input.fullName,
      email: input.email,
      phone: input.whatsapp,
    },
  };

  const created = await asaasFetch<{ id: string }>("/checkouts", {
    method: "POST",
    body,
  });

  // A URL do checkout é montada com o ID retornado:
  // https://asaas.com/checkoutSession/show?id=RETURNED_ID :contentReference[oaicite:5]{index=5}
  const checkoutUrl = `https://asaas.com/checkoutSession/show?id=${created.id}`;

  return { id: created.id, checkoutUrl };
}
